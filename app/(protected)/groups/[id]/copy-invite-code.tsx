"use client";

import { useState } from "react";
import { UI_TEXT } from "@/lib/constants";

export function CopyInviteCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-zinc-500 dark:text-zinc-400">
        {UI_TEXT.group.inviteCode}:
      </span>
      <code className="rounded bg-zinc-100 px-2 py-1 font-mono text-sm font-bold text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
        {code}
      </code>
      <button
        onClick={handleCopy}
        className="rounded bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
      >
        {copied ? UI_TEXT.group.copied : UI_TEXT.group.copyInviteCode}
      </button>
    </div>
  );
}
