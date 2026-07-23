"use client";

import { signup } from "@/app/actions/auth";
import { UI_TEXT } from "@/lib/constants";
import { useActionState } from "react";

export function SignupForm({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const [state, formAction, pending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      await signup(formData);
      return null;
    },
    null,
  );

  const errorMsg = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("error")
    : null;

  return (
    <form action={formAction} className="space-y-4">
      {errorMsg && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {decodeURIComponent(errorMsg)}
        </div>
      )}
      {state && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {state}
        </div>
      )}
      <div>
        <label
          htmlFor="display_name"
          className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          {UI_TEXT.auth.displayName}
        </label>
        <input
          id="display_name"
          name="display_name"
          type="text"
          required
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          placeholder="你的昵称"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          {UI_TEXT.auth.email}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          placeholder="you@example.com"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          {UI_TEXT.auth.password}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          placeholder="至少6位密码"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-600"
      >
        {pending ? UI_TEXT.common.loading : UI_TEXT.auth.signup}
      </button>
    </form>
  );
}
