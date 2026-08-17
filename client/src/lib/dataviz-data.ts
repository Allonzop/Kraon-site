/**
 * Deterministic mock-data engine for the DataViz Pro showcase dashboard.
 *
 * Everything is generated from a seeded PRNG so the numbers are realistic and
 * stable for a given (range, segment) pair — switching filters produces a
 * different-but-consistent dataset, and re-renders never jitter.
 */

export type RangeKey = "7d" | "30d" | "90d" | "12m";
export type Segment = "all" | "new" | "returning";

export interface SeriesPoint {
  label: string;
  revenue: number;
  sessions: number;
  conversions: number;
}

export type StatFormat = "currency" | "number" | "percent" | "duration";

export interface Kpi {
  key: string;
  label: string;
  value: number;
  format: StatFormat;
  /** Period-over-period change, as a ratio (0.128 = +12.8%). */
  delta: number;
  /** Small sparkline series. */
  spark: number[];
}

export interface ChannelDatum {
  name: string;
  value: number;
}

export interface SourceDatum {
  name: string;
  value: number;
  color: string;
}

export interface CampaignRow {
  name: string;
  channel: string;
  visitors: number;
  conversion: number;
  revenue: number;
  delta: number;
}

export interface DashboardData {
  series: SeriesPoint[];
  kpis: Kpi[];
  channels: ChannelDatum[];
  sources: SourceDatum[];
  campaigns: CampaignRow[];
  rangeLabel: string;
}

/** mulberry32 — tiny, fast, deterministic PRNG. */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const RANGE_META: Record<
  RangeKey,
  { points: number; unit: "day" | "month"; label: string; seed: number }
> = {
  "7d": { points: 7, unit: "day", label: "7 derniers jours", seed: 71 },
  "30d": { points: 30, unit: "day", label: "30 derniers jours", seed: 307 },
  "90d": { points: 90, unit: "day", label: "90 derniers jours", seed: 907 },
  "12m": { points: 12, unit: "month", label: "12 derniers mois", seed: 1200 },
};

const SEGMENT_META: Record<Segment, { seed: number; scale: number; convBoost: number }> = {
  all: { seed: 1, scale: 1, convBoost: 1 },
  new: { seed: 2, scale: 0.46, convBoost: 0.82 },
  returning: { seed: 3, scale: 0.58, convBoost: 1.28 },
};

const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

function buildLabels(range: RangeKey): string[] {
  const { points, unit } = RANGE_META[range];
  const now = new Date();
  const labels: string[] = [];
  for (let i = points - 1; i >= 0; i--) {
    const d = new Date(now);
    if (unit === "month") {
      d.setMonth(now.getMonth() - i);
      labels.push(MONTHS[d.getMonth()]);
    } else {
      d.setDate(now.getDate() - i);
      labels.push(`${d.getDate()}/${d.getMonth() + 1}`);
    }
  }
  return labels;
}

function round(n: number, step = 1) {
  return Math.round(n / step) * step;
}

/** Compute a dashboard dataset for the given filters. */
export function getDashboardData(range: RangeKey, segment: Segment): DashboardData {
  const meta = RANGE_META[range];
  const seg = SEGMENT_META[segment];
  const rand = mulberry32(meta.seed * 7919 + seg.seed * 104729);
  const labels = buildLabels(range);
  const n = labels.length;

  // Base daily magnitudes; months aggregate ~30 days.
  const dayFactor = meta.unit === "month" ? 28 : 1;
  const baseSessions = 1850 * dayFactor * seg.scale;
  const baseConvRate = 0.041 * seg.convBoost;
  const baseAov = 68 + rand() * 22; // average order value

  // Gentle upward trend across the window + weekly seasonality + noise.
  const growth = 0.28 + rand() * 0.22; // total growth over the window
  const series: SeriesPoint[] = labels.map((label, i) => {
    const t = n === 1 ? 1 : i / (n - 1);
    const trend = 1 + growth * t;
    const weekly = meta.unit === "day" ? 1 + 0.16 * Math.sin((i / 7) * Math.PI * 2) : 1;
    const noise = 0.88 + rand() * 0.24;
    const sessions = baseSessions * trend * weekly * noise;
    const convRate = baseConvRate * (0.92 + rand() * 0.16);
    const conversions = sessions * convRate;
    const revenue = conversions * baseAov * (0.95 + rand() * 0.1);
    return {
      label,
      sessions: Math.round(sessions),
      conversions: Math.round(conversions),
      revenue: Math.round(revenue),
    };
  });

  const sum = (k: keyof Omit<SeriesPoint, "label">) => series.reduce((a, p) => a + (p[k] as number), 0);
  const totalRevenue = sum("revenue");
  const totalSessions = sum("sessions");
  const totalConversions = sum("conversions");
  const convRate = totalConversions / Math.max(1, totalSessions);
  const aov = totalRevenue / Math.max(1, totalConversions);

  // Period-over-period deltas: split the window in half and compare.
  const half = Math.floor(n / 2) || 1;
  const firstHalf = series.slice(0, half);
  const secondHalf = series.slice(half);
  const halfSum = (arr: SeriesPoint[], k: keyof Omit<SeriesPoint, "label">) =>
    arr.reduce((a, p) => a + (p[k] as number), 0) / Math.max(1, arr.length);
  const delta = (k: keyof Omit<SeriesPoint, "label">) => {
    const a = halfSum(firstHalf, k);
    const b = halfSum(secondHalf, k);
    return a === 0 ? 0 : (b - a) / a;
  };

  const revDelta = delta("revenue");
  const spark = (k: keyof Omit<SeriesPoint, "label">, count = 12) => {
    const src = series.slice(-count);
    return src.map((p) => p[k] as number);
  };

  const kpis: Kpi[] = [
    {
      key: "revenue",
      label: "Revenu total",
      value: totalRevenue,
      format: "currency",
      delta: revDelta,
      spark: spark("revenue"),
    },
    {
      key: "sessions",
      label: "Sessions",
      value: totalSessions,
      format: "number",
      delta: delta("sessions"),
      spark: spark("sessions"),
    },
    {
      key: "conversion",
      label: "Taux de conversion",
      value: convRate * 100,
      format: "percent",
      delta: delta("conversions") - delta("sessions"),
      spark: series.slice(-12).map((p) => (p.conversions / Math.max(1, p.sessions)) * 100),
    },
    {
      key: "aov",
      label: "Panier moyen",
      value: aov,
      format: "currency",
      delta: 0.03 + rand() * 0.05,
      spark: spark("revenue").map((v, i) => v / Math.max(1, spark("conversions")[i] || 1)),
    },
  ];

  // Acquisition channels (share of sessions, scaled to totals).
  const channelWeights = [
    { name: "Organique", w: 0.34 },
    { name: "Payant", w: 0.24 },
    { name: "Direct", w: 0.16 },
    { name: "Réseaux sociaux", w: 0.15 },
    { name: "Email", w: 0.07 },
    { name: "Référence", w: 0.04 },
  ];
  const channels: ChannelDatum[] = channelWeights.map((c) => ({
    name: c.name,
    value: round(totalSessions * c.w * (0.9 + rand() * 0.2), 10),
  }));

  // Device / source split for the donut.
  const sourcePalette = ["#3b82f6", "#8b5cf6", "#22d3ee", "#f59e0b"];
  const sourceRaw = [
    { name: "Desktop", w: 0.52 },
    { name: "Mobile", w: 0.38 },
    { name: "Tablette", w: 0.07 },
    { name: "Autre", w: 0.03 },
  ];
  const sources: SourceDatum[] = sourceRaw.map((s, i) => ({
    name: s.name,
    value: Math.round(s.w * 100 * (0.95 + rand() * 0.1)),
    color: sourcePalette[i],
  }));

  // Top campaigns table.
  const campaignNames = [
    { name: "Retargeting Q3 — Prospection", channel: "Payant" },
    { name: "SEO — Guides produit", channel: "Organique" },
    { name: "Newsletter — Onboarding", channel: "Email" },
    { name: "Social — Lancement v2", channel: "Réseaux sociaux" },
    { name: "Brand — Notoriété", channel: "Direct" },
  ];
  const campaigns: CampaignRow[] = campaignNames.map((c) => {
    const visitors = round(totalSessions * (0.04 + rand() * 0.12), 10);
    const conversion = baseConvRate * (0.7 + rand() * 1.1) * 100;
    const revenue = round(visitors * (conversion / 100) * aov, 10);
    return {
      name: c.name,
      channel: c.channel,
      visitors,
      conversion,
      revenue,
      delta: -0.12 + rand() * 0.44,
    };
  });
  campaigns.sort((a, b) => b.revenue - a.revenue);

  return { series, kpis, channels, sources, campaigns, rangeLabel: meta.label };
}

/** Format a numeric stat for display (French conventions). */
export function formatStat(value: number, format: StatFormat): string {
  switch (format) {
    case "currency":
      return `${Math.round(value).toLocaleString("fr-FR")} €`;
    case "number":
      return Math.round(value).toLocaleString("fr-FR");
    case "percent":
      return `${value.toFixed(1).replace(".", ",")} %`;
    case "duration": {
      const m = Math.floor(value / 60);
      const s = Math.round(value % 60);
      return `${m}m ${s.toString().padStart(2, "0")}s`;
    }
  }
}

export const RANGE_OPTIONS: { key: RangeKey; label: string }[] = [
  { key: "7d", label: "7 j" },
  { key: "30d", label: "30 j" },
  { key: "90d", label: "90 j" },
  { key: "12m", label: "12 mois" },
];

export const SEGMENT_OPTIONS: { key: Segment; label: string }[] = [
  { key: "all", label: "Tous" },
  { key: "new", label: "Nouveaux" },
  { key: "returning", label: "Récurrents" },
];
