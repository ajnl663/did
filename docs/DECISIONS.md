# Decision Log Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [001](adr/ADR-001-bifold-deferral.md) | Defer Bifold Integration | Accepted | 2026-10-11 |

## Upcoming Decisions (per Master Prompt Part Q)

| # | Question | Status |
|---|----------|--------|
| Q1 | Scope: MVP only or MVP + Phase 2? | Pending |
| Q2 | Project/repo name | ✅ `did-workers` |
| Q3 | D-TRUST-1: Auth credentials format | ✅ Signed JSON (EdDSA JWS) |
| Q4 | D-MEDIATOR: Run mediator? | ✅ Yes (Credo-TS) |
| Q5 | Cloud provider for eval pool | Pending |
| Q6 | Test devices, min Android version | ✅ API 34, Pixel 7a + 2GB device |
| Q7 | D-VOICE: Pre-recorded vs TTS | ✅ AI TTS bundled + Android TTS fallback |
| Q8 | D-GRANT: Single-use + time-bound grants | ✅ Both, grants default off |
| Q9 | Staleness defaults per credential type | ✅ Identity 72h, Work 168h, Welfare 24h, Skill 168h |
| Q10 | D-VERIFIER-ID: Signed verifier requests | ✅ Verifier name shown, signed optional |
| Q11 | Team split for CODEOWNERS | ✅ Solo developer |
| Q12 | Milestone dates & final submission | Pending |
| Q13 | Pinned versions confirmation | ✅ Documented in DEPENDENCIES.md |
| Q14 | Dual approval for bulk revocation | ✅ Off in MVP, documented |