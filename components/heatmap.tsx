"use client";

import { useState } from "react";

interface HeatmapDay {
  date: string;
  count: number;
  minutes: number;
}

interface HeatmapProps {
  data: HeatmapDay[];
}

const COLORS = [
  "bg-zinc-100 dark:bg-zinc-800",
  "bg-emerald-200 dark:bg-emerald-900",
  "bg-emerald-400 dark:bg-emerald-700",
  "bg-emerald-500 dark:bg-emerald-600",
  "bg-emerald-700 dark:bg-emerald-500",
];

const MONTHS = [
  "1月","2月","3月","4月","5月","6月",
  "7月","8月","9月","10月","11月","12月",
];

const WEEKDAYS = ["一", "二", "三", "四", "五", "六", "日"];

function getColorIndex(count: number): number {
  if (count === 0) return 0;
  if (count <= 1) return 1;
  if (count <= 2) return 2;
  if (count <= 3) return 3;
  return 4;
}

function getWeeks(data: HeatmapDay[]): (HeatmapDay | null)[][] {
  if (data.length === 0) return [];

  const weeks: (HeatmapDay | null)[][] = [];
  let currentWeek: (HeatmapDay | null)[] = [];

  // Pad the start with nulls
  const firstDate = new Date(data[0].date);
  let dayOfWeek = firstDate.getDay(); // 0=Sun, 1=Mon, ...
  // Convert to Mon=0 format
  dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  for (let i = 0; i < dayOfWeek; i++) {
    currentWeek.push(null);
  }

  for (const day of data) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Pad the end
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return weeks;
}

export function Heatmap({ data }: HeatmapProps) {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    day: HeatmapDay;
  } | null>(null);

  const weeks = getWeeks(data);

  // Get month labels
  const monthPositions: { month: string; weekIndex: number }[] = [];
  let lastMonth = -1;
  weeks.forEach((week, i) => {
    const firstDay = week.find((d) => d !== null);
    if (firstDay) {
      const month = new Date(firstDay.date).getMonth();
      if (month !== lastMonth) {
        monthPositions.push({ month: MONTHS[month], weekIndex: i });
        lastMonth = month;
      }
    }
  });

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-[700px]">
        {/* Month labels */}
        <div className="mb-1 flex pl-10">
          {monthPositions.map((mp, i) => (
            <div
              key={i}
              className="text-xs text-zinc-500 dark:text-zinc-400"
              style={{
                position: "relative",
                left: `${mp.weekIndex * 14}px`,
                width: 0,
              }}
            >
              {mp.month}
            </div>
          ))}
        </div>

        <div className="flex">
          {/* Weekday labels */}
          <div className="mr-1 flex flex-col gap-[2px]">
            {WEEKDAYS.map((day) => (
              <div
                key={day}
                className="flex h-[11px] w-8 items-center text-[10px] text-zinc-500 dark:text-zinc-400"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex gap-[2px]">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[2px]">
                {week.map((day, di) => {
                  if (!day) {
                    return (
                      <div
                        key={di}
                        className="h-[11px] w-[11px]"
                      />
                    );
                  }
                  const colorIdx = getColorIndex(day.count);
                  return (
                    <div
                      key={di}
                      className={`h-[11px] w-[11px] cursor-pointer rounded-sm transition-transform hover:scale-150 ${COLORS[colorIdx]}`}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setTooltip({
                          x: rect.left + rect.width / 2,
                          y: rect.top - 8,
                          day,
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 rounded-lg bg-zinc-900 px-3 py-2 text-xs text-white shadow-lg dark:bg-zinc-100 dark:text-zinc-900"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <p className="font-medium">{tooltip.day.date}</p>
          <p>
            {tooltip.day.count > 0
              ? `${tooltip.day.count} 次打卡 · ${tooltip.day.minutes} 分钟`
              : "未打卡"}
          </p>
        </div>
      )}
    </div>
  );
}
