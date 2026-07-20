"use client";

import { formatCurrency } from "@/src/lib/api";
import {
  getStoredAuth,
  getUserInitials,
  updateStoredUser,
} from "@/src/lib/auth";
import { getClientBalance } from "@/src/lib/dashboard";
import { getClient, updateClient } from "@/src/lib/clients";
import { getDeposits } from "@/src/lib/deposits";
import { getTransfers } from "@/src/lib/transfers";
import { FormEvent, useEffect, useState } from "react";

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [joinedDate, setJoinedDate] = useState("");
  const [stats, setStats] = useState({
    availableBalance: 0,
    totalDeposits: 0,
    totalTransfers: 0,
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    async function loadProfile() {
      setIsLoading(true);
      setError("");

      const auth = getStoredAuth();
      if (!auth) {
        setError("Please log in to view your profile.");
        setIsLoading(false);
        return;
      }

      try {
        const [client, deposits, transfers] = await Promise.all([
          getClient(auth.user.id),
          getDeposits(),
          getTransfers(),
        ]);

        const myDeposits = deposits.filter(
          (deposit) => deposit.clientId === auth.user.id
        );
        const myTransfers = transfers.filter(
          (transfer) => transfer.clientId === auth.user.id
        );
        const balance = getClientBalance(myDeposits, myTransfers);

        setFormData({
          name: client.name,
          email: client.email,
          phone: client.phone,
        });
        setJoinedDate(new Date(client.createdAt).toLocaleDateString());
        setStats(balance);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSaving(true);

    const auth = getStoredAuth();
    if (!auth) {
      setError("Please log in to update your profile.");
      setIsSaving(false);
      return;
    }

    try {
      const updated = await updateClient(auth.user.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });

      updateStoredUser({
        name: updated.name,
        email: updated.email,
      });

      setFormData({
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
      });
      setEditing(false);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f6fa" }}>
      <div
        className="relative h-52 w-full overflow-x-auto"
        style={{
          background:
            "linear-gradient(135deg, #1C2541 0%, #2a3a6b 50%, #1C2541 100%)",
        }}
      >
        <div className="relative z-10 flex h-full items-start justify-between px-8 pt-8">
          <div>
            <h1 className="text-2xl font-bold text-white">My Profile</h1>
            <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
              Manage your account information
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-16">
        <div className="relative -mt-16 mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <div
              className="flex h-28 w-28 items-center justify-center rounded-2xl text-3xl font-extrabold text-white"
              style={{
                background: "linear-gradient(135deg, #a67c3e, #c49a4f)",
                boxShadow: "0 8px 32px rgba(28,37,65,0.25)",
              }}
            >
              {getUserInitials(formData.name || "User")}
            </div>
            <div className="pb-1">
              <h2 className="text-2xl font-bold" style={{ color: "#1C2541" }}>
                {formData.name}
              </h2>
              <p className="text-sm" style={{ color: "#6b7280" }}>
                {formData.email}
              </p>
              {joinedDate && (
                <p className="mt-1 text-xs" style={{ color: "#6b7280" }}>
                  Joined {joinedDate}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              setEditing(!editing);
              setSuccess("");
              setError("");
            }}
            className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow transition-all hover:opacity-90"
            style={{ backgroundColor: "#1C2541" }}
          >
            {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Available Balance</p>
            <p className="text-xl font-bold" style={{ color: "#a67c3e" }}>
              {formatCurrency(stats.availableBalance)}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Deposits</p>
            <p className="text-xl font-bold" style={{ color: "#059669" }}>
              {formatCurrency(stats.totalDeposits)}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Transfers</p>
            <p className="text-xl font-bold" style={{ color: "#dc2626" }}>
              {formatCurrency(stats.totalTransfers)}
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="mb-5 font-bold" style={{ color: "#1C2541" }}>
            Personal Information
          </h3>

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {[
              { label: "Full Name", key: "name" as const },
              { label: "Email Address", key: "email" as const },
              { label: "Phone Number", key: "phone" as const },
            ].map(({ label, key }) => (
              <div key={key}>
                <label
                  className="mb-1 block text-xs font-medium uppercase tracking-wider"
                  style={{ color: "#9ca3af" }}
                >
                  {label}
                </label>
                {editing ? (
                  <input
                    type={key === "email" ? "email" : "text"}
                    value={formData[key]}
                    onChange={(event) =>
                      setFormData((prev) => ({
                        ...prev,
                        [key]: event.target.value,
                      }))
                    }
                    required
                    disabled={isSaving}
                    className="w-full rounded-lg border px-3 py-2 text-sm outline-none"
                    style={{ borderColor: "#e5e7eb", color: "#1C2541" }}
                  />
                ) : (
                  <p className="text-sm font-medium" style={{ color: "#1C2541" }}>
                    {formData[key]}
                  </p>
                )}
              </div>
            ))}

            {editing && (
              <button
                type="submit"
                disabled={isSaving}
                className="mt-2 w-full rounded-xl py-2.5 text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: "#a67c3e" }}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
