"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function checkIn(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const duration = Number(formData.get("duration")) || 0;
  const notes = (formData.get("notes") as string) || null;
  const groupId = (formData.get("group_id") as string) || null;

  // Check if already checked in today
  const today = new Date().toLocaleDateString("en-CA");
  const { data: todayCheckIns } = await supabase
    .from("check_ins")
    .select("id")
    .eq("user_id", user.id)
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`);

  if (todayCheckIns && todayCheckIns.length > 0) {
    throw new Error("今天已打卡");
  }

  // Insert check-in
  const { error } = await supabase.from("check_ins").insert({
    user_id: user.id,
    group_id: groupId,
    duration,
    notes,
  });

  if (error) throw error;

  // Update personal streak
  await updateStreak(supabase, user.id, null);

  // Update group streak if applicable
  if (groupId) {
    await updateStreak(supabase, user.id, groupId);
  }

  // Award XP (base 10 + 1 per minute, max 60)
  const xpEarned = Math.min(10 + duration, 60);
  await supabase
    .from("profiles")
    .update({
      xp: (await supabase.from("profiles").select("xp").eq("id", user.id).single())!.data!.xp + xpEarned,
      level: Math.floor(Math.sqrt(
        ((await supabase.from("profiles").select("xp").eq("id", user.id).single())!.data!.xp + xpEarned) / 100
      )) + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  // Check achievements
  await checkAchievements(supabase, user.id);

  revalidatePath("/dashboard");
  revalidatePath("/checkin");
  if (groupId) {
    revalidatePath(`/groups/${groupId}`);
  }
}

async function updateStreak(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  groupId: string | null,
) {
  // Get current streak
  const { data: streak } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", userId)
    .is("group_id", groupId)
    .single();

  const today = new Date();
  const todayStr = today.toLocaleDateString("en-CA");

  if (!streak) {
    // Create streak record
    await supabase.from("streaks").insert({
      user_id: userId,
      group_id: groupId,
      current_streak: 1,
      longest_streak: 1,
      total_days: 1,
      last_check_in: todayStr,
    });
    return;
  }

  if (streak.last_check_in === todayStr) {
    return; // Already counted today
  }

  const lastDate = new Date(streak.last_check_in);
  const diffDays = Math.floor(
    (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  let newCurrentStreak: number;
  let newLongestStreak: number;

  if (diffDays === 1) {
    // Consecutive day
    newCurrentStreak = streak.current_streak + 1;
    newLongestStreak = Math.max(streak.longest_streak, newCurrentStreak);
  } else {
    // Streak broken
    newCurrentStreak = 1;
    newLongestStreak = streak.longest_streak;
  }

  await supabase
    .from("streaks")
    .update({
      current_streak: newCurrentStreak,
      longest_streak: newLongestStreak,
      total_days: streak.total_days + 1,
      last_check_in: todayStr,
    })
    .eq("id", streak.id);
}

async function checkAchievements(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
) {
  // Get personal streak
  const { data: streak } = await supabase
    .from("streaks")
    .select("current_streak, longest_streak, total_days")
    .eq("user_id", userId)
    .is("group_id", null)
    .single();

  if (!streak) return;

  const achievements: string[] = [];

  if (streak.total_days >= 1) achievements.push("first_checkin");
  if (streak.current_streak >= 7 || streak.longest_streak >= 7)
    achievements.push("streak_7");
  if (streak.current_streak >= 30 || streak.longest_streak >= 30)
    achievements.push("streak_30");
  if (streak.current_streak >= 100 || streak.longest_streak >= 100)
    achievements.push("streak_100");

  for (const type of achievements) {
    await supabase
      .from("achievements")
      .upsert({ user_id: userId, type }, { onConflict: "user_id,type" });
  }
}
