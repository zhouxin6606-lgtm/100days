"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { CheckInWithProfile } from "@/lib/types";

export function GroupFeed({
  groupId,
  initialCheckIns,
}: {
  groupId: string;
  initialCheckIns: CheckInWithProfile[];
}) {
  const [checkIns, setCheckIns] = useState(initialCheckIns);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel(`group-${groupId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "check_ins",
          filter: `group_id=eq.${groupId}`,
        },
        async (payload) => {
          // Fetch the full check-in with profile
          const { data } = await supabase
            .from("check_ins")
            .select("*, profiles(display_name, avatar_url)")
            .eq("id", payload.new.id)
            .single();

          if (data) {
            setCheckIns((prev) => [data as CheckInWithProfile, ...prev]);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId, supabase]);

  return (
    <div className="space-y-3">
      {checkIns.length === 0 && (
        <p className="py-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
          暂无打卡记录
        </p>
      )}
      {checkIns.map((ci) => (
        <div
          key={ci.id}
          className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                {ci.profiles?.display_name?.[0] ?? "用"}
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {ci.profiles?.display_name ?? "匿名用户"}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {new Date(ci.created_at).toLocaleString("zh-CN", {
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              +{ci.duration} 分钟
            </span>
          </div>
          {ci.notes && (
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              {ci.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
