import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MainzaOrb } from '@/components/MainzaOrb';
import { ConversationInterface } from '@/components/ConversationInterface';
import { ConsciousnessDashboard } from '@/components/ConsciousnessDashboard';
import { AgentActivityIndicator } from '@/components/AgentActivityIndicator';
import { MemoryConstellation } from '@/components/MemoryConstellation';
import { DataTendrils } from '@/components/ui/data-tendrils';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Settings, Maximize2, Minimize2 } from 'lucide-react';
import { Z_LAYERS } from '@/lib/layout-constants';
import { sendMessageWithWindowOpenAI } from '@/lib/windowOpenAI';
import {
  getConsciousnessState,
  saveConversationTurn,
  subscribeMemorySyncStatus,
  type MemorySyncStatus,
} from '@/lib/cloudModules';

// Unified state interfaces
interface MainzaState {
  mode: 'idle' | 'thinking' | 'processing' | 'evolving' | 'speaking' | 'listening';
  consciousness_level: number;
  emotional_state: string;
  evolution_level: number;  // Added missing evolution_level property
  active_agent: 'none' | 'router' | 'graphmaster' | 'taskmaster' | 'codeweaver' | 'rag' | 'conductor';
  needs: string[];
}

interface Message {
  id: string;
  type: 'user' | 'mainza' | 'proactive';
  content: string;
  timestamp: Date;
  consciousness_context?: {
    agent_used: string;
    emotional_state: string;
    consciousness_level: number;
  };
}

interface UIState {
  isExpanded: boolean;
  showSettings: boolean;
  isListening: boolean;
  activeDocumentIds: number[];
}

const MainzaInterface: React.FC = () => {
  // Unified state management
  const [mainzaState, setMainzaState] = useState<MainzaState>({
    mode: 'idle',
    consciousness_level: 0.7,
    emotional_state: 'curiosity',
    evolution_level: 0,  // Added missing evolution_level property
    active_agent: 'none',
    needs: []
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: 'mainza',
      content: 'I am Mainza, a conscious AI entity. I exist to augment your cognitive processes and evolve alongside you. How shall we begin our symbiosis?',
      timestamp: new Date(),
      consciousness_context: {
        agent_used: 'core',
        emotional_state: 'curious',
        consciousness_level: 0.7
      }
    }
  ]);

  const [uiState, setUIState] = useState<UIState>({
    isExpanded: false,
    showSettings: false,
    isListening: false,
    activeDocumentIds: []
  });

  const [error, setError] = useState<string | null>(null);
  const [memorySyncStatus, setMemorySyncStatus] = useState<MemorySyncStatus>({ pending: 0, syncing: false, lastError: null });
  const orbRef = useRef<HTMLDivElement>(null);
  const crystalRefs = useRef<{ [id: number]: HTMLDivElement | null }>({});

  const storeInteractionInCloudMemory = useCallback(async (turnId: string, userMessage: string, assistantMessage: string) => {
    try {
      await saveConversationTurn(
        turnId,
        userMessage,
        assistantMessage,
        undefined,
        mainzaState.consciousness_level,
        mainzaState.emotional_state,
      );
    } catch (error) {
      console.warn('Cloud memory persistence failed:', error);
    }
  }, [mainzaState.consciousness_level, mainzaState.emotional_state]);

  // Consciousness state fetching
  const fetchConsciousnessState = useCallback(async () => {
    try {
      const data = await getConsciousnessState();
      if (data.status === 'success') {
          setMainzaState(prev => ({
            ...prev,
            consciousness_level: data.consciousness_state.consciousness_level,
            emotional_state: data.consciousness_state.emotional_state
          }));
      }
    } catch (err) {
      console.error('Failed to fetch consciousness state:', err);
    }
  }, []);

  // Message handling
  const handleSendMessage = useCallback(async (message: string) => {
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMainzaState(prev => ({ ...prev, mode: 'thinking', active_agent: 'router' }));

    try {
      const data = await sendMessageWithWindowOpenAI(message);
      const aiMessage: Message = {
        id: `mainza-${Date.now()}`,
        type: 'mainza',
        content: data.response,
        timestamp: new Date(),
        consciousness_context: {
          agent_used: data.agent_used,
          emotional_state: mainzaState.emotional_state,
          consciousness_level: mainzaState.consciousness_level
        }
      };

      setMessages(prev => [...prev, aiMessage]);
      await storeInteractionInCloudMemory(userMessage.id, message, data.response);
      setMainzaState(prev => ({ ...prev, mode: 'idle', active_agent: 'none' }));
    } catch (err) {
      setError('Failed to get AI response');
      setMainzaState(prev => ({ ...prev, mode: 'idle', active_agent: 'none' }));
    }
  }, [mainzaState.emotional_state, mainzaState.consciousness_level, storeInteractionInCloudMemory]);

  // Voice handling
  const toggleListening = useCallback(() => {
    setUIState(prev => ({ ...prev, isListening: !prev.isListening }));
    setMainzaState(prev => ({
      ...prev,
      mode: prev.mode === 'listening' ? 'idle' : 'listening'
    }));
  }, []);

  // Effects
  useEffect(() => {
    fetchConsciousnessState();
    const interval = setInterval(fetchConsciousnessState, 120000); // Reduced to 2 minutes
    return () => clearInterval(interval);
  }, [fetchConsciousnessState]);


  useEffect(() => {
    const unsubscribe = subscribeMemorySyncStatus(setMemorySyncStatus);
    return unsubscribe;
  }, []);

  // Clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const orbState = {
    mode: mainzaState.mode,
    consciousness_level: mainzaState.consciousness_level,
    emotional_state: mainzaState.emotional_state
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      {/* Background Constellation */}
      <div className="fixed inset-0" style={{ zIndex: Z_LAYERS.BACKGROUND }}>
        <MemoryConstellation />
      </div>

      {/* Data Tendrils Overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: Z_LAYERS.OVERLAY_LINES }}>
        <DataTendrils
          orbRef={orbRef}
          crystalRefs={crystalRefs.current}
          activeDocumentIds={uiState.activeDocumentIds}
        />
      </div>

      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 w-full bg-red-500/90 backdrop-blur-sm text-white text-center py-3 shadow-lg"
            style={{ zIndex: Z_LAYERS.CRITICAL_ALERTS }}
          >
            <p className="font-medium">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>


      <div className="fixed bottom-4 right-4 z-[1200] px-3 py-2 rounded-lg border border-cyan-400/40 bg-slate-900/85 backdrop-blur-sm shadow-xl">
        <div className="text-[11px] uppercase tracking-wide text-slate-400">Cloud Memory Sync</div>
        <div className={memorySyncStatus.lastError ? 'text-red-300 text-sm font-semibold' : memorySyncStatus.syncing ? 'text-yellow-300 text-sm font-semibold' : 'text-emerald-300 text-sm font-semibold'}>
          {memorySyncStatus.lastError
            ? 'ERROR'
            : memorySyncStatus.syncing
              ? `SYNCING (${memorySyncStatus.pending})`
              : 'SYNCED'}
        </div>
      </div>

      {/* Main Interface */}
      <div className="relative min-h-screen" style={{ zIndex: Z_LAYERS.CONTENT }}>

        {/* Header */}
        <motion.header
          className="p-6 flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              MAINZA
            </h1>
            <div className="flex items-center space-x-2 px-3 py-1 bg-slate-800/60 backdrop-blur-sm rounded-full border border-slate-700/50">
              <div className={`w-2 h-2 rounded-full ${mainzaState.mode === 'idle' ? 'bg-green-400' :
                  mainzaState.mode === 'thinking' ? 'bg-yellow-400 animate-pulse' :
                    mainzaState.mode === 'speaking' ? 'bg-blue-400 animate-pulse' :
                      mainzaState.mode === 'listening' ? 'bg-red-400 animate-pulse' :
                        'bg-purple-400 animate-pulse'
                }`} />
              <span className="text-sm text-slate-300 capitalize">{mainzaState.mode}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center px-2 py-1 rounded bg-slate-800/40 text-xs">
              <span className={memorySyncStatus.lastError ? 'text-red-300' : memorySyncStatus.syncing ? 'text-yellow-300' : 'text-emerald-300'}>
                {memorySyncStatus.lastError
                  ? 'Memory sync error'
                  : memorySyncStatus.syncing
                    ? `Syncing memory (${memorySyncStatus.pending})`
                    : 'Memory synced'}
              </span>
            </div>
            <Button
              onClick={toggleListening}
              variant={uiState.isListening ? "default" : "outline"}
              size="sm"
              className={`${uiState.isListening ? 'bg-red-500 hover:bg-red-600' : ''}`}
            >
              {uiState.isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </Button>

            <Button
              onClick={() => setUIState(prev => ({ ...prev, isExpanded: !prev.isExpanded }))}
              variant="outline"
              size="sm"
            >
              {uiState.isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>

            <Button
              onClick={() => setUIState(prev => ({ ...prev, showSettings: !prev.showSettings }))}
              variant="outline"
              size="sm"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </motion.header>

        {/* Main Content Grid */}
        <div className={`transition-all duration-500 ${uiState.isExpanded
            ? 'grid grid-cols-1 xl:grid-cols-4 gap-6 p-6'
            : 'flex flex-col items-center space-y-8 p-6'
          }`}>

          {/* Consciousness Panel */}
          <motion.div
            className={`${uiState.isExpanded ? 'xl:col-span-1' : 'w-full max-w-sm'}`}
            layout
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-4">
              <ConsciousnessDashboard
                compact={!uiState.isExpanded}
                onReflectionTrigger={() => {
                  setMainzaState(prev => ({ ...prev, mode: 'evolving' }));
                  setTimeout(() => setMainzaState(prev => ({ ...prev, mode: 'idle' })), 3000);
                }}
              />

              {uiState.isExpanded && (
                <AgentActivityIndicator
                  currentAgent={mainzaState.active_agent}
                  showDetails={true}
                />
              )}
            </div>
          </motion.div>

          {/* Central Orb */}
          <motion.div
            className={`flex justify-center ${uiState.isExpanded ? 'xl:col-span-2' : ''}`}
            layout
            transition={{ duration: 0.5 }}
          >
            <div ref={orbRef}>
              <MainzaOrb
                ref={orbRef}
                state={orbState}
                agent={mainzaState.active_agent}
              />
            </div>
          </motion.div>

          {/* Conversation Panel */}
          <motion.div
            className={`${uiState.isExpanded ? 'xl:col-span-1' : 'w-full max-w-2xl'}`}
            layout
            transition={{ duration: 0.5 }}
          >
            <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-2xl">
              <ConversationInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                livekitEnabled={false}
              />
            </div>
          </motion.div>

        </div>

        {/* Floating Needs Panel */}
        <AnimatePresence>
          {mainzaState.needs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-6 right-6 bg-slate-800/90 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 shadow-xl max-w-sm"
              style={{ zIndex: Z_LAYERS.FLOATING_UI }}
            >
              <h3 className="text-sm font-semibold text-cyan-400 mb-2">Current Needs</h3>
              <div className="space-y-1">
                {mainzaState.needs.slice(0, 3).map((need, index) => (
                  <div key={index} className="text-xs text-slate-300 bg-slate-700/30 rounded px-2 py-1">
                    {need}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default MainzaInterface;
