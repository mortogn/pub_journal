export class ReviewerAssignedEvent {
  constructor(
    public readonly reviewerName: string,
    public readonly reviewerEmail: string,
    public readonly submissionTitle: string,
    public readonly submissionId: string,
  ) {}
}
