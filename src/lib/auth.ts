import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"

const COOKIE_NAME = "kk_session"
const MAX_AGE = 60 * 60 * 24 * 7 // 7 hari

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error("AUTH_SECRET belum di-set.")
  return new TextEncoder().encode(secret)
}

export type SessionPayload = {
  userId: string
  email: string
  name: string
}

export async function createSession(payload: SessionPayload): Promise<void> {
  const token = await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret())

  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  })
}

export async function getSession(): Promise<SessionPayload | null> {
  const token = cookies().get(COOKIE_NAME)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return {
      userId: String(payload.userId),
      email: String(payload.email),
      name: String(payload.name),
    }
  } catch {
    return null
  }
}

export async function destroySession(): Promise<void> {
  cookies().delete(COOKIE_NAME)
}
