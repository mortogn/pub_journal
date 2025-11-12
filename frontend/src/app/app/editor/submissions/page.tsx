import PageHeading from "@/components/common/page-heading";
import React from "react";
import EditorSubmissionClientPage from "./page.client";

export default function EditorSubmissionPage() {
  return (
    <div>
      <PageHeading
        title="Submissions"
        subtitle="Submissions for you to assign and take decisions on"
      />

      <div className="mt-4">
        <EditorSubmissionClientPage />
      </div>
    </div>
  );
}
