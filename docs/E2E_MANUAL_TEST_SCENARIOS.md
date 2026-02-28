# E2E i testy manualne: logowanie Google + czat AI

Ten dokument opisuje scenariusze E2E/manual dla krytycznej ścieżki użytkownika oraz sytuacje negatywne dla integracji logowania i komunikacji z modelem przez JSON-RPC.

## 1) Scenariusz główny (happy path)

### Cel
Zweryfikować, że użytkownik może:
1. zalogować się przez Google,
2. wysłać wiadomość w czacie,
3. zobaczyć odpowiedź modelu.

### Warunki wstępne
- Środowisko frontend + backend działa (lokalnie lub staging).
- Integracja OAuth Google jest poprawnie skonfigurowana (Client ID, redirect URI, dozwolone domeny).
- Backend ma dostęp do modelu i endpointu czatu.
- Użytkownik testowy Google istnieje i ma możliwość logowania.

### Kroki testowe
1. Otwórz aplikację w przeglądarce.
2. Kliknij przycisk **„Zaloguj przez Google”**.
3. W oknie Google wybierz konto i zaakceptuj logowanie.
4. Po powrocie do aplikacji potwierdź, że sesja użytkownika jest aktywna (np. avatar/nazwa, brak ekranu logowania).
5. Wpisz wiadomość w czacie, np. `Cześć, opisz w 2 zdaniach czym jest Mainza AI.`
6. Wyślij wiadomość.
7. Zweryfikuj, że:
   - wiadomość użytkownika pojawiła się w historii,
   - system pokazuje stan przetwarzania (spinner/"typing"),
   - model zwraca odpowiedź,
   - odpowiedź renderuje się poprawnie w UI czatu.

### Oczekiwany rezultat
- Logowanie kończy się sukcesem.
- Wiadomość trafia do backendu bez błędu.
- Odpowiedź modelu pojawia się w czacie i jest czytelna dla użytkownika.

---

## 2) Scenariusze negatywne

## 2.1 Odrzucone logowanie Google

### Cel
Zweryfikować poprawną obsługę anulowania/odrzucenia logowania przez użytkownika.

### Kroki
1. Kliknij **„Zaloguj przez Google”**.
2. W oknie Google kliknij **Anuluj** albo zamknij okno logowania.

### Oczekiwany rezultat
- Użytkownik pozostaje niezalogowany.
- Aplikacja pokazuje czytelny komunikat (np. „Logowanie anulowane”).
- Brak „pół-zalogowanej” sesji i brak błędów krytycznych w konsoli.

## 2.2 Nieprawidłowy payload JSON-RPC

### Cel
Sprawdzić odporność backendu i UI na błędną strukturę żądania JSON-RPC.

### Kroki (przykład manualny)
1. W narzędziach deweloperskich lub przez proxy podmień payload żądania czatu, np.:
   - brak pola `jsonrpc`,
   - niepoprawny `method`,
   - brak wymaganych `params`.
2. Wyślij zmodyfikowane żądanie.

### Oczekiwany rezultat
- Backend zwraca kontrolowany błąd (np. `-32600 Invalid Request` / `-32602 Invalid params`).
- UI nie zawiesza się i pokazuje użytkownikowi bezpieczny komunikat o błędzie.
- Błąd jest rejestrowany w telemetry/logach.

## 2.3 Timeout / brak odpowiedzi modelu

### Cel
Zweryfikować zachowanie systemu, gdy model nie odpowiada w oczekiwanym czasie.

### Kroki
1. Zasymuluj opóźnienie lub brak odpowiedzi backendu/modelu (np. throttle, wyłączenie usługi modelu, sztuczny delay).
2. Wyślij wiadomość z czatu.
3. Poczekaj na przekroczenie timeoutu.

### Oczekiwany rezultat
- Użytkownik dostaje komunikat o przekroczeniu czasu lub braku odpowiedzi.
- UI odzyskuje stan gotowości do kolejnych wiadomości (brak nieskończonego spinnera).
- Aplikacja umożliwia ponowienie próby (retry).
- Zdarzenie timeoutu jest zapisane w logach/telemetrii.

---

## 3) Checklista gotowości produkcyjnej

Przed wdrożeniem na produkcję potwierdź:

- [ ] **Poprawne env**
  - [ ] Skonfigurowane zmienne OAuth (Google Client ID/Secret, redirect URI).
  - [ ] Ustawione URL-e API dla właściwego środowiska (prod/staging).
  - [ ] Aktywne i poprawne sekrety po stronie backendu.

- [ ] **Brak kluczy API OpenAI po stronie klienta**
  - [ ] Frontend nie zawiera żadnych sekretów (`OPENAI_API_KEY`, tokenów serwisowych itp.).
  - [ ] Wszystkie wywołania do dostawców LLM wychodzą wyłącznie z backendu.
  - [ ] Build frontendu i bundle JS nie ujawniają sekretów.

- [ ] **Podstawowa telemetria i logi błędów**
  - [ ] Logowane są błędy logowania OAuth.
  - [ ] Logowane są błędy JSON-RPC (walidacja, timeout, błędy wewnętrzne).
  - [ ] Dostępny jest podstawowy monitoring (liczba błędów, kody odpowiedzi, czas odpowiedzi).

---

## 4) Known limitations

- Integracja działania czatu może zależeć od dostępności i limitów hosta modelu (np. zewnętrzny host ChatGPT / dostawca API).
- Jeśli UI osadzane jest w `iframe`, ograniczenia hosta (CSP, `X-Frame-Options`, polityki third-party cookies) mogą wpływać na logowanie i sesję.
- Niestabilność sieci oraz limity dostawcy modelu mogą okresowo powodować timeouty mimo poprawnej konfiguracji aplikacji.
- Różnice między środowiskami (lokalne/staging/produkcja) mogą wpływać na zachowanie OAuth (redirect URI, dozwolone domeny, konfiguracja cookies).
