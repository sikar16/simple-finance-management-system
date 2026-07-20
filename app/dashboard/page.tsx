"use client";

import { formatCurrency } from "@/src/lib/api";
import { getStoredAuth } from "@/src/lib/auth";
import { getClientTotals, getClients } from "@/src/lib/clients";
import { buildRecentTransactions } from "@/src/lib/dashboard";
import { getDeposits } from "@/src/lib/deposits";
import { getTransfers } from "@/src/lib/transfers";
import type { DashboardTransaction } from "@/src/lib/dashboard";
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
  const [userName, setUserName] = useState("Admin");
  const [availableBalance, setAvailableBalance] = useState(0);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [totalTransfers, setTotalTransfers] = useState(0);
  const [transactions, setTransactions] = useState<DashboardTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const auth = getStoredAuth();
    if (auth?.user.name) {
      setUserName(auth.user.name.split(" ")[0]);
    }

    async function loadDashboard() {
      setIsLoading(true);
      setError("");

      try {
        const [clients, deposits, transfers] = await Promise.all([
          getClients(),
          getDeposits(),
          getTransfers(),
        ]);

        const totals = getClientTotals(clients);
        setAvailableBalance(totals.availableBalance);
        setTotalDeposits(totals.totalDeposits);
        setTotalTransfers(totals.totalTransfers);
        setTransactions(buildRecentTransactions(deposits, transfers));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load dashboard"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const summary = [
    {
      title: "Available Balance",
      value: formatCurrency(availableBalance),
      icon: "💰",
    },
    {
      title: "Total Deposits",
      value: formatCurrency(totalDeposits),
      icon: "📥",
    },
    {
      title: "Total Transfers",
      value: formatCurrency(totalTransfers),
      icon: "🔄",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1C2541" }}>
            Welcome, {userName}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Here is your account overview.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-3">
        {summary.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border bg-white p-5 shadow-sm"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-gray-400">{item.title}</p>
                <h2
                  className="mt-3 text-xl font-bold"
                  style={{ color: "#1C2541" }}
                >
                  {isLoading ? "..." : item.value}
                </h2>
              </div>
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{ background: "#f8f1e8" }}
              >
                {item.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-8 rounded-2xl border bg-white overflow-x-auto shadow-sm"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      >
        <div className="p-5">
          <h2 className="font-bold" style={{ color: "#1C2541" }}>
            Recent Transactions
          </h2>
        </div>

        {isLoading ? (
          <div className="px-5 pb-8 text-sm text-gray-500">
            Loading transactions...
          </div>
        ) : transactions.length === 0 ? (
          <div className="px-5 pb-8 text-sm text-gray-500">
            No transactions recorded yet.
          </div>
        ) : (
          <table className="w-full">
            <thead style={{ background: "#faf8f5" }}>
              <tr className="text-left text-sm text-gray-500">
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Description</th>
                <th className="px-5 py-4">Amount</th>
                <th className="px-5 py-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="px-5 py-4">
                    <span
                      className="rounded-full px-3 py-1 text-xs"
                      style={
                        item.type === "Deposit"
                          ? { background: "#ecfdf5", color: "#059669" }
                          : { background: "#fee2e2", color: "#dc2626" }
                      }
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="px-5 py-4">{item.description}</td>
                  <td
                    className="px-5 py-4 font-bold"
                    style={{
                      color: item.type === "Deposit" ? "#059669" : "#dc2626",
                    }}
                  >
                    {item.type === "Deposit" ? "+" : "-"}
                    {formatCurrency(item.amount)}
                  </td>
                  <td className="px-5 py-4 text-gray-400">
                    {new Date(item.date).toLocaleDateString()}
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
