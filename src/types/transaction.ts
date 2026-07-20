import type { Client } from "@/src/types/client";
import type { Deposit } from "@/src/types/deposit";
import type { Transfer } from "@/src/types/transfer";

export type TransactionType = "DEPOSIT" | "TRANSFER";

export type Transaction = {
  id: string;
  clientId: string;
  type: TransactionType;
  depositId?: string | null;
  transferId?: string | null;
  amount: string | number;
  balanceAfter: string | number;
  createdAt: string;
  client?: Client;
  deposit?: Deposit | null;
  transfer?: Transfer | null;
};
