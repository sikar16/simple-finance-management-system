"use client";

import { isImageReceipt, uploadReceipt } from "@/src/lib/upload";
import Image from "next/image";
import { useRef, useState } from "react";

type ReceiptUploadProps = {
  value?: string | null;
  onChange: (url: string | undefined) => void;
  disabled?: boolean;
};

export function ReceiptUpload({
  value,
  onChange,
  disabled = false,
}: ReceiptUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setIsUploading(true);

    try {
      const url = await uploadReceipt(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload receipt");
      onChange(undefined);
    } finally {
      setIsUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  function handleRemove() {
    onChange(undefined);
    setError("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-1" style={{ color: "#1C2541" }}>
        Upload Receipt
      </label>

      <div
        className="w-full rounded-xl border-2 border-dashed px-4 py-6 text-center transition hover:bg-gray-50 cursor-pointer"
        style={{ borderColor: "#d0cec9" }}
        onClick={() => !disabled && !isUploading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.jpg,.jpeg,.png,.webp,.gif,image/*,application/pdf"
          disabled={disabled || isUploading}
        />

        {isUploading ? (
          <p className="text-sm" style={{ color: "#4a4a4a" }}>
            Uploading receipt...
          </p>
        ) : value ? (
          <div className="space-y-3">
            {isImageReceipt(value) ? (
              <div className="relative mx-auto h-40 w-full max-w-xs overflow-hidden rounded-lg border">
                <Image
                  src={value}
                  alt="Receipt preview"
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
            ) : (
              <p className="text-sm font-medium" style={{ color: "#059669" }}>
                Receipt uploaded
              </p>
            )}
            <div className="flex items-center justify-center gap-3 text-xs">
              <a
                href={value}
                target="_blank"
                rel="noreferrer"
                className="font-medium hover:underline"
                style={{ color: "#a67c3e" }}
                onClick={(event) => event.stopPropagation()}
              >
                View receipt
              </a>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handleRemove();
                }}
                className="font-medium text-red-600 hover:underline"
                disabled={disabled}
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <>
            <svg
              className="mx-auto h-8 w-8"
              style={{ color: "#4a4a4a" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            <p className="mt-2 text-sm" style={{ color: "#4a4a4a" }}>
              Click to upload receipt image or PDF
            </p>
            <p className="text-xs" style={{ color: "#4a4a4a" }}>
              JPG, PNG, WEBP, GIF, PDF (Max 5MB)
            </p>
          </>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export function ReceiptPreview({ url }: { url?: string | null }) {
  if (!url) {
    return <p className="text-sm text-gray-500">No receipt uploaded.</p>;
  }

  if (isImageReceipt(url)) {
    return (
      <div className="space-y-2">
        <div className="relative h-48 w-full overflow-hidden rounded-lg border">
          <Image
            src={url}
            alt="Receipt"
            fill
            className="object-contain"
            unoptimized
          />
        </div>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium hover:underline"
          style={{ color: "#a67c3e" }}
        >
          Open receipt
        </a>
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="text-sm font-medium hover:underline"
      style={{ color: "#a67c3e" }}
    >
      View receipt (PDF)
    </a>
  );
}
