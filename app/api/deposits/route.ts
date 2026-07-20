import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const deposits = await prisma.deposit.findMany({
      include: {
        client: true,
        bankAccount: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(deposits);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch deposits." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      clientId,
      bankAccountId,
      amount,
      referenceNumber,
      receipt,
      note,
    } = body;

    const bank = await prisma.bankAccount.findUnique({
      where: {
        id: bankAccountId,
      },
    });

    if (!bank) {
      return NextResponse.json(
        { message: "Bank account not found." },
        { status: 404 }
      );
    }

    const deposit = await prisma.deposit.create({
      data: {
        clientId,
        bankAccountId,
        amount,
        referenceNumber,
        receipt,
        note,
      },
    });

    const newBalance =
      Number(bank.balance) + Number(amount);

    await prisma.bankAccount.update({
      where: {
        id: bankAccountId,
      },
      data: {
        balance: newBalance,
      },
    });

    await prisma.transaction.create({
      data: {
        clientId,
        type: "DEPOSIT",
        depositId: deposit.id,
        amount,
        balanceAfter: newBalance,
      },
    });

    return NextResponse.json(deposit, {
      status: 201,
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to create deposit." },
      { status: 500 }
    );
  }
}