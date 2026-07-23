import type { Streak } from "@/lib/types";

export function StreakCounter({ streak }: { streak: Streak | null }) {
  const current = streak?.current_streak ?? 0;
  const longest = streak?.longest_streak ?? 0;
  const total = streak?.total_days ?? 0;

  return (
    <div className="flex h-full flex-col justify-center rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mb-3 flex items-center gap-3">
        <span className="text-3xl">{current > 0 ? "🔥" : "💤"}</span>
        <div>
          <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {current}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            连续打卡天数
          </div>
        </div>
      </div>
      <div className="flex gap-4 text-sm">
        <span className="text-zinc-500 dark:text-zinc-400">
          最长 <span className="font-semibold text-zinc-900 dark:text-zinc-100">{longest}</span> 天
        </span>
        <span className="text-zinc-500 dark:text-zinc-400">
          累计 <span className="font-semibold text-zinc-900 dark:text-zinc-100">{total}</span> 天
        </span>
      </div>
    </div>
  );
}
