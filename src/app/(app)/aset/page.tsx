import { listAssets } from "@/lib/queries"
import { formatRupiah, formatNumber } from "@/lib/money"
import { addAsset, deleteAsset } from "./actions"

export const dynamic = "force-dynamic"

export default async function AsetPage() {
  const items = await listAssets()
  const totalValue = items.reduce((s, a) => s + a.value, 0)
  const totalGrams = items.reduce((s, a) => s + a.weightGrams, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Aset</h1>
        <p className="text-sm text-slate-500">Catat emas/perhiasan dan aset lainnya.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Nilai Aset</p>
          <p className="text-2xl font-bold text-slate-800">{formatRupiah(totalValue)}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Berat (gram)</p>
          <p className="text-2xl font-bold text-slate-800">{formatNumber(totalGrams)} gr</p>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-slate-700">Tambah Aset</h2>
        <form action={addAsset} className="grid grid-cols-1 gap-3 md:grid-cols-5">
          <input name="name" placeholder="Nama aset" className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 md:col-span-2" />
          <input name="type" placeholder="Jenis (mis. Emas)" className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
          <input name="weightGrams" type="number" step="any" placeholder="Gram" className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
          <input name="value" type="number" step="any" placeholder="Nilai (Rp)" className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500" />
          <input name="note" placeholder="Catatan (opsional)" className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 md:col-span-4" />
          <button className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">+ Tambah</button>
        </form>
      </div>

      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-slate-500">
                <th className="py-2">Nama</th>
                <th className="py-2">Jenis</th>
                <th className="py-2 text-right">Gram</th>
                <th className="py-2 text-right">Nilai</th>
                <th className="py-2">Catatan</th>
                <th className="py-2"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id} className="border-b border-slate-100">
                  <td className="py-2 font-medium text-slate-700">{a.name}</td>
                  <td className="py-2 text-slate-600">{a.type}</td>
                  <td className="py-2 text-right text-slate-600">{formatNumber(a.weightGrams)}</td>
                  <td className="py-2 text-right text-slate-600">{formatRupiah(a.value)}</td>
                  <td className="py-2 text-slate-500">{a.note ?? "-"}</td>
                  <td className="py-2 text-right">
                    <form action={deleteAsset}>
                      <input type="hidden" name="id" value={a.id} />
                      <button className="rounded-md bg-red-50 px-2 py-1 text-xs text-red-600 hover:bg-red-100">Hapus</button>
                    </form>
                  </td>
                </tr>
              ))}
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-400">
                    Belum ada aset.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
