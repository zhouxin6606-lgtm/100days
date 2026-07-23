"use client";

import { useActionState } from "react";
import { joinGroup } from "@/app/actions/groups";
import { UI_TEXT } from "@/lib/constants";

export function JoinGroupForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      try {
        await joinGroup(formData);
        return null;
      } catch (e) {
        return e instanceof Error ? e.message : "加入失败";
      }
    },
    null,
  );

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {UI_TEXT.group.join}
      </h3>
      <form action={formAction} className="space-y-3">
        {state && (
          <div className="rounded bg-red-50 p-2 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400">
            {state}
          </div>
        )}
        <input
          name="invite_code"
          required
          placeholder={UI_TEXT.group.inviteCode}
          maxLength={8}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-mono uppercase text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-lg border border-emerald-600 px-3 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 disabled:opacity-50 dark:border-emerald-400 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
        >
          {pending ? UI_TEXT.common.loading : UI_TEXT.group.join}
        </button>
      </form>
    </div>
  );
}
