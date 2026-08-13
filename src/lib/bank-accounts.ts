import { apiRequest } from "@/src/lib/api";
import type {
  BankAccount,
  CreateBankAccountPayload,
  UpdateBankAccountPayload,
} from "@/src/types/bank-account";

export function getBankAccountAvailableBalance(account: BankAccount): number {
  const startBalance = typeof account.startBalance === "string" 
    ? parseFloat(account.startBalance) 
    : (account.startBalance || 0);
  
  const depositsTotal = (account.deposits ?? []).reduce((sum, deposit) => {
    const amount = typeof deposit.amount === "string" 
      ? parseFloat(deposit.amount) 
      : deposit.amount;
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
  
  const transfersTotal = (account.transfers ?? []).reduce((sum, transfer) => {
    const amount = typeof transfer.amount === "string" 
      ? parseFloat(transfer.amount) 
      : transfer.amount;
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
  
  return startBalance + depositsTotal - transfersTotal;
}

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
