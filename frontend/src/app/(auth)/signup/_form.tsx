"use client";

import { useForm } from "react-hook-form";
import z from "zod";
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
import { Button } from "@/components/ui/button";
import api, { ApiError } from "@/lib/api";
import { useState } from "react";
import ErrorBar from "@/components/common/error-bar";
import { setCookie } from "cookies-next";
import { User } from "@/types/models";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types";

const signUpSchema = z
  .object({
    fullname: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof signUpSchema>;

const SignUpForm = () => {
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const form = useForm<FormValues>({
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(signUpSchema),
  });

  const submitHandler = async (data: FormValues) => {
    setError(null);
    try {
      const { data: signUpResult } = await api<{
        accessToken: string;
        data: Omit<User, "password">;
      }>("/auth/signup", {
        method: "POST",
        body: JSON.stringify(data),
      });

      setCookie("ac-token", signUpResult.accessToken);
      switch (signUpResult.data.role) {
        case UserRole.AUTHOR:
          router.push("/app/author/dashboard");
          break;
        case UserRole.REVIEWER:
          router.push("/app/reviewer/dashboard");
          break;
        case UserRole.ADMIN:
          router.push("/app/admin/dashboard");
          break;
        case UserRole.EDITOR:
          router.push("/app/editor/dashboard");
          break;
        default:
          router.push("/");
      }
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <Form {...form}>
      {error && <ErrorBar message={error} />}
      <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="John Doe" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} placeholder="abc@mail.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input {...field} placeholder="********" type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input {...field} placeholder="********" type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full">
          <span>Sign up</span>
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
