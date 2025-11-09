export class ApiError extends Error {
  status: number;
  data?: Record<string, unknown>;

  constructor(message: string, status: number, data?: Record<string, unknown>) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

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

  const body = await response.json();

  if (!response.ok) {
    const message =
      body && "message" in body
        ? body.message
        : "error" in body
        ? body.error
        : "An unknown error occurred, Please try again later.";
    throw new ApiError(message, response.status, body);
  }

  return {
    data: (await response.json()) as T,
    status: response.status,
  };
};

export default api;
