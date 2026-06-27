import { getRecap, getExpenseByCategory } from "@/lib/queries"
import { formatRupiah } from "@/lib/money"
import { TrendChart, CategoryChart } from "./Charts"

export const dynamic = "force-dynamic"

function StatCard({ title, value, icon, accent }: { title: string; value: string; icon: string; accent: string }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
        <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${accent}`}>{icon}</span>
        {title}
      </div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  )
}

export default async function DashboardPage() {
  const recap = await getRecap()
  const byCat = await getExpenseByCategory()

  const totalIncome = recap.reduce((s, r) => s + r.income, 0)
  const totalSpending = recap.reduce((s, r) => s + r.spending, 0)
  const totalSaved = recap.reduce((s, r) => s + r.saved, 0)
  const trend = [...recap].reverse().map((r) => ({ name: r.period.label, saved: r.saved }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500">Ringkasan keuangan keluarga dari seluruh periode.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Total Pemasukan" value={formatRupiah(totalIncome)} icon="💵" accent="bg-emerald-100" />
        <StatCard title="Total Pengeluaran" value={formatRupiah(totalSpending)} icon="💸" accent="bg-amber-100" />
        <StatCard title="Total Ditabung" value={formatRupiah(totalSaved)} icon="🏦" accent="bg-teal-100" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-700">Tren Tabungan Bulanan</h2>
          <TrendChart data={trend} />
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-700">Kategori Pengeluaran</h2>
          <CategoryChart data={byCat} />
        </div>
      </div>
    </div>
  )
}
