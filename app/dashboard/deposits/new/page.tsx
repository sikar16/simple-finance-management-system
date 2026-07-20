"use client";

import { getBankAccounts } from "@/src/lib/bank-accounts";
import { getClients } from "@/src/lib/clients";
import { createDeposit } from "@/src/lib/deposits";
import type { BankAccount } from "@/src/types/bank-account";
import type { Client } from "@/src/types/client";
import { ReceiptUpload } from "@/components/receipt-upload";
import { FormEvent, useEffect, useState } from "react";

type AddDepositPageProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function AddDepositPage({
  isOpen,
  onClose,
  onSuccess,
}: AddDepositPageProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [clientId, setClientId] = useState("");
  const [bankAccountId, setBankAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [note, setNote] = useState("");
  const [receipt, setReceipt] = useState<string | undefined>();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    async function loadOptions() {
      try {
        const [clientsData, accountsData] = await Promise.all([
          getClients(),
          getBankAccounts(),
        ]);
        setClients(clientsData);
        setBankAccounts(accountsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load form options"
        );
      }
    }

    loadOptions();
  }, [isOpen]);

  if (!isOpen) return null;

  function resetForm() {
    setClientId("");
    setBankAccountId("");
    setAmount("");
    setReferenceNumber("");
    setNote("");
    setReceipt(undefined);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await createDeposit({
        clientId,
        bankAccountId,
        amount: parseFloat(amount),
        referenceNumber: referenceNumber || undefined,
        note: note || undefined,
        receipt,
      });
      resetForm();
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create deposit");
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
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
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
            Add Deposit
          </h2>
          <p className="text-sm" style={{ color: "#4a4a4a" }}>
            Record money received from a client
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#1C2541" }}>
              Select Client *
            </label>
            <select
              value={clientId}
              onChange={(event) => setClientId(event.target.value)}
              required
              disabled={isLoading}
              className="w-full rounded-xl border px-4 py-3"
              style={{ borderColor: "#d0cec9" }}
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#1C2541" }}>
              Bank Account *
            </label>
            <select
              value={bankAccountId}
              onChange={(event) => setBankAccountId(event.target.value)}
              required
              disabled={isLoading}
              className="w-full rounded-xl border px-4 py-3"
              style={{ borderColor: "#d0cec9" }}
            >
              <option value="">Select Bank Account</option>
              {bankAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.bankName} — {account.accountNumber}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#1C2541" }}>
              Amount (ETB) *
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              required
              disabled={isLoading}
              placeholder="e.g. 50000"
              className="w-full rounded-xl border px-4 py-3"
              style={{ borderColor: "#d0cec9" }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#1C2541" }}>
              Reference Number
            </label>
            <input
              value={referenceNumber}
              onChange={(event) => setReferenceNumber(event.target.value)}
              disabled={isLoading}
              placeholder="e.g. REF-2026-001"
              className="w-full rounded-xl border px-4 py-3"
              style={{ borderColor: "#d0cec9" }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#1C2541" }}>
              Note
            </label>
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={3}
              disabled={isLoading}
              placeholder="Add any additional notes..."
              className="w-full rounded-xl border px-4 py-3 resize-none"
              style={{ borderColor: "#d0cec9" }}
            />
          </div>

          <ReceiptUpload
            value={receipt}
            onChange={setReceipt}
            disabled={isLoading}
          />

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
              style={{ background: "#1C2541" }}
            >
              {isLoading ? "Saving..." : "Save Deposit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
