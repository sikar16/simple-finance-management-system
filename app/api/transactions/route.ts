import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(transactions);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch transactions." },
      { status: 500 }
    );
  }
}
