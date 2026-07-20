"use client";

import { formatCurrency } from "@/src/lib/api";
import { getStoredAuth } from "@/src/lib/auth";
import {
  formatTransferStatus,
  getTransfers,
} from "@/src/lib/transfers";
import type { Transfer } from "@/src/types/transfer";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

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

export default function ClientTransfersPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTransfers = useCallback(async () => {
    setIsLoading(true);
    setError("");

    const auth = getStoredAuth();
    if (!auth) {
      setError("Please log in to view your transfers.");
      setIsLoading(false);
      return;
    }

    try {
      const data = await getTransfers();
      setTransfers(data.filter((transfer) => transfer.clientId === auth.user.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load transfers");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransfers();
  }, [loadTransfers]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#1C2541" }}>
          My Transfers
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          View transfers made on your behalf.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div
        className="overflow-x-auto rounded-2xl border bg-white shadow-sm"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      >
        {isLoading ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading transfers...
          </div>
        ) : transfers.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No transfers found for your account yet.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr
                className="text-left text-sm"
                style={{ background: "#faf8f5", color: "#6b7280" }}
              >
                <th className="px-5 py-4">Recipient</th>
                <th className="px-5 py-4">Bank</th>
                <th className="px-5 py-4">Account</th>
                <th className="px-5 py-4 text-right">Amount</th>
                <th className="px-5 py-4 text-center">Status</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {transfers.map((transfer) => (
                <tr
                  key={transfer.id}
                  className="border-t transition hover:bg-[#faf8f5]"
                  style={{ borderColor: "rgba(0,0,0,0.05)" }}
                >
                  <td className="px-5 py-4 font-semibold" style={{ color: "#1C2541" }}>
                    {transfer.recipientName}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {transfer.recipientBank}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {transfer.recipientAccount}
                  </td>
                  <td
                    className="px-5 py-4 text-right font-bold"
                    style={{ color: "#a67c3e" }}
                  >
                    {formatCurrency(transfer.amount)}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span
                      className="rounded-full px-3 py-1 text-xs"
                      style={statusStyles(transfer.status)}
                    >
                      {formatTransferStatus(transfer.status)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {new Date(transfer.date).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Link
                      href={`/client/transfers/${transfer.id}`}
                      className="inline-flex rounded-xl px-4 py-2 text-xs font-semibold text-white transition hover:opacity-90"
                      style={{ background: "#1C2541" }}
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
