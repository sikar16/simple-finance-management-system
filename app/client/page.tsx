"use client";
import { formatCurrency } from "@/src/lib/api";
import { getStoredAuth } from "@/src/lib/auth";
import {
  buildRecentTransactions,
} from "@/src/lib/dashboard";
import { getDeposits } from "@/src/lib/deposits";
import { getBankAccountBreakdowns, getBankAccounts } from "@/src/lib/bank-accounts";
import { getTransfers } from "@/src/lib/transfers";
import type { DashboardTransaction } from "@/src/lib/dashboard";
import type { BankAccountBreakdown } from "@/src/lib/bank-accounts";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ClientDashboardPage() {
  const [userName, setUserName] = useState("there");
  const [availableBalance, setAvailableBalance] = useState(0);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [totalTransfers, setTotalTransfers] = useState(0);
  const [transactions, setTransactions] = useState<DashboardTransaction[]>([]);
  const [bankAccountBreakdowns, setBankAccountBreakdowns] = useState<BankAccountBreakdown[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const auth = getStoredAuth();

  useEffect(() => {
    if (!auth) {
      setError("Please log in to view your dashboard.");
      setIsLoading(false);
      return;
    }
    setUserName(auth.user.name.split(" ")[0]);

    async function loadDashboard() {
      setIsLoading(true);
      setError("");

      try {
        const [deposits, transfers, bankAccounts] = await Promise.all([
          getDeposits(),
          getTransfers(),
          getBankAccounts(),
        ]);

        const myDeposits = deposits.filter(
          (deposit) => deposit.clientId === auth?.user.id
        );
        const myTransfers = transfers.filter(
          (transfer) => transfer.clientId === auth?.user.id
        );

        const bankBreakdowns = getBankAccountBreakdowns(bankAccounts, myDeposits, myTransfers);

        // Calculate totals from bank account breakdowns instead of client balance
        const totalAvailableBalance = bankBreakdowns.reduce((sum, b) => sum + b.availableBalance, 0);
        const totalDepositsSum = bankBreakdowns.reduce((sum, b) => sum + b.totalDeposits, 0);
        const totalTransfersSum = bankBreakdowns.reduce((sum, b) => sum + b.totalTransfers, 0);

        setAvailableBalance(totalAvailableBalance);
        setTotalDeposits(totalDepositsSum);
        setTotalTransfers(totalTransfersSum);
        setTransactions(buildRecentTransactions(myDeposits, myTransfers));
        setBankAccountBreakdowns(bankBreakdowns);
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

  const summary: Array<{
    title: string;
    value: string;
    icon: string;
    breakdowns: Array<{ label: string; value: string }>;
  }> = [
      {
        title: "Available Balance",
        value: formatCurrency(availableBalance),
        icon: "💰",
        breakdowns: bankAccountBreakdowns.map(b => ({
          label: `${b.bankName} - ${b.accountName}`,
          value: formatCurrency(b.availableBalance)
        }))
      },
      {
        title: "Total Deposits",
        value: formatCurrency(totalDeposits),
        icon: "📥",
        breakdowns: bankAccountBreakdowns.map(b => ({
          label: `${b.bankName} - ${b.accountName}`,
          value: formatCurrency(b.totalDeposits)
        }))
      },
      {
        title: "Total Transfers",
        value: formatCurrency(totalTransfers),
        icon: "🔄",
        breakdowns: bankAccountBreakdowns.map(b => ({
          label: `${b.bankName} - ${b.accountName}`,
          value: formatCurrency(b.totalTransfers)
        }))
      },
    ];

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1C2541" }}>
            Welcome, {userName}
          </h1>
          <p className="mt-1 text-sm text-gray-400">
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
            className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
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

            {!isLoading && item.breakdowns && item.breakdowns.length > 0 && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                <p className="text-xs text-gray-400 mb-2">By Bank Account:</p>
                <div className="space-y-1">
                  {item.breakdowns.map((breakdown, idx) => (
                    <div key={idx} className="flex justify-between text-xs">
                      <span className="text-gray-500">{breakdown.label}</span>
                      <span className="font-medium" style={{ color: "#1C2541" }}>{breakdown.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!isLoading && (!item.breakdowns || item.breakdowns.length === 0) && (
              <div className="mt-4 pt-4 border-t" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                <p className="text-xs text-gray-400">No bank accounts configured</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        className="mt-8 rounded-2xl border bg-white overflow-x-auto shadow-sm"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      >
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
          <h2 className="font-bold" style={{ color: "#1C2541" }}>
            Recent Activity
          </h2>
          <div className="flex gap-4 text-sm">
            <Link href="/client/deposits" className="font-medium transition hover:opacity-70" style={{ color: "#a67c3e" }}>
              Deposits
            </Link>
            <Link href="/client/transfers" className="font-medium transition hover:opacity-70" style={{ color: "#a67c3e" }}>
              Transfers
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="px-5 pb-8 text-sm text-gray-500">
            Loading activity...
          </div>
        ) : transactions.length === 0 ? (
          <div className="px-5 pb-8 text-sm text-gray-500">
            No activity yet. Your deposits and transfers will appear here.
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
                <tr key={item.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                  <td className="px-5 py-4">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-semibold"
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
