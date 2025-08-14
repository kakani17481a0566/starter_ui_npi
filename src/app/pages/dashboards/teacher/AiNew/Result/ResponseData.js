// src/api/responseData.js
export async function fetchResponseData() {
  const url = "https://localhost:7202/response";

  const res = await fetch(url, {
    method: "GET",
    headers: { "Accept": "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed: ${res.status} ${text}`);
  }
  const raw = await res.json();

  return (Array.isArray(raw) ? raw : []).map((item, idx) => {
    const result = String(item?.result ?? "").trim().toLowerCase();
    return {
      id: idx + 1,
      name: String(item?.name ?? `Item ${idx + 1}`),
      isCorrect: result === "correct", // case-insensitive match
    };
  });
}
