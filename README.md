# RideWithMe

Vehicle marketplace (buy, rent, lease, auction). TypeScript monorepo.

| Path | What |
|---|---|
| `apps/web` | Customer web, Next.js 15 App Router + framer-motion |
| `apps/admin` | Admin dashboard, Vite + React + react-router |
| `apps/mobile` | Mobile app, Expo + Expo Router + Reanimated |
| `packages/tokens` | Colors, type, radius, motion tokens + shared CSS |
| `packages/icons` | One icon set (data), rendered by web and mobile |
| `packages/shared` | Types, sample data, formatters, zod schemas, API client |

## Run

```bash
pnpm install
pnpm dev:web      # http://localhost:3000
pnpm dev:admin    # http://localhost:5174  (demo login: any email + 6+ char password)
pnpm dev:mobile   # scan the QR code with Expo Go
pnpm typecheck
```

On Termux, run the web or admin dev server and open it in your phone browser. Run the mobile app with Expo Go pointed at the QR code (or `--tunnel`).

## Google sign in (mobile)

Sign in and sign up are the same button: Google tells the app who you are and the account is created on first use. Create OAuth client IDs in Google Cloud Console (Web, Android with package `com.ridewithme.app` and your SHA-1, iOS with bundle ID `com.ridewithme.app`), then put them in `apps/mobile/.env`:

```bash
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=...
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=...
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=...
# optional, shown on the Help screen
EXPO_PUBLIC_SUPPORT_EMAIL=...
EXPO_PUBLIC_SUPPORT_PHONE=...
```

Google's native redirect does not work inside Expo Go. Test it in a development build (`npx expo run:android` or an EAS dev build). Without the IDs the button shows a setup message instead of failing.

## Real backend

Everything runs on sample data from `@rwm/shared` until you set `NEXT_PUBLIC_API_URL`. `createApiClient` in `packages/shared/src/api.ts` is the single place to match your endpoints.

## Notes

- Keep React on the same version in every app (pinned to 19.1.0 via `pnpm.overrides`).
- Expo pins native module versions. If Expo Go complains, run `cd apps/mobile && npx expo install --fix`.
- Vehicle images are placeholders (`VehicleArt`). Swap for real photos.
- Deploy: import `apps/web` on Vercel (root directory `apps/web`, install command `pnpm install`) and `apps/admin` as a second project.
