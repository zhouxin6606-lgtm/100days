import { createClient } from "@/lib/supabase/server";
import { GroupFeed } from "@/components/group-feed";
import { Leaderboard } from "@/components/leaderboard";
import { UI_TEXT } from "@/lib/constants";
import { CopyInviteCode } from "./copy-invite-code";

export default async function GroupDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch group
  const { data: group } = await supabase
    .from("study_groups")
    .select("*")
    .eq("id", id)
    .single();

  if (!group) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-zinc-500 dark:text-zinc-400">小组不存在</p>
      </div>
    );
  }

  // Fetch members with streaks
  const { data: members } = await supabase
    .from("group_members")
    .select("user_id, profiles(display_name)")
    .eq("group_id", id);

  // Fetch streaks for each member
  const memberIds = members?.map((m) => m.user_id) ?? [];
  const { data: streaks } = await supabase
    .from("streaks")
    .select("user_id, current_streak, total_days")
    .eq("group_id", id)
    .in("user_id", memberIds);

  // Check today's check-ins
  const today = new Date().toLocaleDateString("en-CA");
  const { data: todayCheckIns } = await supabase
    .from("check_ins")
    .select("user_id")
    .eq("group_id", id)
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`);

  const todayUserIds = new Set(todayCheckIns?.map((ci) => ci.user_id) ?? []);

  const leaderboard =
    members?.map((m) => {
      const streak = streaks?.find((s) => s.user_id === m.user_id);
      const profile = m.profiles as unknown as { display_name: string } | null;
      return {
        user_id: m.user_id,
        display_name: profile?.display_name ?? "匿名",
        current_streak: streak?.current_streak ?? 0,
        total_days: streak?.total_days ?? 0,
        today_checked_in: todayUserIds.has(m.user_id),
      };
    }) ?? [];

  // Fetch recent check-ins with profile info
  const { data: recentCheckIns } = await supabase
    .from("check_ins")
    .select("*, profiles(display_name, avatar_url)")
    .eq("group_id", id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8">
      {/* Group Header */}
      <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="mb-1 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {group.name}
        </h1>
        {group.description && (
          <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
            {group.description}
          </p>
        )}
        <CopyInviteCode code={group.invite_code} />
      </div>

      {/* Leaderboard */}
      <div className="mb-6">
        <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {UI_TEXT.group.leaderboard}
        </h2>
        <Leaderboard entries={leaderboard} />
      </div>

      {/* Feed */}
      <div>
        <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          {UI_TEXT.group.feed}
        </h2>
        <GroupFeed
          groupId={id}
          initialCheckIns={(recentCheckIns as any) ?? []}
        />
      </div>
    </div>
  );
}
