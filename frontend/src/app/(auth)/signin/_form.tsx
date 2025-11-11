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
import { User, UserRole } from "@/types";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const form = useForm<FormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const submitHandler = async (data: FormValues) => {
    setError(null);
    try {
      const { data: signInResult } = await api<{
        accessToken: string;
        data: Omit<User, "password">;
      }>("/auth/signin", {
        method: "POST",
        body: JSON.stringify(data),
      });

      setCookie("ac-token", signInResult.accessToken);

      switch (signInResult.data.role) {
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
    } catch (err) {
      console.error(err);
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("An unknown error occurred, Please try again later.");
      }
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-4">
        {error && <ErrorBar message={error} />}
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

        <Button className="w-full">
          <span>Sign in</span>
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
