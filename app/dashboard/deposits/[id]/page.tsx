"use client";

import { formatCurrency } from "@/src/lib/api";
import {
  deleteDeposit,
  getDeposit,
  updateDeposit,
} from "@/src/lib/deposits";
import type { Deposit } from "@/src/types/deposit";
import { ReceiptPreview, ReceiptUpload } from "@/components/receipt-upload";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

export default function DepositDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [depositId, setDepositId] = useState<string | null>(null);
  const [deposit, setDeposit] = useState<Deposit | null>(null);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [note, setNote] = useState("");
  const [amount, setAmount] = useState("");
  const [receipt, setReceipt] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    params.then(({ id }) => setDepositId(id));
  }, [params]);

  useEffect(() => {
    if (!depositId) return;

    async function loadDeposit() {
      setIsLoading(true);
      setError("");

      try {
        if (!depositId) {
          throw new Error("Deposit ID is required");
        }
        const data = await getDeposit(depositId);
        setDeposit(data);
        setReferenceNumber(data.referenceNumber ?? "");
        setNote(data.note ?? "");
        setAmount(String(data.amount));
        setReceipt(data.receipt ?? undefined);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load deposit");
      } finally {
        setIsLoading(false);
      }
    }

    loadDeposit();
  }, [depositId]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!depositId) return;

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const updated = await updateDeposit(depositId, {
        referenceNumber: referenceNumber || undefined,
        note: note || undefined,
        amount: parseFloat(amount),
        receipt,
      });
      setDeposit(updated);
      setSuccess("Deposit updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update deposit");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!depositId || !deposit) return;

    if (
      !confirm(
        `Delete deposit of ${formatCurrency(deposit.amount)} from ${deposit.client?.name ?? "client"}?`
      )
    ) {
      return;
    }

    try {
      await deleteDeposit(depositId);
      router.push("/dashboard/deposits");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete deposit");
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">Loading deposit details...</p>
      </div>
    );
  }

  if (!deposit) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600">{error || "Deposit not found."}</p>
        <Link
          href="/dashboard/deposits"
          className="mt-4 inline-block text-sm font-medium"
          style={{ color: "#a67c3e" }}
        >
          Back to deposits
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1C2541" }}>
            Deposit Details
          </h1>
          <p className="text-sm text-gray-400">
            View and update deposit information.
          </p>
        </div>

        <Link
          href="/dashboard/deposits"
          className="text-sm font-medium"
          style={{ color: "#a67c3e" }}
        >
          Back to deposits
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
              <dd className="font-medium">{deposit.client?.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Bank Account</dt>
              <dd className="font-medium">
                {deposit.bankAccount
                  ? `${deposit.bankAccount.bankName} (${deposit.bankAccount.accountNumber})`
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Amount</dt>
              <dd className="text-lg font-bold" style={{ color: "#059669" }}>
                {formatCurrency(deposit.amount)}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Date</dt>
              <dd>{new Date(deposit.date).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Created</dt>
              <dd>{new Date(deposit.createdAt).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="text-gray-500 mb-2">Receipt</dt>
              <dd>
                <ReceiptPreview url={deposit.receipt} />
              </dd>
            </div>
          </dl>
        </div>

        <div
          className="rounded-2xl border bg-white p-6 shadow-sm"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <h2 className="mb-4 font-bold" style={{ color: "#1C2541" }}>
            Edit Deposit
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
              <label className="block text-sm font-medium mb-1">Amount (ETB)</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
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

            <div>
              <label className="block text-sm font-medium mb-1">Note</label>
              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={3}
                disabled={isSaving}
                className="w-full rounded-xl border px-4 py-3 resize-none"
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
