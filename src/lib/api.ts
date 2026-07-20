export type ApiErrorResponse = {
  message: string;
};

export async function apiRequest<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers);

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = (await response.json()) as T | ApiErrorResponse;

  if (!response.ok) {
    throw new Error(
      (data as ApiErrorResponse).message || "Something went wrong"
    );
  }

  return data as T;
}

export function formatCurrency(
  amount: string | number,
  currency = "ETB"
): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;

  return `${value.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} ${currency}`;
}
