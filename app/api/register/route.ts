import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, name, password } = body

    if (!email || !password) {
      return new NextResponse("Missing info", { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error(error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

