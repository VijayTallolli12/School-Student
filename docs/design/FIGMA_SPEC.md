# Figma Specification (v1)

Mapping between design tokens and Figma styles so designers and engineers stay in sync.

## Color styles

| Figma style            | Token        | Value   |
| ---------------------- | ------------ | ------- |
| Brand / Iris 500       | `brand`      | `#7C4DFF` |
| Brand Deep             | `brandDeep`  | `#582BCB` |
| Secondary / Mint      | `secondary`  | `#2DB392` |
| Accent / Sunset       | `accent`     | `#FB5E1D` |
| Success                | `success`    | `#10B981` |
| Warning                | `warning`    | `#F59E0B` |
| Error                  | `error`      | `#EF3D5B` |
| Info                   | `info`       | `#06B6D4` |
| Background             | `background` | `#F7F6FC` |
| Surface / Card         | `card`       | `#FFFFFF` |
| Surface / Subtle       | `surfaceSubtle` | `#F0EEF7` |
| Surface / Sunken       | `surfaceSunken` | `#E9E7F5` |
| Border                 | `border`/`divider` | `#E4E2F0`/`#EEECF7` |
| Text / Primary         | `text`          | `#1B1830` |
| Text / Secondary       | `textSecondary` | `#5C5B78` |
| Text / Muted           | `textMuted`     | `#A5A2BC` |
| Text / Tertiary        | `textTertiary`  | `#9E9BB8` |
| Text / Inverse         | `onBrand`       | `#FFFFFF` |

## Type styles (base)

Name styles `DS/…`: Display 40, DisplaySm 34, Headline 28, HeadlineSm 24,
Title 20, SectionTitle 17, Subtitle 17, Body 15, BodyStrong 15, BodySm 13,
Caption 12, Overline 11, Button 15, Label 13, Metric 30, MetricSm 22.
(Weights 800/700/600/500/400 per `typography.ts`.)

## Spacing (4px grid)

`xs4 · sm8 · md12 · lg16 · xl20 · 2xl24 · 3xl32 · 4xl40 · 5xl48 · 6xl56 · 7xl64`.

## Radius

`sm10 · md14 · lg18 · xl24 · 2xl32 · full9999`.

## Component anatomy

- **Button (MD)**: height 48, radius 14, horizontal padding 20, text `Button` 15/700.
  Loading → spinner replaces content; disabled → opacity 0.38.
- **Card (elevated)**: radius 18, bg white, shadow `flat`.
- **HeroCard**: radius 32, brand fill, decorative 12% white circles, avatar ring 3/white.
- **StatCard**: radius 18, icon chip 30px `${token}1A`, metricSm value, caption label.
- **QuickActionButton**: radius 18, icon chip 34px, min height 86.

## Tokens as variables

Publish the palette + type scale as Figma variables bound to these names so theme
swaps (dark + school branding) update the entire design automatically.