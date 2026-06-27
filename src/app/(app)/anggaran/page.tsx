import { listPeriods, getPeriodBudgets, type UserBudget } from "@/lib/queries"
import { formatRupiah } from "@/lib/money"
import { MONTHS } from "@/lib/calc"
import {
  createPeriod,
  saveIncome,
  addContribution,
  updateContribution,
  deleteContribution,
  addExpense,
  deleteExpense,
  deletePeriod,
} from "./actions"

export const dynamic = "force-dynamic"

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-2 text-sm">
      <span className="text-slate-600">{label}</span>
      <span className="font-medium text-slate-800">{value}</span>
    </div>
  )
}

function BudgetColumn({ periodId, budget }: { periodId: string; budget: UserBudget }) {
  const userId = budget.user.id
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-bold uppercase tracking-wide text-slate-800">{budget.user.name}</h3>

      {/* Rezeki */}
      <form action={saveIncome} className="mb-4">
        <input type="hidden" name="periodId" value={periodId} />
        <input type="hidden" name="userId" value={userId} />
        <label className="mb-1 block text-sm font-medium text-slate-700">Rezeki (Pemasukan)</label>
        <div className="flex gap-2">
          <input
            name="amount"
            type="number"
            step="any"
            defaultValue={budget.income || ""}
            placeholder="0"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500"
          />
          <button className="shrink-0 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            Simpan
          </button>
        </div>
      </form>

      {/* Otomatis */}
      <div className="mb-4 rounded-xl bg-emerald-50 p-3">
        <p className="mb-1 text-xs font-semibold uppercase text-emerald-700">Otomatis</p>
        <Row label="Infaq Rejeki (5%)" value={formatRupiah(budget.infaq)} />
        <div className="flex items-center justify-between py-2 text-sm">
          <span className="text-slate-600">10% Infaq Desa</span>
          <span className="font-medium text-slate-800">{formatRupiah(budget.infaqDesa)}</span>
        </div>
      </div>

      {/* Iuran tetap */}
      <p className="mb-1 text-xs font-semibold uppercase text-slate-500">Iuran / Buku IR</p>
      <div className="mb-3">
        {budget.contributions.map((c) => (
          <div key={c.id} className="flex items-center gap-2 border-b border-slate-100 py-1.5">
            <span className="flex-1 text-sm text-slate-600">{c.category}</span>
            <form action={updateContribution} className="flex items-center gap-1">
              <input type="hidden" name="id" value={c.id} />
              <input
                name="amount"
                type="number"
                step="any"
                defaultValue={c.amount}
                className="w-28 rounded-lg border border-slate-300 px-2 py-1 text-right text-sm outline-none focus:border-emerald-500"
              />
              <button title="Simpan" className="rounded-md bg-emerald-100 px-2 py-1 text-xs text-emerald-700 hover:bg-emerald-200">
                ✓
              </button>
            </form>
            <form action={deleteContribution}>
              <input type="hidden" name="id" value={c.id} />
              <button title="Hapus" className="rounded-md bg-red-50 px-2 py-1 text-xs text-red-600 hover:bg-red-100">
                ✕
              </button>
            </form>
          </div>
        ))}
      </div>

      <form action={addContribution} className="mb-5 flex gap-2">
        <input type="hidden" name="periodId" value={periodId} />
        <input type="hidden" name="userId" value={userId} />
        <input
          name="category"
          placeholder="Nama iuran"
          className="flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-emerald-500"
        />
        <input
          name="amount"
          type="number"
          step="any"
          placeholder="0"
          className="w-24 rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-emerald-500"
        />
        <button className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm text-white hover:bg-slate-800">+</button>
      </form>

      {/* Pengeluaran */}
      <p className="mb-1 text-xs font-semibold uppercase text-slate-500">Pengeluaran</p>
      <div className="mb-3">
        {budget.expenses.map((e) => (
          <div key={e.id} className="flex items-center gap-2 border-b border-slate-100 py-1.5 text-sm">
            <span className="flex-1 text-slate-600">
              {e.name}
              {e.category ? <span className="ml-1 text-xs text-slate-400">({e.category})</span> : null}
            </span>
            <span className="font-medium text-slate-800">{formatRupiah(e.amount)}</span>
            <form action={deleteExpense}>
              <input type="hidden" name="id" value={e.id} />
              <button title="Hapus" className="rounded-md bg-red-50 px-2 py-1 text-xs text-red-600 hover:bg-red-100">
                ✕
              </button>
            </form>
          </div>
        ))}
        {budget.expenses.length === 0 ? (
          <p className="py-2 text-sm text-slate-400">Belum ada pengeluaran.</p>
        ) : null}
      </div>

      <form action={addExpense} className="mb-5 space-y-2">
        <input type="hidden" name="periodId" value={periodId} />
        <input type="hidden" name="userId" value={userId} />
        <div className="flex gap-2">
          <input
            name="name"
            placeholder="Nama pengeluaran"
            className="flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-emerald-500"
          />
          <input
            name="amount"
            type="number"
            step="any"
            placeholder="0"
            className="w-24 rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex gap-2">
          <input
            name="category"
            placeholder="Kategori (opsional)"
            className="flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-emerald-500"
          />
          <button className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm text-white hover:bg-slate-800">+ Tambah</button>
        </div>
      </form>

      {/* Ringkasan */}
      <div className="rounded-xl bg-slate-50 p-3">
        <Row label="Total Iuran (Buku IR)" value={formatRupiah(budget.contribTotal)} />
        <Row label="Total Pengeluaran" value={formatRupiah(budget.expenseTotal)} />
        <Row label="Total Kebutuhan" value={formatRupiah(budget.totalKebutuhan)} />
        <div className="flex items-center justify-between pt-2 text-sm">
          <span className="font-semibold text-slate-700">Di Tabung</span>
          <span className={budget.diTabung >= 0 ? "font-bold text-emerald-600" : "font-bold text-red-600"}>
            {formatRupiah(budget.diTabung)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default async function AnggaranPage({ searchParams }: { searchParams: { p?: string } }) {
  const ps = await listPeriods()
  const current = searchParams.p ? ps.find((p) => p.id === searchParams.p) ?? ps[0] : ps[0]

  const now = new Date()
  const budgets = current ? await getPeriodBudgets(current.id) : []
  const totalSaved = budgets.reduce((s, b) => s + b.diTabung, 0)
  const totalNeed = budgets.reduce((s, b) => s + b.totalKebutuhan, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Anggaran Bulanan</h1>
          <p className="text-sm text-slate-500">Isi rezeki & pengeluaran, sisanya dihitung otomatis.</p>
        </div>
        <form action={createPeriod} className="flex items-end gap-2 rounded-xl bg-white p-3 shadow-sm">
          <div>
            <label className="block text-xs text-slate-500">Bulan</label>
            <select name="month" defaultValue={now.getMonth() + 1} className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm">
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500">Tahun</label>
            <input
              name="year"
              type="number"
              defaultValue={now.getFullYear()}
              className="w-24 rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
            />
          </div>
          <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700">
            + Tambah Bulan
          </button>
        </form>
      </div>

      {ps.length > 0 ? (
        <form method="get" className="flex items-center gap-2 rounded-xl bg-white p-3 shadow-sm">
          <label className="text-sm text-slate-600">Pilih periode:</label>
          <select name="p" defaultValue={current?.id} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm">
            {ps.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
          <button className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm text-white hover:bg-slate-800">Tampilkan</button>
        </form>
      ) : null}

      {!current ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="text-slate-500">Belum ada periode. Tambahkan bulan baru di atas untuk mulai mencatat.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {budgets.map((b) => (
              <BudgetColumn key={b.user.id} periodId={current.id} budget={b} />
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-emerald-600 p-5 text-white shadow-sm">
            <div>
              <p className="text-sm text-emerald-100">Total Kebutuhan ({current.label})</p>
              <p className="text-2xl font-bold">{formatRupiah(totalNeed)}</p>
            </div>
            <div>
              <p className="text-sm text-emerald-100">Total Di Tabung</p>
              <p className="text-2xl font-bold">{formatRupiah(totalSaved)}</p>
            </div>
            <form action={deletePeriod}>
              <input type="hidden" name="id" value={current.id} />
              <button className="rounded-lg bg-emerald-800/60 px-3 py-2 text-sm hover:bg-emerald-900">Hapus periode ini</button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
