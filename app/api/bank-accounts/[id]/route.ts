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
  try {
    const { id } = await params;

    const account = await prisma.bankAccount.findUnique({
      where: {
        id,
      },
    });

    if (!account) {
      return NextResponse.json(
        { message: "Bank account not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(account);
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch account." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;

    const body = await req.json();

    const account = await prisma.bankAccount.update({
      where: {
        id,
      },
      data: body,
    });

    return NextResponse.json(account);
  } catch {
    return NextResponse.json(
      { message: "Failed to update account." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;

    await prisma.bankAccount.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Bank account deleted successfully.",
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to delete account." },
      { status: 500 }
    );
  }
}