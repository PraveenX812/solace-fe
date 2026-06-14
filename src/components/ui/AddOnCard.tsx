import { ADDON_MULTIPLIERS } from '../../logic/pricing';
import { formatINR } from '../../utils/formatting';
import { Stepper } from './Stepper';
import type { AddOn } from '../../config/addons';
import type { PlanId } from '../../config/plans';

interface AddOnCardProps {
  addon: AddOn;
  isEnabled: boolean;
  memberCount: number;
  selectedPlan: PlanId;
  onToggle: () => void;
  onMemberCountChange: (n: number) => void;
}

export function AddOnCard({
  addon,
  isEnabled,
  memberCount,
  selectedPlan,
  onToggle,
  onMemberCountChange,
}: AddOnCardProps) {
  const multiplier = ADDON_MULTIPLIERS[selectedPlan];
  const members = addon.hasMembers ? memberCount : 1;
  const effectivePaisePer = addon.monthlyPricePaise * members * multiplier;

  const periodLabel =
    selectedPlan === 'monthly'  ? '/mo' :
    selectedPlan === 'annual'   ? '/yr' :
    'one-time';

  const perMemberNote =
    addon.hasMembers && selectedPlan !== 'lifetime'
      ? `₹${addon.monthlyPricePaise / 100}/member/mo`
      : null;

  const toggleId = `addon-toggle-${addon.id}`;

  return (
    <div className={`pb-addon-card ${isEnabled ? 'enabled' : ''}`}>

      <label className="pb-toggle" htmlFor={toggleId} aria-label={`Toggle ${addon.label}`}>
        <input
          id={toggleId}
          type="checkbox"
          checked={isEnabled}
          onChange={onToggle}
          role="switch" 
          aria-checked={isEnabled}
        />
        <span className="pb-toggle-track" />
        <span className="pb-toggle-thumb" />
      </label>

      <div className="pb-addon-info">
        <div className="pb-addon-name">{addon.label}</div>
        <div className="pb-addon-desc">{addon.description}</div>
        {isEnabled && addon.hasMembers && (
          <div className="pb-stepper-wrap">
            <span className="pb-stepper-label">Members:</span>
            <Stepper
              value={memberCount}
              min={addon.minMembers ?? 2}
              max={addon.maxMembers ?? 5}
              onChange={onMemberCountChange}
              label="members"
            />
          </div>
        )}
      </div>

      <div>
        <div className="pb-addon-price">
          {formatINR(effectivePaisePer)}
          <span className="pb-addon-period"> {periodLabel}</span>
        </div>
        {perMemberNote && (
          <span className="pb-addon-price-sub">{perMemberNote}</span>
        )}
      </div>

    </div>
  );
}
