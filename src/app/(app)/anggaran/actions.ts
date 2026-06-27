"use server"

import { db } from "@/db"
import { periods, incomes, contributions, expenses } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { DEFAULT_CONTRIBUTIONS, MONTHS } from "@/lib/calc"
import { listUsers } from "@/lib/queries"

export async function createPeriod(formData: FormData) {
  const year = Number(formData.get("year"))
  const month = Number(formData.get("month"))
  if (!year || !month || month < 1 || month > 12) return

  const existing = await db
    .select()
    .from(periods)
    .where(and(eq(periods.year, year), eq(periods.month, month)))

  let periodId: string
  if (existing.length) {
    periodId = existing[0].id
  } else {
    const label = `${MONTHS[month - 1]} ${year}`
    const inserted = await db.insert(periods).values({ year, month, label }).returning()
    periodId = inserted[0].id

    const us = await listUsers()
    for (const u of us) {
      await db.insert(incomes).values({ periodId, userId: u.id, amount: 0 })
      for (let i = 0; i < DEFAULT_CONTRIBUTIONS.length; i++) {
        const c = DEFAULT_CONTRIBUTIONS[i]
        await db.insert(contributions).values({
          periodId,
          userId: u.id,
          category: c.category,
          amount: c.amount,
          sortOrder: i,
        })
      }
    }
  }

  revalidatePath("/anggaran")
  redirect(`/anggaran?p=${periodId}`)
}

export async function saveIncome(formData: FormData) {
  const periodId = String(formData.get("periodId") ?? "")
  const userId = String(formData.get("userId") ?? "")
  const amount = Number(formData.get("amount")) || 0
  if (!periodId || !userId) return

  await db
    .insert(incomes)
    .values({ periodId, userId, amount })
    .onConflictDoUpdate({ target: [incomes.periodId, incomes.userId], set: { amount } })

  revalidatePath("/anggaran")
}

export async function addContribution(formData: FormData) {
  const periodId = String(formData.get("periodId") ?? "")
  const userId = String(formData.get("userId") ?? "")
  const category = String(formData.get("category") ?? "").trim()
  const amount = Number(formData.get("amount")) || 0
  if (!periodId || !userId || !category) return

  await db.insert(contributions).values({ periodId, userId, category, amount, sortOrder: 999 })
  revalidatePath("/anggaran")
}

export async function updateContribution(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  const amount = Number(formData.get("amount")) || 0
  if (!id) return
  await db.update(contributions).set({ amount }).where(eq(contributions.id, id))
  revalidatePath("/anggaran")
}

export async function deleteContribution(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  if (!id) return
  await db.delete(contributions).where(eq(contributions.id, id))
  revalidatePath("/anggaran")
}

export async function addExpense(formData: FormData) {
  const periodId = String(formData.get("periodId") ?? "")
  const userId = String(formData.get("userId") ?? "")
  const name = String(formData.get("name") ?? "").trim()
  const amount = Number(formData.get("amount")) || 0
  const categoryRaw = String(formData.get("category") ?? "").trim()
  if (!periodId || !userId || !name) return

  await db.insert(expenses).values({
    periodId,
    userId,
    name,
    amount,
    category: categoryRaw || null,
  })
  revalidatePath("/anggaran")
}

export async function deleteExpense(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  if (!id) return
  await db.delete(expenses).where(eq(expenses.id, id))
  revalidatePath("/anggaran")
}

export async function deletePeriod(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  if (!id) return
  await db.delete(expenses).where(eq(expenses.periodId, id))
  await db.delete(contributions).where(eq(contributions.periodId, id))
  await db.delete(incomes).where(eq(incomes.periodId, id))
  await db.delete(periods).where(eq(periods.id, id))
  revalidatePath("/anggaran")
  redirect("/anggaran")
}
