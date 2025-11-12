import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Submission } from "@/types";
import Link from "next/link";
import React, { FC } from "react";

type Props = {
  data: Submission[];
};

const EditorSubmissionTable: FC<Props> = ({ data }) => {
  return (
    <Table className="table-fixed w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[30%]">Title</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Decision</TableHead>
          <TableHead>Reviews</TableHead>
          <TableHead>Assignments</TableHead>
          <TableHead>Submitted At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((submission) => (
          <TableRow key={submission.id}>
            <TableCell className="w-[30%] whitespace-normal wrap-break-word">
              <Link
                href={`/app/editor/submissions/${submission.id}`}
                className="hover:underline"
              >
                {submission.title}
              </Link>
            </TableCell>
            <TableCell>{submission.author?.fullname}</TableCell>
            <TableCell>{submission.decision?.outcome || "N/A"}</TableCell>
            <TableCell>{submission._count?.reviews || 0}</TableCell>
            <TableCell>{submission._count?.assignments || 0}</TableCell>
            <TableCell>
              {new Date(submission.createdAt).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default EditorSubmissionTable;
