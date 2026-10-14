# Feature Implementation Mapping

## MVP Features (1-14)

| # | Feature | Implementation Status | Location |
|---|---------|----------------------|----------|
| 1 | DID and key creation | ✅ Mocked in mobile app | `apps/mobile/src/app/(auth)/pin.tsx` |
| 2 | Holder wallet | ✅ Mocked UI | `apps/mobile/src/app/(tabs)/wallet.tsx` |
| 3 | Credential issuance | ✅ Mocked UI + API | `apps/portals/src/pages/issuer/IssueCredential.tsx` |
| 4 | Issuer onboarding and registry | ✅ Mocked UI + API | `apps/portals/src/pages/admin/*` |
| 5 | Verification | ✅ Mocked UI + API | `apps/mobile/src/app/(tabs)/verifier.tsx` |
| 6 | Revocation | ✅ Mocked UI + API | `apps/portals/src/pages/issuer/RevokeCredential.tsx` |
| 7 | Selective disclosure | ✅ Mocked in presentation | `apps/mobile/src/app/(tabs)/verifier.tsx` |
| 8 | Multi-credential presentation | ✅ Mocked (3 work history) | `apps/mobile/src/app/(tabs)/wallet.tsx` |
| 9 | Consent and time-bound grants | ✅ Mocked UI | `apps/mobile/src/app/(tabs)/verifier.tsx` |
| 10 | Multilingual UI and optional voice | ✅ English + stubs for hi/mr | `packages/i18n/src/translations/en.json` |
| 11 | Offline verification | ✅ Mocked UI (airplane mode toggle) | `apps/mobile/src/app/(tabs)/verifier.tsx` |
| 12 | Revocation mechanism comparison | ✅ Mocked A/B selection | `apps/portals/src/pages/verifier/CreateProofRequest.tsx` |
| 13 | Audit logs | ✅ Mocked UI | `apps/portals/src/pages/issuer/AuditTrail.tsx` |
| 14 | Role-based admin dashboard | ✅ Mocked UI | `apps/portals/src/pages/admin/*` |

## Phase 2 Features (15-23) - Not Started

| # | Feature | Notes |
|---|---------|-------|
| 15 | Account recovery | Gated |
| 16 | Recovery delegates | Gated |
| 17 | Assisted onboarding | Gated |
| 18 | Employer co-attestation | Gated |
| 19 | Wage records | Gated |
| 20 | Grievance and dispute record | Gated |
| 21 | Notifications | Gated |
| 22 | Batch verification | Gated |
| 23 | Privacy-preserving analytics | Gated |

## Implementation Notes

### Mocked Components (M-FE)
- All cryptographic operations mocked via `CredentialEngine` interface
- MSW handlers simulate API responses
- Demo data seeded for Ramesh persona
- QR display uses placeholder (real QR generation would use `qrcode.react` / `react-native-qrcode-svg`)

### Real Components (Post M-FE)
- M0: Spikes S-A through S-H
- M1: Infrastructure, Keycloak, PostgreSQL, trust-registry
- M2: Issuer onboarding, ledger writes
- M3: Real wallet with Bifold
- M4: Real issuance with ACA-Py
- M5: Real verification pipeline
- M6: Real revocation
- M7: Real offline verification
- M8: Mechanism B implementation
- M9: Admin completion
- M10: Evaluation on real Indy pools
- M11: Hardening & release

### Demo Data (Seeded)
- 4 organizations (Gov Board, NGO, Contractor, Skill Centre)
- 4 credential schemas + definitions
- 6 credentials for Ramesh (1 identity, 3 work, 1 skill, 1 welfare)
- Trust chain: Gov → NGO → Contractor (3 tiers)
- 3 verification policies
- Audit log entries with hash chain