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

  // 计算本月统计
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const monthCheckIns = checkIns?.filter(
    (ci) => new Date(ci.created_at).toLocaleDateString("en-CA").startsWith(thisMonth),
  ) ?? [];
  const monthDays = new Set(
    monthCheckIns.map((ci) => new Date(ci.created_at).toLocaleDateString("en-CA")),
  ).size;
  const monthMinutes = monthCheckIns.reduce((sum, ci) => sum + ci.duration, 0);

  return (
    <div className="mx-auto max-w-3xl p-4 md:p-8">
      {/* Hero 卡片 */}
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <StreakCounter streak={streak} />
        <QuickCheckIn checkedInToday={checkedInToday} />
      </div>

      {/* 本月概览 */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-zinc-100 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500">本月打卡</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {monthDays} <span className="text-sm font-normal text-zinc-400">天</span>
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-100 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500">本月学习</p>
          <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {monthMinutes} <span className="text-sm font-normal text-zinc-400">分钟</span>
          </p>
        </div>
      </div>

      {/* 热力图 */}
      <div className="rounded-2xl border border-zinc-100 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <Heatmap data={heatmapData} />
      </div>
    </div>
  );
}
