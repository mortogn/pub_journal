import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { AuthTokenPayload } from 'src/auth/token.type';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SubmissionsService } from './submissions.service';
import { ReviewSubmissionDto } from './dto/review-submission.dto';
import { CreateDecisionDto } from './dto/create-decision.dto';
import { SubmissionQueryDto } from './dto/submission-query.dto';
import { Public } from 'src/auth/public.decorator';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post()
  createSubmission(
    @CurrentUser() user: AuthTokenPayload,
    @Body() createSubmissionDto: CreateSubmissionDto,
  ) {
    return this.submissionsService.createSubmission(
      user.sub,
      createSubmissionDto,
    );
  }

  @Get('')
  @Public()
  listSubmissions(
    @Query() query: SubmissionQueryDto,
    @CurrentUser() user?: AuthTokenPayload,
  ) {
    return this.submissionsService.listSubmissions(user, query);
  }

  @Get(':id')
  getSubmissionById(
    @CurrentUser() user: AuthTokenPayload,
    @Param('id') id: string,
  ) {
    return this.submissionsService.getSubmissionById(user, id);
  }

  @Get(':id/public')
  @Public()
  publicSubmissionById(@Param('id') id: string) {
    return this.submissionsService.publicSubmissionById(id);
  }

  @Put(':id/publish')
  publishSubmission(
    @CurrentUser() user: AuthTokenPayload,
    @Param('id') id: string,
  ) {
    return this.submissionsService.publishSubmission(user.sub, id);
  }

  @Post('assign')
  assignSubmission(
    @CurrentUser() user: AuthTokenPayload,
    @Body() body: { submissionId: string; reviewerId: string },
  ) {
    return this.submissionsService.assignSubmission(user, body);
  }

  @Put(':id/review')
  reviewSubmission(
    @CurrentUser() user: AuthTokenPayload,
    @Param('id') id: string,
    @Body() dto: ReviewSubmissionDto,
  ) {
    return this.submissionsService.reviewSubmission(user, id, dto);
  }

  @Post(':id/decision')
  createDecision(
    @CurrentUser() user: AuthTokenPayload,
    @Param('id') id: string,
    @Body() dto: CreateDecisionDto,
  ) {
    return this.submissionsService.createDecision(user, id, dto);
  }
}
