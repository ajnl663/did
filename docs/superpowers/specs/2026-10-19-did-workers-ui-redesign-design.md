# DID Workers UI Redesign Design

## Summary

This redesign keeps the existing DID Workers architecture intact while substantially improving the visual quality, consistency, responsiveness, and usability of the product. The work covers the routed portals application in `apps/portals`, the Expo mobile wallet in `apps/mobile`, and the shared component foundation in `packages/design-system`.

The three portals must feel like one related product, not three separate apps. They will share one shell model, one component language, one spacing and typography system, and one interaction model. Visual variation between portals will be limited to restrained accent usage and domain-specific content treatment.

## Product Context

The project currently contains:

- One Vite + React + TypeScript portals app in `apps/portals`
- Three logical portal experiences inside that app:
  - Issuer portal
  - Verifier portal
  - Admin portal
- One Expo 51 + React Native 0.74 mobile app in `apps/mobile`
- One shared design-system package in `packages/design-system`
- Shared data and utility packages in `packages/credential-engine`, `packages/i18n`, and `packages/mock-api`

The redesign must improve the real source code already in use. It must not replace the app architecture, rewrite routing, or disconnect the frontend from its existing credential-engine, auth flow, or data model.

## Goals

- Make the portals feel polished, modern, and production-quality
- Make the three portals visually consistent and clearly related
- Establish a reusable design system for web and mobile
- Improve navigation, layout rhythm, readability, feedback states, forms, tables, and detail views
- Preserve existing routes, state, APIs, workflows, role flows, and business logic
- Redesign portals first, then redesign the mobile app using the same product language adapted for mobile

## Non-Goals

- No framework migration
- No backend rewrite
- No API contract changes unless required by existing broken UI integration
- No replacement of working business logic with mock or hardcoded UI-only data
- No introduction of multiple competing UI libraries for the web portals
- No conversion of the mobile app into a web-style dashboard

## Constraints

- The portals stay in the existing React Router application in `apps/portals/src/App.tsx`
- The mobile app stays on Expo Router in `apps/mobile/src/app`
- Existing login, routing, credential engine integration, and role navigation must keep working
- Existing forms and actions must preserve their current submission and validation behavior
- Existing environment handling must not change
- Work must be staged in small, reviewable slices
- Browser-based verification may be used for web portals; mobile verification must be described accurately if emulator support is limited

## Current-State Findings

### Shared Web Findings

- The repo already contains a custom shared UI layer in `packages/design-system`, so the best path is to improve it rather than add a second component system
- The portals already share a common `Layout` component, which makes shell-level consistency practical
- The current layouts repeat similar patterns but do not yet feel unified enough in hierarchy, density, and navigation treatment
- Tables, forms, cards, and feedback states are inconsistent across pages
- Some pages still rely on basic visual treatments that feel closer to a prototype than a finished product

### Portal Findings

- The portals are implemented as one routed app, not three separate deployable apps
- Issuer, Verifier, and Admin currently use similar structures but with inconsistent emphasis and weak active-state weight
- Navigation density and header behavior vary more than needed for a related product family
- Several important workflows are present, but visual guidance through those workflows is not strong enough

### Mobile Findings

- Mobile already has Expo, expo-router, and NativeWind installed
- NativeWind is underused; many screens still rely on handwritten `StyleSheet` blocks with hardcoded values
- The mobile screens need stronger safe-area handling, better hierarchy, cleaner spacing, and more consistent touch targets
- The mobile redesign should reuse the same product language while staying platform-appropriate

## Library Strategy

### Web

The recommended web strategy is to continue using:

- React 18
- Tailwind CSS
- The existing `@did-workers/design-system`

The redesign should not adopt `shadcn/ui`, `Radix UI`, or any other parallel component system unless a specific missing capability cannot be solved cleanly in the existing shared package. Based on the current codebase, that migration is unnecessary and would increase inconsistency risk.

### Mobile

The recommended mobile strategy is to continue using:

- Expo 51
- React Native 0.74
- Expo Router
- NativeWind
- Existing Expo-compatible icon libraries already in the app

The redesign should not add React DOM style dependencies or web-only UI patterns to the mobile app.

## Design Direction

### Product Character

The visual direction should feel trustworthy, professional, and calm. It should look like modern operational software used by real organizations, not a marketing site and not a generic dashboard template.

### Shell Direction

- Dark sidebar across all three portals
- Light main content area
- Clear page header structure
- Strong but restrained active states
- Consistent layout widths, spacing, and section rhythm
- Consistent information density across tables, forms, and detail views

### Portal Family Rules

The three portals must share:

- The same sidebar architecture
- The same header structure
- The same page container rules
- The same component styles for buttons, inputs, tables, badges, dialogs, alerts, and empty states
- The same responsive behavior patterns

The three portals may differ only in:

- Accent color emphasis
- Domain-specific page patterns
- Contextual icon usage
- Small copy and metadata differences tied to user roles

## Design System Specification

### Core Tokens

The shared system should define and consistently apply:

- Color tokens for:
  - base backgrounds
  - elevated surfaces
  - borders
  - text hierarchy
  - primary action
  - success
  - warning
  - danger
  - subtle role accents
- Typography tokens for:
  - page titles
  - section headings
  - body text
  - labels
  - table headers
  - captions
  - monospace technical values where needed
- Spacing tokens built around a consistent 4px or 8px rhythm
- Border radius tokens for controls, panels, and badges
- Shadow tokens for low-elevation and hover-elevation surfaces
- Breakpoints for desktop, tablet, and mobile layouts

### Web Component Standards

The web design system must provide consistent patterns for:

- App shell layout
- Sidebar navigation
- Top bar actions
- Page headers
- Button variants, including icon-only actions
- Inputs, selects, and field groups
- Tabs and segmented controls
- Tables with hover, density, and status affordances
- Cards and stat summaries
- Badges and status labels
- Alerts and notifications
- Empty states
- Skeleton loading states
- Dialogs and confirmation modals
- Dropdown menus

### Mobile Component Standards

The mobile redesign should mirror the same product language using native patterns for:

- Screen containers with safe-area awareness
- Section headers
- Action buttons
- List rows
- Credential cards
- Form fields
- PIN entry surfaces
- Bottom actions
- Loading and empty states
- Result states

## Architecture and Implementation Boundaries

### Shared Foundation First

The first implementation layer should be the shared web design-system package and the common portals shell. This avoids redesigning pages one by one with duplicated styling logic.

Primary files likely to carry this layer include:

- `packages/design-system/src/components/Layout.tsx`
- `packages/design-system/src/components/Button.tsx`
- `packages/design-system/src/components/Card.tsx`
- `packages/design-system/src/components/Input.tsx`
- `packages/design-system/src/components/Table.tsx`
- `packages/design-system/src/components/Dropdown.tsx`
- `packages/design-system/src/components/Modal.tsx`
- `packages/design-system/src/components/StatCard.tsx`
- `packages/design-system/src/index.ts`
- `apps/portals/src/index.css`
- `apps/portals/src/layouts/IssuerLayout.tsx`
- `apps/portals/src/layouts/VerifierLayout.tsx`
- `apps/portals/src/layouts/AdminLayout.tsx`

New shared components are appropriate where repetition is already visible, especially for:

- skeleton loading
- reusable empty states
- possibly drawer behavior if the current layout logic needs separation

### Portal Pages Second

Once the foundation is stable, each portal should be redesigned within its existing route structure.

#### Issuer Portal Priority Pages

- `IssuerDashboard.tsx`
- `ConnectWorker.tsx`
- `IssueCredential.tsx`
- `IssuedCredentials.tsx`
- `BulkIssue.tsx`
- `AuditTrail.tsx`
- Then remaining issuer support pages

#### Verifier Portal Priority Pages

- `VerifierDashboard.tsx`
- `CreateProofRequest.tsx`
- `ProofRequestList.tsx`
- `VerificationResult.tsx`
- `VerifierHistory.tsx`

#### Admin Portal Priority Pages

- `AdminDashboard.tsx`
- `IssuerRegistry.tsx`
- `AuditLogs.tsx`
- `Monitoring.tsx`
- `UserManagement.tsx`
- `OnboardIssuer.tsx`
- `TrustBundleStatus.tsx`
- `TrustChainView.tsx`

### Mobile Third

After the portals are visually coherent, the mobile app should be redesigned using the same system translated into native components and NativeWind class patterns.

Priority screens:

- `src/app/(auth)/language.tsx`
- `src/app/(auth)/pin.tsx`
- `src/app/(tabs)/wallet.tsx`
- `src/app/(tabs)/verifier.tsx`
- `src/app/connect.tsx`
- `src/app/settings.tsx`
- supporting layout files in `src/app/_layout.tsx` and `src/app/(tabs)/_layout.tsx`

## User Experience Plan

### Shared Portal Shell

All portals will move to a shared shell behavior:

- left dark sidebar with a clear product identity block
- primary nav grouped with consistent icons and hover/active treatment
- lightweight top bar with page context and utility actions
- main content container with controlled max width and consistent padding
- mobile drawer behavior consistent across portals

### Issuer Experience

The issuer portal should feel action-oriented and workflow-driven. Its UI should make issuance flows clearer, especially on connection, issuing, bulk issuing, and reviewing issued credentials.

Improvements will emphasize:

- better step progression
- clearer form grouping
- more polished upload and review states
- better table readability
- stronger detail and confirmation affordances

### Verifier Experience

The verifier portal should feel fast, readable, and confidence-oriented. It should make proof request creation and result interpretation immediate.

Improvements will emphasize:

- fast request creation
- readable request history
- strong pass/fail visual hierarchy
- clearer operational status feedback

### Admin Experience

The admin portal should feel structured, credible, and data-heavy without becoming visually noisy.

Improvements will emphasize:

- dense but readable tables
- operational clarity
- stronger status cues
- clearer governance and monitoring layouts

### Mobile Experience

The mobile app should feel like a wallet and verification tool, not a compressed portal. It should prioritize clear flows, accessible touch targets, readable lists, and strong state feedback.

Improvements will emphasize:

- safe-area-aware layouts
- improved PIN and auth flows
- better credential card hierarchy
- more native-feeling action placement
- better modal and result states

## Data Flow and Functional Preservation

The redesign must preserve the existing functional backbone:

- React Router route map in the portals app
- Expo Router route map in the mobile app
- `CredentialEngineProvider` usage in both apps
- current engine calls for credentials, offers, presentation generation, PIN flows, and verification actions
- current navigation destinations after auth and workflow actions

The redesign may reorganize component structure and styling, but it must not change the meaning of these flows or invent substitute data.

## Error Handling and State Feedback

The redesign must standardize feedback for:

- initial loading
- section loading
- empty lists
- form validation errors
- submit-in-progress actions
- success confirmations
- destructive confirmations
- recoverable action failures

For the web portals, these should be handled with shared components where possible. For mobile, the same state model should be adapted to native patterns such as alerts, inline feedback, and modal surfaces.

## Responsive and Accessibility Requirements

### Web

- sidebar must remain usable on mobile through a real drawer pattern
- page layouts must avoid horizontal overflow at common breakpoints
- forms and tables must remain readable on tablet widths
- interactive states must be visible through hover, focus, and disabled styles
- color contrast must support operational readability

### Mobile

- safe areas must be respected
- touch targets should meet practical mobile minimums
- text hierarchy must remain readable on smaller devices
- scrolling must remain smooth around keyboard entry and modal use

## Verification Strategy

### Automated Checks

At appropriate checkpoints, run:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm build:portals`

Mobile-specific checks should be run only when supported by the local environment. If the Expo environment blocks reliable runtime verification, that must be reported clearly rather than assumed complete.

### Visual Checks

For portals:

- run the portals app locally
- inspect login, dashboard, form, table, and detail pages
- test desktop, tablet, and mobile widths
- verify navigation, menus, dialogs, empty states, and loading states
- inspect console and failed network requests during major workflows

For mobile:

- verify screen structure and runtime behavior as far as the available Expo or simulator environment allows
- if full visual execution is not available, report the exact limitation and keep mobile claims narrower

## Risks

- Shared component changes can affect many pages at once, so shell and design-system updates must be verified carefully before broad rollout
- Some current pages may contain implicit assumptions about existing component props and layout behavior
- Mobile runtime verification may be partially constrained by the existing Expo workspace setup
- Visual improvements to dense pages can accidentally reduce clarity if spacing is made too loose

## Staged Rollout Plan

The implementation should proceed in this order:

1. Strengthen shared design-system primitives for the web portals
2. Unify the portal shell and global styling
3. Redesign the login experience
4. Redesign the issuer portal pages
5. Verify issuer workflows
6. Redesign the verifier portal pages
7. Verify verifier workflows
8. Redesign the admin portal pages
9. Verify admin workflows
10. Redesign the mobile app using the same design language in native form
11. Run cross-application consistency review
12. Run lint, typecheck, and build verification before signoff

## Decisions Locked In

- Use a dark sidebar for all three portals
- Keep the three portals visually consistent and clearly related
- Improve the existing shared design system instead of replacing it
- Keep the existing frameworks and route structure
- Redesign portals before the mobile app

## Deliverables

This redesign effort should produce:

- improved shared design-system components
- redesigned portal shell and global styling
- redesigned portal pages across issuer, verifier, and admin
- redesigned mobile wallet and verification screens
- a clear implementation plan tied to exact files and staged verification
- a final report describing verified changes, tests run, and remaining limitations
