import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SubmissionPublishedEvent } from '../events/submission-published.event';
import { EmailsService } from 'src/emails/emails.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SubmissionPublishedListener {
  private readonly logger = new Logger(SubmissionPublishedListener.name);

  constructor(
    private readonly emailsService: EmailsService,
    private readonly configService: ConfigService,
  ) {}

  @OnEvent('submission.published')
  async handleSubmissionPublishedEvent(event: SubmissionPublishedEvent) {
    this.logger.log(
      `Handling SubmissionPublishedEvent for submission ID: ${event.submissionId}`,
    );

    const submissionURL = `${this.configService.get<string>('WEB_APP_URL')}/app/author/submissions/${event.submissionId}`;

    try {
      await this.emailsService.sendAuthorPublishEmail({
        author_name: event.authorName,
        submission_title: event.submissionTitle,
        submission_url: submissionURL,
        author_email: event.authorEmail,
      });

      this.logger.log(
        `Author publish email sent for submission ID: ${event.submissionId}`,
      );
    } catch (err) {
      this.logger.error('Failed to send author publish email', err);
    }
  }
}
