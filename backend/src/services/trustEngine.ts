import { prisma } from "../lib/prisma.js";

export class TrustEngineService {
  /**
   * Recalculates user trust score based on verification updates
   */
  static async processVerificationOutcome(
    verificationId: string,
    status: "VERIFIED" | "REJECTED",
    scoreImpact: number,
    reason?: string,
  ) {
    return await prisma.$transaction(async (tx) => {
      const verification = await tx.verification.findUnique({
        where: { id: verificationId },
        include: { user: true },
      });

      if (!verification) {
        throw new Error("Verification record not found");
      }

      if (verification.status !== "PENDING") {
        throw new Error(`Verification ${verificationId} was already ${verification.status}`);
      }

      const pointsDelta = status === "VERIFIED" ? Math.abs(scoreImpact) : -Math.abs(scoreImpact);
      const currentScore = verification.user.trustScore;
      const newScore = Math.max(0, Math.min(1000, currentScore + pointsDelta));

      const updatedVerification = await tx.verification.update({
        where: { id: verificationId },
        data: {
          status,
          scoreImpact: pointsDelta,
        },
      });

      await tx.user.update({
        where: { id: verification.userId },
        data: { trustScore: newScore },
      });

      const trustLog = await tx.trustLog.create({
        data: {
          userId: verification.userId,
          action: `CLAIM_${status}`,
          pointsDelta,
          newScore,
          reason: reason || `Verification ${verificationId} was marked as ${status}`,
        },
      });

      return {
        verification: updatedVerification,
        newScore,
        trustLog,
      };
    });
  }

  /**
   * Recalculates lawyer trust score and rating metrics after review submissions
   */
  static async recalculateLawyerTrustScore(lawyerId: string) {
    return await prisma.$transaction(async (tx) => {
      const lawyer = await tx.lawyer.findUnique({
        where: { id: lawyerId },
        include: { reviews: true, user: true },
      });

      if (!lawyer) return null;

      const reviewCount = lawyer.reviews.length;
      let averageRating = 0;
      if (reviewCount > 0) {
        const sum = lawyer.reviews.reduce((acc, r) => acc + r.rating, 0);
        averageRating = Number((sum / reviewCount).toFixed(1));
      }

      const verifiedReviewsCount = lawyer.reviews.filter((r) => r.verifiedClient).length;
      const calculatedTrustScore = Math.min(1000, Math.round(averageRating * 150 + verifiedReviewsCount * 25));

      const updatedLawyer = await tx.lawyer.update({
        where: { id: lawyerId },
        data: {
          rating: averageRating,
          reviewCount,
        },
      });

      if (lawyer.userId) {
        await tx.user.update({
          where: { id: lawyer.userId },
          data: { trustScore: calculatedTrustScore },
        });
      }

      return {
        lawyer: updatedLawyer,
        trustScore: calculatedTrustScore,
        rating: averageRating,
        reviewCount,
      };
    });
  }
}
