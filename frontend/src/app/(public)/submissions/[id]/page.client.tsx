"use client";

import Keyword from "@/components/submissions/keyword";
import api from "@/lib/api";
import { Submission } from "@/types";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

type Props = {
  submissionId: string;
};

export default function PublicSubmissionDetailsClientPage({
  submissionId,
}: Props) {
  const { data: submissionRes } = useQuery({
    queryKey: ["submission", "public", submissionId],
    queryFn: async () => {
      return api<Submission>(`/submissions/${submissionId}/public`);
    },
  });

  return (
    <div className="flex items-start gap-10">
      <div className="max-w-[210px] w-full shrink-0">
        <div className="w-40 shrink-0 h-auto bg-gray-100 border border-border rounded-md aspect-3/4"></div>
        <Link
          href={`${process.env.NEXT_PUBLIC_FILE_BASE_URL}/${submissionRes?.data.manuscriptPath}`}
          className="my-2  text-base tracking-wide underline"
          target="_blank"
        >
          View/Open Manuscript
        </Link>

        <div className="space-y-6 mt-6">
          <div>
            <h3 className="font-medium tracking-tight">Date</h3>
            <Link
              href={`/?author=${submissionRes?.data.author?.id}`}
              className=""
            >
              {new Date(
                submissionRes?.data.decision?.decisionAt ?? ""
              ).toDateString()}
            </Link>
          </div>

          <div>
            <h3 className="font-medium tracking-tight ">Publisher</h3>
            <p>Pundra University</p>
          </div>

          <div>
            <h3 className="font-medium tracking-tight ">Author</h3>
            <Link
              href={`/?author=${submissionRes?.data.author?.id}`}
              className=""
            >
              {submissionRes?.data.author?.fullname}
            </Link>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">
          {submissionRes?.data.title}
        </h1>
        <div className="space-y-3">
          <h3 className="font-medium tracking-tight ">Abstract</h3>
          <p className="prose leading-7">{submissionRes?.data.abstract}</p>
        </div>

        <div className="space-y-3">
          <h3 className="font-medium tracking-tight ">Keyword</h3>
          <div className="space-x-2">
            {submissionRes?.data.keywords.map((keyword) => (
              <Link href={`/?keyword=${keyword}`} key={keyword}>
                <Keyword>{keyword}</Keyword>
              </Link>
            ))}
          </div>
        </div>

        {submissionRes?.data.type && (
          <div className="space-y-3">
            <h3 className="font-medium tracking-tight ">Type</h3>
            <p className="prose">{submissionRes?.data.type}</p>
          </div>
        )}

        {submissionRes?.data.description && (
          <div className="space-y-3">
            <h3 className="font-medium tracking-tight ">Description</h3>
            <p className="prose leading-7">{submissionRes?.data.description}</p>
          </div>
        )}

        {submissionRes?.data.department && (
          <div className="space-y-3">
            <h3 className="font-medium tracking-tight ">Department</h3>
            <p className="prose">{submissionRes?.data.department}</p>
          </div>
        )}
      </div>
    </div>
  );
}
