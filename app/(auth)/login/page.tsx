import Link from "next/link";
import { LoginForm } from "./login-form";
import { UI_TEXT } from "@/lib/constants";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h1 className="mb-2 text-center text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        {UI_TEXT.auth.loginTitle}
      </h1>
      <p className="mb-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        记录你的每一步进步
      </p>
      <LoginForm searchParams={searchParams} />
      <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        {UI_TEXT.auth.noAccount}{" "}
        <Link
          href="/signup"
          className="font-medium text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
        >
          {UI_TEXT.auth.signup}
        </Link>
      </p>
    </div>
  );
}
