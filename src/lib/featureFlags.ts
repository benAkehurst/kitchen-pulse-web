export const featureFlags = {
  enableWhatsapp: false,
  enableAI: false,
} satisfies Record<string, boolean>;

export type FeatureFlag = keyof typeof featureFlags;

export const isFeatureEnabled = (flag: FeatureFlag): boolean =>
  featureFlags[flag];

export default featureFlags;
