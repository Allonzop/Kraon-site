import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { motion, animate, useReducedMotion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  LayoutDashboard,
  Users,
  Share2,
  Wallet,
  FileBarChart,
  Settings,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeft,
  Sparkles,
  Search,
  Bell,
} from "lucide-react";
import {
  getDashboardData,
  formatStat,
  RANGE_OPTIONS,
  SEGMENT_OPTIONS,
  type RangeKey,
  type Segment,
  type StatFormat,
} from "@/lib/dataviz-data";

const BLUE = "#3b82f6";
const VIOLET = "#8b5cf6";
const CYAN = "#22d3ee";

const METRICS = [
  { key: "revenue", label: "Revenu", color: BLUE, format: "currency" as StatFormat },
  { key: "sessions", label: "Sessions", color: VIOLET, format: "number" as StatFormat },
  { key: "conversions", label: "Conversions", color: CYAN, format: "number" as StatFormat },
] as const;

type MetricKey = (typeof METRICS)[number]["key"];

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function AnimatedNumber({ value, format }: { value: number; format: StatFormat }) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      prev.current = value;
      return;
    }
    const controls = animate(prev.current, value, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, reduce]);

  return <>{formatStat(display, format)}</>;
}

function DeltaChip({ delta }: { delta: number }) {
  const up = delta >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
        up ? "bg-emerald-500/15 text-emerald-400" : "bg-rose-500/15 text-rose-400"
      }`}
    >
      {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {Math.abs(delta * 100).toFixed(1).replace(".", ",")} %
    </span>
  );
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const chartData = data.map((v, i) => ({ i, v }));
  const id = `spark-${color.replace("#", "")}`;
  return (
    <ResponsiveContainer width="100%" height={44}>
      <AreaChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.4} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${id})`}
          isAnimationActive={false}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

interface TooltipProps {
  active?: boolean;
  payload?: { value: number; name: string; color?: string; payload?: Record<string, unknown> }[];
  label?: string;
  format?: StatFormat;
}

function GlassTooltip({ active, payload, label, format = "number" }: TooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#161616]/95 px-3 py-2 shadow-2xl backdrop-blur-md">
      {label && <div className="mb-1 text-xs text-muted-foreground">{label}</div>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-sm font-medium text-foreground">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color ?? BLUE }} />
          {formatStat(p.value, format)}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                             */
/* ------------------------------------------------------------------ */

const NAV = [
  { icon: LayoutDashboard, label: "Vue d'ensemble", active: true },
  { icon: Users, label: "Audience" },
  { icon: Share2, label: "Acquisition" },
  { icon: Wallet, label: "Revenus" },
  { icon: FileBarChart, label: "Rapports" },
  { icon: Settings, label: "Paramètres" },
];

function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-white/10 bg-[#0d0d0d]/80 p-5 lg:flex">
      <div className="mb-8 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg">
          <LayoutDashboard className="h-5 w-5 text-white" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-bold">DataViz Pro</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Analytics</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                item.active
                  ? "bg-primary/15 font-medium text-primary"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
              {item.label}
            </div>
          );
        })}
      </nav>

      <Link
        href="/#work"
        className="mt-4 flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2.5 text-xs text-muted-foreground transition-colors hover:border-white/20 hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour au portfolio KRAON
      </Link>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Segmented control                                                   */
/* ------------------------------------------------------------------ */

function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { key: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex rounded-lg border border-white/10 bg-white/5 p-0.5">
      {options.map((opt) => (
        <button
          key={opt.key}
          onClick={() => onChange(opt.key)}
          className={`relative rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            value === opt.key ? "text-white" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {value === opt.key && (
            <motion.span
              layoutId={`seg-${options[0].key}`}
              className="absolute inset-0 rounded-md bg-primary shadow"
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
            />
          )}
          <span className="relative z-10">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main page                                                           */
/* ------------------------------------------------------------------ */

export default function DataVizPro() {
  const [range, setRange] = useState<RangeKey>("30d");
  const [segment, setSegment] = useState<Segment>("all");
  const [metric, setMetric] = useState<MetricKey>("revenue");

  const data = useMemo(() => getDashboardData(range, segment), [range, segment]);
  const activeMetric = METRICS.find((m) => m.key === metric)!;

  useEffect(() => {
    const prev = document.title;
    document.title = "DataViz Pro — Analytics Dashboard";
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-foreground">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-white/10 bg-[#0a0a0a]/85 px-4 py-3 backdrop-blur-md sm:px-6">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-lg font-bold sm:text-xl">Vue d'ensemble</h1>
              <span className="hidden items-center gap-1 rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent sm:inline-flex">
                <Sparkles className="h-3 w-3" /> Démo
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{data.rangeLabel} · mise à jour en temps réel</p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-muted-foreground md:flex">
              <Search className="h-3.5 w-3.5" />
              Rechercher…
            </div>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground transition-colors hover:text-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-bold text-white">
              KR
            </div>
          </div>
        </header>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 border-b border-white/10 px-4 py-3 sm:px-6">
          <Segmented options={RANGE_OPTIONS} value={range} onChange={setRange} />
          <div className="hidden h-5 w-px bg-white/10 sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Segment</span>
            <Segmented options={SEGMENT_OPTIONS} value={segment} onChange={setSegment} />
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            En direct
          </div>
        </div>

        {/* Body */}
        <main className="flex-1 space-y-5 p-4 sm:p-6">
          {/* KPI row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {data.kpis.map((kpi, i) => (
              <motion.div
                key={kpi.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="glass rounded-2xl p-5"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{kpi.label}</span>
                  <DeltaChip delta={kpi.delta} />
                </div>
                <div className="mb-3 text-2xl font-bold tracking-tight sm:text-[26px]">
                  <AnimatedNumber value={kpi.value} format={kpi.format} />
                </div>
                <Sparkline data={kpi.spark} color={i % 2 === 0 ? BLUE : VIOLET} />
              </motion.div>
            ))}
          </div>

          {/* Main chart + donut */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            {/* Trend area chart */}
            <div className="glass rounded-2xl p-5 xl:col-span-2">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold">Évolution</h2>
                  <p className="text-xs text-muted-foreground">Performance sur la période</p>
                </div>
                <div className="inline-flex rounded-lg border border-white/10 bg-white/5 p-0.5">
                  {METRICS.map((m) => (
                    <button
                      key={m.key}
                      onClick={() => setMetric(m.key)}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                        metric === m.key ? "text-white" : "text-muted-foreground hover:text-foreground"
                      }`}
                      style={metric === m.key ? { background: m.color } : undefined}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={data.series} margin={{ top: 6, right: 8, bottom: 0, left: -12 }}>
                  <defs>
                    <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={activeMetric.color} stopOpacity={0.45} />
                      <stop offset="100%" stopColor={activeMetric.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    minTickGap={24}
                  />
                  <YAxis
                    tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={52}
                    tickFormatter={(v: number) => (v >= 1000 ? `${Math.round(v / 1000)}k` : `${v}`)}
                  />
                  <Tooltip
                    content={<GlassTooltip format={activeMetric.format} />}
                    cursor={{ stroke: "rgba(255,255,255,0.15)", strokeWidth: 1 }}
                  />
                  <Area
                    type="monotone"
                    dataKey={metric}
                    stroke={activeMetric.color}
                    strokeWidth={2.5}
                    fill="url(#areaFill)"
                    animationDuration={700}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Device donut */}
            <div className="glass rounded-2xl p-5">
              <h2 className="mb-1 font-semibold">Répartition par appareil</h2>
              <p className="mb-2 text-xs text-muted-foreground">Part des sessions</p>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={data.sources}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={88}
                    paddingAngle={3}
                    stroke="none"
                    animationDuration={700}
                  >
                    {data.sources.map((s) => (
                      <Cell key={s.name} fill={s.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<GlassTooltip format="percent" />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {data.sources.map((s) => (
                  <div key={s.name} className="flex items-center gap-2 text-xs">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                    <span className="text-muted-foreground">{s.name}</span>
                    <span className="ml-auto font-medium">{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Channels bar + campaigns table */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
            {/* Acquisition bar */}
            <div className="glass rounded-2xl p-5">
              <h2 className="mb-1 font-semibold">Acquisition par canal</h2>
              <p className="mb-3 text-xs text-muted-foreground">Sessions par source</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data.channels} layout="vertical" margin={{ left: 6, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={92}
                  />
                  <Tooltip content={<GlassTooltip format="number" />} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} animationDuration={700} barSize={16}>
                    {data.channels.map((_, i) => (
                      <Cell key={i} fill={i % 2 === 0 ? BLUE : VIOLET} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Campaigns table */}
            <div className="glass overflow-hidden rounded-2xl xl:col-span-2">
              <div className="flex items-center justify-between p-5 pb-3">
                <div>
                  <h2 className="font-semibold">Top campagnes</h2>
                  <p className="text-xs text-muted-foreground">Classées par revenu généré</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] text-sm">
                  <thead>
                    <tr className="border-y border-white/10 text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="px-5 py-2.5 font-medium">Campagne</th>
                      <th className="px-3 py-2.5 font-medium">Visiteurs</th>
                      <th className="px-3 py-2.5 font-medium">Conv.</th>
                      <th className="px-3 py-2.5 font-medium">Revenu</th>
                      <th className="px-5 py-2.5 text-right font-medium">Évol.</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.campaigns.map((c) => (
                      <tr key={c.name} className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.03]">
                        <td className="px-5 py-3">
                          <div className="font-medium">{c.name}</div>
                          <div className="text-xs text-muted-foreground">{c.channel}</div>
                        </td>
                        <td className="px-3 py-3 tabular-nums text-muted-foreground">
                          {c.visitors.toLocaleString("fr-FR")}
                        </td>
                        <td className="px-3 py-3 tabular-nums text-muted-foreground">
                          {c.conversion.toFixed(1).replace(".", ",")} %
                        </td>
                        <td className="px-3 py-3 font-semibold tabular-nums">
                          {formatStat(c.revenue, "currency")}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <DeltaChip delta={c.delta} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <p className="pt-2 text-center text-xs text-muted-foreground">
            Démo produit conçue par KRAON — données simulées à des fins de démonstration.{" "}
            <Link href="/project/2" className="text-primary hover:underline">
              Voir l'étude de cas
            </Link>
          </p>
        </main>
      </div>
    </div>
  );
}
