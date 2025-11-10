import PageHeading from "@/components/common/page-heading";
import React from "react";
import SubmissionsClientPage from "./page.client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircleIcon } from "lucide-react";

export default function SubmissionsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <PageHeading
          title="Submissions"
          subtitle="All the submissions from you, Draft and published"
        />
        <Button asChild variant="ghost">
          <Link href={"/app/author/submissions/create"}>
            <PlusCircleIcon className="size-4" />
            <span>Create Submission</span>
          </Link>
        </Button>
      </div>

      <div className="mt-4">
        <SubmissionsClientPage />
      </div>
    </div>
  );
}
