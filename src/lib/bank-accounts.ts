import { apiRequest } from "@/src/lib/api";
import type {
  BankAccount,
  CreateBankAccountPayload,
  UpdateBankAccountPayload,
} from "@/src/types/bank-account";

export function getBankAccounts() {
  return apiRequest<BankAccount[]>("/api/bank-accounts");
}

export function getBankAccount(id: string) {
  return apiRequest<BankAccount>(`/api/bank-accounts/${id}`);
}

export function createBankAccount(payload: CreateBankAccountPayload) {
  return apiRequest<BankAccount>("/api/bank-accounts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateBankAccount(
  id: string,
  payload: UpdateBankAccountPayload
) {
  return apiRequest<BankAccount>(`/api/bank-accounts/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteBankAccount(id: string) {
  return apiRequest<{ message: string }>(`/api/bank-accounts/${id}`, {
    method: "DELETE",
  });
}
