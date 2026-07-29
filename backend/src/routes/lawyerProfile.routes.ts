import type { FastifyInstance } from "fastify";
import {
  getMyProfile,
  updateMyProfile,
  addEducation,
  updateEducation,
  deleteEducation,
  addTimeline,
  updateTimeline,
  deleteTimeline,
  addCourtMembership,
  updateCourtMembership,
  deleteCourtMembership,
  addFAQ,
  updateFAQ,
  deleteFAQ,
  addOffice,
  updateOffice,
  deleteOffice,
  addGalleryImage,
  deleteGalleryImage,
} from "../controllers/lawyerProfile.controller.js";

export async function lawyerProfileRoutes(fastify: FastifyInstance) {
  const auth = { onRequest: [(fastify as any).authenticate] };

  // Profile
  fastify.get("/profile", auth, getMyProfile);
  fastify.patch("/profile", auth, updateMyProfile);

  // Education
  fastify.post("/profile/education", auth, addEducation);
  fastify.patch("/profile/education/:id", auth, updateEducation);
  fastify.delete("/profile/education/:id", auth, deleteEducation);

  // Timeline
  fastify.post("/profile/timeline", auth, addTimeline);
  fastify.patch("/profile/timeline/:id", auth, updateTimeline);
  fastify.delete("/profile/timeline/:id", auth, deleteTimeline);

  // Court Memberships
  fastify.post("/profile/court-memberships", auth, addCourtMembership);
  fastify.patch("/profile/court-memberships/:id", auth, updateCourtMembership);
  fastify.delete("/profile/court-memberships/:id", auth, deleteCourtMembership);

  // FAQs
  fastify.post("/profile/faqs", auth, addFAQ);
  fastify.patch("/profile/faqs/:id", auth, updateFAQ);
  fastify.delete("/profile/faqs/:id", auth, deleteFAQ);

  // Office Locations
  fastify.post("/profile/offices", auth, addOffice);
  fastify.patch("/profile/offices/:id", auth, updateOffice);
  fastify.delete("/profile/offices/:id", auth, deleteOffice);

  // Gallery
  fastify.post("/profile/gallery", auth, addGalleryImage);
  fastify.delete("/profile/gallery/:id", auth, deleteGalleryImage);
}
