import { apiRequest } from "@/src/lib/api";
import type {
  CreateTransferPayload,
  Transfer,
  UpdateTransferPayload,
} from "@/src/types/transfer";

export function getTransfers() {
  return apiRequest<Transfer[]>("/api/transfers");
}

export function getTransfer(id: string) {
  return apiRequest<Transfer>(`/api/transfers/${id}`);
}

export function createTransfer(payload: CreateTransferPayload) {
  return apiRequest<Transfer>("/api/transfers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateTransfer(id: string, payload: UpdateTransferPayload) {
  return apiRequest<Transfer>(`/api/transfers/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteTransfer(id: string) {
  return apiRequest<{ message: string }>(`/api/transfers/${id}`, {
    method: "DELETE",
  });
}

export function formatTransferStatus(status: Transfer["status"]) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}
