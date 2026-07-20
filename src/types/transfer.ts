import type { BankAccount } from "@/src/types/bank-account";
import type { Client } from "@/src/types/client";

export type TransferStatus = "PENDING" | "COMPLETED" | "CANCELLED";

export type Transfer = {
  id: string;
  clientId: string;
  bankAccountId: string;
  recipientName: string;
  recipientBank: string;
  recipientAccount: string;
  amount: string | number;
  referenceNumber?: string | null;
  receipt?: string | null;
  status: TransferStatus;
  date: string;
  createdAt: string;
  client?: Client;
  bankAccount?: BankAccount;
};

export type CreateTransferPayload = {
  clientId: string;
  bankAccountId: string;
  recipientName: string;
  recipientBank: string;
  recipientAccount: string;
  amount: number;
  referenceNumber?: string;
  receipt?: string;
};

export type UpdateTransferPayload = {
  recipientName?: string;
  recipientBank?: string;
  recipientAccount?: string;
  amount?: number;
  referenceNumber?: string;
  receipt?: string;
  status?: TransferStatus;
};
