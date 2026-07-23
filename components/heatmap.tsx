"use client";

import { useState, useMemo } from "react";

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
  "bg-emerald-100 dark:bg-emerald-900/40",
  "bg-emerald-300 dark:bg-emerald-700",
  "bg-emerald-500 dark:bg-emerald-600",
  "bg-emerald-700 dark:bg-emerald-500",
];

const MONTHS = [
  "1月","2月","3月","4月","5月","6月",
  "7月","8月","9月","10月","11月","12月",
];

// 星期标签现在在热力图内部使用

function getColorIndex(count: number): number {
  if (count === 0) return 0;
  if (count <= 1) return 1;
  if (count <= 2) return 2;
  if (count <= 3) return 3;
  return 4;
}

function getMonthData(
  allData: HeatmapDay[],
  year: number,
  month: number,
): HeatmapDay[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const result: HeatmapDay[] = [];

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const found = allData.find((d) => d.date === dateStr);
    result.push(found ?? { date: dateStr, count: 0, minutes: 0 });
  }

  return result;
}

function getWeeks(data: HeatmapDay[]): (HeatmapDay | null)[][] {
  if (data.length === 0) return [];

  const weeks: (HeatmapDay | null)[][] = [];
  let currentWeek: (HeatmapDay | null)[] = [];

  const firstDate = new Date(data[0].date);
  let dayOfWeek = firstDate.getDay();
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

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // 可选年份
  const yearRange = useMemo(() => {
    const years = new Set<number>();
    years.add(currentYear);
    data.forEach((d) => {
      const y = new Date(d.date).getFullYear();
      years.add(y);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [data, currentYear]);

  // 月度数据
  const monthData = useMemo(
    () => getMonthData(data, selectedYear, selectedMonth),
    [data, selectedYear, selectedMonth],
  );

  const weeks = getWeeks(monthData);

  // 月度统计
  const stats = useMemo(() => {
    const totalDays = monthData.filter((d) => d.count > 0).length;
    const totalMinutes = monthData.reduce((sum, d) => sum + d.minutes, 0);
    return { totalDays, totalMinutes };
  }, [monthData]);

  // 上一月 / 下一月
  const goPrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const goNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  const isCurrentMonth =
    selectedYear === currentYear && selectedMonth === currentMonth;

  return (
    <div>
      {/* 标题行 */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={goPrevMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <span className="min-w-[100px] text-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            {selectedYear}年{MONTHS[selectedMonth]}
          </span>
          <button
            onClick={goNextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
          {!isCurrentMonth && (
            <button
              onClick={() => {
                setSelectedYear(currentYear);
                setSelectedMonth(currentMonth);
              }}
              className="ml-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600 transition-colors hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/30"
            >
              本月
            </button>
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-zinc-400 dark:text-zinc-500">
          <span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{stats.totalDays}</span> 天
          </span>
          <span>
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">{stats.totalMinutes}</span> 分钟
          </span>
        </div>
      </div>

      {/* 热力图 */}
      <div className="w-full">
        {/* 星期标签在顶部 */}
        <div className="mb-1 flex gap-[2px] pl-6">
          {["一", "二", "三", "四", "五", "六", "日"].map((day) => (
            <div
              key={day}
              className="flex flex-1 justify-center text-[10px] text-zinc-300 dark:text-zinc-600"
            >
              {day}
            </div>
          ))}
        </div>

        {/* 网格 - 按行排列 */}
        <div className="flex flex-col gap-[2px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex gap-[2px]">
              {/* 星期标签在左侧 */}
              {wi === 0 &&
                week.map((_, di) => (
                  <div key={di} className="w-6" />
                ))}
              {week.map((day, di) => {
                if (!day) {
                  return <div key={di} className="flex-1 aspect-square" />;
                }
                const colorIdx = getColorIndex(day.count);
                return (
                  <div
                    key={di}
                    className={`flex-1 aspect-square cursor-pointer rounded-sm transition-all hover:scale-110 hover:ring-1 hover:ring-emerald-400/50 ${COLORS[colorIdx]}`}
                    onMouseEnter={(e) => {
                      const rect =
                        e.currentTarget.getBoundingClientRect();
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

      {/* 图例 */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 dark:text-zinc-500">
          <span>少</span>
          {COLORS.map((color, i) => (
            <div key={i} className={`h-[10px] w-[10px] rounded-[2px] ${color}`} />
          ))}
          <span>多</span>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 rounded-xl bg-zinc-900 px-3 py-2 text-xs text-white shadow-xl dark:bg-zinc-100 dark:text-zinc-900"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translate(-50%, -100%)",
          }}
        >
          <p className="font-medium">{tooltip.day.date}</p>
          <p className="text-zinc-300 dark:text-zinc-500">
            {tooltip.day.count > 0
              ? `${tooltip.day.count} 次打卡 · ${tooltip.day.minutes} 分钟`
              : "未打卡"}
          </p>
        </div>
      )}
    </div>
  );
}
