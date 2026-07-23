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
      {/* 标题行：年月选择 + 统计 */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={goPrevMonth}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            ‹
          </button>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-sm font-medium text-zinc-900 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            {yearRange.map((y) => (
              <option key={y} value={y}>
                {y}年
              </option>
            ))}
          </select>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-sm font-medium text-zinc-900 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            {MONTHS.map((m, i) => (
              <option key={i} value={i}>
                {m}
              </option>
            ))}
          </select>
          <button
            onClick={goNextMonth}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
          >
            ›
          </button>
          {!isCurrentMonth && (
            <button
              onClick={() => {
                setSelectedYear(currentYear);
                setSelectedMonth(currentMonth);
              }}
              className="rounded-lg bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
            >
              回到本月
            </button>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-zinc-600 dark:text-zinc-400">
            打卡 <span className="font-bold text-zinc-900 dark:text-zinc-100">{stats.totalDays}</span> 天
          </span>
          <span className="text-zinc-600 dark:text-zinc-400">
            <span className="font-bold text-zinc-900 dark:text-zinc-100">{stats.totalMinutes}</span> 分钟
          </span>
        </div>
      </div>

      {/* 热力图 */}
      <div className="overflow-x-auto">
        <div className="inline-block">
          <div className="flex">
            {/* 星期标签 */}
            <div className="mr-2 flex flex-col gap-[3px]">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="flex h-[13px] w-6 items-center text-[11px] text-zinc-400 dark:text-zinc-500"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* 网格 */}
            <div className="flex gap-[3px]">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[3px]">
                  {week.map((day, di) => {
                    if (!day) {
                      return <div key={di} className="h-[13px] w-[13px]" />;
                    }
                    const colorIdx = getColorIndex(day.count);
                    return (
                      <div
                        key={di}
                        className={`h-[13px] w-[13px] cursor-pointer rounded-[3px] transition-transform hover:scale-125 ${COLORS[colorIdx]}`}
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
      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-400 dark:text-zinc-500">
        <span>少</span>
        {COLORS.map((color, i) => (
          <div key={i} className={`h-[11px] w-[11px] rounded-[2px] ${color}`} />
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
