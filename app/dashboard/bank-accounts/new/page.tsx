"use client";

import { createBankAccount } from "@/src/lib/bank-accounts";
import { FormEvent, useState } from "react";

type AddBankAccountProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function AddBankAccount({
  isOpen,
  onClose,
  onSuccess,
}: AddBankAccountProps) {
  const [bankName, setBankName] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [currency, setCurrency] = useState("ETB");
  const [balance, setBalance] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  function resetForm() {
    setBankName("");
    setAccountName("");
    setAccountNumber("");
    setCurrency("ETB");
    setBalance("");
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await createBankAccount({
        bankName,
        accountName,
        accountNumber,
        currency,
        balance: balance ? parseFloat(balance) : 0,
      });
      resetForm();
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create bank account"
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
        style={{
          borderTop: "4px solid #a67c3e",
          animation: "slideIn 0.3s ease-out",
        }}
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
          <div className="flex items-center gap-3">
            <div
              className="rounded-full p-2"
              style={{ backgroundColor: "rgba(28, 37, 65, 0.08)" }}
            >
              <svg className="h-6 w-6" style={{ color: "#1C2541" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "#1C2541" }}>
                Add Bank Account
              </h2>
              <p className="text-sm" style={{ color: "#4a4a4a" }}>
                Add a receiving bank account
              </p>
            </div>
          </div>
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
              placeholder="e.g. Commercial Bank of Ethiopia"
              required
              disabled={isLoading}
              className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-offset-0 transition"
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
              placeholder="e.g. Amanet Main Account"
              required
              disabled={isLoading}
              className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-offset-0 transition"
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
              placeholder="e.g. 1000123456"
              required
              disabled={isLoading}
              className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-offset-0 transition"
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
              className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-offset-0 transition"
              style={{ borderColor: "#d0cec9" }}
            >
              <option value="ETB">ETB - Ethiopian Birr</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#1C2541" }}>
              Opening Balance
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={balance}
              onChange={(event) => setBalance(event.target.value)}
              placeholder="0"
              disabled={isLoading}
              className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-offset-0 transition"
              style={{ borderColor: "#d0cec9" }}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-xl border px-6 py-3 font-medium transition hover:bg-gray-50"
              style={{ borderColor: "#d0cec9", color: "#4a4a4a" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 rounded-xl px-6 py-3 font-medium text-white transition hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: "#1C2541" }}
            >
              {isLoading ? "Saving..." : "Save Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
