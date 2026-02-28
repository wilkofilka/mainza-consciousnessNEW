interface RetryOptions {
  retries?: number;
  timeoutMs?: number;
  retryDelayMs?: number;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const withTimeout = async (input: RequestInfo | URL, init: RequestInit | undefined, timeoutMs: number): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, {
      ...init,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
};

export const fetchWithRetry = async (
  input: RequestInfo | URL,
  init?: RequestInit,
  options: RetryOptions = {},
): Promise<Response> => {
  const retries = options.retries ?? 2;
  const timeoutMs = options.timeoutMs ?? 8000;
  const retryDelayMs = options.retryDelayMs ?? 350;

  let lastError: unknown;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await withTimeout(input, init, timeoutMs);

      if (response.ok) {
        return response;
      }

      if (response.status >= 500 && attempt < retries) {
        await sleep(retryDelayMs * (attempt + 1));
        continue;
      }

      return response;
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await sleep(retryDelayMs * (attempt + 1));
        continue;
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Cloud API request failed.');
};

export const fetchJsonWithRetry = async <T>(
  input: RequestInfo | URL,
  init?: RequestInit,
  options: RetryOptions = {},
): Promise<T> => {
  const response = await fetchWithRetry(input, init, options);
  return response.json() as Promise<T>;
};

export interface CloudMemoryPayload {
  content: string;
  memory_type: string;
  user_id: string;
  agent_name: string;
  consciousness_context?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export const persistConversationMemory = async (payload: CloudMemoryPayload): Promise<void> => {
  await fetchWithRetry(
    '/api/memory-system/memories/create',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Idempotency-Key': `${payload.user_id}-${Date.now()}-${payload.agent_name}`,
      },
      body: JSON.stringify(payload),
    },
    { retries: 2, timeoutMs: 9000, retryDelayMs: 500 },
  );
};
