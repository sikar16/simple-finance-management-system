"use client";

import { formatCurrency } from "@/src/lib/api";
import { getStoredAuth } from "@/src/lib/auth";
import { getDeposits } from "@/src/lib/deposits";
import type { Deposit } from "@/src/types/deposit";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function ClientDepositsPage() {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDeposits = useCallback(async () => {
    setIsLoading(true);
    setError("");

    const auth = getStoredAuth();
    if (!auth) {
      setError("Please log in to view your deposits.");
      setIsLoading(false);
      return;
    }

    try {
      const data = await getDeposits();
      setDeposits(data.filter((deposit) => deposit.clientId === auth.user.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load deposits");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDeposits();
  }, [loadDeposits]);

  const totalDeposited = deposits.reduce(
    (sum, deposit) =>
      sum +
      (typeof deposit.amount === "string"
        ? parseFloat(deposit.amount)
        : deposit.amount),
    0
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: "#1C2541" }}>
          My Deposits
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          View deposits recorded on your account.
        </p>
      </div>

      {!isLoading && deposits.length > 0 && (
        <div
          className="mb-6 rounded-2xl border bg-white p-5 shadow-sm"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <p className="text-sm text-gray-500">Total Deposited</p>
          <p className="text-2xl font-bold" style={{ color: "#059669" }}>
            {formatCurrency(totalDeposited)}
          </p>
        </div>
      )}

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
            Loading deposits...
          </div>
        ) : deposits.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No deposits found for your account yet.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr
                className="text-left text-sm"
                style={{ background: "#faf8f5", color: "#6b7280" }}
              >
                <th className="px-5 py-4">Bank</th>
                <th className="px-5 py-4 text-right">Amount</th>
                <th className="px-5 py-4">Reference</th>
                <th className="px-5 py-4">Note</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((deposit) => (
                <tr
                  key={deposit.id}
                  className="border-t transition hover:bg-[#faf8f5]"
                  style={{ borderColor: "rgba(0,0,0,0.05)" }}
                >
                  <td className="px-5 py-4 font-semibold" style={{ color: "#1C2541" }}>
                    {deposit.bankAccount?.bankName ?? "—"}
                  </td>
                  <td
                    className="px-5 py-4 text-right font-bold"
                    style={{ color: "#059669" }}
                  >
                    {formatCurrency(deposit.amount)}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {deposit.referenceNumber ?? "—"}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {deposit.note ?? "—"}
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-600">
                    {new Date(deposit.date).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Link
                      href={`/client/deposits/${deposit.id}`}
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
