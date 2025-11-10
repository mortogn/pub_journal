import PageHeading from "@/components/common/page-heading";
import React from "react";
import CreateSubmissionForm from "./_form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Submission",
  description: "Add a new submission to your author profile",
};

export default function CreateSubmissionPage() {
  return (
    <div>
      <div>
        <PageHeading
          title="Create Submission"
          subtitle="Add a new submission to your author profile"
        />
      </div>

      <div className="max-w-[650px] mx-auto mt-8">
        <CreateSubmissionForm />
      </div>
    </div>
  );
}
