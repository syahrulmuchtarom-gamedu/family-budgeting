import { getRecap } from "@/lib/queries"
import { formatRupiah } from "@/lib/money"

export const dynamic = "force-dynamic"

export default async function RekapPage() {
  const recap = await getRecap()

  // Kelompokkan per tahun
  const byYear = new Map<number, typeof recap>()
  for (const r of recap) {
    const arr = byYear.get(r.period.year) ?? []
    arr.push(r)
    byYear.set(r.period.year, arr)
  }
  const years = [...byYear.keys()].sort((a, b) => b - a)

  const grandSaved = recap.reduce((s, r) => s + r.saved, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Rekap</h1>
        <p className="text-sm text-slate-500">Ringkasan pemasukan, pengeluaran, dan tabungan per bulan.</p>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm text-slate-500">Total tabungan keseluruhan</span>
          <span className="text-xl font-bold text-emerald-600">{formatRupiah(grandSaved)}</span>
        </div>
      </div>

      {years.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center text-slate-500 shadow-sm">Belum ada data.</div>
      ) : (
        years.map((year) => {
          const rows = byYear.get(year)!
          const yearSaved = rows.reduce((s, r) => s + r.saved, 0)
          return (
            <div key={year} className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">{year}</h2>
                <span className="text-sm font-medium text-emerald-600">Tabungan: {formatRupiah(yearSaved)}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-slate-500">
                      <th className="py-2">Bulan</th>
                      <th className="py-2 text-right">Pemasukan</th>
                      <th className="py-2 text-right">Pengeluaran</th>
                      <th className="py-2 text-right">Ditabung</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.period.id} className="border-b border-slate-100">
                        <td className="py-2 text-slate-700">{r.period.label}</td>
                        <td className="py-2 text-right text-slate-700">{formatRupiah(r.income)}</td>
                        <td className="py-2 text-right text-slate-700">{formatRupiah(r.spending)}</td>
                        <td className={r.saved >= 0 ? "py-2 text-right font-semibold text-emerald-600" : "py-2 text-right font-semibold text-red-600"}>
                          {formatRupiah(r.saved)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
