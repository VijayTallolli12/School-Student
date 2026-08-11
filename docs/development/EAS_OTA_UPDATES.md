# Student App — EAS OTA Update Workflow

This document describes how the School Student App delivers JavaScript/UI changes to
installed devices using **Expo EAS Update** — without requiring users to install a new APK.

## How it works

```
CODE CHANGE
   ↓
eas update --channel production --message "description"
   ↓
EAS Update server
   ↓
Existing installed OTA-capable APK (checks on launch)
   ↓
Download update → restart/reopen app
   ↓
New JS/UI is live (no new APK, no reinstall)
```

The installed APK already contains the native `expo-updates` runtime, the EAS update URL,
a runtime version, and the channel it listens to. Any compatible JS/UI change is pushed over
the air.

## Project facts

| Item | Value |
|------|-------|
| Expo SDK | 54.0.0 |
| EAS project | `@vijaytallolli/school-student` |
| EAS project ID | `9d2d91c1-c334-49b0-b5c2-e9865b3c7a49` |
| Updates URL | `https://u.expo.dev/9d2d91c1-c334-49b0-b5c2-e9865b3c7a49` |
| Runtime version | `1.0.0` (policy: `appVersion`) |
| Runtime version policy | `appVersion` (runtime version == app version) |
| Production channel | `production` (production build listens here) |
| Preview channel | `preview` (preview build listens here) |
| Production API URL | `https://paleturquoise-monkey-126256.hostingersite.com` |
| Android package | `com.folkslogic.schoolstudent` |
| Update check | `ON_LOAD` (checks on app launch) |

## Normal JS/UI change workflow

1. Modify the code (screens, styles, logic, compatible assets).
2. Test locally (`npm start` / `npx expo start`).
3. Type-check: `npx tsc --noEmit`.
4. Publish the update to the **production** channel:

```sh
# Use the exact EAS project environment (production API URL):
eas update --channel production --message "Describe the change"
```

5. Existing installed Student APKs on the `production` channel will receive the update
   on next launch (the app checks on launch). Users simply reopen/restart the app.

> For a staging/internal build, publish to the preview channel instead:
> `eas update --channel preview --message "…"`

### Important — environment safety

EAS Update bundles the project as-is from the shell. `EXPO_PUBLIC_API_URL` is inlined at
bundle time. **Always ensure the shell does not load `.env.development`**
(`EXPO_PUBLIC_API_URL=http://192.168.1.3:8000`).

- Local dev uses `.env.development` (LAN URL) — safe for `npm start` only.
- Production builds/updates must resolve the production URL.

`expo export`/`eas update` force `NODE_ENV=production`, which loads `.env.production`
(production URL). To be explicit, set it in the shell:

```sh
# PowerShell
$env:EXPO_PUBLIC_API_URL="https://paleturquoise-monkey-126256.hostingersite.com"
eas update --channel production --message "…"
```

Verify the inlined URL after bundling before publishing if in doubt.

## Native change rule (requires a NEW APK)

The following require a new `eas build` + new APK (they change the native runtime and are
**NOT** deliverable via EAS Update):

- installing/removing a native module
- Android/iOS native code changes
- adding/changing native permissions
- native configuration changes
- Expo SDK upgrades that change the native runtime
- any change that alters the runtime version

Workflow:

```
NATIVE CHANGE
   ↓
eas build --platform android --profile production
   ↓
install new APK
   ↓
future OTA updates continue on the new runtime
```

Because `runtimeVersion.policy = "appVersion"`, bumping `version` in the app config
automatically produces a **new runtime version**, forcing a new APK — that is the intended
gate so incompatible updates are never pushed to old binaries.

## Channel / runtime verification

- Build `production` → channel `production`, runtime `1.0.0`
- Build `preview` → channel `preview`, runtime `1.0.0` (same runtime, different channel)

An APK only receives updates published to its own channel. Publishing to `preview` will
**not** reach a `production` APK and vice-versa.

Verify with:

```sh
eas build:list --platform android --limit 5
eas update:list --channel production
eas channel:list
```

## Rollback / revert safety

If a bad JS update is published:

1. Publish a corrected update to the same channel:
   ```sh
   eas update --channel production --message "Rollback fix"
   ```
2. Or roll the channel back to a previous branch/update group:
   ```sh
   eas channel:edit production --branch <previous-branch>
   ```
3. Or point the channel back to the embedded/previous update group.

The previous working update remains on the server and is recoverable — do not delete it
until the new update is verified.

## One-time baseline build

The currently installed APK (built 2026-08-07) does **not** contain EAS Update
configuration and is **not** OTA-capable. A new baseline APK was created after this
configuration (channel `production`, runtime `1.0.0`). Install that APK once; all
subsequent compatible JS/UI changes use `eas update` only.
