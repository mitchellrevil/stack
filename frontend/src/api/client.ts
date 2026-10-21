// One place for the version prefix, bearer token and HTTP error handling.
// Pass a schema so an unexpected server response fails at the API boundary.
import type { z } from "zod";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export function createApiClient(getToken: () => Promise<string | null>) {
  return {
    async get<T>(
      path: string,
      schema: z.ZodType<T>,
      signal?: AbortSignal,
    ): Promise<T> {
      const token = await getToken();
      const headers: HeadersInit = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`/v1${path}`, { headers, signal });
      if (!response.ok) {
        // Do not echo arbitrary server bodies or tokens into the UI.
        throw new ApiError(
          response.status,
          `Request failed (${response.status}). Please try again.`,
        );
      }

      return schema.parse(await response.json());
    },
  };
}
export type ApiClient = ReturnType<typeof createApiClient>;
