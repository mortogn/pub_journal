import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SubmissionAcceptedEvent } from '../events/submission-accepted.event';
import { EmailsService } from 'src/emails/emails.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SubmissionAcceptedListener {
  private readonly logger = new Logger(SubmissionAcceptedListener.name);

  constructor(
    private readonly emailService: EmailsService,
    private readonly configService: ConfigService,
  ) {}

  @OnEvent('submission.accepted')
  async handleSubmissionAcceptedEvent(event: SubmissionAcceptedEvent) {
    const submissionURL = `${this.configService.get<string>('WEB_APP_URL')}/app/author/submissions/${event.submissionId}`;

    this.logger.log(
      `Handling SubmissionAcceptedEvent for submission ID: ${event.submissionId}`,
    );

    await this.emailService.sendSubmissionAcceptedEmail({
      author_email: event.authorEmail,
      author_name: event.authorName,
      submission_title: event.submissionTitle,
      submission_url: submissionURL,
      editor_name: event.editorName,
      letterURL: event.letterURL,
    });

    this.logger.log(
      `Submission accepted email sent for submission ID: ${event.submissionId}`,
    );
  }
}
