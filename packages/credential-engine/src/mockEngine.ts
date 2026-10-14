import { CredentialEngine } from './engine';
import {
  HolderWallet,
  Credential,
  Connection,
  CredentialOffer,
  VerificationRequest,
  ProofRequest,
  Presentation,
  VerificationResult,
  TrustBundle,
  Organization,
  Accreditation,
  CredentialSchema,
  CredentialDefinition,
  RevocationRegistry,
  StatusList,
  VerificationPolicy,
  QRFrameData,
  OfflineVerificationState,
  VonNetworkConfig,
} from './types';
import {
  DEMO_ORGANIZATIONS,
  DEMO_SCHEMAS,
  DEMO_CREDENTIAL_DEFINITIONS,
  DEMO_CREDENTIALS,
  DEMO_CREDENTIAL_OFFERS,
  DEMO_CONNECTIONS,
  DEMO_VERIFICATION_REQUESTS,
  DEMO_ACCREDITATIONS,
  DEMO_REVOCATION_REGISTRIES,
  DEMO_STATUS_LISTS,
  DEMO_POLICIES,
  DEMO_TRUST_BUNDLE,
  DEMO_AUDIT_LOGS,
  DEMO_VERIFICATION_EVENTS,
  DEMO_HOLDER_DID,
  DEMO_HOLDER_NAME,
} from '@did-workers/mock-api/src/seed/demoData';

const listeners: Record<string, Function[]> = {};

function emit(event: string, data: any) {
  listeners[event]?.forEach(cb => cb(data));
}

let walletState: HolderWallet = {
  did: DEMO_HOLDER_DID,
  name: DEMO_HOLDER_NAME,
  credentials: [...DEMO_CREDENTIALS],
  connections: [...DEMO_CONNECTIONS],
  pinSet: false,
  biometricEnabled: false,
  language: 'en',
  voiceEnabled: true,
};

let credentialOffers = [...DEMO_CREDENTIAL_OFFERS];
let verificationRequests = [...DEMO_VERIFICATION_REQUESTS];
let trustBundleVersion = '1.0.0';
let lastSyncAt: string | undefined;

export function createMockCredentialEngine(): CredentialEngine {
  return {
    async initializeWallet(): Promise<HolderWallet> {
      return walletState;
    },

    async getWallet(): Promise<HolderWallet> {
      return { ...walletState };
    },

    async setPin(pin: string): Promise<void> {
      walletState.pinSet = true;
      emit('walletChange', walletState);
    },

    async verifyPin(pin: string): Promise<boolean> {
      return pin.length >= 4;
    },

    async setBiometric(enabled: boolean): Promise<void> {
      walletState.biometricEnabled = enabled;
      emit('walletChange', walletState);
    },

    async setLanguage(lang: 'en' | 'hi' | 'mr'): Promise<void> {
      walletState.language = lang;
      emit('walletChange', walletState);
    },

    async setVoiceEnabled(enabled: boolean): Promise<void> {
      walletState.voiceEnabled = enabled;
      emit('walletChange', walletState);
    },

    async scanInvitation(qrData: string): Promise<Connection> {
      const newConn: Connection = {
        id: `conn-${Date.now()}`,
        holderDid: walletState.did,
        issuerDid: 'did:indy:workers-dev:new-issuer',
        issuerName: 'New Issuer (demo)',
        state: 'invited',
        createdAt: new Date().toISOString(),
      };
      walletState.connections.push(newConn);
      emit('connectionChange', newConn);
      return newConn;
    },

    async getConnections(): Promise<Connection[]> {
      return [...walletState.connections];
    },

    async acceptConnection(connectionId: string): Promise<void> {
      const conn = walletState.connections.find(c => c.id === connectionId);
      if (conn) {
        conn.state = 'connected';
        emit('connectionChange', conn);
      }
    },

    async getCredentials(): Promise<Credential[]> {
      return [...walletState.credentials];
    },

    async getCredentialOffers(): Promise<CredentialOffer[]> {
      return [...credentialOffers];
    },

    async acceptCredentialOffer(offerId: string): Promise<Credential> {
      const offer = credentialOffers.find(o => o.id === offerId);
      if (!offer) throw new Error('Offer not found');

      const newCred: Credential = {
        id: `cred-${Date.now()}`,
        credentialDefinitionId: offer.credentialDefinitionId,
        schemaId: offer.schemaId,
        issuerDid: offer.issuerDid,
        issuerName: offer.issuerName,
        holderDid: walletState.did,
        attributes: offer.attributes,
        status: 'valid',
        issuedOn: new Date().toISOString(),
        statusIndex: Math.floor(Math.random() * 1000) + 10,
      };
      walletState.credentials.push(newCred);
      credentialOffers = credentialOffers.filter(o => o.id !== offerId);
      emit('credentialOffer', { type: 'accepted', credential: newCred });
      return newCred;
    },

    async rejectCredentialOffer(offerId: string): Promise<void> {
      credentialOffers = credentialOffers.filter(o => o.id !== offerId);
      emit('credentialOffer', { type: 'rejected', offerId });
    },

    async createProofRequest(policyId: string): Promise<VerificationRequest> {
      const policy = DEMO_POLICIES.find(p => p.policyId === policyId);
      const vr: VerificationRequest = {
        id: `vr-${Date.now()}`,
        verifierId: 'verifier-mobile',
        verifierName: 'Mobile Verifier (demo)',
        nonce: `nonce-${Math.random().toString(36).slice(2, 10)}`,
        proofRequest: {
          name: policy?.credentialType || 'Verification',
          version: '1.0',
          requestedAttributes: {},
          requestedPredicates: policy?.predicates.reduce((acc, p, i) => {
            acc[`pred_${i}`] = { name: p.attribute, pType: p.op, pValue: p.value, restrictions: [] };
            return acc;
          }, {} as any) || {},
          nonRevoked: { from: 20240101, to: 20241231 },
        },
        mechanism: policy?.revocationMechanism || 'A',
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        status: 'pending',
      };
      verificationRequests.push(vr);
      emit('verificationRequest', vr);
      return vr;
    },

    async getVerificationRequests(): Promise<VerificationRequest[]> {
      return [...verificationRequests];
    },

    async generatePresentation(requestId: string, credentialIds: string[], revealedAttrs: Record<string, boolean>): Promise<Presentation> {
      const request = verificationRequests.find(v => v.id === requestId);
      if (!request) throw new Error('Request not found');

      const creds = walletState.credentials.filter(c => credentialIds.includes(c.id));
      const revealed: Record<string, string> = {};
      const predicates: Record<string, boolean> = {};

      creds.forEach(cred => {
        Object.entries(cred.attributes).forEach(([key, value]) => {
          if (revealedAttrs[key]) revealed[key] = value;
        });
      });

      Object.entries(request.proofRequest.requestedPredicates).forEach(([key, pred]) => {
        const cred = creds.find(c => c.attributes[pred.name] !== undefined);
        if (cred) {
          const val = parseInt(cred.attributes[pred.name]);
          switch (pred.pType) {
            case '>=': predicates[key] = val >= pred.pValue; break;
            case '<=': predicates[key] = val <= pred.pValue; break;
            case '>': predicates[key] = val > pred.pValue; break;
            case '<': predicates[key] = val < pred.pValue; break;
          }
        }
      });

      const presentation: Presentation = {
        id: `pres-${Date.now()}`,
        verificationRequestId: requestId,
        holderDid: walletState.did,
        credentials: credentialIds,
        proof: { demo: true, nonce: request.nonce },
        revealedAttributes: revealed,
        predicates,
        createdAt: new Date().toISOString(),
      };

      request.status = 'completed';
      emit('verificationRequest', request);
      return presentation;
    },

    async verifyPresentation(presentation: Presentation): Promise<VerificationResult> {
      const isRevoked = presentation.credentials.some(id =>
        walletState.credentials.find(c => c.id === id)?.status === 'revoked'
      );

      return {
        id: `vr-${Date.now()}`,
        verificationRequestId: presentation.verificationRequestId,
        presentationId: presentation.id,
        result: isRevoked ? 'INVALID' : 'VALID',
        reasonCodes: isRevoked ? ['REVOKED'] : ['OK'],
        checkedAt: new Date().toISOString(),
        stalenessSeconds: 0,
      };
    },

    async generateRequestQR(request: VerificationRequest): Promise<string> {
      return JSON.stringify({ type: 'proof_request', ...request });
    },

    async generatePresentationQR(presentation: Presentation): Promise<QRFrameData[]> {
      const data = JSON.stringify({ type: 'presentation', ...presentation });
      const chunkSize = 1000;
      const frames: QRFrameData[] = [];
      for (let i = 0; i < data.length; i += chunkSize) {
        frames.push({
          data: data.slice(i, i + chunkSize),
          frameIndex: frames.length,
          totalFrames: Math.ceil(data.length / chunkSize),
        });
      }
      return frames.length > 0 ? frames : [{ data, frameIndex: 0, totalFrames: 1 }];
    },

    async scanQR(qrData: string): Promise<{ type: 'invitation' | 'request' | 'presentation'; data: any }> {
      try {
        const parsed = JSON.parse(qrData);
        return { type: parsed.type || 'invitation', data: parsed };
      } catch {
        return { type: 'invitation', data: { invitationUrl: qrData } };
      }
    },

    async syncTrustBundle(): Promise<TrustBundle> {
      lastSyncAt = new Date().toISOString();
      trustBundleVersion = `${parseFloat(trustBundleVersion) + 0.1}.0`;
      emit('trustBundleUpdate', DEMO_TRUST_BUNDLE);
      return DEMO_TRUST_BUNDLE;
    },

    async getTrustBundle(): Promise<TrustBundle> {
      return DEMO_TRUST_BUNDLE;
    },

    async getOfflineState(): Promise<OfflineVerificationState> {
      return {
        isOnline: true,
        lastSyncAt,
        trustBundleVersion,
        cachedCredentials: walletState.credentials,
        pendingVerifications: verificationRequests.filter(v => v.status === 'pending'),
      };
    },

    async refreshRevocationWitness(credentialId: string): Promise<void> {},

    async getVonNetworkConfig(): Promise<VonNetworkConfig> {
      return {
        genesisUrl: 'http://host.docker.internal:9000/genesis',
        poolName: 'pool',
        nodes: [
          { host: 'host.docker.internal', port: 9701 },
          { host: 'host.docker.internal', port: 9703 },
          { host: 'host.docker.internal', port: 9705 },
          { host: 'host.docker.internal', port: 9707 },
        ],
      };
    },

    async getOrganizations(): Promise<Organization[]> {
      return [...DEMO_ORGANIZATIONS];
    },

    async getAccreditations(): Promise<Accreditation[]> {
      return [...DEMO_ACCREDITATIONS];
    },

    async getSchemas(): Promise<CredentialSchema[]> {
      return [...DEMO_SCHEMAS];
    },

    async getCredentialDefinitions(): Promise<CredentialDefinition[]> {
      return [...DEMO_CREDENTIAL_DEFINITIONS];
    },

    async getRevocationRegistries(): Promise<RevocationRegistry[]> {
      return [...DEMO_REVOCATION_REGISTRIES];
    },

    async getStatusLists(): Promise<StatusList[]> {
      return [...DEMO_STATUS_LISTS];
    },

    async getPolicies(): Promise<VerificationPolicy[]> {
      return [...DEMO_POLICIES];
    },

    async issueCredential(data: { credentialDefinitionId: string; holderDid: string; attributes: Record<string, string> }): Promise<Credential> {
      return {
        id: `cred-${Date.now()}`,
        credentialDefinitionId: data.credentialDefinitionId,
        schemaId: DEMO_CREDENTIAL_DEFINITIONS.find(d => d.id === data.credentialDefinitionId)?.schemaId || '',
        issuerDid: 'did:indy:workers-dev:current-issuer',
        issuerName: 'Current Issuer (demo)',
        holderDid: data.holderDid,
        attributes: data.attributes,
        status: 'valid',
        issuedOn: new Date().toISOString(),
        statusIndex: Math.floor(Math.random() * 1000) + 10,
      };
    },

    async revokeCredential(credentialId: string, reason: string): Promise<void> {
      const cred = walletState.credentials.find(c => c.id === credentialId);
      if (cred) {
        cred.status = 'revoked';
        cred.revokedAt = new Date().toISOString();
        cred.revocationReason = reason;
      }
    },

    async bulkIssue(data: { credentialDefinitionId: string; rows: Record<string, string>[] }): Promise<{ jobId: string }> {
      return { jobId: `bulk-${Date.now()}` };
    },

    async createVerificationRequest(policyId: string): Promise<VerificationRequest> {
      return this.createProofRequest(policyId);
    },

    async getVerificationResult(requestId: string): Promise<VerificationResult | null> {
      const request = verificationRequests.find(v => v.id === requestId);
      if (!request || request.status !== 'completed') return null;
      return {
        id: `vr-${Date.now()}`,
        verificationRequestId: requestId,
        presentationId: `pres-${requestId}`,
        result: 'VALID',
        reasonCodes: ['OK'],
        checkedAt: new Date().toISOString(),
      };
    },

    async getAuditLogs(limit = 50, offset = 0): Promise<{ entries: any[]; total: number }> {
      return {
        entries: DEMO_AUDIT_LOGS.slice(offset, offset + limit),
        total: DEMO_AUDIT_LOGS.length,
      };
    },

    async getVerificationEvents(limit = 50, offset = 0): Promise<any[]> {
      return DEMO_VERIFICATION_EVENTS.slice(offset, offset + limit);
    },

    on(event: string, callback: Function): void {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(callback);
    },

    off(event: string, callback: Function): void {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter(cb => cb !== callback);
      }
    },
  };
}