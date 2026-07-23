import {
  ACHIEVEMENT_LABELS,
  ACHIEVEMENT_ICONS,
} from "@/lib/constants";

export function AchievementBadge({
  type,
  earned,
}: {
  type: string;
  earned: boolean;
}) {
  const label = ACHIEVEMENT_LABELS[type] ?? type;
  const icon = ACHIEVEMENT_ICONS[type] ?? "🏅";

  return (
    <div
      className={`flex flex-col items-center gap-1 rounded-xl border p-3 ${
        earned
          ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
          : "border-zinc-200 bg-zinc-50 opacity-50 dark:border-zinc-800 dark:bg-zinc-900"
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <span
        className={`text-xs font-medium ${
          earned
            ? "text-emerald-700 dark:text-emerald-400"
            : "text-zinc-500 dark:text-zinc-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
