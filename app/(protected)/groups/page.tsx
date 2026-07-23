import { createClient } from "@/lib/supabase/server";
import { GroupCard } from "@/components/group-card";
import { CreateGroupForm } from "./create-group-form";
import { JoinGroupForm } from "./join-group-form";
import { UI_TEXT } from "@/lib/constants";

export default async function GroupsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch user's groups
  const { data: memberships } = await supabase
    .from("group_members")
    .select("study_groups(*, group_members(count))")
    .eq("user_id", user!.id);

  const groups =
    memberships?.map(
      (m) => (m as { study_groups: any }).study_groups,
    ) ?? [];

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        {UI_TEXT.group.title}
      </h1>

      {/* Create & Join */}
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <CreateGroupForm />
        <JoinGroupForm />
      </div>

      {/* Group List */}
      {groups.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-zinc-300 py-12 text-center dark:border-zinc-700">
          <p className="mb-2 text-lg text-zinc-500 dark:text-zinc-400">
            还没有加入任何小组
          </p>
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            创建一个小组或通过邀请码加入
          </p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      )}
    </div>
  );
}
