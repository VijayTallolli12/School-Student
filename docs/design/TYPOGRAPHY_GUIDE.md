# Typography Guide

System: `typeScale` tokens + `scaled(role, fontScale)`. See `typography.ts`.

## Hierarchy cheat sheet

| Use case             | Role        |
| -------------------- | ----------- |
| Hero number (fee)    | `metric`    |
| Screen title         | `headlineSm` |
| Card title           | `title`     |
| Section header       | `sectionTitle` |
| Body copy            | `body` / `bodyStrong` |
| Meta / dates         | `bodySm` / `caption` |
| Uppercase eyebrow    | `overline`  |
| Button text          | `button`    |
| Input label          | `label`     |

## Rules

1. **One scale, five levels max per screen.** Display → Section → Body → Caption.
2. **Metrics** (numbers) use `metric`/`metricSm`: weight 800, tight negative tracking.
3. **Never set `fontFamily` manually** — tokens default to the system font for native
   speed and perfect font-scale support.
4. **Dynamic type:** call `scaled(role, fontScale)` for accessory emphasis; plain
   tokens already inherit the device font scale via React Native defaults.
5. **Line-height comes with the token.** Don't hand-tune per screen.
6. **Uppercase** is reserved for `overline`-style eyebrows (small, wide tracking).

## In code

```tsx
import { typeScale } from "@/design-system";

<Text style={{ ...typeScale.sectionTitle, color: colors.text }}>Attendance</Text>
```

Prefer the `DesignText` component for plain text:

```tsx
<DesignText role="title" color="text">Fee Summary</DesignText>
```