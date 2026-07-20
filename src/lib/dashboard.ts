import type { Deposit } from "@/src/types/deposit";
import type { Transfer } from "@/src/types/transfer";

export type DashboardTransaction = {
  id: string;
  type: "Deposit" | "Transfer";
  description: string;
  amount: number;
  date: string;
  clientName?: string;
};

function parseAmount(amount: string | number) {
  return typeof amount === "string" ? parseFloat(amount) : amount;
}

export function buildRecentTransactions(
  deposits: Deposit[],
  transfers: Transfer[],
  limit = 5
): DashboardTransaction[] {
  const depositItems: DashboardTransaction[] = deposits.map((deposit) => ({
    id: deposit.id,
    type: "Deposit",
    description: `Deposit from ${deposit.client?.name ?? "client"}`,
    amount: parseAmount(deposit.amount),
    date: deposit.date,
    clientName: deposit.client?.name,
  }));

  const transferItems: DashboardTransaction[] = transfers.map((transfer) => ({
    id: transfer.id,
    type: "Transfer",
    description: `Transfer to ${transfer.recipientName}`,
    amount: parseAmount(transfer.amount),
    date: transfer.date,
    clientName: transfer.client?.name,
  }));

  return [...depositItems, ...transferItems]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
}

export function getClientBalance(
  deposits: Deposit[],
  transfers: Transfer[]
) {
  const totalDeposits = deposits.reduce(
    (sum, deposit) => sum + parseAmount(deposit.amount),
    0
  );

  const totalTransfers = transfers.reduce(
    (sum, transfer) => sum + parseAmount(transfer.amount),
    0
  );

  return {
    totalDeposits,
    totalTransfers,
    availableBalance: totalDeposits - totalTransfers,
  };
}
