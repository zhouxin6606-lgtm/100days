import { createClient } from "@/lib/supabase/server";
import { AchievementBadge } from "@/components/achievement-badge";
import { UI_TEXT } from "@/lib/constants";

const ALL_ACHIEVEMENTS = [
  "first_checkin",
  "streak_7",
  "streak_30",
  "streak_100",
];

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  // Fetch streak
  const { data: streak } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", user!.id)
    .is("group_id", null)
    .single();

  // Fetch achievements
  const { data: achievements } = await supabase
    .from("achievements")
    .select("type")
    .eq("user_id", user!.id);

  const earnedTypes = new Set(achievements?.map((a) => a.type) ?? []);

  // Calculate level progress
  const xp = profile?.xp ?? 0;
  const level = profile?.level ?? 1;
  const currentLevelXp = (level - 1) * (level - 1) * 100;
  const nextLevelXp = level * level * 100;
  const progress =
    nextLevelXp > currentLevelXp
      ? ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100
      : 0;

  return (
    <div className="mx-auto max-w-2xl p-4 md:p-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        {UI_TEXT.profile.title}
      </h1>

      {/* Profile Card */}
      <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            {profile?.display_name?.[0] ?? "用"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {profile?.display_name ?? "用户"}
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Level Progress */}
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {UI_TEXT.profile.level} {level}
            </span>
            <span className="text-zinc-500 dark:text-zinc-400">
              {xp} / {nextLevelXp} XP
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-1 text-2xl">🔥</div>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {streak?.current_streak ?? 0}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {UI_TEXT.streak.current}{UI_TEXT.streak.days}
          </div>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-4 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-1 text-2xl">📅</div>
          <div className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            {streak?.total_days ?? 0}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {UI_TEXT.streak.total}{UI_TEXT.streak.days}
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {UI_TEXT.profile.achievements}
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ALL_ACHIEVEMENTS.map((type) => (
            <AchievementBadge
              key={type}
              type={type}
              earned={earnedTypes.has(type)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
