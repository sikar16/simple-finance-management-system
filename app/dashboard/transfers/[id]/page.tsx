"use client";

import { formatCurrency } from "@/src/lib/api";
import {
  deleteTransfer,
  formatTransferStatus,
  getTransfer,
  updateTransfer,
} from "@/src/lib/transfers";
import type { Transfer, TransferStatus } from "@/src/types/transfer";
import { ReceiptPreview, ReceiptUpload } from "@/components/receipt-upload";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function TransferDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [transferId, setTransferId] = useState<string | null>(null);
  const [transfer, setTransfer] = useState<Transfer | null>(null);
  const [status, setStatus] = useState<TransferStatus>("PENDING");
  const [recipientName, setRecipientName] = useState("");
  const [recipientBank, setRecipientBank] = useState("");
  const [recipientAccount, setRecipientAccount] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [receipt, setReceipt] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    params.then(({ id }) => setTransferId(id));
  }, [params]);

  useEffect(() => {
    if (!transferId) return;

    async function loadTransfer() {
      setIsLoading(true);
      setError("");

      try {
        if (!transferId) {
          throw new Error("Deposit ID is required");
        }
        const data = await getTransfer(transferId);
        setTransfer(data);
        setStatus(data.status);
        setRecipientName(data.recipientName);
        setRecipientBank(data.recipientBank);
        setRecipientAccount(data.recipientAccount);
        setReferenceNumber(data.referenceNumber ?? "");
        setReceipt(data.receipt ?? undefined);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load transfer");
      } finally {
        setIsLoading(false);
      }
    }

    loadTransfer();
  }, [transferId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!transferId) return;

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const updated = await updateTransfer(transferId, {
        status,
        recipientName,
        recipientBank,
        recipientAccount,
        referenceNumber: referenceNumber || undefined,
        receipt,
      });
      setTransfer(updated);
      setSuccess("Transfer updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update transfer");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!transferId || !transfer) return;

    if (
      !confirm(
        `Delete transfer of ${formatCurrency(transfer.amount)} to ${transfer.recipientName}?`
      )
    ) {
      return;
    }

    try {
      await deleteTransfer(transferId);
      router.push("/dashboard/transfers");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete transfer");
    }
  }

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
          href="/dashboard/transfers"
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
            View and update transfer information.
          </p>
        </div>

        <Link
          href="/dashboard/transfers"
          className="text-sm font-medium"
          style={{ color: "#a67c3e" }}
        >
          Back to transfers
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div
          className="rounded-2xl border bg-white p-6 shadow-sm"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <h2 className="mb-4 font-bold" style={{ color: "#1C2541" }}>
            Summary
          </h2>

          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Client</dt>
              <dd className="font-medium">{transfer.client?.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Source Account</dt>
              <dd className="font-medium">
                {transfer.bankAccount
                  ? `${transfer.bankAccount.bankName} (${transfer.bankAccount.accountNumber})`
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Amount</dt>
              <dd className="text-lg font-bold" style={{ color: "#a67c3e" }}>
                {formatCurrency(transfer.amount)}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Status</dt>
              <dd>{formatTransferStatus(transfer.status)}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Date</dt>
              <dd>{new Date(transfer.date).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-gray-500 mb-2">Receipt</dt>
              <dd>
                <ReceiptPreview url={transfer.receipt} />
              </dd>
            </div>
          </dl>
        </div>

        <div
          className="rounded-2xl border bg-white p-6 shadow-sm"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <h2 className="mb-4 font-bold" style={{ color: "#1C2541" }}>
            Edit Transfer
          </h2>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as TransferStatus)
                }
                disabled={isSaving}
                className="w-full rounded-xl border px-4 py-3"
                style={{ borderColor: "#d0cec9" }}
              >
                <option value="PENDING">Pending</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Recipient Name
              </label>
              <input
                value={recipientName}
                onChange={(event) => setRecipientName(event.target.value)}
                required
                disabled={isSaving}
                className="w-full rounded-xl border px-4 py-3"
                style={{ borderColor: "#d0cec9" }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Recipient Bank
              </label>
              <input
                value={recipientBank}
                onChange={(event) => setRecipientBank(event.target.value)}
                required
                disabled={isSaving}
                className="w-full rounded-xl border px-4 py-3"
                style={{ borderColor: "#d0cec9" }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Recipient Account
              </label>
              <input
                value={recipientAccount}
                onChange={(event) => setRecipientAccount(event.target.value)}
                required
                disabled={isSaving}
                className="w-full rounded-xl border px-4 py-3"
                style={{ borderColor: "#d0cec9" }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Reference Number
              </label>
              <input
                value={referenceNumber}
                onChange={(event) => setReferenceNumber(event.target.value)}
                disabled={isSaving}
                className="w-full rounded-xl border px-4 py-3"
                style={{ borderColor: "#d0cec9" }}
              />
            </div>

            <ReceiptUpload
              value={receipt}
              onChange={setReceipt}
              disabled={isSaving}
            />

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl px-6 py-3 font-medium text-white disabled:opacity-50"
                style={{ backgroundColor: "#1C2541" }}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSaving}
                className="rounded-xl border px-6 py-3 font-medium text-red-600"
                style={{ borderColor: "#fecaca" }}
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
