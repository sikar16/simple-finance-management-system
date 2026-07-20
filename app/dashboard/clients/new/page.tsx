"use client";

import { createClient } from "@/src/lib/clients";
import { FormEvent, useState } from "react";

type AddClientModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function AddClientPage({
  isOpen,
  onClose,
  onSuccess,
}: AddClientModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  function resetForm() {
    setName("");
    setPhone("");
    setEmail("");
    setPassword("");
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await createClient({ name, phone, email, password });
      resetForm();
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create client");
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
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div
              className="rounded-full p-2"
              style={{ backgroundColor: "rgba(28, 37, 65, 0.08)" }}
            >
              <svg
                className="h-6 w-6"
                style={{ color: "#1C2541" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold" style={{ color: "#1C2541" }}>
                Add New Client
              </h2>
              <p className="text-sm" style={{ color: "#4a4a4a" }}>
                Register a new client to the system
              </p>
            </div>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div
              className="rounded-xl border px-4 py-3 text-sm"
              style={{
                borderColor: "#fecaca",
                backgroundColor: "#fef2f2",
                color: "#b91c1c",
              }}
            >
              {error}
            </div>
          )}

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#1C2541" }}
            >
              Full Name
            </label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. John Doe"
              required
              disabled={isLoading}
              className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-offset-0 transition"
              style={{ borderColor: "#d0cec9" }}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#1C2541" }}
            >
              Phone Number
            </label>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="e.g. +251 912 345 678"
              required
              disabled={isLoading}
              className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-offset-0 transition"
              style={{ borderColor: "#d0cec9" }}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#1C2541" }}
            >
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="e.g. john@example.com"
              required
              disabled={isLoading}
              className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-offset-0 transition"
              style={{ borderColor: "#d0cec9" }}
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: "#1C2541" }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Create a secure password"
              required
              minLength={6}
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
              className="flex-1 rounded-xl px-6 py-3 font-medium text-white transition hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #a67c3e, #c49a4f)",
              }}
            >
              {isLoading ? "Saving..." : "Save Client"}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
