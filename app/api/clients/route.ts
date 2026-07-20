import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/src/lib/prisma";

export async function GET() {
  try {
    const clients = await prisma.user.findMany({
      where: {
        role: "CLIENT",
      },
      include: {
        deposits: true,
        transfers: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(clients);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch clients." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      phone,
      email,
      password,
    } = body;

    if (!name || !phone || !email || !password) {
      return NextResponse.json(
        { message: "Please fill all required fields." },
        { status: 400 }
      );
    }

    const exists = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { phone },
        ],
      },
    });

    if (exists) {
      return NextResponse.json(
        { message: "Client already exists." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const client = await prisma.user.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
        role: "CLIENT",
      },
    });

    return NextResponse.json(client, {
      status: 201,
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to create client." },
      { status: 500 }
    );
  }
}