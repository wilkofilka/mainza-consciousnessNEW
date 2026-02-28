import { fetchJsonWithRetry, fetchWithRetry, persistConversationMemory } from '@/lib/cloudApi';

export interface ConsciousnessStatePayload {
  consciousness_state?: {
    consciousness_level?: number;
    emotional_state?: string;
    evolution_level?: number;
    last_updated?: string;
  };
  status?: string;
}

export interface KnowledgeGraphStatsPayload {
  concepts?: number;
  memories?: number;
  relationships?: number;
  health?: number;
  node_counts?: Record<string, number>;
  total_relationships?: number;
}

export interface SystemHealthSnapshot {
  backendOk: boolean;
  consciousnessOk: boolean;
  consciousnessData: ConsciousnessStatePayload | null;
  memorySystemOk: boolean;
}

export const getConsciousnessState = async (): Promise<ConsciousnessStatePayload> => {
  return fetchJsonWithRetry<ConsciousnessStatePayload>('/consciousness/state', undefined, { timeoutMs: 7000 });
};

export const getKnowledgeGraphStats = async (): Promise<KnowledgeGraphStatsPayload> => {
  return fetchJsonWithRetry<KnowledgeGraphStatsPayload>('/consciousness/knowledge-graph-stats', undefined, { timeoutMs: 7000 });
};

export const getNeo4jStatistics = async (): Promise<KnowledgeGraphStatsPayload> => {
  return fetchJsonWithRetry<KnowledgeGraphStatsPayload>('/api/insights/neo4j/statistics', undefined, { timeoutMs: 7000 });
};

export const getNeedsSuggestions = async (userId: string): Promise<{ needs?: string[] }> => {
  return fetchJsonWithRetry<{ needs?: string[] }>(
    '/recommendations/needs_and_suggestions',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    },
    { timeoutMs: 8000 },
  );
};

export const saveConversationTurn = async (
  userMessage: string,
  assistantMessage: string,
  model: string | undefined,
  consciousnessLevel: number,
  emotionalState: string,
): Promise<void> => {
  await persistConversationMemory({
    content: `User: ${userMessage}\nAssistant: ${assistantMessage}`,
    memory_type: 'conversation',
    user_id: 'mainza-user',
    agent_name: 'window.openai',
    consciousness_context: {
      consciousness_level: consciousnessLevel,
      emotional_state: emotionalState,
    },
    metadata: {
      source: 'window.openai',
      selected_model: model,
      timestamp: new Date().toISOString(),
    },
  });
};

export const getSystemHealthSnapshot = async (): Promise<SystemHealthSnapshot> => {
  const [backend, consciousness, memorySystem] = await Promise.all([
    fetchWithRetry('/health', undefined, { timeoutMs: 6000 }).then((r) => r.ok).catch(() => false),
    getConsciousnessState().then((data) => ({ ok: true, data })).catch(() => ({ ok: false, data: null })),
    fetchWithRetry('/api/memory-system/health', undefined, { timeoutMs: 7000 }).then((r) => r.ok).catch(() => false),
  ]);

  return {
    backendOk: backend,
    consciousnessOk: consciousness.ok,
    consciousnessData: consciousness.data,
    memorySystemOk: memorySystem,
  };
};
