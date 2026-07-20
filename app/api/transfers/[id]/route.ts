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

  const transfer = await prisma.transfer.findUnique({
    where: {
      id,
    },
    include: {
      client: true,
      bankAccount: true,
    },
  });

  if (!transfer) {
    return NextResponse.json(
      { message: "Transfer not found." },
      { status: 404 }
    );
  }

  return NextResponse.json(transfer);
}

export async function PUT(
  req: NextRequest,
  { params }: Params
) {
  const { id } = await params;

  const body = await req.json();

  const transfer = await prisma.transfer.update({
    where: {
      id,
    },
    data: body,
  });

  return NextResponse.json(transfer);
}

export async function DELETE(
  req: NextRequest,
  { params }: Params
) {
  const { id } = await params;

  const transfer = await prisma.transfer.findUnique({
    where: {
      id,
    },
  });

  if (!transfer) {
    return NextResponse.json(
      { message: "Transfer not found." },
      { status: 404 }
    );
  }

  const bank = await prisma.bankAccount.findUnique({
    where: {
      id: transfer.bankAccountId,
    },
  });

  if (bank) {
    await prisma.bankAccount.update({
      where: {
        id: bank.id,
      },
      data: {
        balance:
          Number(bank.balance) +
          Number(transfer.amount),
      },
    });
  }

  await prisma.transaction.deleteMany({
    where: {
      transferId: id,
    },
  });

  await prisma.notification.deleteMany({
    where: {
      clientId: transfer.clientId,
      title: "Transfer Completed",
    },
  });

  await prisma.transfer.delete({
    where: {
      id,
    },
  });

  return NextResponse.json({
    message: "Transfer deleted successfully.",
  });
}