import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ReviewerAssignedEvent } from '../events/reviewer-assgined.event';
import { EmailsService } from 'src/emails/emails.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReviewerAssignedListener {
  private readonly logger = new Logger(ReviewerAssignedListener.name);

  constructor(
    private readonly emailsService: EmailsService,
    private readonly configService: ConfigService,
  ) {}

  @OnEvent('reviewer.assigned')
  async handleReviewerAssignedEvent(event: ReviewerAssignedEvent) {
    this.logger.log(
      `Handling ReviewerAssignedEvent for submission ID: ${event.submissionId}`,
    );

    const submissionURL = `${this.configService.get<string>('WEB_APP_URL')}/app/reviewer/submissions/${event.submissionId}`;

    try {
      await this.emailsService.sendReviewerAssignmentEmail({
        reviewer_name: event.reviewerName,
        reviewer_email: event.reviewerEmail,
        submission_title: event.submissionTitle,
        submission_url: submissionURL,
      });

      this.logger.log(
        `Reviewer assignment email sent for submission ID: ${event.submissionId}`,
      );
    } catch (err) {
      this.logger.error('Failed to send reviewer assignment email', err);
    }
  }
}
