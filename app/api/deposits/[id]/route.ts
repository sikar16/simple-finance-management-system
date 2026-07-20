import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  req: NextRequest,
  { params }: Params
) {
  const { id } = await params;

  const deposit = await prisma.deposit.findUnique({
    where: {
      id,
    },
    include: {
      client: true,
      bankAccount: true,
    },
  });

  if (!deposit) {
    return NextResponse.json(
      { message: "Deposit not found." },
      { status: 404 }
    );
  }

  return NextResponse.json(deposit);
}

export async function PUT(
  req: NextRequest,
  { params }: Params
) {
  const { id } = await params;

  const body = await req.json();

  const deposit = await prisma.deposit.update({
    where: {
      id,
    },
    data: body,
  });

  return NextResponse.json(deposit);
}

export async function DELETE(
  req: NextRequest,
  { params }: Params
) {
  const { id } = await params;

  const deposit = await prisma.deposit.findUnique({
    where: {
      id,
    },
  });

  if (!deposit) {
    return NextResponse.json(
      { message: "Deposit not found." },
      { status: 404 }
    );
  }

  const bank = await prisma.bankAccount.findUnique({
    where: {
      id: deposit.bankAccountId,
    },
  });

  if (bank) {
    const newBalance =
      Number(bank.balance) - Number(deposit.amount);

    await prisma.bankAccount.update({
      where: {
        id: bank.id,
      },
      data: {
        balance: newBalance,
      },
    });
  }

  await prisma.transaction.deleteMany({
    where: {
      depositId: id,
    },
  });

  await prisma.deposit.delete({
    where: {
      id,
    },
  });

  return NextResponse.json({
    message: "Deposit deleted successfully.",
  });
}