import { PLANS } from '../config/plans';
import { ADDONS } from '../config/addons';
import { PROMO_CODES, PROMO_ERRORS } from '../config/promoCodes';
import type { PlanId } from '../config/plans';
import type { AddOnId } from '../config/addons';

export interface PricingInput {
  planId: PlanId;
  activeAddOns: Set<AddOnId>;   
  memberCount: number;          
  promoCode: string | null;     
                                
}

export interface BreakdownLine {
  label: string;
  amountPaise: number;
  isDiscount: boolean; 
}

export interface PricingOutput {
  lines: BreakdownLine[];         
  totalPaise: number;             
  originalTotalPaise: number;     
  savingsPaise: number;
  savingsPercent: number;         
  billingLabel: string;           
  promoStatus: PromoStatus | null; 
}


export type PromoState = 'valid' | 'invalid' | 'none';

export interface PromoStatus {
  state: PromoState;
  message: string | null; 
}

export const ADDON_MULTIPLIERS: Record<PlanId, number> = {
  monthly: 1,
  annual: 10,
  lifetime: 24,
};

export function validatePromo(code: string, input: PricingInput): PromoStatus {

  if (!code || code.trim() === '') {
    return { state: 'none', message: null };
  }

  const upperCode = code.trim().toUpperCase();

  const promo = PROMO_CODES[upperCode];
  if (!promo) {
    return { state: 'invalid', message: PROMO_ERRORS.UNRECOGNISED };
  }
  if (promo.type === 'EXPIRED') {
    return { state: 'invalid', message: promo.expiredMessage ?? PROMO_ERRORS.EXPIRED };
  }

  if (upperCode === 'WELCOME20' && input.planId === 'lifetime') {
    return { state: 'invalid', message: PROMO_ERRORS.WELCOME20_LIFETIME };
  }

  if (upperCode === 'FAMILY50' && !input.activeAddOns.has('family')) {
    return { state: 'invalid', message: PROMO_ERRORS.FAMILY50_NO_FAMILY };
  }

  if (promo.validPlans && !promo.validPlans.includes(input.planId)) {
    return { state: 'invalid', message: PROMO_ERRORS.UNRECOGNISED };
  }

  return { state: 'valid', message: null };
}

export function calculateTotal(input: PricingInput): PricingOutput {
  const { planId, activeAddOns, promoCode } = input;

  const memberCount = Math.min(5, Math.max(2, input.memberCount));

  const plan = PLANS[planId];
  const multiplier = ADDON_MULTIPLIERS[planId];
  const basePaise = plan.pricePaise;

  const lines: BreakdownLine[] = [];

  lines.push({
    label: `${plan.label} Plan`,
    amountPaise: basePaise,
    isDiscount: false,
  });
  let familyCostPaise = 0;
  let addonsTotalPaise = 0;

  const ADDON_ORDER: AddOnId[] = ['family', 'coaching', 'stories'];

  for (const addonId of ADDON_ORDER) {
    if (!activeAddOns.has(addonId)) continue;

    const addon = ADDONS[addonId];
    const members = addonId === 'family' ? memberCount : 1;

    const costPaise = addon.monthlyPricePaise * members * multiplier;

    if (addonId === 'family') {
      familyCostPaise = costPaise;
    }
    addonsTotalPaise += costPaise;

    const label =
      addonId === 'family'
        ? `Family Sharing (${memberCount} member${memberCount > 1 ? 's' : ''})`
        : addon.label;

    lines.push({ label, amountPaise: costPaise, isDiscount: false });
  }

  const subtotalPaise = basePaise + addonsTotalPaise;
  let originalTotalPaise: number;

  if (planId === 'annual') {
    const monthlyBasePaise = PLANS.monthly.pricePaise; // 49900

    let monthlyAddonsPaise = 0;
    for (const addonId of ADDON_ORDER) {
      if (!activeAddOns.has(addonId)) continue;
      const addon = ADDONS[addonId];
      const members = addonId === 'family' ? memberCount : 1;
      monthlyAddonsPaise += addon.monthlyPricePaise * members * 12;
    }

    originalTotalPaise = monthlyBasePaise * 12 + monthlyAddonsPaise;
  } else {
    originalTotalPaise = subtotalPaise;
  }

  let promoStatus: PromoStatus | null = null;
  let discountPaise = 0;

  if (promoCode) {
    promoStatus = validatePromo(promoCode, input);

    if (promoStatus.state === 'valid') {
      const upperCode = promoCode.trim().toUpperCase();
      const promo = PROMO_CODES[upperCode];

      if (promo.type === 'PERCENT_OFF_TOTAL' && promo.discountPercent !== undefined) {
        discountPaise = Math.round(subtotalPaise * promo.discountPercent / 100);

        lines.push({
          label: `${upperCode} — ${promo.discountPercent}% off`,
          amountPaise: discountPaise,
          isDiscount: true,
        });
      } else if (
        promo.type === 'PERCENT_OFF_ADDON' &&
        promo.appliesToAddon === 'family' &&
        promo.discountPercent !== undefined
      ) {
        discountPaise = Math.round(familyCostPaise * promo.discountPercent / 100);

        lines.push({
          label: `${upperCode} — ${promo.discountPercent}% off Family Sharing`,
          amountPaise: discountPaise,
          isDiscount: true,
        });
      }
    }
  }

  const finalTotalPaise = subtotalPaise - discountPaise;

  const savingsPaise = Math.max(0, originalTotalPaise - finalTotalPaise);

  const savingsPercent =
    originalTotalPaise > 0
      ? Math.round((savingsPaise / originalTotalPaise) * 100 * 10) / 10
      : 0;
  return {
    lines,
    totalPaise: finalTotalPaise,
    originalTotalPaise,
    savingsPaise,
    savingsPercent,
    billingLabel: plan.billingLabel,
    promoStatus,
  };
}
