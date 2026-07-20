"use client";

import { formatCurrency } from "@/src/lib/api";
import {
  deleteClient,
  getClientTotals,
  getClients,
} from "@/src/lib/clients";
import type { Client } from "@/src/types/client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import AddClientPage from "./new/page";

export default function ClientPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadClients = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await getClients();
      setClients(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load clients");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete client "${name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await deleteClient(id);
      await loadClients();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete client");
    }
  }

  const totals = getClientTotals(clients);

  const cards = [
    {
      title: "Total Clients",
      value: totals.totalClients.toString(),
      icon: "👥",
      description: "Registered clients",
    },
    {
      title: "Total Deposits",
      value: formatCurrency(totals.totalDeposits),
      icon: "💰",
      description: "Money received",
    },
    {
      title: "Total Transfers",
      value: formatCurrency(totals.totalTransfers),
      icon: "🔄",
      description: "Money transferred",
    },
    {
      title: "Available Balance",
      value: formatCurrency(totals.availableBalance),
      icon: "🏦",
      description: "Remaining amount",
    },
  ];

  return (
    <div
      className="p-6"
      style={{ backgroundColor: "#f8f7f4", minHeight: "100vh" }}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "#1C2541" }}>
            Clients
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#4a4a4a" }}>
            Manage registered clients and view summary stats.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-xl px-5 py-2 text-white font-semibold transition hover:opacity-90 hover:shadow-lg"
          style={{
            background: "linear-gradient(135deg, #a67c3e, #c49a4f)",
          }}
        >
          + Add Client
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md"
            style={{ borderColor: "rgba(0,0,0,0.06)" }}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="text-sm" style={{ color: "#4a4a4a" }}>
                  {card.title}
                </p>
                <h2
                  className="mt-2 text-xl font-bold"
                  style={{ color: "#1C2541" }}
                >
                  {card.value}
                </h2>
                <p className="mt-1 text-xs" style={{ color: "#4a4a4a" }}>
                  {card.description}
                </p>
              </div>

              <div
                className="flex h-11 w-11 items-center justify-center rounded-xl flex-shrink-0"
                style={{ background: "rgba(28, 37, 65, 0.06)" }}
              >
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="mt-8 rounded-2xl border bg-white shadow-sm overflow-x-auto transition hover:shadow-md"
        style={{ borderColor: "rgba(0,0,0,0.06)" }}
      >
        <div
          className="p-5 border-b"
          style={{ borderColor: "rgba(0,0,0,0.06)" }}
        >
          <h2 className="font-bold" style={{ color: "#1C2541" }}>
            All Clients
          </h2>
        </div>

        {error && (
          <div className="p-5 text-sm text-red-600">{error}</div>
        )}

        {isLoading ? (
          <div className="p-8 text-center text-sm" style={{ color: "#4a4a4a" }}>
            Loading clients...
          </div>
        ) : clients.length === 0 ? (
          <div className="p-8 text-center text-sm" style={{ color: "#4a4a4a" }}>
            No clients yet. Add your first client to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ background: "#faf8f5" }}>
                <tr
                  className="text-left text-sm"
                  style={{ color: "#4a4a4a" }}
                >
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Phone</th>
                  <th className="px-5 py-3 font-medium">Deposits</th>
                  <th className="px-5 py-3 font-medium">Transfers</th>
                  <th className="px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>

              <tbody>
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-t transition hover:bg-gray-50"
                    style={{ borderColor: "rgba(0,0,0,0.06)" }}
                  >
                    <td
                      className="px-5 py-4 font-medium"
                      style={{ color: "#1C2541" }}
                    >
                      {client.name}
                    </td>
                    <td className="px-5 py-4" style={{ color: "#4a4a4a" }}>
                      {client.email}
                    </td>
                    <td className="px-5 py-4" style={{ color: "#4a4a4a" }}>
                      {client.phone}
                    </td>
                    <td className="px-5 py-4" style={{ color: "#4a4a4a" }}>
                      {client.deposits?.length ?? 0}
                    </td>
                    <td className="px-5 py-4" style={{ color: "#4a4a4a" }}>
                      {client.transfers?.length ?? 0}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/dashboard/clients/${client.id}`}
                          className="text-sm font-medium transition hover:opacity-70"
                          style={{ color: "#a67c3e" }}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(client.id, client.name)}
                          className="text-sm font-medium text-red-600 transition hover:opacity-70"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddClientPage
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadClients}
      />
    </div>
  );
}
