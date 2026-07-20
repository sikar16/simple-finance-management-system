export type BankAccount = {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  currency: string;
  balance: string | number;
  createdAt: string;
};

export type CreateBankAccountPayload = {
  bankName: string;
  accountName: string;
  accountNumber: string;
  currency?: string;
  balance?: number;
};

export type UpdateBankAccountPayload = {
  bankName: string;
  accountName: string;
  accountNumber: string;
  currency: string;
  balance?: number;
};
