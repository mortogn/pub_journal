import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AuthTokenPayload } from 'src/auth/token.type';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { SubmissionsService } from './submissions.service';

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

  @Get()
  listSubmissions(@CurrentUser() user: AuthTokenPayload) {
    return this.submissionsService.listSubmissions(user);
  }

  @Get(':id')
  getSubmissionById(
    @CurrentUser() user: AuthTokenPayload,
    @Param('id') id: string,
  ) {
    return this.submissionsService.getSubmissionById(user, id);
  }

  @Put(':id/publish')
  publishSubmission(
    @CurrentUser() user: AuthTokenPayload,
    @Param('id') id: string,
  ) {
    return this.submissionsService.publishSubmission(user.sub, id);
  }
}
