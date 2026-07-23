"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

function generateInviteCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function createGroup(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const inviteCode = generateInviteCode();

  const { data: group, error } = await supabase
    .from("study_groups")
    .insert({
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || null,
      invite_code: inviteCode,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) throw error;

  // Add creator as admin
  await supabase.from("group_members").insert({
    group_id: group.id,
    user_id: user.id,
    role: "admin",
  });

  // Create streak record for this group
  await supabase.from("streaks").insert({
    user_id: user.id,
    group_id: group.id,
    current_streak: 0,
    longest_streak: 0,
    total_days: 0,
  });

  revalidatePath("/groups");
  return group;
}

export async function joinGroup(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const inviteCode = (formData.get("invite_code") as string)?.toUpperCase();

  // Find group by invite code
  const { data: group } = await supabase
    .from("study_groups")
    .select("*")
    .eq("invite_code", inviteCode)
    .single();

  if (!group) throw new Error("无效的邀请码");

  // Check if already a member
  const { data: existing } = await supabase
    .from("group_members")
    .select("id")
    .eq("group_id", group.id)
    .eq("user_id", user.id)
    .single();

  if (existing) throw new Error("你已经是该小组的成员");

  // Add as member
  await supabase.from("group_members").insert({
    group_id: group.id,
    user_id: user.id,
    role: "member",
  });

  // Create streak record for this group
  await supabase.from("streaks").insert({
    user_id: user.id,
    group_id: group.id,
    current_streak: 0,
    longest_streak: 0,
    total_days: 0,
  });

  revalidatePath("/groups");
  revalidatePath(`/groups/${group.id}`);
  return group;
}
