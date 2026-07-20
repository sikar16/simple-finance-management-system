"use client";

import { formatCurrency } from "@/src/lib/api";
import { getStoredAuth } from "@/src/lib/auth";
import { getDeposit } from "@/src/lib/deposits";
import type { Deposit } from "@/src/types/deposit";
import { ReceiptPreview } from "@/components/receipt-upload";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ClientDepositDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [depositId, setDepositId] = useState<string | null>(null);
  const [deposit, setDeposit] = useState<Deposit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    params.then(({ id }) => setDepositId(id));
  }, [params]);

  useEffect(() => {
    if (!depositId) return;

    async function loadDeposit() {
      setIsLoading(true);
      setError("");

      const auth = getStoredAuth();
      if (!auth) {
        setError("Please log in to view this deposit.");
        setIsLoading(false);
        return;
      }

      try {
        if (!depositId) {
          throw new Error("Deposit ID is required");
        }
        const data = await getDeposit(depositId);
        if (data.clientId !== auth.user.id) {
          setError("You do not have access to this deposit.");
          return;
        }
        setDeposit(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load deposit");
      } finally {
        setIsLoading(false);
      }
    }

    loadDeposit();
  }, [depositId]);

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
          href="/client/deposits"
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
            View your deposit information and receipt.
          </p>
        </div>
        <Link
          href="/client/deposits"
          className="text-sm font-medium"
          style={{ color: "#a67c3e" }}
        >
          Back to deposits
        </Link>
      </div>

      <div
        className="rounded-2xl border bg-white p-6 shadow-sm"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      >
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-gray-500">Bank</dt>
            <dd className="font-medium">{deposit.bankAccount?.bankName ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Account Number</dt>
            <dd className="font-medium">
              {deposit.bankAccount?.accountNumber ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Amount</dt>
            <dd className="text-lg font-bold" style={{ color: "#059669" }}>
              {formatCurrency(deposit.amount)}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Reference</dt>
            <dd>{deposit.referenceNumber ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-sm text-gray-500">Date</dt>
            <dd>{new Date(deposit.date).toLocaleString()}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-sm text-gray-500">Note</dt>
            <dd>{deposit.note ?? "—"}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="mb-2 text-sm text-gray-500">Receipt</dt>
            <dd>
              <ReceiptPreview url={deposit.receipt} />
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
