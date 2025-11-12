"use client";

import Submission from "@/components/submissions/submission";
import { Spinner } from "@/components/ui/spinner";
import api from "@/lib/api";
import type { Submission as TSubmission } from "@/types/models";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import { getCookie } from "cookies-next";

export default function SubmissionsClientPage() {
  const { data: { data: submissions } = {}, isLoading } = useQuery({
    queryKey: ["submissions", "reviewer"],
    queryFn: async () => {
      return api<TSubmission[]>(`/submissions`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${getCookie("ac-token")}`,
        },
      });
    },
  });

  if (isLoading) {
    return (
      <div className="flex  items-center justify-center text-base text-muted-foreground">
        <Spinner />
        <span>Loading submissions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {submissions?.length
        ? submissions.map((submission) => (
            <Link
              href={`/app/reviewer/submissions/${submission.id}`}
              key={submission.id}
            >
              <Submission data={submission} />
            </Link>
          ))
        : null}
    </div>
  );
}
