export class SubmissionPublishedEvent {
  constructor(
    public readonly submissionId: string,
    public readonly authorName: string,
    public readonly authorEmail: string,
    public readonly submissionTitle: string,
  ) {}
}
