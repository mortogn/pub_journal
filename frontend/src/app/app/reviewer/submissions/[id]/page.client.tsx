"use client";

import React from "react";
import api, { ApiError } from "@/lib/api";
import { Recommendation, Submission, User, Review } from "@/types";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getCookie } from "cookies-next";

type Props = { submissionId: string };

export default function ReviewerSubmissionClientPage({ submissionId }: Props) {
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

  // Fetch current user to identify their review among submission.reviews
  const { data: meResp } = useQuery({
    queryKey: ["me"],
    queryFn: async () =>
      api<User>(`/users/me`, {
        method: "GET",
        headers: { authorization: `Bearer ${getCookie("ac-token")}` },
      }),
    staleTime: 60_000,
  });
  const me = meResp?.data;

  const existingReview = React.useMemo(() => {
    if (!submission || !me) return undefined;
    return submission.reviews?.find((r: Review) => r.reviewerId === me.id);
  }, [submission, me]);

  const isFinalized = !!existingReview?.recommendation; // once recommendation set, lock fields

  const [recommendation, setRecommendation] = React.useState<
    Recommendation | ""
  >("");
  const [score, setScore] = React.useState<string>("");
  const [commentsToAuthor, setCommentsToAuthor] = React.useState("");
  const [commentsToEditor, setCommentsToEditor] = React.useState("");

  // Initialize form values from existing review when it loads
  React.useEffect(() => {
    if (existingReview && existingReview.id) {
      if (existingReview.recommendation) {
        setRecommendation(existingReview.recommendation as Recommendation);
      }
      if (typeof existingReview.score === "number") {
        setScore(String(existingReview.score));
      }
      if (existingReview.commentsToAuthor) {
        setCommentsToAuthor(existingReview.commentsToAuthor);
      }
      if (existingReview.commentsToEditor) {
        setCommentsToEditor(existingReview.commentsToEditor);
      }
    }
  }, [existingReview]);

  const reviewMutation = useMutation({
    mutationFn: async () =>
      api(`/submissions/${submissionId}/review`, {
        method: "PUT",
        headers: { authorization: `Bearer ${getCookie("ac-token")}` },
        body: JSON.stringify({
          recommendation: recommendation || undefined,
          score: score !== "" ? Number(score) : undefined,
          commentsToAuthor: commentsToAuthor || undefined,
          commentsToEditor: commentsToEditor || undefined,
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submission", submissionId] });
    },
  });

  // basic derived state
  const canSubmit =
    !!recommendation ||
    !!commentsToAuthor ||
    !!commentsToEditor ||
    score !== "";

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
            disabled={isLoading}
            onClick={() => refetch()}
          >
            Refresh
          </Button>
          {!isFinalized && (
            <Button
              size="sm"
              onClick={() => reviewMutation.mutate()}
              disabled={!canSubmit || reviewMutation.isPending}
            >
              {reviewMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Spinner className="size-4" /> Submitting...
                </span>
              ) : (
                "Submit review"
              )}
            </Button>
          )}
          {isFinalized && (
            <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">
              Review finalized
            </span>
          )}
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

          {/* Manuscript */}
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

          {/* Review form */}
          <section className="space-y-3">
            <h3 className="text-sm font-medium tracking-wide text-muted-foreground">
              Your review
            </h3>
            <div className="grid gap-3 max-w-2xl">
              <div className="flex gap-3 flex-wrap items-center">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">
                    Recommendation
                  </div>
                  {isFinalized ? (
                    <div className="px-2 py-1 rounded bg-muted text-xs font-medium uppercase">
                      {recommendation?.replace(/_/g, " ") ||
                        existingReview?.recommendation?.replace(/_/g, " ")}
                    </div>
                  ) : (
                    <Select
                      value={recommendation}
                      onValueChange={(v) =>
                        setRecommendation(v as Recommendation)
                      }
                    >
                      <SelectTrigger className="min-w-56">
                        <SelectValue placeholder="Select recommendation" />
                      </SelectTrigger>
                      <SelectContent>
                        {(
                          [
                            Recommendation.ACCEPT,
                            Recommendation.MINOR_REVISION,
                            Recommendation.MAJOR_REVISION,
                            Recommendation.REJECT,
                          ] as const
                        ).map((r) => (
                          <SelectItem key={r} value={r}>
                            {r.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">
                    Score (0-10)
                  </div>
                  {isFinalized ? (
                    <div className="px-2 py-1 rounded bg-muted text-xs font-medium">
                      {score !== "" ? score : existingReview?.score ?? "-"}
                    </div>
                  ) : (
                    <Input
                      type="number"
                      min={0}
                      max={10}
                      step={1}
                      value={score}
                      onChange={(e) => setScore(e.target.value)}
                      className="w-24"
                    />
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">
                  Comments to author
                </div>
                {isFinalized ? (
                  <div className="border rounded-md p-2 text-sm whitespace-pre-line bg-muted/30">
                    {commentsToAuthor || existingReview?.commentsToAuthor || (
                      <em className="text-xs text-muted-foreground">None</em>
                    )}
                  </div>
                ) : (
                  <Textarea
                    rows={4}
                    value={commentsToAuthor}
                    onChange={(e) => setCommentsToAuthor(e.target.value)}
                    placeholder="Share constructive feedback for the author."
                  />
                )}
              </div>
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">
                  Comments to editor
                </div>
                {isFinalized ? (
                  <div className="border rounded-md p-2 text-sm whitespace-pre-line bg-muted/30">
                    {commentsToEditor || existingReview?.commentsToEditor || (
                      <em className="text-xs text-muted-foreground">None</em>
                    )}
                  </div>
                ) : (
                  <Textarea
                    rows={4}
                    value={commentsToEditor}
                    onChange={(e) => setCommentsToEditor(e.target.value)}
                    placeholder="Private notes for the editor."
                  />
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
