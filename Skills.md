# SKILL.md

# School ERP Mobile App Development Standards

This document defines the engineering, UI/UX, architecture, coding, and quality standards that every AI agent must follow while building the School ERP mobile applications.

These standards are **mandatory**.

The objective is to ensure the Student App, Teacher App, Parent App, and Driver App all look and behave like a single premium SaaS product.

---

# PROJECT OVERVIEW

Apps in ecosystem

* School ERP (Laravel Backend)
* Parent App
* Teacher App
* Student App
* Driver App

Backend

Laravel

Authentication

Laravel Sanctum

API Version

/api/v1

Framework

React Native + Expo SDK 54

Language

TypeScript

Navigation

React Navigation

Data Fetching

React Query

State

Zustand

Storage

AsyncStorage

Icons

Expo Vector Icons

---

# CORE PRINCIPLES

Never duplicate business logic.

Always consume existing ERP APIs.

Never hardcode data.

Never create fake endpoints.

Always reuse shared components.

Always build production-quality code.

Every screen must support:

* Loading
* Empty
* Error
* Success

---

# UI DESIGN STANDARD

Target quality:

Premium SaaS Mobile Application

Inspiration:

Stripe

Linear

Notion

Slack

Microsoft Teams

Google Workspace

Avoid template-like UI.

The application must feel custom designed.

---

# DESIGN SYSTEM

Every screen must use the shared design system.

Never use arbitrary spacing.

Use spacing scale only:

4

8

12

16

20

24

32

40

Use common:

Colors

Typography

Radius

Shadow

Elevation

Animations

Never redefine styles inside screens.

---

# SAFE AREA

Every screen MUST use:

SafeAreaView

react-native-safe-area-context

useSafeAreaInsets()

Content must NEVER render:

behind Android status bar

behind iPhone notch

behind bottom navigation

behind gesture area

---

# SCREEN LAYOUT

Every screen must use the shared ScreenLayout component.

Responsibilities:

Safe Area

Padding

Keyboard handling

Scroll handling

Loading wrapper

Empty wrapper

Error wrapper

No screen should implement its own layout.

---

# HEADER

Every page must use AppHeader.

Consistent:

Height

Typography

Spacing

Back button

Actions

Notification icon

Never manually build page headers.

---

# CARD SYSTEM

Use reusable cards only.

MetricCard

SummaryCard

ActionCard

ListCard

BaseCard

All cards must have:

consistent radius

consistent shadow

consistent elevation

consistent padding

consistent hover/press animation

---

# TYPOGRAPHY

Use design tokens only.

Heading XL

Heading L

Heading M

Body

Caption

Label

Never use random font sizes.

---

# BUTTONS

Primary

Secondary

Outline

Danger

Ghost

Loading

Disabled

Use reusable Button component.

Never create custom buttons per screen.

---

# LISTS

Always use FlatList.

Support:

Pull to Refresh

Skeleton loading

Pagination (if backend supports)

Empty state

Retry state

Search

Filter

---

# FORMS

React Hook Form

Validation

Zod

Every form requires:

inline validation

disabled submit while loading

error handling

success feedback

---

# API RULES

Never guess endpoints.

Always verify:

Method

Path

Parameters

Response

Status

Never modify backend contracts.

---

# DATA MAPPING

Never trust API values.

Always map responses.

Use fallback values:

??

Optional chaining:

?.

Null values must never crash UI.

---

# ERROR HANDLING

Every API screen must support:

Loading

Empty

Error

Retry

Offline

Authentication failure

Never show red screen.

Never crash.

---

# REACT QUERY

All API calls must use React Query.

Configure:

Caching

Invalidation

Refetch

Loading

Retry

Never manually cache.

---

# ZUSTAND

Use Zustand only for:

Authentication

Settings

Theme

Global preferences

Do NOT store API data.

---

# PERFORMANCE

Use:

memo

useMemo

useCallback

FlatList optimization

Avoid unnecessary re-renders.

---

# NAVIGATION

Keep navigation simple.

Root

Authentication

Main Tabs

Feature Stacks

Deep linking ready.

---

# ANIMATIONS

Use subtle animations only.

Press scale

Fade

Slide

Skeleton shimmer

Avoid excessive motion.

---

# ACCESSIBILITY

Support:

Screen readers

Touch targets

Contrast

Dynamic text

Accessibility labels

---

# CODE QUALITY

Every feature must include:

API layer

Hooks

Types

Components

Screens

Navigation

Audit document

No feature is complete without documentation.

---

# FILE STRUCTURE

src/

api/

components/

hooks/

navigation/

screens/

store/

theme/

types/

utils/

services/

constants/

assets/

Follow this structure strictly.

---

# TESTING CHECKLIST

Every module must verify:

API connectivity

Loading state

Empty state

Error state

Success state

Pull to Refresh

Navigation

TypeScript

No runtime crashes

---

# DOCUMENTATION

Each completed module must generate:

<FEATURE>_AUDIT.md

Include:

Files created

Files modified

API endpoints

Components

Performance notes

Verification

Known limitations

---

# UI/UX REQUIREMENTS

The application must never feel like an admin template.

Every screen should have:

Clear hierarchy

Balanced whitespace

Consistent spacing

Premium cards

Professional iconography

Smooth interactions

Consistent headers

Consistent footers

Elegant empty states

High-quality loading skeletons

Micro animations

The overall experience should match a commercial SaaS product.

---

# BEFORE MARKING A FEATURE COMPLETE

Verify:

✓ No TypeScript errors

✓ No crashes

✓ No undefined values

✓ No hardcoded data

✓ API integration complete

✓ Empty state works

✓ Error state works

✓ Loading state works

✓ Documentation created

✓ UI matches design system

✓ Ready for stakeholder demo

Do not mark any phase complete unless every item above has been satisfied.
