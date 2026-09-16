/**
 * AgriSync Application Constants & Configuration
 */

export const APP_NAME = 'AgriSync';
export const APP_TAGLINE = 'Smart Agriculture Network';
export const APP_SUBTITLE = 'Community-focused Agricultural Supply-Chain Platform';

export const USER_ROLES = {
  FARMER: 'FARMER',
  STORAGE_PROVIDER: 'STORAGE_PROVIDER',
  TRANSPORTER: 'TRANSPORTER',
  BUYER: 'BUYER',
  ADMIN: 'ADMIN',
} as const;

export const ROLE_LABELS: Record<string, string> = {
  FARMER: 'Farmer / Producer',
  STORAGE_PROVIDER: 'Cold Storage Provider',
  TRANSPORTER: 'Logistics & Transporter',
  BUYER: 'Mandi Trader & Bulk Buyer',
  ADMIN: 'Platform Administrator',
};

export const NAV_LINKS = [
  { label: 'Home', href: '/#hero' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Features', href: '/#features' },
  { label: 'Traceability', href: '/#traceability' },
  { label: 'Community', href: '/#community' },
  { label: 'About', href: '/#about' },
];

export const DEMO_SAMPLE_BATCH_ID = 'AGRI-2026-00421';

export const EPICS_NOTE = 'Academic / EPICS Project — Digital Agriculture Network Demonstration';
