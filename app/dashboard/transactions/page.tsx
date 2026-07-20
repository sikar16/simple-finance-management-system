"use client";

import { formatCurrency } from "@/src/lib/api";
import {
  formatTransactionType,
  getTransactions,
} from "@/src/lib/transactions";
import type { Transaction } from "@/src/types/transaction";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTransactions = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await getTransactions();
      setTransactions(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load transactions"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-1" style={{ color: "#1C2541" }}>
        Transactions
      </h1>
      <p className="text-sm text-gray-400 mb-6">Complete financial history.</p>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="rounded-2xl border bg-white overflow-x-auto">
        {isLoading ? (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading transactions...
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center text-sm text-gray-500">
            No transactions recorded yet.
          </div>
        ) : (
          <table className="w-full">
            <thead style={{ background: "#faf8f5" }}>
              <tr className="text-left text-gray-500">
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Client</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Balance After</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-t">
                  <td className="px-5 py-4">
                    <span
                      className="rounded-full px-3 py-1 text-xs"
                      style={
                        transaction.type === "DEPOSIT"
                          ? { background: "#ecfdf5", color: "#059669" }
                          : { background: "#fee2e2", color: "#dc2626" }
                      }
                    >
                      {formatTransactionType(transaction.type)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    {transaction.client?.name ?? "—"}
                  </td>
                  <td
                    className="px-5 py-4 font-bold"
                    style={{
                      color:
                        transaction.type === "DEPOSIT" ? "#059669" : "#dc2626",
                    }}
                  >
                    {transaction.type === "DEPOSIT" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-5 py-4">
                    {formatCurrency(transaction.balanceAfter)}
                  </td>
                  <td className="px-5 py-4 text-gray-500">
                    {new Date(transaction.createdAt).toLocaleString()}
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      href={`/dashboard/transactions/${transaction.id}`}
                      className="text-sm font-medium"
                      style={{ color: "#a67c3e" }}
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
