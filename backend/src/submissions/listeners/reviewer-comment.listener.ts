import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ReviewerCommentEvent } from '../events/reviewer-comment.event';
import { EmailsService } from 'src/emails/emails.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReviewerCommentListener {
  private readonly logger = new Logger(ReviewerCommentListener.name);

  constructor(
    private readonly emailsService: EmailsService,
    private readonly configService: ConfigService,
  ) {}

  @OnEvent('reviewer.comment')
  async handleReviewerCommentEvent(event: ReviewerCommentEvent) {
    this.logger.log(
      `Handling ReviewerCommentEvent for submission ID: ${event.submissionId}`,
    );

    const submissionURL = `${this.configService.get<string>('WEB_APP_URL')}/app/author/submissions/${event.submissionId}`;

    try {
      await this.emailsService.sendReviewerCommentEmail({
        author_name: event.authorName,
        author_email: event.authorEmail,
        submission_title: event.submissionTitle,
        submission_url: submissionURL,
        reviewer_name: event.reviewerName,
      });

      this.logger.log(
        `Reviewer comment email sent for submission ID: ${event.submissionId}`,
      );
    } catch (err) {
      this.logger.error('Failed to send reviewer comment email', err);
    }
  }
}
