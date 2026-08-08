import {
  getBlobAccess,
  isBlobStorageConfigured,
} from "@/src/lib/blob-storage";
import { get } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: Promise<{
    path: string[];
  }>;
}

export async function GET(req: NextRequest, { params }: Params) {
  if (!isBlobStorageConfigured()) {
    return NextResponse.json(
      { message: "Blob storage is not configured." },
      { status: 503 }
    );
  }

  const { path } = await params;
  const pathname = path.join("/");

  if (!pathname.startsWith("receipts/")) {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }

  try {
    const result = await get(pathname, { access: getBlobAccess() });

    if (!result || result.statusCode !== 200) {
      return NextResponse.json({ message: "Not found." }, { status: 404 });
    }

    return new NextResponse(result.stream, {
      headers: {
        "Content-Type": result.blob.contentType,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "private, no-cache",
      },
    });
  } catch {
    return NextResponse.json({ message: "Not found." }, { status: 404 });
  }
}
