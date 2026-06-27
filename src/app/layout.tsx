import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Keuangan Keluarga",
  description: "Aplikasi anggaran keluarga — Syahrul & Intan",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
