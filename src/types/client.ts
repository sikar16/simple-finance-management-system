export type Client = {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: "CLIENT";
  createdAt: string;
  deposits?: { id: string; amount: string | number }[];
  transfers?: { id: string; amount: string | number }[];
};

export type CreateClientPayload = {
  name: string;
  phone: string;
  email: string;
  password: string;
};

export type UpdateClientPayload = {
  name: string;
  phone: string;
  email: string;
};
