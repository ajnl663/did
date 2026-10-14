# STRIDE Threat Model

## Assets
| Asset | Description | Sensitivity |
|-------|-------------|-------------|
| Holder Credentials | AnonCreds in wallet | HIGH (PII-equivalent) |
| Holder Private Keys | Link secret, pairwise DID keys | CRITICAL |
| Issuer Signing Keys | Credential issuance keys | CRITICAL |
| Trust Bundle | Signed consortium trust data | HIGH |
| Revocation Data | Accumulator witnesses, status lists | MEDIUM |
| Audit Logs | Hash-chained tamper-evident logs | MEDIUM |
| Verification Events | Verification results (no PII) | LOW |

## Trust Boundaries
```
┌─────────────────────────────────────────────────────────────┐
│                    CONSORTIUM NETWORK                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Trust      │  │  Issuer     │  │  Verifier           │  │
│  │  Registry   │  │  Service    │  │  Service            │  │
│  │  (Indy)     │  │  (ACA-Py)   │  │  (FastAPI)          │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
└─────────┼────────────────┼─────────────────────┼─────────────┘
          │                │                     │
    ┌─────┴─────┐    ┌─────┴─────┐       ┌──────┴──────┐
    │  Holder   │    │  Issuer   │       │  Verifier   │
    │  Wallet   │    │  Portal   │       │  Portal/App │
    │ (Android) │    │  (Web)    │       │  (Web/App)  │
    └───────────┘    └───────────┘       └─────────────┘
```

## Threat Analysis

### Spoofing
| ID | Threat | Mitigation |
|----|--------|------------|
| S1 | Fake issuer joins consortium | Governance approval, Tier 1 accreditation, audit logs |
| S2 | Fake verifier requests credentials | Verifier identity shown on consent screen, signed requests optional |
| S3 | Attacker spoofs holder DID | Pairwise DIDs, link secret, wallet PIN/biometric |
| S4 | Fake trust bundle served | Pinned root verkey, EdDSA JWS signature verification |

### Tampering
| ID | Threat | Mitigation |
|----|--------|------------|
| T1 | Credential modified in transit | AnonCreds signatures, holder verifies on receipt |
| T2 | Trust bundle modified | EdDSA JWS signature, root key pinning |
| T3 | Revocation status tampered | Signed status lists (Mech B), accumulator (Mech A), ledger anchoring |
| T4 | Audit log entries modified | Hash-chained logs, append-only, verification CLI |
| T5 | QR presentation tampered | Session binding, nonce, expiry, CRC32 per frame |

### Repudiation
| ID | Threat | Mitigation |
|----|--------|------------|
| R1 | Issuer denies issuing credential | Audit log with hash chain, ledger anchoring of revocation |
| R2 | Holder denies presenting credential | Verification event logged by verifier (no PII) |
| R3 | Verifier denies verification result | Verification event with hash chain |

### Information Disclosure
| ID | Threat | Mitigation |
|----|--------|------------|
| I1 | PII on ledger | **Design rule**: Only DIDs, schemas, cred defs, revocation data on ledger |
| I2 | Credentials leaked from wallet | Android Keystore for unlock key, Askar encrypted store for credentials |
| I3 | Verifier learns more than necessary | Selective disclosure, predicate proofs, no raw values in logs |
| I4 | Linkability via Mechanism B status_index | Documented privacy trade-off, Mechanism A alternative |
| I5 | Metadata in logs | Log references, hashes, types, results, timestamps only |

### Denial of Service
| ID | Threat | Mitigation |
|----|--------|------------|
| D1 | Ledger unavailable | Verification works offline from cached trust bundle |
| D2 | Trust registry down | Verifiers use cached bundle (staleness policy) |
| D3 | Tails server down | Witness refresh delayed, staleness window applies |
| D4 | DIDComm mediator down | Return-route fallback for in-session issuance |

### Elevation of Privilege
| ID | Threat | Mitigation |
|----|--------|------------|
| E1 | Tier 3 issuer delegates further | Accreditation credential enforces tier rules, validation in trust-registry |
| E2 | Issuer issues unauthorized schema | Schema authorization in accreditation credential |
| E3 | Verifier accesses unauthorized data | Policy enforcement in verifier-service, RBAC in Keycloak |
| E4 | Admin privilege escalation | Keycloak RBAC, audit logs, role negative tests |

## Security Controls Summary

| Control | Implementation |
|---------|----------------|
| **Cryptography** | Audited libs only (anoncreds-rs, indy-vdr, libsodium, jose) |
| **Key Storage** | Android Keystore (unlock), Askar (credentials), HSM for production issuers |
| **Authentication** | Keycloak OIDC, RBAC, MFA for production |
| **Authorization** | Role+org checks on every API call, policy enforcement in verifier |
| **Audit** | Hash-chained logs, no PII, tamper-evident |
| **Network** | TLS everywhere, no public blockchain, no IPFS |
| **Mobile** | PIN/biometric, auto-lock, encrypted storage, offline-first |
| **Supply Chain** | Pinned deps, SBOM, trivy/syft scans, gitleaks in CI |

## Residual Risks
1. **Coercion**: Employer forces worker to present → Consent screen + verifier accountability mitigates but cannot eliminate
2. **Linkability (Mech B)**: status_index reveals correlation → Documented, Mechanism A alternative
3. **Validator operation**: Institutions may not run nodes → Governance dependency, documented
4. **AI code**: Security weaknesses in generated code → Human review required for CODEOWNERS files