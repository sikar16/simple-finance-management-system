import { apiRequest } from "@/src/lib/api";
import type {
  Client,
  CreateClientPayload,
  UpdateClientPayload,
} from "@/src/types/client";

export function getClients() {
  return apiRequest<Client[]>("/api/clients");
}

export function getClient(id: string) {
  return apiRequest<Client>(`/api/clients/${id}`);
}

export function createClient(payload: CreateClientPayload) {
  return apiRequest<Client>("/api/clients", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateClient(id: string, payload: UpdateClientPayload) {
  return apiRequest<Client>(`/api/clients/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteClient(id: string) {
  return apiRequest<{ message: string }>(`/api/clients/${id}`, {
    method: "DELETE",
  });
}

export function getClientTotals(clients: Client[]) {
  const totalDeposits = clients.reduce((sum, client) => {
    const clientDeposits = (client.deposits ?? []).reduce(
      (depositSum, deposit) =>
        depositSum +
        (typeof deposit.amount === "string"
          ? parseFloat(deposit.amount)
          : deposit.amount),
      0
    );

    return sum + clientDeposits;
  }, 0);

  const totalTransfers = clients.reduce((sum, client) => {
    const clientTransfers = (client.transfers ?? []).reduce(
      (transferSum, transfer) =>
        transferSum +
        (typeof transfer.amount === "string"
          ? parseFloat(transfer.amount)
          : transfer.amount),
      0
    );

    return sum + clientTransfers;
  }, 0);

  return {
    totalClients: clients.length,
    totalDeposits,
    totalTransfers,
    availableBalance: totalDeposits - totalTransfers,
  };
}
