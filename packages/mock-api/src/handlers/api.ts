import { http, HttpResponse } from 'msw';
import { v4 as uuidv4 } from 'uuid';
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
} from '../seed/demoData';

const trustBundleETag = 'W/"bundle-v1"';

export const mockApiHandlers = [
  // Trust Registry
  http.get('/v1/root', () => {
    return HttpResponse.json({
      did: DEMO_TRUST_BUNDLE.rootDid,
      verkey: 'demo-verkey',
      governance: { name: 'Mumbai Labour Welfare Consortium (demo)' },
    });
  }),

  http.get('/v1/organizations', () => {
    return HttpResponse.json(DEMO_ORGANIZATIONS);
  }),

  http.get('/v1/organizations/:id', ({ params }) => {
    const org = DEMO_ORGANIZATIONS.find(o => o.id === params.id);
    if (!org) return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    return HttpResponse.json(org);
  }),

  http.get('/v1/accreditations', () => {
    return HttpResponse.json(DEMO_ACCREDITATIONS);
  }),

  http.get('/v1/accreditations/:did', ({ params }) => {
    const acc = DEMO_ACCREDITATIONS.filter(a => a.subjectDid === params.did);
    return HttpResponse.json(acc);
  }),

  http.get('/v1/chain/:issuerDid', ({ params }) => {
    const chain: any[] = [];
    let current = DEMO_ACCREDITATIONS.find(a => a.subjectDid === params.issuerDid);
    while (current) {
      const org = DEMO_ORGANIZATIONS.find(o => o.did === current.subjectDid);
      chain.push({ accreditation: current, organization: org });
      if (current.parentAccreditationId) {
        current = DEMO_ACCREDITATIONS.find(a => a.id === current.parentAccreditationId);
      } else {
        current = DEMO_ACCREDITATIONS.find(a => a.subjectDid === current.parentDid);
      }
    }
    return HttpResponse.json({ chain: chain.reverse(), depth: chain.length });
  }),

  http.get('/v1/schemas', () => {
    return HttpResponse.json(DEMO_SCHEMAS);
  }),

  http.get('/v1/credential-definitions', () => {
    return HttpResponse.json(DEMO_CREDENTIAL_DEFINITIONS);
  }),

  http.get('/v1/revocation/:revRegId', ({ params }) => {
    const reg = DEMO_REVOCATION_REGISTRIES.find(r => r.id === params.revRegId);
    if (!reg) return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    const statusList = DEMO_STATUS_LISTS.find(s => s.credentialDefinitionId === reg.credentialDefinitionId);
    return HttpResponse.json({ registry: reg, statusList });
  }),

  http.get('/v1/status-lists/:id', ({ params }) => {
    const list = DEMO_STATUS_LISTS.find(s => s.id === params.id);
    if (!list) return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    return HttpResponse.json(list);
  }),

  http.get('/v1/bundle', ({ request }) => {
    const etag = request.headers.get('If-None-Match');
    if (etag === trustBundleETag) {
      return new HttpResponse(null, { status: 304 });
    }
    return HttpResponse.json(DEMO_TRUST_BUNDLE, {
      headers: { ETag: trustBundleETag, 'Cache-Control': 'public, max-age=3600' },
    });
  }),

  http.get('/v1/bundle/delta', ({ request }) => {
    const since = request.headers.get('If-None-Match');
    if (since === trustBundleETag) {
      return HttpResponse.json({ changed: false, bundle: DEMO_TRUST_BUNDLE });
    }
    return HttpResponse.json({ changed: true, bundle: DEMO_TRUST_BUNDLE });
  }),

  // Issuer Service
  http.post('/v1/connections/invitations', async ({ request }) => {
    const body = await request.json();
    const invitation = {
      id: uuidv4(),
      connectionId: uuidv4(),
      invitationUrl: `didcomm://invitation?c_i=${btoa(JSON.stringify({ @type: 'didcomm/connection/invitation', id: uuidv4(), label: body.label || 'Issuer', recipients: [] }))}`,
      qrData: `didcomm://invitation?c_i=demo-invitation-data`,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    };
    return HttpResponse.json(invitation);
  }),

  http.get('/v1/connections', () => {
    return HttpResponse.json(DEMO_CONNECTIONS);
  }),

  http.get('/v1/connections/:id', ({ params }) => {
    const conn = DEMO_CONNECTIONS.find(c => c.id === params.id);
    if (!conn) return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    return HttpResponse.json(conn);
  }),

  http.post('/v1/claims', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ claimId: uuidv4(), status: 'validated', validatedAt: new Date().toISOString() });
  }),

  http.post('/v1/credentials/offer', async ({ request }) => {
    const body = await request.json();
    const offer: any = {
      id: uuidv4(),
      credentialDefinitionId: body.credentialDefinitionId,
      schemaId: DEMO_CREDENTIAL_DEFINITIONS.find(d => d.id === body.credentialDefinitionId)?.schemaId,
      issuerDid: body.issuerDid,
      issuerName: DEMO_ORGANIZATIONS.find(o => o.did === body.issuerDid)?.name,
      connectionId: body.connectionId,
      attributes: body.attributes,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
    DEMO_CREDENTIAL_OFFERS.push(offer);
    return HttpResponse.json(offer);
  }),

  http.get('/v1/credentials', () => {
    return HttpResponse.json(DEMO_CREDENTIALS);
  }),

  http.get('/v1/credentials/:id', ({ params }) => {
    const cred = DEMO_CREDENTIALS.find(c => c.id === params.id);
    if (!cred) return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    return HttpResponse.json(cred);
  }),

  http.post('/v1/credentials/:id/revoke', async ({ params, request }) => {
    const body = await request.json();
    const cred = DEMO_CREDENTIALS.find(c => c.id === params.id);
    if (cred) {
      cred.status = 'revoked';
      cred.revokedAt = new Date().toISOString();
      cred.revocationReason = body.reason;
    }
    return HttpResponse.json({ success: true, revokedAt: new Date().toISOString() });
  }),

  http.post('/v1/credentials/bulk', async ({ request }) => {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const text = await file.text();
    const lines = text.trim().split('\n');
    return HttpResponse.json({
      jobId: uuidv4(),
      totalRows: lines.length - 1,
      processed: 0,
      status: 'processing',
    });
  }),

  http.get('/v1/audit', ({ request }) => {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    return HttpResponse.json({
      entries: DEMO_AUDIT_LOGS.slice(offset, offset + limit),
      total: DEMO_AUDIT_LOGS.length,
    });
  }),

  // Verifier Service
  http.post('/v1/proof-requests', async ({ request }) => {
    const body = await request.json();
    const policy = DEMO_POLICIES.find(p => p.policyId === body.policyId);
    const vr = {
      id: uuidv4(),
      verifierId: 'verifier-demo',
      verifierName: 'Demo Verifier',
      nonce: uuidv4().slice(0, 16),
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
    DEMO_VERIFICATION_REQUESTS.push(vr);
    return HttpResponse.json(vr);
  }),

  http.get('/v1/proof-requests/:id', ({ params }) => {
    const vr = DEMO_VERIFICATION_REQUESTS.find(v => v.id === params.id);
    if (!vr) return HttpResponse.json({ error: 'Not found' }, { status: 404 });
    return HttpResponse.json(vr);
  }),

  http.post('/v1/verification-events', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ accepted: true, count: Array.isArray(body) ? body.length : 1 });
  }),

  // Health & Metrics
  http.get('/healthz', () => HttpResponse.json({ status: 'healthy' })),
  http.get('/metrics', () => HttpResponse.text('# Mock metrics\nhttp_requests_total 123\n')),

  // VON Network / Indy Pool Configuration
  http.get('/v1/von-network/config', () => {
    return HttpResponse.json({
      genesisUrl: process.env.GENESIS_URL || 'http://host.docker.internal:9000/genesis',
      poolName: process.env.INDY_POOL_NAME || 'pool',
      nodes: [
        { host: 'host.docker.internal', port: 9701 },
        { host: 'host.docker.internal', port: 9703 },
        { host: 'host.docker.internal', port: 9705 },
        { host: 'host.docker.internal', port: 9707 },
      ],
    });
  }),

  http.get('/v1/von-network/genesis', () => {
    // In production, this would fetch from von-network webserver
    // For demo, return a minimal genesis structure
    return HttpResponse.json({
      transactions: [],
      note: 'Fetch from von-network webserver at /genesis endpoint',
    });
  }),
];

export const allHandlers = mockApiHandlers;