"use client";

import { formatCurrency } from "@/src/lib/api";
import {
  deleteTransfer,
  formatTransferStatus,
  getTransfers,
} from "@/src/lib/transfers";
import type { Transfer } from "@/src/types/transfer";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import AddTransfersPage from "./new/page";

function statusStyles(status: Transfer["status"]) {
  switch (status) {
    case "COMPLETED":
      return { background: "#ecfdf5", color: "#059669" };
    case "CANCELLED":
      return { background: "#fef2f2", color: "#dc2626" };
    default:
      return { background: "#fff7ed", color: "#ea580c" };
  }
}

export default function TransfersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTransfers = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await getTransfers();
      setTransfers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load transfers");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransfers();
  }, [loadTransfers]);

  async function handleDelete(transfer: Transfer) {
    if (
      !confirm(
        `Delete transfer of ${formatCurrency(transfer.amount)} to ${transfer.recipientName}?`
      )
    ) {
      return;
    }

    try {
      await deleteTransfer(transfer.id);
      await loadTransfers();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete transfer");
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1C2541" }}>
            Transfers
          </h1>
          <p className="text-sm text-gray-400">Track all client transfers.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-xl px-5 py-2 text-white font-semibold"
          style={{
            background: "linear-gradient(135deg,#a67c3e,#c49a4f)",
          }}
        >
          + New Transfer
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-2xl border bg-white overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading transfers...
          </div>
        ) : transfers.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No transfers yet. Create your first transfer to get started.
          </div>
        ) : (
          <table className="w-full">
            <thead style={{ background: "#faf8f5" }}>
              <tr className="text-left text-gray-500">
                <th className="px-5 py-4">Client</th>
                <th className="px-5 py-4">Recipient</th>
                <th className="px-5 py-4">Bank</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((transfer) => (
                <tr key={transfer.id} className="border-t">
                  <td className="px-5 py-4">
                    {transfer.client?.name ?? "—"}
                  </td>
                  <td className="px-5 py-4">{transfer.recipientName}</td>
                  <td className="px-5 py-4">{transfer.recipientBank}</td>
                  <td className="px-5 py-4 font-bold">
                    {formatCurrency(transfer.amount)}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="rounded-full px-3 py-1 text-xs"
                      style={statusStyles(transfer.status)}
                    >
                      {formatTransferStatus(transfer.status)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/dashboard/transfers/${transfer.id}`}
                        className="text-sm font-medium"
                        style={{ color: "#a67c3e" }}
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(transfer)}
                        className="text-sm font-medium text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <AddTransfersPage
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadTransfers}
      />
    </div>
  );
}
