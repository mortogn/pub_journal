import type { Submission as TSubmission } from "@/types";
import React, { FC } from "react";
import StatusBadge from "./status-badge";
import Keyword from "./keyword";

type Props = {
  data: TSubmission;
};

const Submission: FC<Props> = ({ data }) => {
  return (
    <div className="py-3 rounded-md mb-4 space-y-3 group">
      <h2 className="text-lg font-medium tracking-tight group-hover:underline">
        {data.title}
      </h2>
      <p className="line-clamp-2 text-sm tracking-wide">{data.abstract}</p>
      <div className="space-y-1 space-x-1">
        {data.keywords.map((keyword) => (
          <Keyword key={keyword}>{keyword}</Keyword>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        <StatusBadge status={data.status} />
      </p>
    </div>
  );
};

export default Submission;
