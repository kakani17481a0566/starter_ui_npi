// src/utils/handleAxiosError.js

export function handleAxiosError(error) {
  const isAxiosError = !!error.isAxiosError;
  const hasResponse = !!error.response;
  const isNetworkError = !hasResponse && error.message === "Network Error";
  const isTimeout = error.code === "ECONNABORTED";
  const fallback = "Something went wrong. Please try again.";

  const method = error?.config?.method?.toUpperCase?.() || "UNKNOWN";
  const url = error?.config?.url || "unknown endpoint";

  let message = fallback;

  if (isAxiosError) {
    if (hasResponse) {
      message =
        error.response?.data?.message ||
        error.response?.statusText ||
        `Server Error: ${error.response?.status}`;
    } else if (isNetworkError) {
      message = "Network error: Please check your internet connection.";
    } else if (isTimeout) {
      message = "Request timed out. Try again later.";
    } else {
      message = error.message || fallback;
    }
  } else {
    message = error.message || fallback;
  }

  const handled = {
    message,
    status: error?.response?.status || 0,
    method,
    url,
    code: error?.code || "UNKNOWN",
    isAxiosError,
    isTimeout,
    isNetworkError,
    raw: error,
  };

  // 🔍 Dev-friendly logs
  if (import.meta.env.MODE !== "production") {
    console.log(
      `%c❌ API ERROR [${method}] ${url} ${handled.status ? `(Status: ${handled.status})` : ""}`,
      "color: red; font-weight: bold;"
    );
    console.log("📩 Message:", handled.message);
    if (handled.code) console.log("💥 Code:", handled.code);
    if (handled.isTimeout) console.log("⏱ Timeout occurred.");
    if (handled.isNetworkError) console.log("📡 Network error detected.");
    console.log("📦 Full error object:", handled.raw);
  }

  return handled;
}
