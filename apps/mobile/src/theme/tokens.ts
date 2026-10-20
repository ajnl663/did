// Centralized design tokens for the DID Workers mobile app.
// Single source of truth for colors, spacing, typography, radii, and shadows.

export const colors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },
  danger: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  surface: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  white: '#ffffff',
  black: '#000000',
} as const;

// Semantic colors for light mode
export const theme = {
  background: colors.surface[50],
  surface: colors.surface[0],
  surfaceMuted: colors.surface[100],
  border: colors.surface[200],
  text: colors.surface[900],
  textSecondary: colors.surface[500],
  textTertiary: colors.surface[400],
  primary: colors.primary[600],
  primaryLight: colors.primary[50],
  primaryBg: colors.primary[50],
  success: colors.success[600],
  successBg: colors.success[50],
  warning: colors.warning[600],
  warningBg: colors.warning[50],
  danger: colors.danger[600],
  dangerBg: colors.danger[50],
};

// 8px spacing scale
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 28,
  full: 9999,
} as const;

export const typography = {
  // Font sizes
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 32,
  // Font weights
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// Shared shadow presets (subtle, appropriate for light surfaces)
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
};

// Credential type metadata: icon name (Ionicons) and accent color per schema
export const credentialMeta: Record<
  string,
  { icon: string; color: string; bg: string; label: string }
> = {
  identity_verification: { icon: 'person-circle-outline', color: colors.primary[600], bg: colors.primary[50], label: 'Identity' },
  work_history: { icon: 'briefcase-outline', color: colors.success[600], bg: colors.success[50], label: 'Work History' },
  skill: { icon: 'ribbon-outline', color: colors.warning[600], bg: colors.warning[50], label: 'Skill' },
  welfare_eligibility: { icon: 'shield-checkmark-outline', color: colors.primary[700], bg: colors.primary[100], label: 'Welfare' },
};

export function getCredentialMeta(schemaId: string) {
  return credentialMeta[schemaId] ?? { icon: 'document-text-outline', color: colors.surface[600], bg: colors.surface[100], label: 'Credential' };
}

// Human-readable labels for credential attributes
export const attributeLabels: Record<string, string> = {
  full_name: 'Full Name',
  date_of_birth: 'Date of Birth',
  home_state: 'Home State',
  home_district: 'Home District',
  verification_method: 'Verification Method',
  verified_on: 'Verified On',
  issuer_case_ref: 'Case Reference',
  employer_name: 'Employer',
  employer_ref: 'Employer Ref',
  trade: 'Trade',
  site_city: 'City',
  site_area: 'Site Area',
  start_date: 'Start Date',
  end_date: 'End Date',
  months_worked: 'Months Worked',
  employment_type: 'Employment Type',
  skill_code: 'Skill Code',
  skill_name: 'Skill Name',
  skill_level: 'Skill Level',
  experience_months: 'Experience (months)',
  assessed_by: 'Assessed By',
  assessed_on: 'Assessed On',
  certificate_ref: 'Certificate Ref',
  scheme_code: 'Scheme',
  eligibility_status: 'Eligibility',
  valid_from: 'Valid From',
  registration_ref: 'Registration Ref',
  residence_district: 'Residence District',
  continuous_work_months: 'Continuous Work (months)',
};

export function formatAttributeValue(key: string, value: string): string {
  if (!value) return '—';
  // Date fields stored as YYYYMMDD
  if (key.endsWith('_on') || key.endsWith('_date') || key === 'date_of_birth' || key === 'valid_from') {
    if (/^\d{8}$/.test(value)) {
      return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
    }
    if (value === '0') return 'Present';
  }
  if (key === 'employment_type') {
    return value.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  }
  if (key === 'eligibility_status') {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
  return value;
}
