import { apiRequest } from "@/src/lib/api";
import type { Transaction } from "@/src/types/transaction";

export function getTransactions() {
  return apiRequest<Transaction[]>("/api/transactions");
}

export function getTransaction(id: string) {
  return apiRequest<Transaction>(`/api/transactions/${id}`);
}

export function formatTransactionType(type: Transaction["type"]) {
  return type.charAt(0) + type.slice(1).toLowerCase();
}
