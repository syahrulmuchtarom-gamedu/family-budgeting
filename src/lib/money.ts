export function formatRupiah(value: number): string {
  const n = Number.isFinite(value) ? value : 0
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Math.round(n))
}

export function formatNumber(value: number): string {
  const n = Number.isFinite(value) ? value : 0
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(n)
}
