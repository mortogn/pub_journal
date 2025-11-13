"use client";

import PublicSubmissionCard from "@/components/submissions/public-submission-card";
import Submission from "@/components/submissions/submission";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import api from "@/lib/api";
import { type Submission as TSubmission } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { useState } from "react";

export default function HomeClientPage() {
  const [search, setSearch] = useState("");

  const { data: submissionRes } = useQuery({
    queryKey: ["submissions", "public", search],
    queryFn: async () => {
      return api<TSubmission[]>(`/submissions/public?search=${search}`, {
        method: "GET",
      });
    },
  });

  return (
    <div>
      <div className="mb-6 w-full">
        <InputGroup className="h-12 w-full">
          <InputGroupInput
            className="text-lg"
            placeholder="Search..."
            onChange={(e) => setSearch(e.target.value!)}
          />
          <InputGroupAddon>
            <SearchIcon className="size-6" />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <h2 className="text-2xl font-semibold tracking-tight my-2">
        Recent Submissions
      </h2>
      <div className="mt-4">
        {submissionRes?.data.map((submission) => (
          <PublicSubmissionCard key={submission.id} data={submission} />
        ))}
      </div>
    </div>
  );
}
