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
      className={`flex h-full flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 transition-all ${
        checkedInToday
          ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
          : "border-zinc-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/10"
      }`}
    >
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
        {checkedInToday ? (
          <svg className="h-7 w-7 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        ) : (
          <svg className="h-7 w-7 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
        )}
      </div>
      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        {checkedInToday ? "今日已打卡" : "开始打卡"}
      </p>
      <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
        {checkedInToday ? "明天继续加油" : "记录你的学习时光"}
      </p>
    </button>
  );
}
