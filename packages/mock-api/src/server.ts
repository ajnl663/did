import express from 'express';
import cors from 'cors';
import { mockApiHandlers } from './handlers/api';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/healthz', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Metrics
app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send('# Mock metrics\nhttp_requests_total 123\n');
});

// VON Network config
app.get('/v1/von-network/config', (req, res) => {
  res.json({
    genesisUrl: process.env.GENESIS_URL || 'http://host.docker.internal:9000/genesis',
    poolName: process.env.INDY_POOL_NAME || 'pool',
    nodes: [
      { host: 'host.docker.internal', port: 9701 },
      { host: 'host.docker.internal', port: 9703 },
      { host: 'host.docker.internal', port: 9705 },
      { host: 'host.docker.internal', port: 9707 },
    ],
  });
});

app.get('/v1/von-network/genesis', (req, res) => {
  res.json({
    transactions: [],
    note: 'Fetch from von-network webserver at /genesis endpoint',
  });
});

// Trust Registry
app.get('/v1/root', (req, res) => {
  res.json({
    did: 'did:indy:workers-dev:gov-board',
    verkey: 'demo-verkey',
    governance: { name: 'Mumbai Labour Welfare Consortium (demo)' },
  });
});

app.get('/v1/organizations', (req, res) => {
  res.json([]);
});

app.get('/v1/organizations/:id', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.get('/v1/accreditations', (req, res) => {
  res.json([]);
});

app.get('/v1/accreditations/:did', (req, res) => {
  res.json([]);
});

app.get('/v1/chain/:issuerDid', (req, res) => {
  res.json({ chain: [], depth: 0 });
});

app.get('/v1/schemas', (req, res) => {
  res.json([]);
});

app.get('/v1/credential-definitions', (req, res) => {
  res.json([]);
});

app.get('/v1/revocation/:revRegId', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.get('/v1/status-lists/:id', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.get('/v1/bundle', (req, res) => {
  res.json({
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    rootDid: 'did:indy:workers-dev:gov-board',
    organizations: [],
    accreditations: [],
    schemas: [],
    credentialDefinitions: [],
    revocationRegistries: [],
    statusLists: [],
    policies: [],
  });
});

app.get('/v1/bundle/delta', (req, res) => {
  res.json({ changed: true, bundle: {} });
});

// Issuer Service
app.post('/v1/connections/invitations', (req, res) => {
  res.json({
    id: 'inv-' + Date.now(),
    connectionId: 'conn-' + Date.now(),
    invitationUrl: 'didcomm://invitation?c_i=demo',
    qrData: 'didcomm://invitation?c_i=demo',
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
  });
});

app.get('/v1/connections', (req, res) => {
  res.json([]);
});

app.get('/v1/connections/:id', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.post('/v1/claims', (req, res) => {
  res.json({ claimId: 'claim-' + Date.now(), status: 'validated', validatedAt: new Date().toISOString() });
});

app.post('/v1/credentials/offer', (req, res) => {
  res.json({
    id: 'offer-' + Date.now(),
    credentialDefinitionId: req.body.credentialDefinitionId,
    schemaId: 'work_history',
    issuerDid: 'did:indy:workers-dev:contractor-site',
    issuerName: 'Site Contractors Pvt Ltd (demo)',
    connectionId: req.body.connectionId,
    attributes: req.body.attributes,
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
  });
});

app.get('/v1/credentials', (req, res) => {
  res.json([]);
});

app.get('/v1/credentials/:id', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.post('/v1/credentials/:id/revoke', (req, res) => {
  res.json({ success: true, revokedAt: new Date().toISOString() });
});

app.post('/v1/credentials/bulk', (req, res) => {
  res.json({ jobId: 'bulk-' + Date.now(), totalRows: 0, processed: 0, status: 'processing' });
});

app.get('/v1/audit', (req, res) => {
  res.json({ entries: [], total: 0 });
});

// Verifier Service
app.post('/v1/proof-requests', (req, res) => {
  const policyId = req.body.policyId;
  const policy = { revocationMechanism: 'A', predicates: [], credentialType: 'work_history' };
  res.json({
    id: 'vr-' + Date.now(),
    verifierId: 'verifier-demo',
    verifierName: 'Demo Verifier',
    nonce: 'nonce-' + Math.random().toString(36).slice(2, 10),
    proofRequest: {
      name: policy.credentialType || 'Verification',
      version: '1.0',
      requestedAttributes: {},
      requestedPredicates: {},
      nonRevoked: { from: 20240101, to: 20241231 },
    },
    mechanism: policy.revocationMechanism || 'A',
    expiresAt: new Date(Date.now() + 600000).toISOString(),
    status: 'pending',
  });
});

app.get('/v1/proof-requests/:id', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.post('/v1/verification-events', (req, res) => {
  res.json({ accepted: true, count: 1 });
});

// VON Network
app.get('/v1/von-network/config', (req, res) => {
  res.json({
    genesisUrl: process.env.GENESIS_URL || 'http://host.docker.internal:9000/genesis',
    poolName: process.env.INDY_POOL_NAME || 'pool',
    nodes: [
      { host: 'host.docker.internal', port: 9701 },
      { host: 'host.docker.internal', port: 9703 },
      { host: 'host.docker.internal', port: 9705 },
      { host: 'host.docker.internal', port: 9707 },
    ],
  });
});

app.get('/v1/von-network/genesis', (req, res) => {
  res.json({ transactions: [], note: 'Fetch from von-network webserver at /genesis endpoint' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Mock API server running on port ${PORT}`);
});