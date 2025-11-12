import { Submission } from "@/types";
import Link from "next/link";
import React from "react";
import Keyword from "./keyword";

type Props = {
  data: Submission;
};

const PublicSubmissionCard = ({ data }: Props) => {
  return (
    <div className="flex gap-10">
      <div className="w-40 shrink-0 h-auto bg-gray-100 border border-border rounded-md"></div>
      <div className="space-y-3">
        <Link href={`/submissions/${data.id}`}>
          <h2 className="tracking-tight text-xl font-medium hover:underline">
            {data.title}
          </h2>
        </Link>
        <Link
          href={`/?author=${data.author?.id}`}
          className="hover:underline text-sm tracking-wide font-medium"
        >
          {data.author?.fullname}
        </Link>
        <p className="line-clamp-4 text-sm text-muted-foreground tracking-wide">
          {data.abstract}
        </p>

        <div className="space-y-1 space-x-1">
          {data.keywords.map((keyword) => (
            <Link href={`/?keyword=${keyword}`} key={keyword}>
              <Keyword>{keyword}</Keyword>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicSubmissionCard;
