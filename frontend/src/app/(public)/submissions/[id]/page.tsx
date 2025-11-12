import { Metadata } from "next";
import React from "react";
import PublicSubmissionDetailsClientPage from "./page.client";

export default async function PublicSubmissionDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <PublicSubmissionDetailsClientPage submissionId={id} />
    </div>
  );
}
