export type BankAccount = {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  currency: string;
  startBalance: string | number;
  balance: string | number;
  deposits?: any[];
  transfers?: any[];
  createdAt: string;
};

export type CreateBankAccountPayload = {
  bankName: string;
  accountName: string;
  accountNumber: string;
  currency?: string;
  startBalance?: number;
  balance?: number;
};

export type UpdateBankAccountPayload = {
  bankName: string;
  accountName: string;
  accountNumber: string;
  currency: string;
  startBalance?: number;
  balance?: number;
};
