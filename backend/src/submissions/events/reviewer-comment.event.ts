export class ReviewerCommentEvent {
  constructor(
    public readonly authorName: string,
    public readonly authorEmail: string,
    public readonly submissionTitle: string,
    public readonly submissionId: string,
    public readonly reviewerName: string,
  ) {}
}
