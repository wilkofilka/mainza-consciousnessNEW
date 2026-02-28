export interface JsonRpcMessage {
  jsonrpc: '2.0';
  method: string;
  params?: unknown;
  id?: string | number | null;
}

export interface UserMessageParams {
  role: 'user';
  content: Array<{
    type: 'text';
    text: string;
  }>;
}

export interface ToolResultNotification {
  jsonrpc: '2.0';
  method: 'ui/notifications/tool-result';
  params?: {
    structuredContent?: {
      text?: string;
      [key: string]: unknown;
    };
    [key: string]: unknown;
  };
}

const isDev = import.meta.env.DEV;

function devLog(message: string, payload?: unknown): void {
  if (!isDev) {
    return;
  }

  if (payload === undefined) {
    console.debug(`[chatgptTransport] ${message}`);
    return;
  }

  console.debug(`[chatgptTransport] ${message}`, payload);
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isValidJsonRpcMessage(value: unknown): value is JsonRpcMessage {
  if (!isObject(value)) {
    return false;
  }

  return value.jsonrpc === '2.0' && typeof value.method === 'string';
}

export function sendUserMessage(text: string): void {
  const payload: JsonRpcMessage = {
    jsonrpc: '2.0',
    method: 'ui/message',
    params: {
      role: 'user',
      content: [{ type: 'text', text }],
    } satisfies UserMessageParams,
  };

  window.parent.postMessage(payload, '*');
  devLog('Sent user message', payload);
}

export function attachToolResultListener(
  handler: (message: ToolResultNotification) => void,
): () => void {
  const listener = (event: MessageEvent<unknown>) => {
    if (event.source !== window.parent) {
      return;
    }

    if (!isValidJsonRpcMessage(event.data)) {
      devLog('Ignored message with invalid JSON-RPC structure', event.data);
      return;
    }

    if (event.data.method !== 'ui/notifications/tool-result') {
      return;
    }

    const toolResult: ToolResultNotification = {
      jsonrpc: '2.0',
      method: 'ui/notifications/tool-result',
      params: isObject(event.data.params)
        ? (event.data.params as ToolResultNotification['params'])
        : undefined,
    };

    devLog('Received tool result notification', toolResult);
    handler(toolResult);
  };

  window.addEventListener('message', listener);

  return () => {
    window.removeEventListener('message', listener);
  };
}
