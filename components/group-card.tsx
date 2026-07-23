import Link from "next/link";
import type { GroupWithMembers } from "@/lib/types";

export function GroupCard({ group }: { group: GroupWithMembers }) {
  const memberCount = group.group_members?.[0]?.count ?? 0;

  return (
    <Link
      href={`/groups/${group.id}`}
      className="block rounded-xl border border-zinc-200 bg-white p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/10"
    >
      <h3 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-100">
        {group.name}
      </h3>
      {group.description && (
        <p className="mb-2 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
          {group.description}
        </p>
      )}
      <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
        <span>👥 {memberCount} 人</span>
        <span>
          📅{" "}
          {new Date(group.created_at).toLocaleDateString("zh-CN")}
        </span>
      </div>
    </Link>
  );
}
