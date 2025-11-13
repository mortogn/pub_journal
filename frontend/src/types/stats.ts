export interface AdminStats {
  totalSubmissions: number;
  submittedCount: number;
  underReviewCount: number;
  acceptedCount: number;
  rejectedCount: number;
  publishedCount: number;
  revisionRequiredCount: number;
  totalUsers: number;
  totalReviewers: number;
  totalEditors: number;
  totalAuthors: number;
}

export interface AuthorStats {
  totalSubmissions: number;
  draftCount: number;
  submittedCount: number;
  underReviewCount: number;
  acceptedCount: number;
  rejectedCount: number;
  publishedCount: number;
  revisionRequiredCount: number;
}

export interface ReviewerStats {
  totalAssignments: number;
  completedReviews: number;
  pendingReviews: number;
  acceptRecommendations: number;
  minorRevisionRecommendations: number;
  majorRevisionRecommendations: number;
  rejectRecommendations: number;
}

export interface EditorStats {
  totalAssignments: number;
  completedDecisions: number;
  pendingDecisions: number;
  acceptedDecisions: number;
  rejectedDecisions: number;
  revisionRequiredDecisions: number;
}
