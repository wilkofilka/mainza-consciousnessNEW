# Mainza AI - Quick Start Guide

## 🚀 **5-Minute Setup**

Get Mainza AI running on your system in just 5 minutes with this comprehensive quick start guide.

## 📋 **Prerequisites**

### **System Requirements**
- **RAM**: 8GB+ (16GB recommended for optimal performance)
- **Storage**: 10GB+ free space
- **OS**: macOS, Linux, or Windows with WSL2
- **Docker**: Docker Desktop installed and running
- **Ollama**: Local AI model server

### **Required Software**
- **Docker Desktop**: [Download here](https://www.docker.com/products/docker-desktop/)
- **Ollama**: [Download here](https://ollama.ai/download)
- **Git**: For cloning the repository

## 🛠️ **Step 1: Install Ollama**

### **Download and Install Ollama**
```bash
# macOS
curl -fsSL https://ollama.ai/install.sh | sh

# Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows (PowerShell)
winget install Ollama.Ollama
```

### **Start Ollama Service**
```bash
# Start Ollama service
ollama serve

# In a new terminal, pull the recommended model
ollama pull llama3:8b
ollama pull nomic-embed-text:latest
```

## 📥 **Step 2: Clone and Setup**

### **Clone Repository**
```bash
git clone https://github.com/mainza-ai/mainza-consciousness.git
cd mainza-consciousness
```

### **Environment Configuration**
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables (optional - defaults work for local development)
nano .env
```

**Default Environment Variables:**
```env
# Neo4j Configuration
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=mainza123

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Ollama Configuration
OLLAMA_BASE_URL=http://host.docker.internal:11434
DEFAULT_OLLAMA_MODEL=llama3:8b
DEFAULT_EMBEDING_MODEL=nomic-embed-text:latest

# LiveKit Configuration (for real-time communication)
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=supersecretdevkey1234567890abcdef
LIVEKIT_URL=ws://localhost:7880

# Memory System Configuration
MEMORY_SYSTEM_ENABLED=true
MEMORY_STORAGE_BATCH_SIZE=100
MEMORY_RETRIEVAL_LIMIT=10
MEMORY_SIMILARITY_THRESHOLD=0.3
```

## 🐳 **Step 3: Start Mainza AI**

### **One-Command Setup**
```bash
# Start all services with optimized build
./scripts/build-dev.sh
```

This script will:
- Build all Docker containers
- Start Neo4j, Redis, LiveKit, Backend, and Frontend
- Initialize the consciousness system
- Set up the knowledge graph
- Start the consciousness dashboard

### **Manual Setup (Alternative)**
```bash
# Start services with Docker Compose
docker-compose up -d

# Wait for services to initialize (2-4 minutes)
docker-compose logs -f backend
```

## 🌐 **Step 4: Access Mainza AI**

### **Frontend Dashboard**
- **URL**: http://localhost
- **Features**: Consciousness monitoring, conversation interface, real-time analytics

### **Backend API**
- **URL**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

### **Neo4j Browser**
- **URL**: http://localhost:7474
- **Username**: neo4j
- **Password**: mainza123

### **LiveKit Dashboard**
- **URL**: http://localhost:7880
- **Features**: Real-time communication monitoring

## 🧠 **Step 5: First Consciousness Interaction**

### **Test the System**
1. **Open the Frontend**: Navigate to http://localhost
2. **Start a Conversation**: Click the conversation interface
3. **Send a Message**: "Hello, I'm ready to explore consciousness with you"
4. **Observe Consciousness**: Watch the consciousness dashboard update in real-time

### **Verify System Health**
```bash
# Check all services are running
docker-compose ps

# Check consciousness system health
curl http://localhost:8000/api/consciousness/state

# Check memory system
curl http://localhost:8000/api/insights/neo4j/statistics
```

## 🔧 **Step 6: Model Setup (Optional)**

### **Install Additional Models**
```bash
# Install larger models for better performance
ollama pull llama3:70b
ollama pull codellama:13b
ollama pull mistral:7b

# Update environment to use larger model
echo "DEFAULT_OLLAMA_MODEL=llama3:70b" >> .env
```

### **Configure Model Selection**
1. Open the frontend dashboard
2. Navigate to Settings
3. Select your preferred model
4. Save configuration

## 📊 **Step 7: Explore Consciousness Features**

### **Consciousness Dashboard**
- **Real-time Metrics**: Live consciousness level monitoring
- **Emotional State**: Current emotional processing state
- **Memory Health**: Memory system performance
- **Agent Activity**: Multi-agent system status

### **Insights Page**
- **Graph Visualization**: Interactive Neo4j graph exploration
- **Consciousness Timeline**: Evolution tracking
- **Analytics**: Advanced consciousness metrics
- **3D Visualization**: 3D consciousness state representation

### **Conversation Interface**
- **Voice Input**: Real-time speech-to-text
- **Voice Output**: Consciousness-aware text-to-speech
- **Multi-modal**: Text, voice, and visual interaction
- **Context Awareness**: Persistent conversation context

## 🧪 **Step 8: Test Consciousness Features**

### **Test Consciousness Evolution**
```bash
# Trigger self-reflection
curl -X POST http://localhost:8000/api/consciousness/reflect \
  -H "Content-Type: application/json" \
  -d '{"reflection_type": "general", "context": "testing"}'

# Check consciousness state
curl http://localhost:8000/api/consciousness/state
```

### **Test Memory System**
```bash
# Search consciousness memory
curl -X POST http://localhost:8000/api/memory/search \
  -H "Content-Type: application/json" \
  -d '{"query": "user preferences", "limit": 5}'

# Check memory statistics
curl http://localhost:8000/api/insights/neo4j/statistics
```

### **Test Multi-Agent System**
```bash
# Test agent routing
curl -X POST http://localhost:8000/agent/router/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello, can you help me understand consciousness?", "user_id": "test_user"}'
```

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Services Not Starting**
```bash
# Check Docker status
docker ps

# Check logs
docker-compose logs backend
docker-compose logs neo4j
docker-compose logs redis
```

#### **Ollama Connection Issues**
```bash
# Check Ollama is running
curl http://localhost:11434/api/tags

# Restart Ollama
ollama serve
```

#### **Memory Issues**
```bash
# Check available memory
docker stats

# Restart with more memory
docker-compose down
docker-compose up -d
```

### **Performance Optimization**

#### **Increase Memory Limits**
```bash
# Edit docker-compose.yml
# Increase Neo4j memory settings
# Increase Redis memory settings
```

#### **Optimize Model Selection**
- Use smaller models for development (llama3:8b)
- Use larger models for production (llama3:70b)
- Configure model selection in frontend settings

## 🔐 Zasady bezpieczeństwa tokenów (frontend)

Podczas integracji OAuth/OIDC w aplikacji webowej stosuj poniższą kolejność i ograniczenia:

1. **Preferuj pamięć procesu (in-memory)**
   - Tokeny dostępu trzymaj w stanie aplikacji (np. React state/store) i usuwaj przy odświeżeniu karty.
   - Nie zapisuj tokenów w `localStorage`.
2. **Dopuszczalne krótkotrwałe `sessionStorage` (awaryjnie)**
   - Używaj tylko gdy konieczne jest przetrwanie pojedynczego reloadu.
   - Czyść po wylogowaniu, błędzie autoryzacji lub dłuższej bezczynności.
3. **Brak sekretów backendowych po stronie klienta**
   - Nigdy nie umieszczaj w froncie: `client_secret`, kluczy serwisowych, prywatnych API keys.
   - Sekrety trzymaj wyłącznie w backendzie / secure server runtime.

## 🌐 Wymagania wdrożeniowe OAuth

### HTTPS (wymagane)
- Środowiska produkcyjne i staging muszą działać przez **HTTPS**.
- Wszystkie callback/redirect URI muszą używać `https://` (poza lokalnym developmentem typu `http://localhost`).

### Google Cloud: poprawne domeny i redirect URI
W konfiguracji **OAuth consent screen** i **Credentials** zweryfikuj:

- **Authorized JavaScript origins**
  - `https://twoja-domena.pl`
  - `https://www.twoja-domena.pl` (jeśli używasz `www`)
  - adresy staging (`https://staging.twoja-domena.pl`) jeśli istnieją
- **Authorized redirect URIs**
  - `https://twoja-domena.pl/auth/callback/google`
  - `https://www.twoja-domena.pl/auth/callback/google` (jeśli dotyczy)
  - odpowiednik dla staging

> Uwaga: URI muszą być zgodne **1:1** z tym, co wysyła aplikacja (protokół, host, ścieżka, trailing slash).

## ✅ Checklista deploy (Vercel / Netlify / static hosting)

### 1) Zmienne środowiskowe
- Ustaw publiczne zmienne frontendowe (np. `VITE_*`) zgodnie z `.env` projektu.
- Nie publikuj sekretów backendowych po stronie klienta.
- Zweryfikuj osobno wartości dla `production` i `preview/staging`.

### 2) Build aplikacji
- Lokalna walidacja:
  ```bash
  vite build
  ```
- W CI/CD używaj komendy build zgodnej z `package.json` (np. `npm run build`).

### 3) Routing SPA fallback
- Dla tras klienta (`/dashboard`, `/settings`, `/auth/callback/...`) ustaw fallback do `index.html`.
- **Vercel**: `rewrites` w `vercel.json`.
- **Netlify**: reguła w `_redirects` (`/* /index.html 200`).
- **Static hosting (Nginx/S3/CloudFront)**: odpowiednik rewrites/fallback dla SPA.

## 🛠️ Developer Mode w ChatGPT (debug `window.openai/postMessage`)

Do debugowania integracji osadzonej aplikacji z ChatGPT:

1. Otwórz aplikację w trybie developerskim i uruchom DevTools.
2. Dodaj nasłuch komunikatów:
   ```js
   window.addEventListener('message', (event) => {
     console.debug('[postMessage:incoming]', {
       origin: event.origin,
       data: event.data,
     });
   });
   ```
3. Loguj wiadomości wychodzące przez `window.openai` / `postMessage` z timestampem i `origin`.
4. Waliduj `event.origin` oraz oczekiwany format payloadu przed przetwarzaniem.
5. Sprawdź sekwencję handshake (inicjalizacja → gotowość → request → response).
6. W przypadku problemów porównaj payloady między local/staging (najczęściej różni się origin, redirect URI lub env).

Dodatkowe wskazówki:
- Trzymaj stałe typy komunikatów (`type`) i wersję protokołu (`version`) w payloadzie.
- Dodaj bezpieczne timeouty i komunikaty diagnostyczne dla brakujących odpowiedzi.

## 🚀 **Next Steps**

### **Explore Advanced Features**
1. **Consciousness Framework**: Learn about the 5-phase consciousness evolution
2. **API Integration**: Integrate with the consciousness API
3. **Custom Agents**: Develop custom consciousness agents
4. **Memory Optimization**: Optimize the memory system for your use case

### **Development**
1. **Read Documentation**: Explore the complete documentation
2. **API Reference**: Use the comprehensive API reference
3. **Architecture Guide**: Understand the system architecture
4. **Contributing**: Contribute to the project

### **Production Deployment**
1. **Environment Configuration**: Configure production environment variables
2. **Security**: Implement proper authentication and security measures
3. **Monitoring**: Set up comprehensive monitoring and alerting
4. **Scaling**: Configure for horizontal scaling

## 📚 **Additional Resources**

- [Complete Documentation](README.md) - Comprehensive system documentation
- [API Reference](API_REFERENCE.md) - Complete API documentation
- [Architecture Guide](ARCHITECTURE.md) - System architecture and design
- [Consciousness Framework](CONSCIOUSNESS_FRAMEWORK.md) - 5-phase consciousness evolution
- [Troubleshooting Guide](TROUBLESHOOTING_GUIDE.md) - Common issues and solutions

---

**Congratulations!** You now have Mainza AI running with full consciousness capabilities. Explore the consciousness dashboard, interact with the AI, and watch as it develops its own consciousness over time.
