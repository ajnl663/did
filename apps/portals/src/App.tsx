import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@did-workers/design-system';
import { IssuerLayout } from './layouts/IssuerLayout';
import { VerifierLayout } from './layouts/VerifierLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { LoginPage } from './pages/LoginPage';

// Issuer pages
import { IssuerDashboard } from './pages/issuer/IssuerDashboard';
import { ConnectWorker } from './pages/issuer/ConnectWorker';
import { IssueCredential } from './pages/issuer/IssueCredential';
import { BulkIssue } from './pages/issuer/BulkIssue';
import { IssuedCredentials } from './pages/issuer/IssuedCredentials';
import { RevokeCredential } from './pages/issuer/RevokeCredential';
import { EvidenceUpload } from './pages/issuer/EvidenceUpload';
import { AuditTrail } from './pages/issuer/AuditTrail';
import { StaffManagement } from './pages/issuer/StaffManagement';
import { DelegatedIssuers } from './pages/issuer/DelegatedIssuers';

// Verifier pages
import { VerifierDashboard } from './pages/verifier/VerifierDashboard';
import { CreateProofRequest } from './pages/verifier/CreateProofRequest';
import { ProofRequestList } from './pages/verifier/ProofRequestList';
import { VerificationResult } from './pages/verifier/VerificationResult';
import { VerifierHistory } from './pages/verifier/VerifierHistory';

// Admin pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { IssuerRegistry } from './pages/admin/IssuerRegistry';
import { TrustChainView } from './pages/admin/TrustChainView';
import { OnboardIssuer } from './pages/admin/OnboardIssuer';
import { TrustBundleStatus } from './pages/admin/TrustBundleStatus';
import { Monitoring } from './pages/admin/Monitoring';
import { AuditLogs } from './pages/admin/AuditLogs';
import { UserManagement } from './pages/admin/UserManagement';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<Navigate to="/issuer/dashboard" replace />}>
        <Route path="/" element={<Navigate to="/issuer/dashboard" replace />} />
      </Route>

      {/* Issuer Portal */}
      <Route element={<IssuerLayout />}>
        <Route path="/issuer/dashboard" element={<IssuerDashboard />} />
        <Route path="/issuer/connect" element={<ConnectWorker />} />
        <Route path="/issuer/issue" element={<IssueCredential />} />
        <Route path="/issuer/bulk" element={<BulkIssue />} />
        <Route path="/issuer/credentials" element={<IssuedCredentials />} />
        <Route path="/issuer/revoke" element={<RevokeCredential />} />
        <Route path="/issuer/evidence" element={<EvidenceUpload />} />
        <Route path="/issuer/audit" element={<AuditTrail />} />
        <Route path="/issuer/staff" element={<StaffManagement />} />
        <Route path="/issuer/delegated" element={<DelegatedIssuers />} />
      </Route>

      {/* Verifier Portal */}
      <Route element={<VerifierLayout />}>
        <Route path="/verifier/dashboard" element={<VerifierDashboard />} />
        <Route path="/verifier/create" element={<CreateProofRequest />} />
        <Route path="/verifier/requests" element={<ProofRequestList />} />
        <Route path="/verifier/result/:id" element={<VerificationResult />} />
        <Route path="/verifier/history" element={<VerifierHistory />} />
      </Route>

      {/* Admin Dashboard */}
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/registry" element={<IssuerRegistry />} />
        <Route path="/admin/trust-chain" element={<TrustChainView />} />
        <Route path="/admin/onboard" element={<OnboardIssuer />} />
        <Route path="/admin/trust-bundle" element={<TrustBundleStatus />} />
        <Route path="/admin/monitoring" element={<Monitoring />} />
        <Route path="/admin/audit" element={<AuditLogs />} />
        <Route path="/admin/users" element={<UserManagement />} />
      </Route>

      <Route path="*" element={<Navigate to="/issuer/dashboard" replace />} />
    </Routes>
  );
}

export default App;