export function isVercelDeployment() {
  return process.env.VERCEL === "1";
}

export function isBlobStorageConfigured() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID
  );
}

export function getBlobAccess(): "private" | "public" {
  return process.env.BLOB_ACCESS === "public" ? "public" : "private";
}

export function receiptProxyUrl(pathname: string) {
  return `/api/receipts/${pathname}`;
}
