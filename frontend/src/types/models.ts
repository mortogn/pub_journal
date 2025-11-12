import {
  SubmissionStatus,
  UserRole,
  Recommendation,
  DecisionOutcome,
} from "./enums";

export interface User {
  id: string;
  email: string;
  fullname: string;
  role: UserRole;
  createdAt: string; // ISO string in client
  updatedAt: string; // ISO string in client
  // Prisma has password but we intentionally omit it from the client shape
  // Optional relations expanded for convenience on the client
  submissions?: Submission[];
  assignments?: Assignment[]; // reviewer assignments
  editAssignments?: Assignment[]; // editor assignments
  reviews?: Review[];
  decisions?: Decision[];
  // Prisma's _count when included in a query: { _count: { submissions: number, ... } }
  _count?: {
    submissions?: number;
    assignments?: number;
    editAssignments?: number;
    reviews?: number;
    decisions?: number;
  };
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
  decisionId?: string | null;
  decision?: Decision | null;
  assignments?: Assignment[];
  reviews?: Review[];
  issueId?: string | null;
  issue?: Issue | null;
  // Prisma relation counts when using `include: { _count: true }` or `include: { _count: { select: { ... } } }`
  _count?: {
    assignments?: number;
    reviews?: number;
  };
}

export interface Assignment {
  id: string;
  submissionId: string;
  reviewerId: string;
  editorId: string;
  assignedAt: string; // ISO

  submission?: Submission;
  reviewer?: User;
  editor?: User;
}

export interface Review {
  id: string;
  submissionId: string;
  reviewerId: string;
  commentsToAuthor?: string | null;
  commentsToEditor?: string | null;
  recommendation?: Recommendation | null;
  score?: number | null;

  createdAt: string;
  updatedAt: string;

  submission?: Submission;
  reviewer?: User;
}

export interface Decision {
  id: string;
  submissionId: string;
  editorId: string;
  decisionAt: string;

  outcome: DecisionOutcome;
  letterPath?: string | null;

  submission?: Submission;
  editor?: User;
}

export interface Issue {
  id: string;
  volume: number;
  number: number;
  year: number;
  publishedAt: string;
  papers?: Submission[];
  // Prisma relation counts
  _count?: {
    papers?: number;
  };
}
