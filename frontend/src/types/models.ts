import { SubmissionStatus, UserRole } from "./enums";

export interface User {
  id: string;
  email: string;
  fullname: string;
  role: UserRole;
  createdAt: string; // ISO string in client
  updatedAt: string; // ISO string in client
  // Prisma has password but we intentionally omit it from the client shape
}

export interface Submission {
  id: string;
  title: string;
  abstract: string;
  manuscriptPath?: string | null;
  thumbnailPath?: string | null;
  status: SubmissionStatus;
  keywords: string[];
  version: number;

  // editor-assigned fields upon acceptance
  type?: string | null;
  department?: string | null;
  description?: string | null;

  authorId: string; // relation id
  author?: User; // optional expanded relation for client convenience

  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  publishedAt?: string | null; // ISO string or null
}
