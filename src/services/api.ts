const API_URL = import.meta.env.VITE_API_URL || "https://candle-uqyt.onrender.com";

export async function api<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error("API error");
  }

  return res.json();
}
