import { createClient } from "@/lib/supabase/server";
import { CheckInForm } from "@/components/checkin-form";
import { UI_TEXT } from "@/lib/constants";

export default async function CheckinPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch user's groups
  const { data: memberships } = await supabase
    .from("group_members")
    .select("study_groups(*)")
    .eq("user_id", user!.id);

  const groups =
    memberships?.map((m) => (m as { study_groups: any }).study_groups) ?? [];

  return (
    <div className="mx-auto max-w-lg p-4 md:p-8">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        {UI_TEXT.checkin.title}
      </h1>
      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <CheckInForm groups={groups} />
      </div>
    </div>
  );
}
