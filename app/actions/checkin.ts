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

  // 1. 插入打卡记录
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

  // 2. 更新连续打卡
  const today = new Date().toISOString().split("T")[0];

  let { data: streak } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", user.id)
    .is("group_id", groupId)
    .maybeSingle();

  if (!streak) {
    await supabase.from("streaks").insert({
      user_id: user.id,
      group_id: groupId,
      current_streak: 1,
      longest_streak: 1,
      total_days: 1,
      last_check_in: today,
    });
  } else if (streak.last_check_in !== today) {
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

    // 更新本地变量以便后续使用
    streak = { ...streak, current_streak: newStreak, longest_streak: newLongest, total_days: streak.total_days + 1 };
  }

  // 3. 更新 XP 和等级
  const xpEarned = Math.min(10 + duration, 60);
  const { data: profile } = await supabase
    .from("profiles")
    .select("xp")
    .eq("id", user.id)
    .single();

  if (profile) {
    const newXp = (profile.xp || 0) + xpEarned;
    const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1;
    await supabase
      .from("profiles")
      .update({ xp: newXp, level: newLevel })
      .eq("id", user.id);
  }

  // 4. 检测并授予成就
  if (streak) {
    const achievementsToGrant: string[] = [];

    if (streak.total_days >= 1) achievementsToGrant.push("first_checkin");
    if (streak.current_streak >= 7 || streak.longest_streak >= 7)
      achievementsToGrant.push("streak_7");
    if (streak.current_streak >= 30 || streak.longest_streak >= 30)
      achievementsToGrant.push("streak_30");
    if (streak.current_streak >= 100 || streak.longest_streak >= 100)
      achievementsToGrant.push("streak_100");

    for (const type of achievementsToGrant) {
      await supabase.from("achievements").upsert(
        { user_id: user.id, type },
        { onConflict: "user_id,type" },
      );
    }
  }

  // 5. 刷新页面缓存
  revalidatePath("/dashboard");
  revalidatePath("/checkin");
  revalidatePath("/profile");

  return { success: true, xpEarned };
}
