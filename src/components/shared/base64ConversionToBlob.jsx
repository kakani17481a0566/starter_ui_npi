// utils/base64ToBlob.jsx

// Named export (works in React/JSX files)
export function base64ToBlob(dataUrl) {
  // supports "data:image/png;base64,AAAA" or raw base64 "AAAA"
  const hasPrefix = typeof dataUrl === "string" && dataUrl.startsWith("data:");
  const [meta, b64raw] = hasPrefix
    ? dataUrl.split(",", 2)
    : ["data:application/octet-stream;base64", dataUrl];

  const contentType =
    (meta.match(/^data:(.*?);base64$/i)?.[1]) || "application/octet-stream";

  // normalize URL-safe base64 just in case
  const b64 = String(b64raw).replace(/-/g, "+").replace(/_/g, "/");

  const byteStr = atob(b64);
  const bytes = new Uint8Array(byteStr.length);
  for (let i = 0; i < byteStr.length; i++) bytes[i] = byteStr.charCodeAt(i);

  return new Blob([bytes], { type: contentType });
}

// Optional: get a File (handy for FormData uploads)
export function base64ToFile(dataUrl, filename = "signature.png") {
  const blob = base64ToBlob(dataUrl);
  return new File([blob], filename, { type: blob.type || "application/octet-stream" });
}
