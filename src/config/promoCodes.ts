import type { PlanId } from './plans';
import type { AddOnId } from './addons';

export type PromoType =
  | 'PERCENT_OFF_TOTAL'     
  | 'PERCENT_OFF_ADDON'     
  | 'EXPIRED';              

export interface PromoCode {
  code: string;             
  type: PromoType;
  discountPercent?: number; 
  appliesToAddon?: AddOnId; 
  validPlans?: PlanId[];    
  requiresAddon?: AddOnId;  
  expiredMessage?: string;  
}

export const PROMO_CODES: Record<string, PromoCode> = {
  WELCOME20: {
    code: 'WELCOME20',
    type: 'PERCENT_OFF_TOTAL',
    discountPercent: 20,
    validPlans: ['monthly', 'annual'], // NOT valid on 'lifetime'
  },
  FAMILY50: {
    code: 'FAMILY50',
    type: 'PERCENT_OFF_ADDON',
    discountPercent: 50,
    appliesToAddon: 'family',
    requiresAddon: 'family', // Rejected if Family Sharing is not selected
  },
  SLEEP100: {
    code: 'SLEEP100',
    type: 'EXPIRED',
    expiredMessage: 'This code has expired.',
  },
};

export const PROMO_ERRORS = {
  WELCOME20_LIFETIME: "WELCOME20 doesn't apply to Lifetime plans.",
  FAMILY50_NO_FAMILY: 'Add Family Sharing to use FAMILY50.',
  EXPIRED: 'This code has expired.',
  UNRECOGNISED: "We don't recognise that code.",
} as const;
