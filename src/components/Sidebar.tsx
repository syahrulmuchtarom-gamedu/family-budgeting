"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { logout } from "@/app/(app)/actions"

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/anggaran", label: "Anggaran Bulanan", icon: "📝" },
  { href: "/rekap", label: "Rekap", icon: "📈" },
  { href: "/aset", label: "Aset", icon: "💎" },
]

export default function Sidebar({ name }: { name: string }) {
  const pathname = usePathname()

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-emerald-800 text-emerald-50">
      <div className="flex items-center gap-2 px-6 py-6">
        <span className="text-2xl">💰</span>
        <span className="text-lg font-bold leading-tight">
          Keuangan
          <br />
          Keluarga
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                active ? "bg-emerald-600 text-white" : "text-emerald-100 hover:bg-emerald-700/60"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-emerald-700 px-4 py-4">
        <p className="mb-3 px-2 text-sm">
          <span className="block text-xs text-emerald-300">Masuk sebagai</span>
          <span className="font-semibold">{name}</span>
        </p>
        <form action={logout}>
          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-900/60 px-4 py-2 text-sm font-medium text-emerald-50 transition hover:bg-emerald-900"
          >
            Keluar
          </button>
        </form>
      </div>
    </aside>
  )
}
