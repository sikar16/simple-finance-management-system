"use client";

import { formatCurrency } from "@/src/lib/api";
import {
  deleteBankAccount,
  getBankAccounts,
} from "@/src/lib/bank-accounts";
import type { BankAccount } from "@/src/types/bank-account";
import { useCallback, useEffect, useState } from "react";
import EditBankAccount from "./edit/page";
import AddBankAccount from "./new/page";

export default function BankAccountsPage() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAccounts = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await getBankAccounts();
      setAccounts(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load bank accounts"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  async function handleDelete(account: BankAccount) {
    if (
      !confirm(
        `Delete "${account.accountName}" at ${account.bankName}? This cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteBankAccount(account.id);
      await loadAccounts();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete account");
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1C2541" }}>
            Bank Accounts
          </h1>
          <p className="text-sm" style={{ color: "#4a4a4a" }}>
            Manage your receiving bank accounts.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="rounded-xl px-5 py-2 text-white font-semibold transition hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #a67c3e, #c49a4f)",
          }}
        >
          + Add Account
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="py-12 text-center text-sm" style={{ color: "#4a4a4a" }}>
          Loading bank accounts...
        </div>
      ) : accounts.length === 0 ? (
        <div className="py-12 text-center text-sm" style={{ color: "#4a4a4a" }}>
          No bank accounts yet. Add your first account to get started.
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md"
              style={{ borderColor: "rgba(0,0,0,0.06)" }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="font-bold" style={{ color: "#1C2541" }}>
                    {account.bankName}
                  </h2>
                  <p className="text-sm" style={{ color: "#4a4a4a" }}>
                    {account.accountName}
                  </p>
                </div>
                <div
                  className="rounded-xl p-3"
                  style={{ backgroundColor: "rgba(28, 37, 65, 0.06)" }}
                >
                  🏦
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <div>
                  <p
                    className="text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#4a4a4a" }}
                  >
                    Account Number
                  </p>
                  <p className="font-semibold" style={{ color: "#1C2541" }}>
                    {account.accountNumber}
                  </p>
                </div>

                <div>
                  <p
                    className="text-xs font-medium uppercase tracking-wider"
                    style={{ color: "#4a4a4a" }}
                  >
                    Current Balance
                  </p>
                  <p className="text-xl font-bold" style={{ color: "#a67c3e" }}>
                    {formatCurrency(account.balance, account.currency)}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setEditingAccount(account)}
                  className="text-sm font-medium transition hover:opacity-70"
                  style={{ color: "#a67c3e" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(account)}
                  className="text-sm font-medium text-red-600 transition hover:opacity-70"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddBankAccount
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={loadAccounts}
      />

      <EditBankAccount
        account={editingAccount}
        isOpen={Boolean(editingAccount)}
        onClose={() => setEditingAccount(null)}
        onSuccess={loadAccounts}
      />
    </div>
  );
}
