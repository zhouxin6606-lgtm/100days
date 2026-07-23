import type { Streak } from "@/lib/types";

interface LeaderboardEntry {
  user_id: string;
  display_name: string;
  current_streak: number;
  total_days: number;
  today_checked_in: boolean;
}

export function Leaderboard({
  entries,
}: {
  entries: LeaderboardEntry[];
}) {
  if (entries.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
        暂无成员数据
      </p>
    );
  }

  const sorted = [...entries].sort((a, b) => {
    if (a.today_checked_in !== b.today_checked_in) {
      return a.today_checked_in ? -1 : 1;
    }
    if (b.current_streak !== a.current_streak) {
      return b.current_streak - a.current_streak;
    }
    return b.total_days - a.total_days;
  });

  return (
    <div className="space-y-2">
      {sorted.map((entry, i) => (
        <div
          key={entry.user_id}
          className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
              i === 0
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                : i === 1
                  ? "bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300"
                  : i === 2
                    ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                    : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
            }`}
          >
            {i + 1}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {entry.display_name}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              累计 {entry.total_days} 天
            </p>
          </div>
          <div className="flex items-center gap-2">
            {entry.today_checked_in && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400">
                ✅ 今日已打卡
              </span>
            )}
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              🔥 {entry.current_streak}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
