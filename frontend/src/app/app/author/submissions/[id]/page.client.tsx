"use client";

import api, { ApiError } from "@/lib/api";
import { Submission, SubmissionStatus } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import ErrorBar from "@/components/common/error-bar";
import PageHeading from "@/components/common/page-heading";
import StatusBadge from "@/components/submissions/status-badge";
import Keyword from "@/components/submissions/keyword";
import { getCookie } from "cookies-next";
// using built-in date formatting to avoid extra deps

type Props = {
  submissionId: string;
};

export default function SubmissionDetailsClientPage({ submissionId }: Props) {
  const queryClient = useQueryClient();

  const {
    data: submissionResp,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["submission", submissionId],
    queryFn: async () => {
      return api<Submission>(`/submissions/${submissionId}`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${getCookie("ac-token")}`,
        },
      });
    },
    staleTime: 30_000,
  });

  const submission = submissionResp?.data;

  const publishMutation = useMutation({
    mutationFn: async () => {
      return api<Submission>(`/submissions/${submissionId}/publish`, {
        method: "PUT",
        headers: {
          authorization: `Bearer ${getCookie("ac-token")}`,
        },
      });
    },
    onSuccess: (res) => {
      queryClient.setQueryData(["submission", submissionId], res);
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <PageHeading
          title={submission?.title || "Submission Details"}
          subtitle={submission?.id ? `ID: ${submission.id}` : undefined}
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading || publishMutation.isPending}
            onClick={() => refetch()}
          >
            Refresh
          </Button>

          <Button
            size="sm"
            onClick={() => publishMutation.mutate()}
            disabled={
              publishMutation.isPending ||
              submission?.status !== SubmissionStatus.DRAFT
            }
          >
            {publishMutation.isPending ? (
              <span className="flex items-center gap-2">
                <Spinner className="size-4" /> Publishing...
              </span>
            ) : submission?.status !== SubmissionStatus.DRAFT ? (
              "Published"
            ) : (
              "Publish"
            )}
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner /> Loading submission...
        </div>
      )}
      {isError && (
        <ErrorBar
          message={
            error instanceof ApiError
              ? error.message
              : "Failed to load submission"
          }
        />
      )}

      {submission && (
        <div className="grid gap-6">
          <section className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={submission.status} />
              <div className="text-xs text-muted-foreground">
                Version {submission.version}
              </div>
              <div className="text-xs text-muted-foreground">
                Created {new Date(submission.createdAt).toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">
                Updated {new Date(submission.updatedAt).toLocaleString()}
              </div>
              {submission.publishedAt && (
                <div className="text-xs text-muted-foreground">
                  Published {new Date(submission.publishedAt).toLocaleString()}
                </div>
              )}
            </div>
            <div className="prose max-w-none">
              <h2 className="text-base font-semibold tracking-tight">
                Abstract
              </h2>
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {submission.abstract || <em>No abstract provided.</em>}
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-medium tracking-wide text-muted-foreground">
              Keywords
            </h3>
            {submission.keywords?.length ? (
              <div className="flex flex-wrap gap-2">
                {submission.keywords.map((k) => (
                  <Keyword key={k}>{k}</Keyword>
                ))}
              </div>
            ) : (
              <p className="text-xs italic text-muted-foreground">
                No keywords
              </p>
            )}
          </section>

          {submission.manuscriptPath && (
            <section className="space-y-3">
              <h3 className="text-sm font-medium tracking-wide text-muted-foreground">
                Manuscript
              </h3>
              <div>
                <Button
                  asChild
                  variant="secondary"
                  size="sm"
                  disabled={publishMutation.isPending}
                >
                  <a
                    href={`${process.env.NEXT_PUBLIC_FILE_BASE_URL}/${submission.manuscriptPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View / Download
                  </a>
                </Button>
              </div>
            </section>
          )}

          {submission.reviews && submission.reviews.length > 0 && (
            <section>
              <h3 className="text-sm font-medium tracking-wide text-muted-foreground">
                Comments of Reviewers
              </h3>

              <div className="divide-y px-4 py-3">
                {submission.reviews.map((review, i) =>
                  review.commentsToAuthor ? (
                    <div key={review.id} className="p-3 flex items-start gap-2">
                      <span className="text-xl font-bold">{i + 1}</span>
                      <p className="text-sm tracking-wide">
                        {review.commentsToAuthor}
                      </p>
                    </div>
                  ) : null
                )}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
