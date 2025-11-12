import React from "react";
import ReviewerSubmissionClientPage from "./page.client";

export default async function ReviewerSubmissionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ReviewerSubmissionClientPage submissionId={id} />;
}
