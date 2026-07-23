import { createClient } from "@/lib/supabase/server";
import { Heatmap } from "@/components/heatmap";
import { StreakCounter } from "@/components/streak-counter";
import { QuickCheckIn } from "@/components/quick-checkin";

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

  // Fetch all check-ins for heatmap
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

  // 按日期聚合打卡数据
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
    <div className="mx-auto max-w-3xl p-4 md:p-6">
      {/* 顶部：打卡按钮 + 连续天数 */}
      <div className="mb-4 grid gap-4 md:grid-cols-[1fr_1fr]">
        <QuickCheckIn checkedInToday={checkedInToday} />
        <StreakCounter streak={streak} />
      </div>

      {/* 热力图 */}
      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <Heatmap data={heatmapData} />
      </div>
    </div>
  );
}
