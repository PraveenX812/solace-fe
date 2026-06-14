
export type PlanId = 'monthly' | 'annual' | 'lifetime';

export interface Plan {
  id: PlanId;
  label: string;
  pricePaise: number;       // The base plan price in paise
  billingLabel: string;     // What to show after the price: "month", "year", "one-time"
  badge?: string;           // Optional badge text
  showBillingToggle: boolean; // Whether the Monthly/Annual toggle is visible for this plan
}

export const PLANS: Record<PlanId, Plan> = {
  monthly: {
    id: 'monthly',
    label: 'Monthly',
    pricePaise: 49900,        // 499
    billingLabel: 'month',
    showBillingToggle: true,
  },
  annual: {
    id: 'annual',
    label: 'Annual',
    pricePaise: 399900,       // 3,999
    billingLabel: 'year',
    badge: 'Save 33%',
    showBillingToggle: true,
  },
  lifetime: {
    id: 'lifetime',
    label: 'Lifetime',
    pricePaise: 1499900,      // 14,999
    billingLabel: 'one-time',
    showBillingToggle: false, 
  },
}
