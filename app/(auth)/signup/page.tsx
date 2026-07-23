import Link from "next/link";
import { SignupForm } from "./signup-form";
import { UI_TEXT } from "@/lib/constants";

export default function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h1 className="mb-2 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        {UI_TEXT.auth.signupTitle}
      </h1>
      <p className="mb-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        加入学习社区，互相监督
      </p>
      <SignupForm searchParams={searchParams} />
      <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        {UI_TEXT.auth.hasAccount}{" "}
        <Link
          href="/login"
          className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
        >
          {UI_TEXT.auth.login}
        </Link>
      </p>
    </div>
  );
}
