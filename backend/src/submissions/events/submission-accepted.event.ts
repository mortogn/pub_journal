export class SubmissionAcceptedEvent {
  constructor(
    public authorName: string,
    public submissionId: string,
    public submissionTitle: string,
    public editorName: string,
    public authorEmail: string,
    public letterURL?: string,
  ) {}
}
