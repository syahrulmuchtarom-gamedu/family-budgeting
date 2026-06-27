import { db } from "@/db"
import { periods, incomes, contributions, expenses, users, assets } from "@/db/schema"
import { and, eq, asc, desc } from "drizzle-orm"
import { calcInfaq, calcInfaqDesa } from "./calc"

export async function listUsers() {
  return db.select().from(users).orderBy(asc(users.name))
}

export async function listPeriods() {
  return db.select().from(periods).orderBy(desc(periods.year), desc(periods.month))
}

export async function getPeriodById(id: string) {
  const rows = await db.select().from(periods).where(eq(periods.id, id))
  return rows[0] ?? null
}

export type UserBudget = {
  user: { id: string; name: string }
  income: number
  infaq: number
  infaqDesa: number
  contributions: { id: string; category: string; amount: number }[]
  expenses: { id: string; name: string; amount: number; category: string | null }[]
  contribTotal: number
  expenseTotal: number
  totalKebutuhan: number
  diTabung: number
}

export async function getPeriodBudgets(periodId: string): Promise<UserBudget[]> {
  const us = await listUsers()
  const result: UserBudget[] = []

  for (const u of us) {
    const incRows = await db
      .select()
      .from(incomes)
      .where(and(eq(incomes.periodId, periodId), eq(incomes.userId, u.id)))
    const income = incRows[0]?.amount ?? 0

    const contribs = await db
      .select()
      .from(contributions)
      .where(and(eq(contributions.periodId, periodId), eq(contributions.userId, u.id)))
      .orderBy(asc(contributions.sortOrder), asc(contributions.category))

    const exps = await db
      .select()
      .from(expenses)
      .where(and(eq(expenses.periodId, periodId), eq(expenses.userId, u.id)))
      .orderBy(desc(expenses.createdAt))

    const infaq = calcInfaq(income)
    const infaqDesa = calcInfaqDesa(infaq)
    const fixedTotal = contribs.reduce((s, c) => s + c.amount, 0)
    const contribTotal = infaq + infaqDesa + fixedTotal
    const expenseTotal = exps.reduce((s, e) => s + e.amount, 0)
    const totalKebutuhan = contribTotal + expenseTotal

    result.push({
      user: { id: u.id, name: u.name },
      income,
      infaq,
      infaqDesa,
      contributions: contribs.map((c) => ({ id: c.id, category: c.category, amount: c.amount })),
      expenses: exps.map((e) => ({ id: e.id, name: e.name, amount: e.amount, category: e.category })),
      contribTotal,
      expenseTotal,
      totalKebutuhan,
      diTabung: income - totalKebutuhan,
    })
  }

  return result
}

export type RecapRow = {
  period: { id: string; year: number; month: number; label: string }
  income: number
  spending: number
  saved: number
}

export async function getRecap(): Promise<RecapRow[]> {
  const ps = await listPeriods()
  const rows: RecapRow[] = []
  for (const p of ps) {
    const budgets = await getPeriodBudgets(p.id)
    rows.push({
      period: { id: p.id, year: p.year, month: p.month, label: p.label },
      income: budgets.reduce((s, b) => s + b.income, 0),
      spending: budgets.reduce((s, b) => s + b.totalKebutuhan, 0),
      saved: budgets.reduce((s, b) => s + b.diTabung, 0),
    })
  }
  return rows
}

export async function getExpenseByCategory(): Promise<{ category: string; amount: number }[]> {
  const exps = await db.select().from(expenses)
  const map = new Map<string, number>()
  for (const e of exps) {
    const key = e.category && e.category.trim() ? e.category.trim() : "Lain-lain"
    map.set(key, (map.get(key) ?? 0) + e.amount)
  }
  return [...map.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount)
}

export async function listAssets() {
  return db.select().from(assets).orderBy(desc(assets.updatedAt))
}
