export const INFAQ_RATE = 0.05
export const INFAQ_DESA_RATE = 0.1

export function calcInfaq(income: number): number {
  return (income || 0) * INFAQ_RATE
}

export function calcInfaqDesa(infaq: number): number {
  return (infaq || 0) * INFAQ_DESA_RATE
}

// Iuran tetap default (Buku IR) — diambil dari pola Excel.
// Infaq Rejeki & 10% Infaq Desa dihitung otomatis, jadi tidak ada di sini.
export const DEFAULT_CONTRIBUTIONS: { category: string; amount: number }[] = [
  { category: "Jatah Desa", amount: 110000 },
  { category: "Dana Sosial", amount: 2000 },
  { category: "Olahraga", amount: 5000 },
  { category: "Senkom", amount: 5000 },
  { category: "Masjid", amount: 2000 },
  { category: "CKM", amount: 10000 },
  { category: "Kolektor", amount: 150000 },
  { category: "Bata Merah", amount: 2000 },
  { category: "PPG Daerah", amount: 10000 },
  { category: "Kematian", amount: 2000 },
  { category: "Haji", amount: 2000 },
  { category: "Anak Yatim", amount: 2000 },
  { category: "Tabungan Qurban", amount: 20000 },
  { category: "Halaqoh", amount: 5000 },
  { category: "Hutang Pusat", amount: 110000 },
  { category: "Jimpitan", amount: 0 },
]

export const MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
]
