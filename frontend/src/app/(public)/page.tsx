import Submission from "@/components/submissions/submission";
import api from "@/lib/api";
import { type Submission as TSubmission } from "@/types";
import { SearchIcon } from "lucide-react";
import React from "react";
import HomeClientPage from "./page.client";

export default async function Home() {
  return (
    <div className="flex items-start gap-5">
      <div className="flex items-center justify-center">
        <HomeClientPage />
      </div>

      <div></div>
    </div>
  );
}
