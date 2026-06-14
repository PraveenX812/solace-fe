import { useState, useMemo } from 'react';

import { PLANS } from '../../config/plans';
import { ADDONS, ADDON_ORDER } from '../../config/addons';
import { calculateTotal } from '../../logic/pricing';
import type { PlanId } from '../../config/plans';
import type { AddOnId } from '../../config/addons';

import { AddOnCard }      from '../ui/AddOnCard';
import { PromoInput }     from '../ui/PromoInput';
import { PriceBreakdown } from '../ui/PriceBreakdown';
import { formatINR }      from '../../utils/formatting';
import { useScrollReveal } from '../../hooks/useScrollReveal';

import '../../styles/planBuilder.css';

export function PlanBuilder() {
  const { ref, isVisible } = useScrollReveal<HTMLElement>({ threshold: 0.1 });

  const [selectedPlan, setSelectedPlan] = useState<PlanId>('monthly');

  const [activeAddOns, setActiveAddOns] = useState<Set<AddOnId>>(new Set());

  const [memberCount, setMemberCount] = useState<number>(2);

  const [promoInput, setPromoInput] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const pricing = useMemo(() => calculateTotal({
    planId: selectedPlan,
    activeAddOns,
    memberCount,
    promoCode: appliedPromo,
  }), [selectedPlan, activeAddOns, memberCount, appliedPromo]);

  function handlePlanChange(planId: PlanId) {
    setSelectedPlan(planId);
    if (planId === 'lifetime' && appliedPromo?.toUpperCase() === 'WELCOME20') {
      setAppliedPromo(null);
      setPromoInput('');
    }
  }

  function handleAddonToggle(addonId: AddOnId) {
    const isCurrentlyEnabled = activeAddOns.has(addonId);

    setActiveAddOns(prev => {
      const next = new Set(prev);
      if (next.has(addonId)) {
        next.delete(addonId);
      } else {
        next.add(addonId);
      }
      return next;
    });

    if (isCurrentlyEnabled && addonId === 'family' && appliedPromo?.toUpperCase() === 'FAMILY50') {
      setAppliedPromo(null);
      setPromoInput('');
    }
  }

  function handleMemberCountChange(n: number) {
    setMemberCount(Math.min(5, Math.max(2, n)));
  }

  function handleApplyPromo() {
    const trimmed = promoInput.trim();
    if (!trimmed) return;
    setAppliedPromo(trimmed);
  }

  function handleClearPromo() {
    setAppliedPromo(null);
    setPromoInput('');
  }

  return (
    <section 
      id="plan-builder" 
      aria-label="Choose your plan" 
      className={`pb-section reveal-slide-up ${isVisible ? 'is-visible' : ''}`}
      ref={ref}
    >
      <div className="pb-container">

        {/* Section header */}
        <div className="pb-header">
          <span className="pb-eyebrow">Pricing</span>
          <h2 className="pb-title">Choose your plan</h2>
          <p className="pb-subtitle">
            Upgrade, downgrade, or cancel anytime. No hidden fees.
          </p>
        </div>

        <div className="pb-plan-selector" role="group" aria-label="Select a plan">
          {(Object.values(PLANS) as typeof PLANS[PlanId][]).map(plan => (
            <button
              key={plan.id}
              type="button"
              className="pb-plan-card"
              onClick={() => handlePlanChange(plan.id)}
              aria-pressed={selectedPlan === plan.id}
            >
              <div className="pb-plan-name">{plan.label}</div>
              <div>
                <span className="pb-plan-price">{formatINR(plan.pricePaise)}</span>
                {plan.billingLabel !== 'one-time' && (
                  <span className="pb-plan-period">/ {plan.billingLabel}</span>
                )}
              </div>
              {plan.badge && (
                <span className="pb-plan-badge">{plan.badge}</span>
              )}
            </button>
          ))}
        </div>

        <span className="pb-section-label">Add-ons</span>
        <div className="pb-addons">
          {ADDON_ORDER.map(addonId => (
            <AddOnCard
              key={addonId}
              addon={ADDONS[addonId]}
              isEnabled={activeAddOns.has(addonId)}
              memberCount={memberCount}
              selectedPlan={selectedPlan}
              onToggle={() => handleAddonToggle(addonId)}
              onMemberCountChange={handleMemberCountChange}
            />
          ))}
        </div>

        <PromoInput
          inputText={promoInput}
          promoStatus={pricing.promoStatus}
          onInputChange={setPromoInput}
          onApply={handleApplyPromo}
          onClear={handleClearPromo}
        />

        <PriceBreakdown pricing={pricing} />

      </div>
    </section>
  );
}
