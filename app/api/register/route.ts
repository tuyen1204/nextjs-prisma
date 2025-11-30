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

    const hashedPassword = await bcrypt.hash(password, 10)

    // Tìm default role "User"
    const userRole = await prisma.role.findFirst({
      where: { name: "User" },
    })

    if (!userRole) {
      // Nếu chưa có role User thì tạo mới (fallback)
      // Nhưng tốt nhất là seed data đã có
      return new NextResponse("Default role not found. Please contact admin.", { status: 500 })
    }

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        roleId: userRole.id,
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error(error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
