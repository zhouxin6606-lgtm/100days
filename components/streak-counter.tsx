import type { Streak } from "@/lib/types";

export function StreakCounter({ streak }: { streak: Streak | null }) {
  const current = streak?.current_streak ?? 0;
  const longest = streak?.longest_streak ?? 0;
  const total = streak?.total_days ?? 0;

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-5 text-white shadow-lg shadow-emerald-500/20">
      <div>
        <p className="text-sm font-medium text-emerald-100">连续打卡</p>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-5xl font-bold tracking-tight">{current}</span>
          <span className="text-lg text-emerald-200">天</span>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-4 text-sm">
        <span className="text-emerald-100">
          最长 <span className="font-semibold text-white">{longest}</span> 天
        </span>
        <span className="text-emerald-100">
          累计 <span className="font-semibold text-white">{total}</span> 天
        </span>
      </div>
    </div>
  );
}
