import type { BankAccount } from "@/src/types/bank-account";
import type { Client } from "@/src/types/client";

export type Deposit = {
  id: string;
  clientId: string;
  bankAccountId: string;
  amount: string | number;
  referenceNumber?: string | null;
  receipt?: string | null;
  note?: string | null;
  date: string;
  createdAt: string;
  client?: Client;
  bankAccount?: BankAccount;
};

export type CreateDepositPayload = {
  clientId: string;
  bankAccountId: string;
  amount: number;
  referenceNumber?: string;
  receipt?: string;
  note?: string;
};

export type UpdateDepositPayload = {
  referenceNumber?: string;
  receipt?: string;
  note?: string;
  amount?: number;
};
