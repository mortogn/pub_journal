import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class EmailsService {
  constructor(
    private readonly resend: Resend,
    private readonly configService: ConfigService,
  ) {}

  async renderTemplate(templatePath: string, vars: Record<string, any> = {}) {
    const content = await fs.readFile(path.resolve(templatePath), 'utf8');

    // Replace all {{key}} placeholders. Uses global regex and escapes key for regex.
    return Object.keys(vars).reduce((acc, key) => {
      const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // escape regex meta
      const re = new RegExp(`{{\\s*${escaped}\\s*}}`, 'g');
      return acc.replace(re, String(vars[key]));
    }, content);
  }

  async sendEmail(
    to: string,
    subject: string,
    html: string,
    attachments?: Array<{ path: string; filename: string }>,
  ) {
    return await this.resend.emails.send({
      from: this.configService.get<string>('EMAIL_FROM')!,
      to,
      subject,
      html,
      ...(attachments && attachments?.length > 0 ? { attachments } : {}),
    });
  }

  async sendAuthorPublishEmail({
    author_name,
    submission_title,
    submission_url,
    author_email,
  }: {
    author_name: string;
    submission_title: string;
    submission_url: string;
    author_email: string;
  }) {
    const emailHtml = await this.renderTemplate(
      path.join(__dirname, 'templates', 'author-publish-confirm.template.html'),
      {
        author_name,
        submission_title,
        submission_url,
      },
    );
    await this.sendEmail(
      author_email,
      'Submission Published — Awaiting Editor Acceptance',
      emailHtml,
    );
  }

  async sendSubmissionAcceptedEmail({
    author_email,
    author_name,
    submission_url,
    submission_title,
    editor_name,
    letterURL,
  }: {
    author_name: string;
    submission_url: string;
    submission_title: string;
    editor_name: string;
    author_email: string;
    letterURL?: string;
  }) {
    const emailHtml = await this.renderTemplate(
      path.join(__dirname, 'templates', 'author-accepted.template.html'),
      {
        author_name,
        submission_title,
        submission_url,
        editor_name,
      },
    );

    await this.sendEmail(
      author_email,
      'Submission Accepted for Publication',
      emailHtml,
      letterURL
        ? [
            {
              path: letterURL,
              filename: 'letter.pdf',
            },
          ]
        : undefined,
    );
  }

  async sendReviewerAssignmentEmail({
    reviewer_name,
    reviewer_email,
    submission_title,
    submission_url,
  }: {
    reviewer_name: string;
    reviewer_email: string;
    submission_title: string;
    submission_url: string;
  }) {
    const emailHtml = await this.renderTemplate(
      path.join(__dirname, 'templates', 'reviewer-assign.template.html'),
      {
        reviewer_name,
        submission_title,
        submission_url,
      },
    );

    await this.sendEmail(reviewer_email, 'New Review Assignment', emailHtml);
  }

  async sendReviewerCommentEmail({
    author_name,
    author_email,
    submission_title,
    submission_url,
    reviewer_name,
  }: {
    author_name: string;
    author_email: string;
    submission_title: string;
    submission_url: string;
    reviewer_name: string;
  }) {
    const emailHtml = await this.renderTemplate(
      path.join(__dirname, 'templates', 'reviewer-comment.template.html'),
      {
        author_name,
        submission_title,
        submission_url,
        reviewer_name,
      },
    );

    await this.sendEmail(
      author_email,
      'New Comment on Your Submission',
      emailHtml,
    );
  }
}
