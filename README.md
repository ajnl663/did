# DID Workers - Decentralized Identity for Marginalized Workers

A self-sovereign identity (SSI) system for migrant and informal workers in Mumbai, India. Workers receive verifiable credentials (work history, skills, welfare eligibility) from NGOs, employers, and welfare boards via an Android wallet. Verifiers validate proofs offline using cached trust data—critical for no-signal work sites.

## 🎯 Project Goals

1. **Working Demo**: Wallet-based SSI system for migrant workers with offline verification
2. **Research Contribution**: Measured comparison of two offline revocation mechanisms (AnonCreds accumulator vs. signed bitstring status lists)

## 🏗️ Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Holder    │     │   Issuer    │     │  Verifier   │
│  (Worker)   │     │  (NGO/Org)  │     │ (Welfare/   │
│  Android    │     │  Web Portal │     │  Employer)  │
│   Wallet    │     │             │     │  Android/   │
└──────┬──────┘     └──────┬──────┘     │   Web Portal│
       │                   │            └──────┬──────┘
       │  Credentials      │  Issuance         │ Verification
       │◄──────────────────┤                   │
       │                   │                   ▼
       │                   │            ┌─────────────┐
       │                   │            │   Trust     │
       │                   │            │  Registry   │
       │                   │            │  (Indy)     │
       │                   │            └─────────────┘
       │                   │                   ▲
       └───────────────────┴───────────────────┘
              Offline QR Exchange
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Ledger | Hyperledger Indy (permissioned, RBFT) via **von-network** |
| Credentials | AnonCreds (predicates, selective disclosure) |
| Wallet | React Native (Expo) + Android only |
| Issuer Agent | ACA-Py (multi-tenant, askar-anoncreds) |
| Backend | FastAPI (Python) |
| Web Portals | React + TypeScript + Vite + Tailwind |
| Database | PostgreSQL |
| Auth | Keycloak (OIDC, RBAC) |
| Monitoring | Prometheus + Grafana + Loki |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+, pnpm 9+
- Docker & Docker Compose
- Expo Go app on Android phone (for mobile testing)

### 1. Start von-network (Indy Pool)
```bash
# One-time setup
git clone https://github.com/bcgov/von-network
cd von-network
./manage start

# This starts:
# - 4 Indy nodes on ports 9701-9708
# - Web UI at http://localhost:9000 (genesis, node status)
# - Genesis file at http://localhost:9000/genesis
```

### 2. Start Application Services
```bash
# In did-workers directory
cd /home/solo/did-workers

# Install dependencies
make install

# Start all services (Postgres, Keycloak, MinIO, Tails, Mock API, Portals, Monitoring)
make up

# Seed demo data (Ramesh persona, trust chain, credentials)
make seed

# Start portals dev server (Terminal 1)
make dev-portals

# Start mobile dev server (Terminal 2)
make dev-mobile
```

### 3. Access the Demo
| Service | URL | Notes |
|---------|-----|-------|
| **Portals (Web)** | http://localhost:3000 | Full demo: Issuer/Verifier/Admin |
| **Mobile Web** | http://localhost:8081 | Expo web preview |
| **Mobile Native** | Via Expo Go | Scan QR from `make dev-mobile` |
| **von-network UI** | http://localhost:9000 | Indy pool status, genesis |

### 4. Login (Demo)
- Go to http://localhost:3000
- Select any role (Issuer Operator, Verifier Operator, Governance Admin)
- Enter PIN `1234` (any 4+ digits works)
- Navigate portals

### 5. Mobile App (Expo Go)
```bash
make dev-mobile
# Scan QR with Expo Go app on Android phone
# Flow: Language → PIN → Tabs (Wallet + Verifier)
```

## 📱 Demo Persona: Ramesh

Ramesh is a mason from Bihar with 6 years of Mumbai construction experience. He holds:
- **Identity Verification** (Nirman NGO)
- **Work History** ×3 (Site Contractors Pvt Ltd)
- **Skill: Advanced Masonry Level 4** (SkillTrain Centre)
- **Welfare Eligibility: BOCW** (Mumbai Labour Welfare Board)

## 🔐 Trust Chain (Demo)

```
Mumbai Labour Welfare Board (Tier 1)
├── Nirman NGO (Tier 2)
│   └── Site Contractors Pvt Ltd (Tier 3)
└── SkillTrain Centre (Tier 2)
```

## 📦 Monorepo Structure

```
did-workers/
├── apps/
│   ├── portals/          # React web portals (Issuer, Verifier, Admin)
│   └── mobile/           # Expo React Native app (Wallet + Verifier)
├── packages/
│   ├── design-system/    # Shared UI components (Tailwind)
│   ├── mock-api/         # MSW mock server + demo data
│   ├── credential-engine/# Credential engine interface + mock impl
│   └── i18n/             # Translations (en/hi/mr)
├── infra/
│   ├── docker-compose.yml
│   └── monitoring/
├── von-network/          # External (clone separately)
└── research/
    └── benchmarks/
```

## 🌐 Portals

| Portal | URL | Purpose |
|--------|-----|---------|
| Issuer | http://localhost:3000 | Issue credentials, manage workers |
| Verifier | http://localhost:3000/verifier | Create verification requests |
| Admin | http://localhost:3000/admin | Governance, trust chain, monitoring |

## 📱 Mobile App

- **Wallet Tab**: Holder credentials, connections, QR sharing
- **Verifier Tab**: Create requests, scan presentations, offline mode
- **Settings**: Language (en/hi/mr), voice prompts, PIN/biometric

## 🔬 Research: Offline Revocation Comparison

| Mechanism | Description | Trade-off |
|-----------|-------------|-----------|
| **A: AnonCreds Accumulator** | Holder proves non-revocation with cached witness | Privacy-preserving, needs witness refresh |
| **B: Signed Status List** | Verifier checks bit in cached signed list | Reveals `status_index` (linkable), no witness needed |

Metrics measured: payload size, QR frames, proof generation time, verification time, cache size, staleness vs revocation risk, linkability.

## 📋 Demo Script (5 min)

1. **Onboarding**: Language → PIN → Biometric → Wallet ready
2. **Connection**: Issuer shows QR → Worker scans → Pairwise DID connection
3. **Issuance**: Issuer sends Work History offer → Worker accepts → Credential stored
4. **Verification**: Verifier creates request QR → Worker scans → Consent → Presents proof
5. **Offline**: Verifier goes offline → Scans cached trust data → Validates proof
6. **Revocation**: Issuer revokes credential → Verifier syncs → Rejects revoked proof

## 🔧 Configuration

### Environment Variables
```bash
# .env file (optional)
GENESIS_URL=http://localhost:9000/genesis    # von-network genesis endpoint
INDY_POOL_NAME=pool                           # Indy pool name
POSTGRES_PASSWORD=dev_password                # Database password
KEYCLOAK_ADMIN=admin                          # Keycloak admin user
KEYCLOAK_ADMIN_PASSWORD=admin                 # Keycloak admin password
MINIO_ROOT_USER=minioadmin                    # MinIO credentials
MINIO_ROOT_PASSWORD=minioadmin
```

### von-network Integration
The app connects to von-network via:
- **Genesis URL**: `http://localhost:9000/genesis` (or `host.docker.internal:9000` from Docker)
- **Indy Nodes**: `localhost:9701-9708` (4 nodes × node/client ports)
- **Pool Name**: `pool`

From inside Docker containers, use `host.docker.internal` to reach host's von-network.

## 📝 License

MIT License - See LICENSE file for details.

## ⚠️ Honesty Note

> **Demo data, simulated** - This is a final-year engineering project demo. Cryptographic operations, ledger writes, and network communications are mocked for demonstration purposes. Real deployment requires production-grade infrastructure, HSM key management, and security audits.

---

**Credentials and private keys stay in the holder's wallet; no PII on the registry.**