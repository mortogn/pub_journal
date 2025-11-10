// Auto-generated from Prisma schema (backend/prisma/schema.prisma)
// Keep in sync with backend. If enums change, update here or consider generating.

export enum UserRole {
  ADMIN = "ADMIN",
  AUTHOR = "AUTHOR",
  EDITOR = "EDITOR",
  REVIEWER = "REVIEWER",
}

export enum SubmissionStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  UNDER_REVIEW = "UNDER_REVIEW",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  PUBLISHED = "PUBLISHED",
}
