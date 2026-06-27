import { sqliteTable, text, integer, real, uniqueIndex } from "drizzle-orm/sqlite-core"

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
})

export const periods = sqliteTable(
  "periods",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    year: integer("year").notNull(),
    month: integer("month").notNull(),
    label: text("label").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  },
  (t) => ({
    yearMonthIdx: uniqueIndex("periods_year_month_idx").on(t.year, t.month),
  }),
)

export const incomes = sqliteTable(
  "incomes",
  {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    periodId: text("period_id").notNull().references(() => periods.id, { onDelete: "cascade" }),
    userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    amount: real("amount").notNull().default(0),
  },
  (t) => ({
    periodUserIdx: uniqueIndex("incomes_period_user_idx").on(t.periodId, t.userId),
  }),
)

export const contributions = sqliteTable("contributions", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  periodId: text("period_id").notNull().references(() => periods.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  category: text("category").notNull(),
  amount: real("amount").notNull().default(0),
  isAuto: integer("is_auto", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
})

export const expenses = sqliteTable("expenses", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  periodId: text("period_id").notNull().references(() => periods.id, { onDelete: "cascade" }),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  amount: real("amount").notNull().default(0),
  category: text("category"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
})

export const assets = sqliteTable("assets", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  type: text("type").notNull().default("Umum"),
  name: text("name").notNull(),
  weightGrams: real("weight_grams").notNull().default(0),
  value: real("value").notNull().default(0),
  note: text("note"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
})
