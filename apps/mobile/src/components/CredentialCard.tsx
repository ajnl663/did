import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme, typography, spacing, radii, shadows, getCredentialMeta } from '../theme/tokens';
import { Credential } from '@did-workers/credential-engine';

interface CredentialCardProps {
  credential: Credential;
  onPress?: () => void;
  compact?: boolean;
  style?: ViewStyle;
}

export function CredentialCard({ credential, onPress, compact = false, style }: CredentialCardProps) {
  const meta = getCredentialMeta(credential.schemaId);
  const isRevoked = credential.status === 'revoked';
  const isExpired = credential.status === 'expired';

  // Pick a meaningful primary attribute to display
  const primaryAttr =
    credential.attributes.full_name ||
    credential.attributes.skill_name ||
    credential.attributes.trade ||
    credential.attributes.scheme_code ||
    meta.label;

  const secondaryAttr =
    credential.attributes.home_district ||
    credential.attributes.site_area ||
    credential.attributes.skill_level ||
    credential.attributes.eligibility_status ||
    '';

  const statusStyle = isRevoked
    ? { bg: theme.dangerBg, text: theme.danger, label: 'Revoked' }
    : isExpired
    ? { bg: theme.warningBg, text: theme.warning, label: 'Expired' }
    : { bg: theme.successBg, text: theme.success, label: 'Valid' };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      disabled={!onPress}
      style={[styles.card, shadows.sm, style]}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.iconBadge, { backgroundColor: meta.bg }]}>
          <Ionicons name={meta.icon as any} size={22} color={meta.color} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.typeLabel}>{meta.label}</Text>
          <Text style={styles.primaryText} numberOfLines={1}>{primaryAttr}</Text>
          {secondaryAttr ? (
            <Text style={styles.secondaryText} numberOfLines={1}>{secondaryAttr}</Text>
          ) : null}
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
          <Text style={[styles.statusText, { color: statusStyle.text }]}>{statusStyle.label}</Text>
        </View>
      </View>

      {!compact && (
        <View style={styles.cardFooter}>
          <Text style={styles.issuerText} numberOfLines={1}>{credential.issuerName}</Text>
          <Text style={styles.dateText}>
            {new Date(credential.issuedOn).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: theme.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm + 2,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: 1,
  },
  typeLabel: {
    fontSize: typography.xs,
    fontWeight: typography.medium,
    color: theme.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  primaryText: {
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: theme.text,
  },
  secondaryText: {
    fontSize: typography.sm,
    color: theme.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  statusText: {
    fontSize: typography.xs,
    fontWeight: typography.semibold,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm + 2,
    paddingTop: spacing.sm + 2,
    borderTopColor: theme.border,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  issuerText: {
    fontSize: typography.xs,
    color: theme.textSecondary,
    flex: 1,
    marginRight: spacing.sm,
  },
  dateText: {
    fontSize: typography.xs,
    color: theme.textTertiary,
  },
});
