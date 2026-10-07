/** Allow only http(s) navigation targets (blocks javascript:/data:/etc.). */

export function toSafeHttpUrl(raw, fallback = "") {
  const value = String(raw || "").trim();
  if (!value) return fallback;
  try {
    const parsed = new URL(value, typeof window !== "undefined" ? window.location.origin : "https://example.com");
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return fallback;
    }
    return parsed.href;
  } catch {
    return fallback;
  }
}
