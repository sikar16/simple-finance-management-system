"use client";

import { formatCurrency } from "@/src/lib/api";
import { deleteDeposit, getDeposits } from "@/src/lib/deposits";
import type { Deposit } from "@/src/types/deposit";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import AddDepositPage from "./new/page";

export default function DepositsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDeposits = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await getDeposits();
      setDeposits(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load deposits");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDeposits();
  }, [loadDeposits]);

  async function handleDelete(deposit: Deposit) {
    if (
      !confirm(
        `Delete deposit of ${formatCurrency(deposit.amount)} from ${deposit.client?.name ?? "client"}?`
      )
    ) {
      return;
    }

    try {
      await deleteDeposit(deposit.id);
      await loadDeposits();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete deposit");
    }
  }

  return (
    <div
      className="p-6"
      style={{ backgroundColor: "#f8f7f4", minHeight: "100vh" }}
    >
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1C2541" }}>
            Deposits
          </h1>
          <p className="text-sm" style={{ color: "#4a4a4a" }}>
            Manage money received from clients.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-xl px-5 py-2 text-white font-semibold transition hover:opacity-90 hover:shadow-lg"
          style={{
            background: "linear-gradient(135deg, #a67c3e, #c49a4f)",
          }}
        >
          + Add Deposit
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div
        className="rounded-2xl border bg-white overflow-x-auto shadow-sm transition hover:shadow-md"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      >
        {isLoading ? (
          <div className="p-8 text-center text-sm" style={{ color: "#4a4a4a" }}>
            Loading deposits...
          </div>
        ) : deposits.length === 0 ? (
          <div className="p-8 text-center text-sm" style={{ color: "#4a4a4a" }}>
            <p>No deposits recorded yet.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 text-sm font-medium transition hover:opacity-70"
              style={{ color: "#a67c3e" }}
            >
              Add your first deposit
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead style={{ background: "#faf8f5" }}>
              <tr className="text-left text-sm" style={{ color: "#4a4a4a" }}>
                <th className="px-5 py-4 font-medium">Client</th>
                <th className="px-5 py-4 font-medium">Bank</th>
                <th className="px-5 py-4 font-medium">Amount</th>
                <th className="px-5 py-4 font-medium">Reference</th>
                <th className="px-5 py-4 font-medium">Date</th>
                <th className="px-5 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((deposit) => (
                <tr
                  key={deposit.id}
                  className="border-t transition hover:bg-gray-50"
                  style={{ borderColor: "rgba(0,0,0,0.06)" }}
                >
                  <td
                    className="px-5 py-4 font-medium"
                    style={{ color: "#1C2541" }}
                  >
                    {deposit.client?.name ?? "—"}
                  </td>
                  <td className="px-5 py-4" style={{ color: "#4a4a4a" }}>
                    {deposit.bankAccount?.bankName ?? "—"}
                  </td>
                  <td
                    className="px-5 py-4 font-bold"
                    style={{ color: "#059669" }}
                  >
                    {formatCurrency(deposit.amount)}
                  </td>
                  <td className="px-5 py-4">
                    {deposit.referenceNumber ? (
                      <span
                        className="rounded-full px-3 py-1 text-xs font-medium"
                        style={{
                          backgroundColor: "rgba(28, 37, 65, 0.08)",
                          color: "#1C2541",
                        }}
                      >
                        {deposit.referenceNumber}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-5 py-4" style={{ color: "#4a4a4a" }}>
                    {new Date(deposit.date).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/dashboard/deposits/${deposit.id}`}
                        className="text-sm font-medium"
                        style={{ color: "#a67c3e" }}
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(deposit)}
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

      <AddDepositPage
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadDeposits}
      />
    </div>
  );
}
