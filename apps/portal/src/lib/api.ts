export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body: unknown,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ''

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let body: unknown
    try { body = await res.json() } catch { body = null }
    throw new ApiError(`API ${res.status}: ${res.statusText}`, res.status, body)
  }
  return res.json() as Promise<T>
}

export const api = {
  get<T>(path: string, signal?: AbortSignal): Promise<T> {
    return fetch(`${API_BASE}${path}`, { signal: signal ?? null }).then((r) =>
      handleResponse<T>(r),
    )
  },
  post<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
    return fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: signal ?? null,
    }).then((r) => handleResponse<T>(r))
  },
}
