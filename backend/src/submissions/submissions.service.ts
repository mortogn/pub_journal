import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { AuthTokenPayload } from 'src/auth/token.type';

@Injectable()
export class SubmissionsService {
  constructor(private readonly prismaService: PrismaService) {}

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
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    if (submission?.status != 'PUBLISHED') {
      if (
        submission.authorId !== user.sub &&
        user.role !== 'ADMIN' &&
        user.role !== 'EDITOR'
      ) {
        throw new ForbiddenException(
          'You do not have access to this submission',
        );
      }
    }

    return submission;
  }

  async listSubmissions(user: AuthTokenPayload) {
    if (user.role === 'ADMIN' || user.role === 'EDITOR') {
      return this.prismaService.submission.findMany({
        orderBy: { createdAt: 'desc' },
      });
    }

    return this.prismaService.submission.findMany({
      where: { authorId: user.sub },
      orderBy: { createdAt: 'desc' },
    });
  }

  async publishSubmission(userId: string, id: string) {
    const submission = await this.prismaService.submission.findFirst({
      where: { id, authorId: userId },
    });

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    const publishedSubmission = await this.prismaService.submission.update({
      where: { id },
      data: { status: 'PUBLISHED' },
    });

    return publishedSubmission;
  }
}
