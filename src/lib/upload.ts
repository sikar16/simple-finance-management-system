export async function uploadReceipt(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/upload/receipt", {
    method: "POST",
    body: formData,
  });

  const data = (await response.json()) as { url?: string; message?: string };

  if (!response.ok) {
    throw new Error(data.message || "Failed to upload receipt");
  }

  if (!data.url) {
    throw new Error("Failed to upload receipt");
  }

  return data.url;
}

export function isImageReceipt(url: string) {
  return /\.(jpg|jpeg|png|webp|gif)$/i.test(url);
}
