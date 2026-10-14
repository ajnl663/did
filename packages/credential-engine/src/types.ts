export interface HolderWallet {
  did: string;
  name: string;
  credentials: Credential[];
  connections: Connection[];
  pinSet: boolean;
  biometricEnabled: boolean;
  language: 'en' | 'hi' | 'mr';
  voiceEnabled: boolean;
}

export interface Credential {
  id: string;
  credentialDefinitionId: string;
  schemaId: string;
  issuerDid: string;
  issuerName: string;
  holderDid?: string;
  attributes: Record<string, string>;
  status: 'valid' | 'revoked' | 'expired';
  issuedOn: string;
  validUntil?: string;
  revokedAt?: string;
  revocationReason?: string;
  statusIndex: number;
}

export interface Connection {
  id: string;
  holderDid?: string;
  issuerDid: string;
  issuerName?: string;
  state: 'invited' | 'requested' | 'connected';
  createdAt: string;
}

export interface CredentialOffer {
  id: string;
  credentialDefinitionId: string;
  schemaId: string;
  issuerDid: string;
  issuerName: string;
  connectionId: string;
  attributes: Record<string, string>;
  expiresAt: string;
}

export interface VerificationRequest {
  id: string;
  verifierId: string;
  verifierName: string;
  nonce: string;
  proofRequest: ProofRequest;
  mechanism: 'A' | 'B';
  expiresAt: string;
  status: 'pending' | 'completed' | 'expired';
}

export interface ProofRequest {
  name: string;
  version: string;
  requestedAttributes: Record<string, { name: string; restrictions: Array<{ issuer_did?: string; schema_id?: string }> }>;
  requestedPredicates: Record<string, { name: string; pType: '>=' | '<=' | '>' | '<'; pValue: number; restrictions: Array<{ issuer_did?: string; schema_id?: string }> }>;
  nonRevoked?: { from: number; to: number };
}

export interface Presentation {
  id: string;
  verificationRequestId: string;
  holderDid: string;
  credentials: string[];
  proof: any;
  revealedAttributes: Record<string, string>;
  predicates: Record<string, boolean>;
  createdAt: string;
}

export interface VerificationResult {
  id: string;
  verificationRequestId: string;
  presentationId: string;
  result: 'VALID' | 'INVALID' | 'STALE';
  reasonCodes: string[];
  checkedAt: string;
  stalenessSeconds?: number;
}

export interface TrustBundle {
  version: string;
  generatedAt: string;
  rootDid: string;
  organizations: Organization[];
  accreditations: Accreditation[];
  schemas: CredentialSchema[];
  credentialDefinitions: CredentialDefinition[];
  revocationRegistries: RevocationRegistry[];
  statusLists: StatusList[];
  policies: VerificationPolicy[];
}

export interface Organization {
  id: string;
  name: string;
  tier: 1 | 2 | 3;
  parentOrgId?: string;
  did: string;
  status: 'active' | 'pending' | 'revoked';
  createdAt: string;
  allowedSchemaIds: string[];
}

export interface Accreditation {
  id: string;
  subjectDid: string;
  parentDid: string;
  tier: 1 | 2 | 3;
  depth: number;
  allowedSchemaIds: string[];
  validFrom: string;
  validUntil: string;
  statusListId: string;
  statusIndex: number;
  coAttestationRequired: boolean;
  parentAccreditationId?: string;
  jws: string;
}

export interface CredentialSchema {
  id: string;
  name: string;
  version: string;
  attributes: string[];
  description: string;
}

export interface CredentialDefinition {
  id: string;
  schemaId: string;
  issuerDid: string;
  revocationRegistryId?: string;
  tag: string;
}

export interface RevocationRegistry {
  id: string;
  issuerDid: string;
  credentialDefinitionId: string;
  currentAccumulator: string;
  tailsLocation: string;
  maxCreds: number;
}

export interface StatusList {
  id: string;
  issuerDid: string;
  credentialDefinitionId: string;
  encodedList: string;
  jws: string;
  publishedAt: string;
  version: number;
}

export interface VerificationPolicy {
  policyId: string;
  credentialType: string;
  maxChainDepth: number;
  minAssuranceTier: number;
  requireCoAttestationForTier3: boolean;
  revocationMechanism: 'A' | 'B';
  maxStalenessHours: number;
  staleBehavior: 'reject' | 'flag' | 'accept';
  predicates: Array<{ attribute: string; op: '>=' | '<=' | '>' | '<'; value: number }>;
  revealAttributes: string[];
}

export interface QRFrameData {
  data: string;
  frameIndex: number;
  totalFrames: number;
}

export interface OfflineVerificationState {
  isOnline: boolean;
  lastSyncAt?: string;
  trustBundleVersion?: string;
  cachedCredentials: Credential[];
  pendingVerifications: VerificationRequest[];
}