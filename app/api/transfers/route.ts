import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const transfers = await prisma.transfer.findMany({
      include: {
        client: true,
        bankAccount: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(transfers);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch transfers." },
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
      recipientName,
      recipientBank,
      recipientAccount,
      amount,
      referenceNumber,
      receipt,
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

    if (Number(bank.balance) < Number(amount)) {
      return NextResponse.json(
        { message: "Insufficient balance." },
        { status: 400 }
      );
    }

    const transfer = await prisma.transfer.create({
      data: {
        clientId,
        bankAccountId,
        recipientName,
        recipientBank,
        recipientAccount,
        amount,
        referenceNumber,
        receipt,
      },
    });

    const balanceAfter =
      Number(bank.balance) - Number(amount);

    await prisma.bankAccount.update({
      where: {
        id: bank.id,
      },
      data: {
        balance: balanceAfter,
      },
    });

    await prisma.transaction.create({
      data: {
        clientId,
        type: "TRANSFER",
        transferId: transfer.id,
        amount,
        balanceAfter,
      },
    });

    await prisma.notification.create({
      data: {
        clientId,
        title: "Transfer Completed",
        message: `${amount} ETB has been transferred successfully.`,
      },
    });

    return NextResponse.json(transfer, {
      status: 201,
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to create transfer." },
      { status: 500 }
    );
  }
}