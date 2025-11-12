import PageHeading from "@/components/common/page-heading";
import React from "react";
import SubmissionsClientPage from "./page.client";

export default function ReviewerSubmissionsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <PageHeading
          title="Submissions"
          subtitle="Submissions assigned to you"
        />
      </div>

      <div className="mt-4">
        <SubmissionsClientPage />
      </div>
    </div>
  );
}
