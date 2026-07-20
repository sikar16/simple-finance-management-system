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

  const client = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      deposits: true,
      transfers: true,
      notifications: true,
      transactions: true,
    },
  });

  if (!client) {
    return NextResponse.json(
      { message: "Client not found." },
      { status: 404 }
    );
  }

  return NextResponse.json(client);
}

export async function PUT(
  req: NextRequest,
  { params }: Params
) {
  const { id } = await params;

  const body = await req.json();

  const client = await prisma.user.update({
    where: {
      id,
    },
    data: {
      name: body.name,
      phone: body.phone,
      email: body.email,
    },
  });

  return NextResponse.json(client);
}

export async function DELETE(
  req: NextRequest,
  { params }: Params
) {
  try {
    const { id } = await params;

    await prisma.user.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Client deleted successfully.",
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to delete client." },
      { status: 500 }
    );
  }
}