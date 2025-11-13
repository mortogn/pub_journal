import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AdminStatsDto } from './dto/admin-stats.dto';
import { AuthorStatsDto } from './dto/author-stats.dto';
import { ReviewerStatsDto } from './dto/reviewer-stats.dto';
import { EditorStatsDto } from './dto/editor-stats.dto';
import {
  SubmissionStatus,
  UserRole,
  Recommendation,
  DecisionOutcome,
} from '../../generated/prisma/enums';

@Injectable()
export class StatsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAdminStats(): Promise<AdminStatsDto> {
    const [
      totalSubmissions,
      submittedCount,
      underReviewCount,
      acceptedCount,
      rejectedCount,
      publishedCount,
      revisionRequiredCount,
      totalUsers,
      totalReviewers,
      totalEditors,
      totalAuthors,
    ] = await Promise.all([
      this.prismaService.submission.count(),
      this.prismaService.submission.count({
        where: { status: SubmissionStatus.SUBMITTED },
      }),
      this.prismaService.submission.count({
        where: { status: SubmissionStatus.UNDER_REVIEW },
      }),
      this.prismaService.submission.count({
        where: { status: SubmissionStatus.ACCEPTED },
      }),
      this.prismaService.submission.count({
        where: { status: SubmissionStatus.REJECTED },
      }),
      this.prismaService.submission.count({
        where: { status: SubmissionStatus.PUBLISHED },
      }),
      this.prismaService.submission.count({
        where: { status: SubmissionStatus.REVISION_REQUIRED },
      }),
      this.prismaService.user.count(),
      this.prismaService.user.count({ where: { role: UserRole.REVIEWER } }),
      this.prismaService.user.count({ where: { role: UserRole.EDITOR } }),
      this.prismaService.user.count({ where: { role: UserRole.AUTHOR } }),
    ]);

    return {
      totalSubmissions,
      submittedCount,
      underReviewCount,
      acceptedCount,
      rejectedCount,
      publishedCount,
      revisionRequiredCount,
      totalUsers,
      totalReviewers,
      totalEditors,
      totalAuthors,
    };
  }

  async getAuthorStats(userId: string): Promise<AuthorStatsDto> {
    const [
      totalSubmissions,
      draftCount,
      submittedCount,
      underReviewCount,
      acceptedCount,
      rejectedCount,
      publishedCount,
      revisionRequiredCount,
    ] = await Promise.all([
      this.prismaService.submission.count({ where: { authorId: userId } }),
      this.prismaService.submission.count({
        where: { authorId: userId, status: SubmissionStatus.DRAFT },
      }),
      this.prismaService.submission.count({
        where: { authorId: userId, status: SubmissionStatus.SUBMITTED },
      }),
      this.prismaService.submission.count({
        where: { authorId: userId, status: SubmissionStatus.UNDER_REVIEW },
      }),
      this.prismaService.submission.count({
        where: { authorId: userId, status: SubmissionStatus.ACCEPTED },
      }),
      this.prismaService.submission.count({
        where: { authorId: userId, status: SubmissionStatus.REJECTED },
      }),
      this.prismaService.submission.count({
        where: { authorId: userId, status: SubmissionStatus.PUBLISHED },
      }),
      this.prismaService.submission.count({
        where: { authorId: userId, status: SubmissionStatus.REVISION_REQUIRED },
      }),
    ]);

    return {
      totalSubmissions,
      draftCount,
      submittedCount,
      underReviewCount,
      acceptedCount,
      rejectedCount,
      publishedCount,
      revisionRequiredCount,
    };
  }

  async getReviewerStats(userId: string): Promise<ReviewerStatsDto> {
    const [
      totalAssignments,
      completedReviews,
      acceptRecommendations,
      minorRevisionRecommendations,
      majorRevisionRecommendations,
      rejectRecommendations,
    ] = await Promise.all([
      this.prismaService.assignment.count({ where: { reviewerId: userId } }),
      this.prismaService.review.count({
        where: { reviewerId: userId, recommendation: { not: null } },
      }),
      this.prismaService.review.count({
        where: {
          reviewerId: userId,
          recommendation: Recommendation.ACCEPT,
        },
      }),
      this.prismaService.review.count({
        where: {
          reviewerId: userId,
          recommendation: Recommendation.MINOR_REVISION,
        },
      }),
      this.prismaService.review.count({
        where: {
          reviewerId: userId,
          recommendation: Recommendation.MAJOR_REVISION,
        },
      }),
      this.prismaService.review.count({
        where: {
          reviewerId: userId,
          recommendation: Recommendation.REJECT,
        },
      }),
    ]);

    const pendingReviews = totalAssignments - completedReviews;

    return {
      totalAssignments,
      completedReviews,
      pendingReviews,
      acceptRecommendations,
      minorRevisionRecommendations,
      majorRevisionRecommendations,
      rejectRecommendations,
    };
  }

  async getEditorStats(userId: string): Promise<EditorStatsDto> {
    const [
      totalAssignments,
      completedDecisions,
      acceptedDecisions,
      rejectedDecisions,
      revisionRequiredDecisions,
    ] = await Promise.all([
      this.prismaService.assignment.count({ where: { editorId: userId } }),
      this.prismaService.decision.count({ where: { editorId: userId } }),
      this.prismaService.decision.count({
        where: { editorId: userId, outcome: DecisionOutcome.ACCEPTED },
      }),
      this.prismaService.decision.count({
        where: { editorId: userId, outcome: DecisionOutcome.REJECTED },
      }),
      this.prismaService.decision.count({
        where: {
          editorId: userId,
          outcome: DecisionOutcome.REVISION_REQUIRED,
        },
      }),
    ]);

    const pendingDecisions = totalAssignments - completedDecisions;

    return {
      totalAssignments,
      completedDecisions,
      pendingDecisions,
      acceptedDecisions,
      rejectedDecisions,
      revisionRequiredDecisions,
    };
  }
}
