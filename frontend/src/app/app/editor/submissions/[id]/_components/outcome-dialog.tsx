"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import api from "@/lib/api";
import { getCookie } from "cookies-next/client";
import React, { useState } from "react";

import { toast } from "sonner";

type Props = {
  submissionId: string;
};

const OutcomeDialog = ({ submissionId }: Props) => {
  const [outcome, setOutcome] = useState<string>("");
  const [letterPath, setLetterPath] = useState<string>("");
  const [letterFile, setLetterFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const dialogCloseBtnRef = React.useRef<HTMLButtonElement>(null);

  const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setLetterFile(file);
    }
  };

  const uploadLetter = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit.");
      return;
    }

    const { data: presignData } = await api<{
      url: string;
      key: string;
      expiresIn: number;
      requiredHeaders: Record<string, string>;
    }>("/files/presign", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getCookie("ac-token")}`,
      },
      body: JSON.stringify({
        size: file.size,
      }),
    });

    if (!presignData) {
      console.error("Failed to get presign data");
      toast.error("Failed to upload letter.");
      return;
    }

    const uploadRes = await fetch(presignData.url, {
      method: "PUT",
      headers: {
        ...presignData.requiredHeaders,
      },
      body: file,
    });

    if (!uploadRes.ok) {
      toast.error("Failed to upload letter.");
      return;
    }
    return presignData.key;
  };

  const submitHandler = async () => {
    if (!outcome) {
      toast.error("Please select an outcome.");
      return;
    }

    try {
      setSubmitting(true);

      if (letterFile) {
        const path = await uploadLetter(letterFile);
        setLetterPath(path || "");
      }

      await api(`/submissions/${submissionId}/decision`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getCookie("ac-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          outcome,
          letterPath: letterPath || null,
        }),
      });

      toast.success("Decision submitted successfully.");
      dialogCloseBtnRef.current?.click();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
        return;
      }
      toast.error("Failed to submit decision.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">Make decision</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Make a decision</DialogTitle>
          <DialogDescription>
            Take an action to finalize the submission outcome.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <Field>
            <FieldLabel>Submission Outcome</FieldLabel>
            <Select value={outcome} onValueChange={setOutcome}>
              <SelectTrigger>
                <SelectValue placeholder="Select outcome" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACCEPTED">Accept</SelectItem>
                <SelectItem value="REJECTED">Reject</SelectItem>
                <SelectItem value="REVISION_REQUIRED">
                  Revision Required
                </SelectItem>
              </SelectContent>
            </Select>
            <FieldDescription>
              Choose the outcome for this submission.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel>Decision Letter</FieldLabel>
            <Input
              type="file"
              accept="application/pdf"
              onChange={fileChangeHandler}
            />
            <FieldDescription>
              Upload the decision letter (PDF format).
            </FieldDescription>
          </Field>
        </div>
        <DialogFooter>
          <DialogClose asChild ref={dialogCloseBtnRef}>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button onClick={submitHandler} disabled={submitting}>
            {submitting ? (
              <>
                <Spinner className="size-4" /> <span>Submitting...</span>
              </>
            ) : (
              "Submit Decision"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OutcomeDialog;
