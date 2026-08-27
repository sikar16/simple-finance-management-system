import { apiRequest } from "@/src/lib/api";
import type {
  BankAccount,
  CreateBankAccountPayload,
  UpdateBankAccountPayload,
} from "@/src/types/bank-account";
import type { Deposit } from "@/src/types/deposit";
import type { Transfer } from "@/src/types/transfer";

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

export type BankAccountBreakdown = {
  bankAccountId: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  availableBalance: number;
  totalDeposits: number;
  totalTransfers: number;
};

export function getBankAccountBreakdowns(
  bankAccounts: BankAccount[],
  deposits: Deposit[],
  transfers: Transfer[]
): BankAccountBreakdown[] {
  return bankAccounts.map((account) => {
    const accountDeposits = deposits.filter(
      (deposit) => deposit.bankAccountId === account.id
    );
    const accountTransfers = transfers.filter(
      (transfer) => transfer.bankAccountId === account.id
    );

    const totalDeposits = accountDeposits.reduce((sum, deposit) => {
      const amount = typeof deposit.amount === "string"
        ? parseFloat(deposit.amount)
        : deposit.amount;
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    const totalTransfers = accountTransfers.reduce((sum, transfer) => {
      const amount = typeof transfer.amount === "string"
        ? parseFloat(transfer.amount)
        : transfer.amount;
      return sum + (isNaN(amount) ? 0 : amount);
    }, 0);

    const currentBalance = typeof account.balance === "string"
      ? parseFloat(account.balance)
      : (account.balance || 0);

    // Use the current balance field from the bank account
    const availableBalance = currentBalance;

    return {
      bankAccountId: account.id,
      bankName: account.bankName,
      accountName: account.accountName,
      accountNumber: account.accountNumber,
      availableBalance,
      totalDeposits,
      totalTransfers,
    };
  });
}
