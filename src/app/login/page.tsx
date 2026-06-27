"use client"

import { useFormState, useFormStatus } from "react-dom"
import { login, type LoginState } from "./actions"

const initialState: LoginState = {}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
    >
      {pending ? "Memproses..." : "Masuk"}
    </button>
  )
}

export default function LoginPage() {
  const [state, formAction] = useFormState(login, initialState)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-100 via-emerald-50 to-white p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">
            💰
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Keuangan Keluarga</h1>
          <p className="mt-1 text-sm text-slate-500">Kelola anggaran bersama dengan mudah dan aman.</p>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              name="email"
              type="email"
              autoComplete="email"
              placeholder="contoh@email.com"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Kata Sandi</label>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              required
            />
          </div>

          {state.error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
          ) : null}

          <SubmitButton />
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">Akses terbatas untuk Syahrul & Intan</p>
      </div>
    </div>
  )
}
