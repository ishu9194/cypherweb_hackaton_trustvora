import { prisma } from "../lib/prisma.js";

export class TrustEngineService {
  /**
   * Recalculates user trust score based on verification updates
   */
  static async processVerificationOutcome(
    verificationId: string,
    status: "VERIFIED" | "REJECTED",
    scoreImpact: number,
    reason?: string
  ) {
    return await prisma.$transaction(async (tx) => {
      // 1. Fetch verification and user
      const verification = await tx.verification.findUnique({
        where: { id: verificationId },
        include: { user: true },
      });

      if (!verification) {
        throw new Error("Verification record not found");
      }

      // Guard against double-processing (e.g. a retried request re-scoring
      // a claim that was already resolved).
      if (verification.status !== "PENDING") {
        throw new Error(
          `Verification ${verificationId} was already ${verification.status}`
        );
      }

      // Calculate score delta (+impact for verified, -impact for rejected)
      const pointsDelta =
        status === "VERIFIED" ? Math.abs(scoreImpact) : -Math.abs(scoreImpact);
      const currentScore = verification.user.trustScore;

      // Keep trust score bounded between 0 and 1000
      const newScore = Math.max(0, Math.min(1000, currentScore + pointsDelta));

      // 2. Update verification status
      const updatedVerification = await tx.verification.update({
        where: { id: verificationId },
        data: {
          status,
          scoreImpact: pointsDelta,
        },
      });

      // 3. Update user trust score
      await tx.user.update({
        where: { id: verification.userId },
        data: { trustScore: newScore },
      });

      // 4. Create immutable audit log entry
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
}
