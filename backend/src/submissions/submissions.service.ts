import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { AuthTokenPayload } from 'src/auth/token.type';
import { AssignSubmissionDto } from './dto/assign-submission.dto';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
import { CreateDecisionDto } from './dto/create-decision.dto';
import { SubmissionQueryDto } from './dto/submission-query.dto';
import { SubmissionPublishedEvent } from './events/submission-published.event';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SubmissionAcceptedEvent } from './events/submission-accepted.event';
import { ConfigService } from '@nestjs/config';
import { ReviewerAssignedEvent } from './events/reviewer-assgined.event';

@Injectable()
export class SubmissionsService {
  constructor(
    private readonly prismaService: PrismaService,
    private eventEmitter: EventEmitter2,
    private readonly configService: ConfigService,
  ) {}

  async createSubmission(
    userId: string,
    createSubmissionDto: CreateSubmissionDto,
  ) {
    const submission = await this.prismaService.submission.create({
      data: {
        title: createSubmissionDto.title,
        abstract: createSubmissionDto.abstract,
        keywords: createSubmissionDto.keywords,
        authorId: userId,
        manuscriptPath: createSubmissionDto.manuscriptUrl,
      },
    });
    return submission;
  }

  async getSubmissionById(user: AuthTokenPayload, id: string) {
    const submission = await this.prismaService.submission.findFirst({
      where: { id },
      include: {
        reviews: {
          include: {
            reviewer: {
              select: { id: true, fullname: true },
            },
          },
        },
        author: {
          select: { id: true, fullname: true },
        },
        assignments: {
          include: {
            reviewer: { select: { id: true, fullname: true } },
            editor: { select: { id: true, fullname: true } },
          },
        },
        decision: true,
      },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    // Visibility rules
    // Public (any authenticated user) can view ACCEPTED or PUBLISHED submissions
    if (submission.status === 'ACCEPTED') {
      return submission;
    }

    // Otherwise only author, editor/admin, or assigned reviewer can view
    const isAuthor = submission.authorId === user.sub;
    const isEditorOrAdmin = user.role === 'ADMIN' || user.role === 'EDITOR';
    const isAssignedReviewer = submission.assignments?.some(
      (a) => a.reviewerId === user.sub,
    );

    if (!isAuthor && !isEditorOrAdmin && !isAssignedReviewer) {
      throw new ForbiddenException('You do not have access to this submission');
    }

    return submission;
  }

  async publicSubmissionById(id: string) {
    const submission = await this.prismaService.submission.findFirst({
      where: { id, status: 'ACCEPTED' },
      include: {
        author: {
          select: {
            id: true,
            fullname: true,
          },
        },
        decision: {
          select: {
            decisionAt: true,
          },
        },
      },
    });
    if (!submission) {
      throw new NotFoundException('Submission not found or not accepted');
    }
    return submission;
  }

  async listSubmissions(user?: AuthTokenPayload) {
    if (user?.role === 'ADMIN' || user?.role === 'EDITOR') {
      return this.prismaService.submission.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: {
              id: true,
              fullname: true,
            },
          },
          decision: {
            select: {
              id: true,
              outcome: true,
            },
          },
          _count: {
            select: {
              reviews: true,
              assignments: true,
            },
          },
        },
      });
    }

    // Reviewer: submissions they are assigned to
    if (user?.role === 'REVIEWER') {
      return this.prismaService.submission.findMany({
        where: {
          assignments: {
            some: { reviewerId: user.sub },
          },
        },
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { id: true, fullname: true },
          },
          decision: {
            select: { id: true, outcome: true },
          },
          _count: {
            select: { reviews: true, assignments: true },
          },
        },
      });
    }

    if (user?.role === 'AUTHOR') {
      // For authors we can still include lightweight related data to keep frontend shape consistent
      return this.prismaService.submission.findMany({
        where: { authorId: user.sub },
        orderBy: { createdAt: 'desc' },
        include: {
          decision: {
            select: { id: true, outcome: true },
          },
          _count: {
            select: {
              reviews: true,
              assignments: true,
            },
          },
        },
      });
    }
  }

  async listSubmissionPublic(query?: SubmissionQueryDto) {
    return this.prismaService.submission.findMany({
      orderBy: { decision: { decisionAt: 'desc' } },
      where: {
        status: 'ACCEPTED',
        OR: [
          { title: { contains: query?.search || '', mode: 'insensitive' } },
          { abstract: { contains: query?.search || '', mode: 'insensitive' } },
          { keywords: { has: query?.search || '' } },
        ],
      },
      include: {
        author: {
          select: {
            id: true,
            fullname: true,
          },
        },
      },
      take: 1000,
    });
  }

  async publishSubmission(userId: string, id: string) {
    const submission = await this.prismaService.submission.findFirst({
      where: { id, authorId: userId },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    const [publishedSubmission, author] = await Promise.all([
      this.prismaService.submission.update({
        where: { id },
        data: { status: 'PUBLISHED' },
      }),
      this.prismaService.user.findFirst({
        where: { id: userId },
        select: {
          fullname: true,
          email: true,
        },
      }),
    ]);

    if (!author) {
      throw new NotFoundException('Author not found');
    }

    // const publishedSubmission = await this.prismaService.submission.update({
    //   where: { id },
    //   data: { status: 'PUBLISHED' },
    // });

    const publishSubmissionEvent = new SubmissionPublishedEvent(
      publishedSubmission.id,
      author.fullname,
      author.email,
      submission.title,
    );

    this.eventEmitter.emit('submission.published', publishSubmissionEvent);

    return publishedSubmission;
  }

  async assignSubmission(
    user: AuthTokenPayload,
    assignSubmissionDto: AssignSubmissionDto,
  ) {
    if (user.role !== 'ADMIN' && user.role !== 'EDITOR') {
      throw new ForbiddenException(
        'You do not have permission to assign reviewers',
      );
    }
    const submission = await this.prismaService.submission.findFirst({
      where: { id: assignSubmissionDto.submissionId },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    if (submission.status === 'ACCEPTED' || submission.status === 'REJECTED') {
      throw new ForbiddenException(
        'Cannot assign reviewers to accepted or rejected submissions',
      );
    }

    const [assignment] = await this.prismaService.$transaction([
      this.prismaService.assignment.create({
        data: {
          submissionId: assignSubmissionDto.submissionId,
          reviewerId: assignSubmissionDto.reviewerId,
          editorId: user.sub,
        },
        include: {
          reviewer: { select: { id: true, fullname: true, email: true } },
          editor: { select: { id: true, fullname: true } },
          submission: { select: { id: true, title: true } },
        },
      }),
      this.prismaService.submission.update({
        where: { id: assignSubmissionDto.submissionId },
        data: { status: 'UNDER_REVIEW' },
      }),
    ]);

    const reviewerAssginedEmail = new ReviewerAssignedEvent(
      assignment.reviewer.fullname,
      assignment.reviewer.email,
      assignment.submission.title,
      assignment.submission.id,
      // assignSubmissionDto.dueDate,
    );

    this.eventEmitter.emit('reviewer.assigned', reviewerAssginedEmail);

    return assignment;
  }

  async reviewSubmission(
    user: AuthTokenPayload,
    submissionId: string,
    reviewSubmissionDto: ReviewSubmissionDto,
  ) {
    const assignment = await this.prismaService.assignment.findFirst({
      where: { submissionId, reviewerId: user.sub },
    });

    if (!assignment) {
      throw new NotFoundException(
        'Assignment not found for this submission and reviewer',
      );
    }

    const existingReview = await this.prismaService.review.findFirst({
      where: {
        submissionId,
        reviewerId: user.sub,
      },
    });

    if (existingReview?.recommendation) {
      throw new ForbiddenException(
        'Cannot modify a review that has been finalized with ACCEPT or REJECT recommendation',
      );
    }

    const review = existingReview
      ? await this.prismaService.review.update({
          where: { id: existingReview.id },
          data: {
            ...reviewSubmissionDto,
          },
        })
      : await this.prismaService.review.create({
          data: {
            submissionId,
            reviewerId: user.sub,
            ...reviewSubmissionDto,
          },
        });

    return review;
  }

  async createDecision(
    user: AuthTokenPayload,
    submissionId: string,
    createDecisionDto: CreateDecisionDto,
  ) {
    const submission = await this.prismaService.submission.findFirst({
      where: { id: submissionId },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    const [decision, _, updatedSubmission, editor] =
      await this.prismaService.$transaction([
        this.prismaService.decision.create({
          data: {
            submissionId,
            editorId: user.sub,
            outcome: createDecisionDto.outcome,
            letterPath: createDecisionDto.letterPath,
          },
        }),
        this.prismaService.submission.update({
          where: { id: submissionId },
          data: { status: createDecisionDto.outcome },
        }),
        this.prismaService.submission.findFirst({
          where: { id: submissionId },
          include: {
            author: {
              select: {
                email: true,
                fullname: true,
              },
            },
          },
        }),

        this.prismaService.user.findFirst({
          where: { id: user.sub },
          select: { fullname: true },
        }),
      ]);

    if (!updatedSubmission) {
      throw new InternalServerErrorException(
        'Failed to retrieve updated submission',
      );
    }

    const submissionAcceptedEvent = new SubmissionAcceptedEvent(
      updatedSubmission.author.fullname,
      updatedSubmission.id,
      updatedSubmission.title,
      editor?.fullname || 'Editor',
      updatedSubmission.author.email,
      decision.letterPath
        ? `${this.configService.get<string>('R2_BUCKET_BASE_URL')}/${decision.letterPath}`
        : undefined,
    );

    this.eventEmitter.emit('submission.accepted', submissionAcceptedEvent);

    return decision;
  }
}
