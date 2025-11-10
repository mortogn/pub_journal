import PageHeading from "@/components/common/page-heading";
import React from "react";
import SubmissionDetailsClientPage from "./page.client";

export default async function SubmissionDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <SubmissionDetailsClientPage submissionId={id} />
    </div>
  );
}
