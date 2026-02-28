# Plan techniczny: ChatGPT Apps Frontend (bez własnego backendu AI)

## Cel dokumentu
Celem jest opisanie docelowej implementacji frontendu aplikacji ChatGPT Apps w modelu **frontend-only**, gdzie:
- aplikacja uruchamia się jako klient webowy,
- nie posiada dedykowanego backendu AI do przetwarzania promptów,
- komunikacja z hostem ChatGPT odbywa się przez mechanizm komunikatów okna (`postMessage`) oparty o JSON-RPC 2.0.

## Założenie architektoniczne
Aplikacja działa jako warstwa UI i logiki prezentacyjnej. Przetwarzanie AI pozostaje po stronie środowiska hostującego (np. runtime ChatGPT Apps), a frontend:
1. obsługuje sesję użytkownika i stan interfejsu,
2. buduje i wysyła komunikaty protokołu,
3. odbiera i renderuje wyniki narzędzi / odpowiedzi asynchroniczne.

## Przepływ architektury (end-to-end)

### 1) Logowanie Google OAuth (po stronie klienta)
- Użytkownik inicjuje logowanie z poziomu komponentu `Login`.
- Przepływ OAuth realizowany jest po stronie klienta (redirect/popup).
- Frontend przechowuje minimalny stan sesji potrzebny do działania UI (np. profil, token sesyjny/ID token zgodnie z polityką bezpieczeństwa).
- Brak przekazywania promptów do własnego serwera AI — autoryzacja służy wyłącznie tożsamości i kontekstowi użytkownika.

### 2) Wysyłanie wiadomości przez `window.parent.postMessage`
- Po wpisaniu wiadomości komponent `ChatInterface` buduje obiekt JSON-RPC 2.0.
- Komunikat wysyłany jest do hosta metodą:
  - `window.parent.postMessage(payload, targetOrigin)`
- Konwencja wiadomości:
  - kanał/typ: `ui/message`,
  - format: JSON-RPC 2.0 (`jsonrpc`, `id`, `method`, `params`),
  - `id` wykorzystywane do korelacji odpowiedzi z konkretną wiadomością użytkownika.

Przykład payload:

```json
{
  "jsonrpc": "2.0",
  "id": "msg-17283910",
  "method": "ui/message",
  "params": {
    "text": "Wyjaśnij ten wykres.",
    "context": {
      "locale": "pl-PL"
    }
  }
}
```

### 3) Odbiór odpowiedzi przez listener `message`
- Frontend rejestruje globalny listener `window.addEventListener('message', ...)`.
- Listener filtruje zdarzenia po:
  - `origin` (whitelist zaufanych źródeł),
  - strukturze JSON-RPC,
  - typie/metodzie powiadomienia.
- Oczekiwane powiadomienia asynchroniczne:
  - `ui/notifications/tool-result`
- Po odebraniu odpowiedzi komponenty aktualizują stan rozmowy (status, treść, błędy, metadane).

## Mapowanie: obecna struktura repo -> struktura docelowa (z obrazów referencyjnych)

| Obecna lokalizacja | Rola obecna | Docelowa rola w architekturze ChatGPT Apps |
|---|---|---|
| `src/main.tsx` | punkt startowy aplikacji React | pozostaje punktem wejścia: bootstrap aplikacji, montaż głównego kontenera |
| `src/App.tsx` | główny komponent aplikacji | kontener providerów (auth/session/chat state/theme) i routing layoutu chat |
| `src/components/` (ogólne) | komponenty domenowe i UI | wydzielenie modułu `src/components/chatgpt/` dla funkcji czatu i logowania |
| `src/components/ui/` | współdzielone komponenty prezentacyjne | pozostają jako design system dla nowego modułu chatgpt |

### Proponowana struktura docelowa

```text
src/
  main.tsx
  App.tsx
  components/
    chatgpt/
      Login.tsx
      ChatInterface.tsx
      MessageBubble.tsx
      transport/
        jsonRpcClient.ts
        messageListener.ts
```

## Granice odpowiedzialności komponentów

### `Login`
- Inicjuje i finalizuje Google OAuth po stronie klienta.
- Zarządza stanami: loading/success/error logowania.
- Udostępnia dane użytkownika do providerów aplikacji.
- Nie zawiera logiki transportu wiadomości czatu.

### `ChatInterface`
- Renderuje obszar rozmowy, pole wejścia i akcje użytkownika.
- Odpowiada za wysyłkę wiadomości użytkownika przez warstwę transportową JSON-RPC.
- Utrzymuje lokalny stan konwersacji (kolejność, status "wysyłanie/odebrano/błąd").
- Nie implementuje szczegółów OAuth.

### `MessageBubble`
- Czysta warstwa prezentacji pojedynczego komunikatu.
- Obsługuje warianty UI: user/system/tool/error.
- Nie zarządza ruchem sieciowym ani stanem globalnym.

### Transport JSON-RPC (`transport/`)
- `jsonRpcClient.ts`:
  - budowa i walidacja payloadu JSON-RPC 2.0,
  - wysyłanie `ui/message` przez `window.parent.postMessage`,
  - korelacja `id` żądań.
- `messageListener.ts`:
  - rejestracja i czyszczenie listenera `message`,
  - walidacja `origin` i schematu danych,
  - obsługa `ui/notifications/tool-result` oraz propagacja eventów do warstwy stanu.

## Zasady bezpieczeństwa i jakości
- Walidować `origin` dla każdego komunikatu `message`.
- Nie przechowywać wrażliwych tokenów długoterminowo po stronie klienta bez uzasadnienia.
- Logować błędy transportowe i błędy walidacji JSON-RPC.
- Zapewnić idempotencję aktualizacji UI dla zdublowanych eventów.

## Plan wdrożenia etapowego
1. Utworzenie modułu `src/components/chatgpt/` i szkieletu komponentów.
2. Implementacja `Login` (Google OAuth client-side) i providerów sesji.
3. Implementacja transportu JSON-RPC (`ui/message`, listener `ui/notifications/tool-result`).
4. Integracja `ChatInterface` + `MessageBubble` z transportem.
5. Testy manualne przepływu login -> send -> receive oraz walidacji `origin`.

## Kryteria akceptacji
- Frontend wysyła komunikat `ui/message` w formacie JSON-RPC 2.0 przez `window.parent.postMessage`.
- Frontend odbiera i renderuje `ui/notifications/tool-result` z listenera `message`.
- Logowanie Google OAuth działa bez dedykowanego backendu AI.
- Odpowiedzialności komponentów są rozdzielone zgodnie z niniejszym dokumentem.
