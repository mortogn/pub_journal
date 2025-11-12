import React from "react";
import EditorSubmissionClientPage from "./page.client";

export default async function EditorSubmissionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditorSubmissionClientPage submissionId={id} />;
}
