"use client";

import { useActionState, useState } from "react";
import { checkIn } from "@/app/actions/checkin";
import { UI_TEXT } from "@/lib/constants";
import type { StudyGroup } from "@/lib/types";

export function CheckInForm({ groups }: { groups: StudyGroup[] }) {
  const [duration, setDuration] = useState(30);
  const [notes, setNotes] = useState("");
  const [groupId, setGroupId] = useState("");
  const [success, setSuccess] = useState(false);

  const [state, formAction, pending] = useActionState(
    async (_prev: string | null, formData: FormData) => {
      try {
        await checkIn(formData);
        setSuccess(true);
        return null;
      } catch (e) {
        return e instanceof Error ? e.message : "打卡失败";
      }
    },
    null,
  );

  if (success) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 text-center dark:border-emerald-800 dark:bg-emerald-900/20">
        <div className="mb-3 text-5xl">🎉</div>
        <h2 className="mb-2 text-xl font-bold text-emerald-700 dark:text-emerald-400">
          {UI_TEXT.checkin.success}
        </h2>
        <p className="text-sm text-emerald-600 dark:text-emerald-500">
          学习了 {duration} 分钟，获得 {Math.min(10 + duration, 60)} XP
        </p>
        <button
          onClick={() => {
            setSuccess(false);
            setNotes("");
          }}
          className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
          继续打卡
        </button>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      {state && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {state}
        </div>
      )}

      {/* Duration */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {UI_TEXT.checkin.duration}
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="5"
            max="180"
            step="5"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="flex-1 accent-emerald-600"
          />
          <span className="w-16 text-center text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {duration} 分
          </span>
        </div>
        <div className="mt-2 flex gap-2">
          {[15, 30, 60, 90, 120].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setDuration(m)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                duration === m
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
              }`}
            >
              {m}分
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {UI_TEXT.checkin.notes}
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          placeholder="今天学了什么？"
        />
      </div>

      {/* Group selector */}
      {groups.length > 0 && (
        <div>
          <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {UI_TEXT.checkin.group}
          </label>
          <select
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="">{UI_TEXT.checkin.noGroup}</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Hidden fields */}
      <input type="hidden" name="duration" value={duration} />
      <input type="hidden" name="notes" value={notes} />
      <input type="hidden" name="group_id" value={groupId} />

      {/* Submit */}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-emerald-600 px-6 py-4 text-lg font-bold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-600"
      >
        {pending ? UI_TEXT.common.loading : `✅ ${UI_TEXT.checkin.button}`}
      </button>
    </form>
  );
}
