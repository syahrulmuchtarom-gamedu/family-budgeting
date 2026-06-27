"use server"

import { db } from "@/db"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"
import { verifyPassword } from "@/lib/password"
import { createSession } from "@/lib/auth"
import { redirect } from "next/navigation"

export type LoginState = { error?: string }

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) {
    return { error: "Email dan kata sandi wajib diisi." }
  }

  const rows = await db.select().from(users).where(eq(users.email, email))
  const user = rows[0]
  if (!user) {
    return { error: "Email tidak terdaftar atau kata sandi salah." }
  }

  const ok = await verifyPassword(password, user.passwordHash)
  if (!ok) {
    return { error: "Email tidak terdaftar atau kata sandi salah." }
  }

  await createSession({ userId: user.id, email: user.email, name: user.name })
  redirect("/dashboard")
}
