"use client";

import { updateBankAccount } from "@/src/lib/bank-accounts";
import type { BankAccount } from "@/src/types/bank-account";
import { FormEvent, useEffect, useState } from "react";

type EditBankAccountProps = {
  account: BankAccount | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function EditBankAccount({
  account,
  isOpen,
  onClose,
  onSuccess,
}: EditBankAccountProps) {
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [currency, setCurrency] = useState("ETB");
  const [balance, setBalance] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (account) {
      setBankName(account.bankName);
      setAccountName(account.accountName);
      setAccountNumber(account.accountNumber);
      setCurrency(account.currency);
      setBalance(String(account.balance));
      setError("");
    }
  }, [account]);

  if (!isOpen || !account) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await updateBankAccount(account!.id, {
        bankName,
        accountName,
        accountNumber,
        currency,
        balance: parseFloat(balance) || 0,
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update bank account"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(28, 37, 65, 0.5)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        style={{ borderTop: "4px solid #a67c3e" }}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-100 transition-colors"
          style={{ color: "#4a4a4a" }}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold" style={{ color: "#1C2541" }}>
            Edit Bank Account
          </h2>
          <p className="text-sm" style={{ color: "#4a4a4a" }}>
            Update account details
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#1C2541" }}>
              Bank Name *
            </label>
            <input
              value={bankName}
              onChange={(event) => setBankName(event.target.value)}
              required
              disabled={isLoading}
              className="w-full rounded-xl border px-4 py-3"
              style={{ borderColor: "#d0cec9" }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#1C2541" }}>
              Account Name *
            </label>
            <input
              value={accountName}
              onChange={(event) => setAccountName(event.target.value)}
              required
              disabled={isLoading}
              className="w-full rounded-xl border px-4 py-3"
              style={{ borderColor: "#d0cec9" }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#1C2541" }}>
              Account Number *
            </label>
            <input
              value={accountNumber}
              onChange={(event) => setAccountNumber(event.target.value)}
              required
              disabled={isLoading}
              className="w-full rounded-xl border px-4 py-3"
              style={{ borderColor: "#d0cec9" }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#1C2541" }}>
              Currency
            </label>
            <select
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              disabled={isLoading}
              className="w-full rounded-xl border px-4 py-3"
              style={{ borderColor: "#d0cec9" }}
            >
              <option value="ETB">ETB</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#1C2541" }}>
              Balance
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={balance}
              onChange={(event) => setBalance(event.target.value)}
              disabled={isLoading}
              className="w-full rounded-xl border px-4 py-3"
              style={{ borderColor: "#d0cec9" }}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-xl border px-6 py-3 font-medium"
              style={{ borderColor: "#d0cec9", color: "#4a4a4a" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-xl px-6 py-3 font-medium text-white disabled:opacity-50"
              style={{ backgroundColor: "#1C2541" }}
            >
              {isLoading ? "Saving..." : "Update Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
