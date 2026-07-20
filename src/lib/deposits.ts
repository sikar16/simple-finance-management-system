import { apiRequest } from "@/src/lib/api";
import type {
  CreateDepositPayload,
  Deposit,
  UpdateDepositPayload,
} from "@/src/types/deposit";

export function getDeposits() {
  return apiRequest<Deposit[]>("/api/deposits");
}

export function getDeposit(id: string) {
  return apiRequest<Deposit>(`/api/deposits/${id}`);
}

export function createDeposit(payload: CreateDepositPayload) {
  return apiRequest<Deposit>("/api/deposits", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateDeposit(id: string, payload: UpdateDepositPayload) {
  return apiRequest<Deposit>(`/api/deposits/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteDeposit(id: string) {
  return apiRequest<{ message: string }>(`/api/deposits/${id}`, {
    method: "DELETE",
  });
}
