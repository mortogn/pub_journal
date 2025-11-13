import { Module } from '@nestjs/common';
import { SubmissionsController } from './submissions.controller';
import { SubmissionsService } from './submissions.service';
import { EmailsModule } from 'src/emails/emails.module';
import { SubmissionPublishedListener } from './listeners/submission-published.listener';
import { SubmissionAcceptedListener } from './listeners/submission-accepted.listener';
import { ReviewerAssignedListener } from './listeners/reviewer-assigned.listener';
import { ReviewerCommentListener } from './listeners/reviewer-comment.listener';

@Module({
  controllers: [SubmissionsController],
  providers: [
    SubmissionsService,
    SubmissionPublishedListener,
    SubmissionAcceptedListener,
    ReviewerAssignedListener,
    ReviewerCommentListener,
  ],
  imports: [EmailsModule],
})
export class SubmissionsModule {}
