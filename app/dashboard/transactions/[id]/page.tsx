"use client";

import { formatCurrency } from "@/src/lib/api";
import {
  formatTransactionType,
  getTransaction,
} from "@/src/lib/transactions";
import { formatTransferStatus } from "@/src/lib/transfers";
import { ReceiptPreview } from "@/components/receipt-upload";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Transaction } from "@/src/types/transaction";

export default function TransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    params.then(({ id }) => setTransactionId(id));
  }, [params]);

  useEffect(() => {
    if (!transactionId) return;

    async function loadTransaction() {
      setIsLoading(true);
      setError("");

      try {
        if (!transactionId) {
          throw new Error("Deposit ID is required");
        }
        const data = await getTransaction(transactionId);
        setTransaction(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load transaction"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadTransaction();
  }, [transactionId]);

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">Loading transaction details...</p>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600">{error || "Transaction not found."}</p>
        <Link
          href="/dashboard/transactions"
          className="mt-4 inline-block text-sm font-medium"
          style={{ color: "#a67c3e" }}
        >
          Back to transactions
        </Link>
      </div>
    );
  }

  const receiptUrl =
    transaction.deposit?.receipt ?? transaction.transfer?.receipt ?? null;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1C2541" }}>
            Transaction Details
          </h1>
          <p className="text-sm text-gray-400">
            Full record for this {formatTransactionType(transaction.type).toLowerCase()}.
          </p>
        </div>
        <Link
          href="/dashboard/transactions"
          className="text-sm font-medium"
          style={{ color: "#a67c3e" }}
        >
          Back to transactions
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
              <dt className="text-gray-500">Type</dt>
              <dd>{formatTransactionType(transaction.type)}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Client</dt>
              <dd className="font-medium">{transaction.client?.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Amount</dt>
              <dd
                className="text-lg font-bold"
                style={{
                  color:
                    transaction.type === "DEPOSIT" ? "#059669" : "#dc2626",
                }}
              >
                {transaction.type === "DEPOSIT" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Balance After</dt>
              <dd>{formatCurrency(transaction.balanceAfter)}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Date</dt>
              <dd>{new Date(transaction.createdAt).toLocaleString()}</dd>
            </div>
          </dl>
        </div>

        <div
          className="rounded-2xl border bg-white p-6 shadow-sm"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <h2 className="mb-4 font-bold" style={{ color: "#1C2541" }}>
            {transaction.type === "DEPOSIT" ? "Deposit" : "Transfer"} Details
          </h2>

          {transaction.type === "DEPOSIT" && transaction.deposit ? (
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Bank</dt>
                <dd>{transaction.deposit.bankAccount?.bankName ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Reference</dt>
                <dd>{transaction.deposit.referenceNumber ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Note</dt>
                <dd>{transaction.deposit.note ?? "—"}</dd>
              </div>
              <div>
                <dt className="mb-2 text-gray-500">Receipt</dt>
                <dd>
                  <ReceiptPreview url={transaction.deposit.receipt} />
                </dd>
              </div>
              <div>
                <Link
                  href={`/dashboard/deposits/${transaction.deposit.id}`}
                  className="text-sm font-medium"
                  style={{ color: "#a67c3e" }}
                >
                  Open deposit record
                </Link>
              </div>
            </dl>
          ) : transaction.transfer ? (
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-500">Recipient</dt>
                <dd>{transaction.transfer.recipientName}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Recipient Bank</dt>
                <dd>{transaction.transfer.recipientBank}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Recipient Account</dt>
                <dd>{transaction.transfer.recipientAccount}</dd>
              </div>
              <div>
                <dt className="text-gray-500">Status</dt>
                <dd>{formatTransferStatus(transaction.transfer.status)}</dd>
              </div>
              <div>
                <dt className="mb-2 text-gray-500">Receipt</dt>
                <dd>
                  <ReceiptPreview url={transaction.transfer.receipt} />
                </dd>
              </div>
              <div>
                <Link
                  href={`/dashboard/transfers/${transaction.transfer.id}`}
                  className="text-sm font-medium"
                  style={{ color: "#a67c3e" }}
                >
                  Open transfer record
                </Link>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-gray-500">Related record not found.</p>
          )}

          {receiptUrl && transaction.type === "DEPOSIT" && !transaction.deposit && (
            <ReceiptPreview url={receiptUrl} />
          )}
        </div>
      </div>
    </div>
  );
}
