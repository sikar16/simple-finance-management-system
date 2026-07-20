import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const accounts = await prisma.bankAccount.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(accounts);
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch bank accounts." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      bankName,
      accountName,
      accountNumber,
      currency,
      balance,
    } = body;

    if (!bankName || !accountName || !accountNumber) {
      return NextResponse.json(
        { message: "Please fill all required fields." },
        { status: 400 }
      );
    }

    const exists = await prisma.bankAccount.findUnique({
      where: {
        accountNumber,
      },
    });

    if (exists) {
      return NextResponse.json(
        { message: "Account number already exists." },
        { status: 400 }
      );
    }

    const account = await prisma.bankAccount.create({
      data: {
        bankName,
        accountName,
        accountNumber,
        currency: currency || "ETB",
        balance: balance || 0,
      },
    });

    return NextResponse.json(account, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to create account." },
      { status: 500 }
    );
  }
}