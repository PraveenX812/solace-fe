/**
 * ADD-ONS CONFIG
 *
 * Purpose: Single source of truth for all add-on data.
 * Rule:    Only the MONTHLY base price is stored here.
 *          The pricing logic in logic/pricing.ts applies the billing
 *          multipliers (×1 monthly, ×10 annual, ×24 lifetime).
 *
 * Why store only monthly price?
 *   Because the spec defines all add-ons by their monthly base price.
 *   The derived annual/lifetime prices are computed, not configured.
 *   This way there's one number to change if pricing changes.
 */

export type AddOnId = 'family' | 'coaching' | 'stories';

export interface AddOn {
  id: AddOnId;
  label: string;
  description: string;
  monthlyPricePaise: number;  // The monthly base price in paise
  hasMembers: boolean;        // Whether this add-on has a member count stepper
  minMembers?: number;        // Minimum member count (Family Sharing: 2)
  maxMembers?: number;        // Maximum member count (Family Sharing: 5)
}

export const ADDONS: Record<AddOnId, AddOn> = {
  family: {
    id: 'family',
    label: 'Family Sharing',
    description: 'Share Solace with up to 5 family members.',
    monthlyPricePaise: 19900,
    hasMembers: true,
    minMembers: 2,
    maxMembers: 5,
  },
  coaching: {
    id: 'coaching',
    label: '1:1 Sleep Coaching',
    description: 'Personal sessions with a certified sleep coach.',
    monthlyPricePaise: 99900,
    hasMembers: false,
  },
  stories: {
    id: 'stories',
    label: 'Premium Story Packs',
    description: 'Exclusive narrated stories updated monthly.',
    monthlyPricePaise: 14900,
    hasMembers: false,
  },
};

export const ADDON_ORDER: AddOnId[] = ['family', 'coaching', 'stories'];
