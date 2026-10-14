# ADR-001: Defer Bifold Integration, Use Standalone React Native App

## Status
Accepted

## Date
2026-10-11

## Context
The project plan specifies using Bifold (React Native, Credo-TS) as the wallet base. However, the M-FE deadline (2026-10-20) requires a working frontend demo in 4 days. Bifold integration involves:
- Forking or consuming Bifold core as dependency
- Adding verifier mode (not in Bifold)
- i18n for Hindi/Marathi
- Custom QR chunking protocol
- Offline verification engine integration

Time-boxed spike S-G (1-2 days) showed Bifold setup would consume most of M-FE timeline.

## Decision
Build a **standalone Expo React Native app** behind the `CredentialEngine` interface. Defer Bifold integration to post-M-FE (M0/M3).

## Consequences

### Positive
- Meets M-FE deadline with working UI demo
- Clean separation via `CredentialEngine` interface enables swap later
- Full control over verifier mode, offline QR, chunked frames
- Faster iteration on UI/UX for demo

### Negative
- No real cryptography in demo (mocked via `CredentialEngine`)
- Duplicate effort if Bifold adopted later
- Must maintain interface compatibility

## Implementation
- `packages/credential-engine/src/engine.ts` - Interface definition
- `packages/credential-engine/src/mockEngine.ts` - Mock implementation for demo
- `apps/mobile/src/context/CredentialEngineContext.tsx` - React context provider
- Mobile app consumes interface, unaware of mock vs real

## Future Work
- M3: Replace mock engine with Bifold + Credo-TS + AnonCreds
- Ensure interface compatibility during migration
- Add real cryptography, key storage, DIDComm

## References
- Master Prompt Part H1, H2, H3
- Part N Isolation requirement
- Spike S-G time-boxed to 1-2 days