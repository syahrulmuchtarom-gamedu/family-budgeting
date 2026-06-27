"use server"

import { db } from "@/db"
import { assets } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function addAsset(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim()
  const type = String(formData.get("type") ?? "").trim() || "Umum"
  const weightGrams = Number(formData.get("weightGrams")) || 0
  const value = Number(formData.get("value")) || 0
  const note = String(formData.get("note") ?? "").trim()
  if (!name) return

  await db.insert(assets).values({
    name,
    type,
    weightGrams,
    value,
    note: note || null,
    updatedAt: new Date(),
  })
  revalidatePath("/aset")
}

export async function deleteAsset(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  if (!id) return
  await db.delete(assets).where(eq(assets.id, id))
  revalidatePath("/aset")
}
