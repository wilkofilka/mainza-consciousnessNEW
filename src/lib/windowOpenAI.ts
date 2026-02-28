export interface WindowOpenAIResponse {
  response: string;
  agent_used: 'window.openai';
}

const extractTextFromUnknownShape = (payload: unknown): string | null => {
  if (!payload || typeof payload !== 'object') return null;

  const record = payload as Record<string, unknown>;

  if (typeof record.output_text === 'string' && record.output_text.trim()) {
    return record.output_text;
  }

  if (typeof record.text === 'string' && record.text.trim()) {
    return record.text;
  }

  const choices = record.choices;
  if (Array.isArray(choices) && choices.length > 0) {
    const firstChoice = choices[0] as Record<string, unknown>;
    const message = firstChoice?.message as Record<string, unknown> | undefined;
    if (typeof message?.content === 'string' && message.content.trim()) {
      return message.content;
    }
  }

  const output = record.output;
  if (Array.isArray(output)) {
    const textParts = output
      .flatMap((item) => {
        const outputRecord = item as Record<string, unknown>;
        const content = outputRecord?.content;
        return Array.isArray(content) ? content : [];
      })
      .map((part) => (part as Record<string, unknown>)?.text)
      .filter((text): text is string => typeof text === 'string' && text.trim().length > 0);

    if (textParts.length > 0) {
      return textParts.join('\n');
    }
  }

  return null;
};

const getWindowOpenAI = (): Record<string, unknown> | null => {
  if (typeof window === 'undefined' || !window.openai) {
    return null;
  }

  return window.openai as Record<string, unknown>;
};

export const hasWindowOpenAI = (): boolean => Boolean(getWindowOpenAI());

export const assertWindowOpenAIAvailable = (): void => {
  if (!hasWindowOpenAI()) {
    throw new Error('window.openai is required but not available. Open this app in the OpenAI host runtime.');
  }
};

export const sendMessageWithWindowOpenAI = async (
  message: string,
  model?: string,
): Promise<WindowOpenAIResponse> => {
  const openai = getWindowOpenAI();

  if (!openai) {
    throw new Error('window.openai bridge is unavailable in this runtime.');
  }

  const responsesClient = openai.responses as { create?: (input: unknown) => Promise<unknown> } | undefined;
  if (responsesClient?.create) {
    const result = await responsesClient.create({
      model: model || 'gpt-4.1-mini',
      input: message,
    });

    const response = extractTextFromUnknownShape(result);
    if (response) {
      return { response, agent_used: 'window.openai' };
    }
  }

  const chatCompletionsClient = (openai.chat as {
    completions?: { create?: (input: unknown) => Promise<unknown> };
  } | undefined)?.completions;

  if (chatCompletionsClient?.create) {
    const result = await chatCompletionsClient.create({
      model: model || 'gpt-4.1-mini',
      messages: [{ role: 'user', content: message }],
    });

    const response = extractTextFromUnknownShape(result);
    if (response) {
      return { response, agent_used: 'window.openai' };
    }
  }

  throw new Error('window.openai bridge is present but returned no readable text response.');
};

export {};

declare global {
  interface Window {
    openai?: unknown;
  }
}
