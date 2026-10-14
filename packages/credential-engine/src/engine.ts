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
} from './types';

export interface CredentialEngine {
  // Holder Wallet
  initializeWallet(): Promise<HolderWallet>;
  getWallet(): Promise<HolderWallet>;
  setPin(pin: string): Promise<void>;
  verifyPin(pin: string): Promise<boolean>;
  setBiometric(enabled: boolean): Promise<void>;
  setLanguage(lang: 'en' | 'hi' | 'mr'): Promise<void>;
  setVoiceEnabled(enabled: boolean): Promise<void>;

  // Connections
  scanInvitation(qrData: string): Promise<Connection>;
  getConnections(): Promise<Connection[]>;
  acceptConnection(connectionId: string): Promise<void>;

  // Credentials
  getCredentials(): Promise<Credential[]>;
  getCredentialOffers(): Promise<CredentialOffer[]>;
  acceptCredentialOffer(offerId: string): Promise<Credential>;
  rejectCredentialOffer(offerId: string): Promise<void>;

  // Presentation / Verification
  createProofRequest(policyId: string): Promise<VerificationRequest>;
  getVerificationRequests(): Promise<VerificationRequest[]>;
  generatePresentation(requestId: string, credentialIds: string[], revealedAttrs: Record<string, boolean>): Promise<Presentation>;
  verifyPresentation(presentation: Presentation): Promise<VerificationResult>;

  // QR Code
  generateRequestQR(request: VerificationRequest): Promise<string>;
  generatePresentationQR(presentation: Presentation): Promise<QRFrameData[]>;
  scanQR(qrData: string): Promise<{ type: 'invitation' | 'request' | 'presentation'; data: any }>;

  // Trust Bundle / Offline
  syncTrustBundle(): Promise<TrustBundle>;
  getTrustBundle(): Promise<TrustBundle>;
  getOfflineState(): Promise<OfflineVerificationState>;
  refreshRevocationWitness(credentialId: string): Promise<void>;

  // Organization / Issuer (for portal)
  getOrganizations(): Promise<Organization[]>;
  getAccreditations(): Promise<Accreditation[]>;
  getSchemas(): Promise<CredentialSchema[]>;
  getCredentialDefinitions(): Promise<CredentialDefinition[]>;
  getRevocationRegistries(): Promise<RevocationRegistry[]>;
  getStatusLists(): Promise<StatusList[]>;
  getPolicies(): Promise<VerificationPolicy[]>;

  // Issuance
  issueCredential(data: { credentialDefinitionId: string; holderDid: string; attributes: Record<string, string> }): Promise<Credential>;
  revokeCredential(credentialId: string, reason: string): Promise<void>;
  bulkIssue(data: { credentialDefinitionId: string; rows: Record<string, string>[] }): Promise<{ jobId: string }>;

  // Verification (portal)
  createVerificationRequest(policyId: string): Promise<VerificationRequest>;
  getVerificationResult(requestId: string): Promise<VerificationResult | null>;

  // Audit
  getAuditLogs(limit?: number, offset?: number): Promise<{ entries: any[]; total: number }>;
  getVerificationEvents(limit?: number, offset?: number): Promise<any[]>;

  // Events
  on(event: 'credentialOffer' | 'verificationRequest' | 'trustBundleUpdate' | 'connectionChange', callback: (data: any) => void): void;
  off(event: string, callback: (data: any) => void): void;
}

export const createCredentialEngine = (): CredentialEngine => {
  throw new Error('Use createMockCredentialEngine() or real implementation');
};