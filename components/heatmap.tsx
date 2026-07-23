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

// 生成指定月份的数据
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

// 生成指定年份的数据
function getYearData(allData: HeatmapDay[], year: number): HeatmapDay[] {
  const result: HeatmapDay[] = [];
  const startDate = new Date(year, 0, 1);
  const endDate = new Date(year, 11, 31);

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toLocaleDateString("en-CA");
    const found = allData.find((item) => item.date === dateStr);
    result.push(found ?? { date: dateStr, count: 0, minutes: 0 });
  }

  return result;
}

// 生成近3个月的数据
function get3MonthData(allData: HeatmapDay[]): HeatmapDay[] {
  const today = new Date();
  const result: HeatmapDay[] = [];

  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString("en-CA");
    const found = allData.find((item) => item.date === dateStr);
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

type ViewMode = "3months" | "year" | "month";

export function Heatmap({ data }: HeatmapProps) {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    day: HeatmapDay;
  } | null>(null);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const [viewMode, setViewMode] = useState<ViewMode>("3months");
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  // 可选年份范围（从数据中推断）
  const yearRange = useMemo(() => {
    const years = new Set<number>();
    years.add(currentYear);
    data.forEach((d) => {
      const y = new Date(d.date).getFullYear();
      years.add(y);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [data, currentYear]);

  // 根据视图模式过滤数据
  const filteredData = useMemo(() => {
    switch (viewMode) {
      case "3months":
        return get3MonthData(data);
      case "year":
        return getYearData(data, selectedYear);
      case "month":
        return getMonthData(data, selectedYear, selectedMonth);
    }
  }, [data, viewMode, selectedYear, selectedMonth]);

  const weeks = getWeeks(filteredData);

  // 统计信息
  const stats = useMemo(() => {
    const totalDays = filteredData.filter((d) => d.count > 0).length;
    const totalMinutes = filteredData.reduce((sum, d) => sum + d.minutes, 0);
    return { totalDays, totalMinutes };
  }, [filteredData]);

  // 月份标签
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
    <div>
      {/* 控制栏 */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        {/* 视图切换 */}
        <div className="flex gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
          <button
            onClick={() => setViewMode("3months")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              viewMode === "3months"
                ? "bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-zinc-100"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            近3月
          </button>
          <button
            onClick={() => setViewMode("year")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              viewMode === "year"
                ? "bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-zinc-100"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            年度
          </button>
          <button
            onClick={() => setViewMode("month")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              viewMode === "month"
                ? "bg-white text-zinc-900 shadow dark:bg-zinc-700 dark:text-zinc-100"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            月度
          </button>
        </div>

        {/* 年份选择 */}
        <div className="flex items-center gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 focus:border-emerald-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
          >
            {yearRange.map((y) => (
              <option key={y} value={y}>
                {y}年
              </option>
            ))}
          </select>

          {/* 月份选择（仅月度视图显示） */}
          {viewMode === "month" && (
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="rounded-lg border border-zinc-300 bg-white px-2 py-1.5 text-xs text-zinc-900 focus:border-emerald-500 focus:outline-none dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
            >
              {MONTHS.map((m, i) => (
                <option key={i} value={i}>
                  {m}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* 统计信息 */}
      <div className="mb-3 flex gap-4 text-xs text-zinc-500 dark:text-zinc-400">
        <span>打卡 {stats.totalDays} 天</span>
        <span>累计 {stats.totalMinutes} 分钟</span>
      </div>

      {/* 热力图 */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-[500px]">
          {/* 月份标签 */}
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
            {/* 星期标签 */}
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

            {/* 网格 */}
            <div className="flex gap-[2px]">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[2px]">
                  {week.map((day, di) => {
                    if (!day) {
                      return <div key={di} className="h-[11px] w-[11px]" />;
                    }
                    const colorIdx = getColorIndex(day.count);
                    return (
                      <div
                        key={di}
                        className={`h-[11px] w-[11px] cursor-pointer rounded-sm transition-transform hover:scale-150 ${COLORS[colorIdx]}`}
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
        </div>
      </div>

      {/* 图例 */}
      <div className="mt-3 flex items-center gap-1 text-[10px] text-zinc-500 dark:text-zinc-400">
        <span>少</span>
        {COLORS.map((color, i) => (
          <div key={i} className={`h-[10px] w-[10px] rounded-sm ${color}`} />
        ))}
        <span>多</span>
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
