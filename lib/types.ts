export interface Profile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  xp: number;
  level: number;
  created_at: string;
  updated_at: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string | null;
  invite_code: string;
  created_by: string;
  created_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: "admin" | "member";
  joined_at: string;
}

export interface CheckIn {
  id: string;
  user_id: string;
  group_id: string | null;
  duration: number;
  notes: string | null;
  created_at: string;
}

export interface CheckInWithProfile extends CheckIn {
  profiles: Pick<Profile, "display_name" | "avatar_url">;
}

export interface Streak {
  id: string;
  user_id: string;
  group_id: string | null;
  current_streak: number;
  longest_streak: number;
  total_days: number;
  last_check_in: string | null;
}

export interface Achievement {
  id: string;
  user_id: string;
  type: string;
  earned_at: string;
}

export interface GroupWithMembers extends StudyGroup {
  group_members: { count: number }[];
}
