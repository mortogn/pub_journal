const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

const api = async <T>(
  path: string,
  options?: RequestInit
): Promise<{
  data: T;
  status: number;
}> => {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return {
    data: (await response.json()) as T,
    status: response.status,
  };
};

export default api;
