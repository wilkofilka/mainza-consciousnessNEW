# Konfiguracja logowania Google OAuth (frontend)

Poniższa instrukcja opisuje konfigurację **Google Identity Services** dla aplikacji frontendowej Mainza.

## 1) Utwórz lub wybierz projekt w Google Cloud Console

1. Otwórz: <https://console.cloud.google.com/>.
2. Wybierz istniejący projekt lub kliknij **New Project**.
3. Upewnij się, że pracujesz w poprawnym projekcie (selektor projektu w górnym pasku).

## 2) Skonfiguruj OAuth consent screen

1. Przejdź do **APIs & Services → OAuth consent screen**.
2. Wybierz typ użytkownika:
   - **External** (dla użytkowników spoza organizacji), albo
   - **Internal** (tylko Google Workspace organizacji).
3. Uzupełnij wymagane pola:
   - App name,
   - User support email,
   - Developer contact information.
4. (Opcjonalnie) Dodaj logo, domenę aplikacji, politykę prywatności i regulamin.
5. Dodaj zakresy (Scopes): dla samego logowania zwykle wystarczą domyślne `openid`, `email`, `profile`.
6. Jeśli aplikacja jest w trybie **Testing**, dodaj **Test users**.
7. Zapisz konfigurację.

## 3) Utwórz dane dostępu OAuth 2.0

1. Przejdź do **APIs & Services → Credentials**.
2. Kliknij **Create Credentials → OAuth client ID**.
3. Wybierz typ aplikacji: **Web application**.
4. Ustaw nazwę klienta (np. `Mainza Frontend Dev`).
5. W sekcji **Authorized JavaScript origins** dodaj:
   - `http://localhost:5173` (Vite dev server),
   - `http://127.0.0.1:5173` (opcjonalnie).
6. W sekcji **Authorized redirect URIs** dodaj URI używane w Twoim flow:
   - dla klasycznego callbacka OAuth np. `http://localhost:5173/auth/callback`,
   - dla samego GIS One Tap / credential callback często redirect nie jest wymagany, ale warto przygotować callback URI na produkcję.
7. Zatwierdź i skopiuj wartość **Client ID**.

## 4) Skonfiguruj aplikację frontendową

1. Skopiuj plik `.env.example` do `.env`.
2. Ustaw:

```bash
VITE_GOOGLE_CLIENT_ID=twoj-client-id.apps.googleusercontent.com
```

3. Uruchom aplikację (`npm run dev`).
4. Przejdź do `/settings` i użyj przycisku logowania Google.

## 5) Ważne uwagi bezpieczeństwa

- `VITE_GOOGLE_CLIENT_ID` jest publicznym identyfikatorem klienta i może znajdować się po stronie frontendu.
- Nie przechowuj tokenów odświeżania (refresh token), client secret ani innych sekretów w frontendzie.
- W aplikacji Mainza stan sesji frontendowej zapisujemy w `sessionStorage` i przechowujemy tylko podstawowe dane użytkownika (bez sekretów).

## 6) Produkcja

Przed publikacją:

1. Dodaj produkcyjne domeny do **Authorized JavaScript origins**.
2. Dodaj produkcyjne redirect URI do **Authorized redirect URIs**.
3. Uzupełnij i zweryfikuj ekran zgody OAuth (jeśli wymagają tego zakresy i polityki Google).
4. Ustaw `VITE_GOOGLE_CLIENT_ID` w środowisku produkcyjnym (np. CI/CD, panel hostingu).
