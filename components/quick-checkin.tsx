"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function QuickCheckIn({ checkedInToday }: { checkedInToday: boolean }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      onClick={() => {
        startTransition(() => {
          router.push("/checkin");
        });
      }}
      disabled={pending || checkedInToday}
      className={`w-full rounded-xl border-2 border-dashed p-6 text-center transition-all ${
        checkedInToday
          ? "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
          : "border-zinc-300 bg-white hover:border-emerald-400 hover:bg-emerald-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-emerald-600 dark:hover:bg-emerald-900/20"
      }`}
    >
      <div className="mb-2 text-4xl">
        {checkedInToday ? "✅" : "⏰"}
      </div>
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {checkedInToday ? "今天已打卡" : "点击去打卡"}
      </p>
    </button>
  );
}
