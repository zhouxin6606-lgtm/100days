import type { Streak } from "@/lib/types";
import { UI_TEXT } from "@/lib/constants";

export function StreakCounter({ streak }: { streak: Streak | null }) {
  const current = streak?.current_streak ?? 0;
  const longest = streak?.longest_streak ?? 0;
  const total = streak?.total_days ?? 0;

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-1 text-3xl">
          {current > 0 ? "🔥" : "💤"}
        </div>
        <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {current}
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          {UI_TEXT.streak.current}{UI_TEXT.streak.days}
        </div>
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-1 text-3xl">🏆</div>
        <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {longest}
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          {UI_TEXT.streak.longest}{UI_TEXT.streak.days}
        </div>
      </div>
      <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-1 text-3xl">📅</div>
        <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {total}
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          {UI_TEXT.streak.total}{UI_TEXT.streak.days}
        </div>
      </div>
    </div>
  );
}
