"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { UI_TEXT } from "@/lib/constants";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/types";

const navItems = [
  { href: "/dashboard", label: UI_TEXT.nav.dashboard, icon: "📊" },
  { href: "/checkin", label: UI_TEXT.nav.checkin, icon: "✅" },
  { href: "/groups", label: UI_TEXT.nav.groups, icon: "👥" },
  { href: "/profile", label: UI_TEXT.nav.profile, icon: "👤" },
];

export function Sidebar({
  user,
  profile,
}: {
  user: User;
  profile: Profile | null;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 md:flex">
        <div className="flex items-center gap-2 border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
          <span className="text-2xl">📚</span>
          <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            学习打卡
          </span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-zinc-200 px-3 py-4 dark:border-zinc-800">
          <div className="mb-3 px-3">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {profile?.display_name ?? "用户"}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Lv.{profile?.level ?? 1} · {profile?.xp ?? 0} XP
            </p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              <span className="text-lg">🚪</span>
              {UI_TEXT.nav.logout}
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 md:hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs font-medium transition-colors ${
                isActive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
