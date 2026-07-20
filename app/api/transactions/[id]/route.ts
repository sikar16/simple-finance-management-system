import { prisma } from "@/src/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params;

    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        client: true,
        deposit: {
          include: {
            bankAccount: true,
          },
        },
        transfer: {
          include: {
            bankAccount: true,
          },
        },
      },
    });

    if (!transaction) {
      return NextResponse.json(
        { message: "Transaction not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(transaction);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch transaction." },
      { status: 500 }
    );
  }
}
