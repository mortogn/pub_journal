"use client";

import { useForm } from "react-hook-form";
import z, { size } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import api, { ApiError } from "@/lib/api";
import { useState } from "react";
import ErrorBar from "@/components/common/error-bar";
import { getCookie } from "cookies-next";

const submissionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  abstract: z.string().min(1, "Abstract is required"),
  keywords: z.string().min(1, "Keywords are required"),
  pdf: z
    .custom<File>((val) => val instanceof File, "Please select a PDF file")
    .refine(
      (file) => (file as File).type === "application/pdf",
      "File must be a PDF"
    ),
  manuscriptURL: z.string().url("Must be a valid URL").optional(),
});

type FormValues = z.infer<typeof submissionSchema>;

const CreateSubmissionForm = () => {
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      title: "",
      abstract: "",
      keywords: "",
      pdf: undefined as unknown as File,
    },
  });

  const uploadPdf = async (file: File): Promise<string> => {
    const { data, status } = await api<{
      url: string;
      key: string;
      expiresIn: number;
      requiredHeaders: Record<string, string>;
    }>("/files/presign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getCookie("ac-token")}`,
      },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
        size: file.size,
      }),
    });

    if (!data.url) {
      throw new Error("Failed to upload the manuscript PDF file");
    }

    const uploadFileRes = await fetch(data.url, {
      method: "PUT",
      headers: {
        ...data.requiredHeaders,
      },
      body: file,
    });

    console.log("File uploaded to presigned URL");

    if (!uploadFileRes.ok) {
      console.error("Upload failed:", uploadFileRes.statusText);
      throw new Error("Failed to upload the manuscript PDF file");
    }

    form.setValue("manuscriptURL", data.key);

    return data.key;
  };

  const submitHandler = async (data: FormValues) => {
    setError(null);

    try {
      const manuscriptKey = await uploadPdf(data.pdf);

      await api("/submissions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getCookie("ac-token")}`,
        },
        body: JSON.stringify({
          title: data.title,
          abstract: data.abstract,
          keywords: data.keywords.split(",").map((kw) => kw.trim()),
          manuscriptUrl: manuscriptKey,
        }),
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <Form {...form}>
      {error && <ErrorBar message={error} />}
      <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="A concise, clear title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="abstract"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Abstract</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Summarize your submission..."
                  className="min-h-40"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keywords</FormLabel>
              <FormControl>
                <Input {...field} placeholder="comma,separated,keywords" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pdf"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PDF File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit">
          <span>Create submission</span>
        </Button>
      </form>
    </Form>
  );
};

export default CreateSubmissionForm;
