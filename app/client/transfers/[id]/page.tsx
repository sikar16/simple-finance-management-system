"use client";

import { formatCurrency } from "@/src/lib/api";
import { getStoredAuth } from "@/src/lib/auth";
import { formatTransferStatus, getTransfer } from "@/src/lib/transfers";
import type { Transfer } from "@/src/types/transfer";
import { ReceiptPreview } from "@/components/receipt-upload";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ClientTransferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [transferId, setTransferId] = useState<string | null>(null);
  const [transfer, setTransfer] = useState<Transfer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    params.then(({ id }) => setTransferId(id));
  }, [params]);

  useEffect(() => {
    if (!transferId) return;

    async function loadTransfer() {
      setIsLoading(true);
      setError("");

      const auth = getStoredAuth();
      if (!auth) {
        setError("Please log in to view this transfer.");
        setIsLoading(false);
        return;
      }

      try {
        if (!transferId) {
          throw new Error("Deposit ID is required");
        }
        const data = await getTransfer(transferId);
        if (data.clientId !== auth.user.id) {
          setError("You do not have access to this transfer.");
          return;
        }
        setTransfer(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load transfer");
      } finally {
        setIsLoading(false);
      }
    }

    loadTransfer();
  }, [transferId]);

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">Loading transfer details...</p>
      </div>
    );
  }

  if (!transfer) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600">{error || "Transfer not found."}</p>
        <Link
          href="/client/transfers"
          className="mt-4 inline-block text-sm font-medium"
          style={{ color: "#a67c3e" }}
        >
          Back to transfers
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1C2541" }}>
            Transfer Details
          </h1>
          <p className="text-sm text-gray-400">
            View your transfer information and receipt.
          </p>
        </div>
        <Link
          href="/client/transfers"
          className="text-sm font-medium"
          style={{ color: "#a67c3e" }}
        >
          Back to transfers
        </Link>
      </div>

      <div
        className="rounded-2xl border bg-white p-6 shadow-sm"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      >
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-gray-500">Recipient</dt>
            <dd className="font-medium">{transfer.recipientName}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Recipient Bank</dt>
            <dd className="font-medium">{transfer.recipientBank}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Recipient Account</dt>
            <dd className="font-medium">{transfer.recipientAccount}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Amount</dt>
            <dd className="text-lg font-bold" style={{ color: "#a67c3e" }}>
              {formatCurrency(transfer.amount)}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Status</dt>
            <dd>{formatTransferStatus(transfer.status)}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Reference</dt>
            <dd>{transfer.referenceNumber ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Date</dt>
            <dd>{new Date(transfer.date).toLocaleString()}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="mb-2 text-sm text-gray-500">Receipt</dt>
            <dd>
              <ReceiptPreview url={transfer.receipt} />
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
