import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { put } from "@vercel/blob";
import {
  getBlobAccess,
  isBlobStorageConfigured,
  isVercelDeployment,
  receiptProxyUrl,
} from "@/src/lib/blob-storage";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "application/pdf": ".pdf",
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { message: "Receipt file is required." },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { message: "Only JPG, PNG, WEBP, GIF, or PDF files are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "File must be 5MB or smaller." },
        { status: 400 }
      );
    }

    const extension =
      EXTENSIONS[file.type] ?? (file.name.split(".").pop() || ".bin");
    const filename = `${randomUUID()}${extension}`;
    const pathname = `receipts/${filename}`;

    if (isBlobStorageConfigured() || isVercelDeployment()) {
      if (!isBlobStorageConfigured()) {
        return NextResponse.json(
          {
            message:
              "Blob store is not connected to this project. Open receipt-storage → Projects → Connect to Project, select this app, then redeploy.",
          },
          { status: 500 }
        );
      }

      const access = getBlobAccess();
      const blob = await put(pathname, file, { access });

      return NextResponse.json({
        url: access === "public" ? blob.url : receiptProxyUrl(pathname),
      });
    }

    {
      // Local development: use filesystem
      const uploadsDir = path.join(process.cwd(), "public", "uploads", "receipts");
      await mkdir(uploadsDir, { recursive: true });
      const filepath = path.join(uploadsDir, filename);
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(filepath, buffer);

      return NextResponse.json({
        url: `/uploads/receipts/${filename}`,
      });
    }
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to upload receipt.", error: err },
      { status: 500 }
    );
  }
}
