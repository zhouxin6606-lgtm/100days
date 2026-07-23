"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function checkIn(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("未登录");

  const duration = Number(formData.get("duration")) || 0;
  const notes = (formData.get("notes") as string) || "";
  const groupId = (formData.get("group_id") as string) || null;

  // 插入打卡记录
  const { error: insertError } = await supabase.from("check_ins").insert({
    user_id: user.id,
    group_id: groupId,
    duration,
    notes,
  });

  if (insertError) {
    console.error("打卡插入失败:", insertError);
    throw new Error("打卡失败: " + insertError.message);
  }

  // 更新连续打卡（简单逻辑）
  const today = new Date().toISOString().split("T")[0];

  // 获取或创建 streak 记录
  let { data: streak } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", user.id)
    .is("group_id", groupId)
    .maybeSingle();

  if (!streak) {
    // 创建新记录
    await supabase.from("streaks").insert({
      user_id: user.id,
      group_id: groupId,
      current_streak: 1,
      longest_streak: 1,
      total_days: 1,
      last_check_in: today,
    });
  } else if (streak.last_check_in !== today) {
    // 计算连续天数
    const lastDate = new Date(streak.last_check_in);
    const now = new Date(today);
    const diffDays = Math.floor(
      (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
    );

    const newStreak = diffDays === 1 ? streak.current_streak + 1 : 1;
    const newLongest = Math.max(streak.longest_streak, newStreak);

    await supabase
      .from("streaks")
      .update({
        current_streak: newStreak,
        longest_streak: newLongest,
        total_days: streak.total_days + 1,
        last_check_in: today,
      })
      .eq("id", streak.id);
  }

  // 更新 XP
  const xpEarned = Math.min(10 + duration, 60);
  const { data: profile } = await supabase
    .from("profiles")
    .select("xp")
    .eq("id", user.id)
    .single();

  if (profile) {
    const newXp = profile.xp + xpEarned;
    const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1;
    await supabase
      .from("profiles")
      .update({ xp: newXp, level: newLevel })
      .eq("id", user.id);
  }

  revalidatePath("/dashboard");
  revalidatePath("/checkin");
}
