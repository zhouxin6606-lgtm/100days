import { createClient } from "@/lib/supabase/server";
import { Heatmap } from "@/components/heatmap";
import { StreakCounter } from "@/components/streak-counter";
import { QuickCheckIn } from "@/components/quick-checkin";
import { UI_TEXT } from "@/lib/constants";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch streak
  const { data: streak } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", user!.id)
    .is("group_id", null)
    .single();

  // Fetch all check-ins for heatmap (不加时间限制)
  const { data: checkIns } = await supabase
    .from("check_ins")
    .select("created_at, duration")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: true });

  // Check if already checked in today
  const today = new Date().toLocaleDateString("en-CA");
  const checkedInToday = checkIns?.some(
    (ci) => new Date(ci.created_at).toLocaleDateString("en-CA") === today,
  ) ?? false;

  // 转换为热力图数据格式（按日期聚合）
  const groupedMap = new Map<string, { count: number; minutes: number }>();
  for (const ci of checkIns ?? []) {
    const date = new Date(ci.created_at).toLocaleDateString("en-CA");
    const existing = groupedMap.get(date) ?? { count: 0, minutes: 0 };
    groupedMap.set(date, {
      count: existing.count + 1,
      minutes: existing.minutes + ci.duration,
    });
  }
  const heatmapData = Array.from(groupedMap.entries()).map(([date, v]) => ({
    date,
    count: v.count,
    minutes: v.minutes,
  }));

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        {UI_TEXT.nav.dashboard}
      </h1>

      {/* Streak Stats */}
      <div className="mb-6">
        <StreakCounter streak={streak} />
      </div>

      {/* Quick Check-in */}
      <div className="mb-6">
        <QuickCheckIn checkedInToday={checkedInToday} />
      </div>

      {/* Heatmap */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-3 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          学习热力图
        </h2>
        <Heatmap data={heatmapData} />
      </div>
    </div>
  );
}
