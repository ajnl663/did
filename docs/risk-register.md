# Risk Register

| ID | Risk | Likelihood | Impact | Mitigation | Status | Owner |
|----|------|------------|--------|------------|--------|-------|
| R1 | Offline payloads too large for one QR | High | High | Chunked QR frames (measured in S-E), animated loop | Active | Mobile |
| R2 | Revocation witness refresh needs connectivity | High | Medium | Staleness window policy, Mechanism B as alternative | Active | Backend |
| R3 | Slow proof generation on low-end phones | Medium | High | Test real devices early (S-C), reduce attrs/proof | Active | Mobile |
| R4 | Ecosystem churn (ACA-Py, Credo, Bifold updates) | High | Medium | Isolation interfaces (CredentialEngine, LedgerReader) | Active | All |
| R5 | Fake issuers in consortium | Medium | High | Tiered trust chain, co-attestation, audit logs | Active | Governance |
| R6 | Fake verifiers harvesting data | Medium | High | Signed requests, verifier identity on consent screen | Active | Mobile |
| R7 | Replay/relay of QR exchanges | Medium | High | Nonce, expiry, session binding in QR protocol | Active | Mobile |
| R8 | Tampered trust bundle or cache | Low | Critical | Signature verification, pinned root key | Active | Mobile/Backend |
| R9 | Stale revocation exploited | Medium | High | Staleness policy (reject/flag/accept per credential) | Active | Verifier |
| R10 | Stolen/shared phone | Medium | High | PIN/biometric, auto-lock, shared-device safety | Active | Mobile |
| R11 | Coercion (employer demanding presentation) | Medium | High | Consent screens, verifier accountability, cannot prevent | Documented | All |
| R12 | Issuer insider abuse | Low | High | RBAC, audit hash chain, dual approval for bulk revoke | Active | Backend |
| R13 | Metadata leakage | Low | Medium | No PII on ledger, pairwise DIDs, linkability analysis | Active | All |
| R14 | Supply chain risk | Medium | Medium | Pinned versions, SBOM, scanners (syft, trivy) | Active | DevOps |
| R15 | AI-generated code security weaknesses | Medium | High | Human review of CODEOWNERS files, audited libs only | Active | All |
| R16 | Institutions won't run validators | High | High | Governance proposal, demo with team-run nodes, document dependency | Active | Governance |
| R17 | Ethics approval delays | Medium | Medium | Start month 1, proxy-user fallback for demo | Active | Team |
| R18 | Scope creep (Phase 2/Future in MVP) | High | Medium | Strict gate at M-FE, Phase 2 only after release | Active | PM |
| R19 | Reviewer says prior art covers offline | Medium | Medium | Position against ISO 18013-5, Aadhaar Secure QR explicitly | Active | Research |
| R20 | Bifold integration blocks M-FE | High | High | ADR-001: defer to standalone Expo app | Mitigated | Mobile |

## Risk Categories
- **Technical**: R1, R2, R3, R4, R7, R8, R14
- **Security**: R5, R6, R9, R10, R11, R12, R13, R15
- **Governance**: R16, R17
- **Project**: R18, R19, R20

## Review Schedule
- Weekly during M-FE
- At each milestone gate
- Before M10 evaluation