"use client";

import Keyword from "@/components/submissions/keyword";
import StatusBadge from "@/components/submissions/status-badge";
import { Spinner } from "@/components/ui/spinner";
import api from "@/lib/api";
import { Submission } from "@/types/models";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React from "react";

export default function SubmissionsClientPage() {
  const {
    data: { data: submissions } = {},
    isLoading,
    error,
  } = useQuery({
    queryKey: ["submissions"],
    queryFn: async () => {
      return api<Submission[]>(`/submissions`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${localStorage.getItem("authToken")}`,
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
              href={`/app/author/submissions/${submission.id}`}
              key={submission.id}
            >
              <div className="py-3 rounded-md mb-4 space-y-3 group">
                <h2 className="text-lg font-medium tracking-tight group-hover:underline">
                  {submission.title}
                </h2>
                <p className="line-clamp-2 text-sm tracking-wide">
                  {submission.abstract}
                </p>
                <div className="space-y-1 space-x-1">
                  {submission.keywords.map((keyword) => (
                    <Keyword key={keyword}>{keyword}</Keyword>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <StatusBadge status={submission.status} />
                </p>
              </div>
            </Link>
          ))
        : null}
    </div>
  );
}
