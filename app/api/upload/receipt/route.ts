import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { put } from "@vercel/blob";

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
      EXTENSIONS[file.type] ?? (file.name.split('.').pop() || ".bin");
    const filename = `${randomUUID()}${extension}`;

    // Vercel serverless has a read-only filesystem — use Blob when deployed there.
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`receipts/${filename}`, file, {
        access: "public",
      });

      return NextResponse.json({
        url: blob.url,
      });
    }

    if (process.env.VERCEL === "1") {
      return NextResponse.json(
        {
          message:
            "File storage is not configured. Add Vercel Blob Storage to your project in the Vercel dashboard (Storage → Create → Blob).",
        },
        { status: 500 }
      );
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
