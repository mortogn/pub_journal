"use client";
import api from "@/lib/api";
import { Submission } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next";
import React from "react";
import EditorSubmissionTable from "./_components/editor-submission-table";

export default function EditorSubmissionClientPage() {
  const { data: submissionRes } = useQuery({
    queryKey: ["editor", "submissions"],
    queryFn: async () => {
      return api<Submission[]>(`/submissions`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getCookie("ac-token")}`,
        },
      });
    },
  });

  return (
    <div>
      {submissionRes && submissionRes.data && (
        <EditorSubmissionTable data={submissionRes.data} />
      )}
    </div>
  );
}
