interface HeatmapDay {
  date: string;
  count: number;
  minutes: number;
}

interface CheckInInput {
  created_at: string;
  duration: number;
}

export function generateHeatmapData(checkIns: CheckInInput[]): HeatmapDay[] {
  // Group check-ins by date (using local timezone)
  const grouped = new Map<string, { count: number; minutes: number }>();

  for (const ci of checkIns) {
    const date = new Date(ci.created_at).toLocaleDateString("en-CA"); // YYYY-MM-DD
    const existing = grouped.get(date) ?? { count: 0, minutes: 0 };
    grouped.set(date, {
      count: existing.count + 1,
      minutes: existing.minutes + ci.duration,
    });
  }

  // Generate 365 days of data
  const today = new Date();
  const days: HeatmapDay[] = [];

  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString("en-CA");
    const data = grouped.get(dateStr) ?? { count: 0, minutes: 0 };
    days.push({
      date: dateStr,
      count: data.count,
      minutes: data.minutes,
    });
  }

  return days;
}
