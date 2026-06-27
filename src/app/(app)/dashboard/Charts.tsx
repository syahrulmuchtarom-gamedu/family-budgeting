"use client"

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { formatRupiah } from "@/lib/money"

const COLORS = ["#059669", "#10b981", "#34d399", "#6ee7b7", "#0d9488", "#14b8a6", "#a7f3d0"]

const lineMargin = { top: 10, right: 20, left: 0, bottom: 0 }
const axisTick = { fontSize: 12 }
const lineDot = { r: 3 }
const legendStyle = { fontSize: 12 }

function formatJuta(v: number | string): string {
  return Math.round(Number(v) / 1000000) + " Jt"
}

function tooltipFormatter(v: number | string): string {
  return formatRupiah(Number(v))
}

export function TrendChart({ data }: { data: { name: string; saved: number }[] }) {
  if (!data.length) {
    return <p className="py-12 text-center text-sm text-slate-400">Belum ada data.</p>
  }
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={lineMargin}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="name" tick={axisTick} />
        <YAxis tick={axisTick} tickFormatter={formatJuta} />
        <Tooltip formatter={tooltipFormatter} />
        <Line type="monotone" dataKey="saved" name="Ditabung" stroke="#059669" strokeWidth={2} dot={lineDot} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function CategoryChart({ data }: { data: { category: string; amount: number }[] }) {
  if (!data.length) {
    return <p className="py-12 text-center text-sm text-slate-400">Belum ada data pengeluaran.</p>
  }
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          dataKey="amount"
          nameKey="category"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
        >
          {data.map((entry, i) => (
            <Cell key={entry.category} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={tooltipFormatter} />
        <Legend wrapperStyle={legendStyle} />
      </PieChart>
    </ResponsiveContainer>
  )
}
