"use client";

import React from "react";
import api, { ApiError } from "@/lib/api";
import { Assignment, Submission, User } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PageHeading from "@/components/common/page-heading";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import ErrorBar from "@/components/common/error-bar";
import StatusBadge from "@/components/submissions/status-badge";
import Keyword from "@/components/submissions/keyword";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCookie } from "cookies-next";
import { CheckIcon, RefreshCwIcon, XIcon } from "lucide-react";
import OutcomeDialog from "./_components/outcome-dialog";

type Props = {
  submissionId: string;
};

export default function EditorSubmissionClientPage({ submissionId }: Props) {
  const queryClient = useQueryClient();

  const {
    data: submissionResp,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["submission", submissionId],
    queryFn: async () =>
      api<Submission>(`/submissions/${submissionId}`, {
        method: "GET",
        headers: { authorization: `Bearer ${getCookie("ac-token")}` },
      }),
    staleTime: 30_000,
  });

  const submission = submissionResp?.data;

  const { data: reviewersResp } = useQuery({
    queryKey: ["reviewers"],
    queryFn: async () =>
      api<Pick<User, "id" | "fullname" | "email">[]>(`/users/reviewers`, {
        method: "GET",
        headers: { authorization: `Bearer ${getCookie("ac-token")}` },
      }),
    staleTime: 60_000,
  });

  const [selectedReviewer, setSelectedReviewer] = React.useState<string>("");

  const assignMutation = useMutation({
    mutationFn: async (vars: { reviewerId: string }) =>
      api<Assignment>(`/submissions/assign`, {
        method: "POST",
        headers: { authorization: `Bearer ${getCookie("ac-token")}` },
        body: JSON.stringify({
          submissionId: submissionId,
          reviewerId: vars.reviewerId,
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submission", submissionId] });
      setSelectedReviewer("");
    },
  });

  const decisionMutation = useMutation({
    mutationFn: async (vars: { outcome: string; letterPath: string }) =>
      api<Submission>(`/submissions/${submissionId}/decision`, {
        method: "POST",
        headers: { authorization: `Bearer ${getCookie("ac-token")}` },
        body: JSON.stringify({
          outcome: vars.outcome,
          letterPath: vars.letterPath,
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submission", submissionId] });
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
          <OutcomeDialog submissionId={submissionId} />
          <Button
            variant="outline"
            size="sm"
            disabled={isLoading}
            onClick={() => refetch()}
          >
            Refresh
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
        <div className="grid gap-8">
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

          {/* Assign reviewers */}
          <section className="space-y-3">
            <h3 className="text-sm font-medium tracking-wide text-muted-foreground">
              Assign reviewer
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={selectedReviewer}
                onValueChange={setSelectedReviewer}
              >
                <SelectTrigger className="min-w-56">
                  <SelectValue placeholder="Select reviewer" />
                </SelectTrigger>
                <SelectContent>
                  {reviewersResp?.data?.length ? (
                    reviewersResp.data.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        <span className="font-medium">{r.fullname}</span>
                        <span className="text-xs text-muted-foreground">
                          {r.email}
                        </span>
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-xs text-muted-foreground">
                      No reviewers
                    </div>
                  )}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                onClick={() =>
                  selectedReviewer &&
                  assignMutation.mutate({ reviewerId: selectedReviewer })
                }
                disabled={!selectedReviewer || assignMutation.isPending}
              >
                {assignMutation.isPending ? (
                  <span className="flex items-center gap-2">
                    <Spinner className="size-4" /> Assigning...
                  </span>
                ) : (
                  "Assign"
                )}
              </Button>
            </div>
            {submission.assignments && submission.assignments.length > 0 && (
              <div className="mt-2">
                <div className="text-xs font-medium text-muted-foreground mb-1.5">
                  Assigned reviewers
                </div>
                <ul className="space-y-1.5">
                  {submission.assignments.map((a) => (
                    <li key={a.id} className="text-sm">
                      <span className="font-medium">
                        {a.reviewer?.fullname || a.reviewerId}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {" "}
                        · assigned {new Date(a.assignedAt).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Reviews */}
          <section className="space-y-3">
            <h3 className="text-sm font-medium tracking-wide text-muted-foreground">
              Reviews
            </h3>
            {submission.reviews && submission.reviews.length > 0 ? (
              <div className="space-y-3">
                {submission.reviews.map((rev) => (
                  <div key={rev.id} className="border rounded-md p-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-medium">
                        {rev.reviewer?.fullname || rev.reviewerId}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Updated {new Date(rev.updatedAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="mt-2 grid gap-2">
                      <div className="text-sm">
                        <span className="font-medium">Recommendation:</span>{" "}
                        <span className="uppercase tracking-wide text-xs px-2 py-0.5 rounded bg-muted">
                          {rev.recommendation || "PENDING"}
                        </span>
                      </div>
                      {rev.commentsToEditor && (
                        <div>
                          <div className="text-xs font-medium text-muted-foreground">
                            Comments to editor
                          </div>
                          <p className="text-sm whitespace-pre-line">
                            {rev.commentsToEditor}
                          </p>
                        </div>
                      )}
                      {rev.commentsToAuthor && (
                        <div>
                          <div className="text-xs font-medium text-muted-foreground">
                            Comments to author
                          </div>
                          <p className="text-sm whitespace-pre-line">
                            {rev.commentsToAuthor}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs italic text-muted-foreground">
                No reviews yet
              </p>
            )}
          </section>

          {submission.manuscriptPath && (
            <section className="space-y-3">
              <h3 className="text-sm font-medium tracking-wide text-muted-foreground">
                Manuscript
              </h3>
              <div>
                <Button asChild variant="secondary" size="sm">
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
        </div>
      )}
    </div>
  );
}
