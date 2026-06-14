import type { PricingOutput } from '../../logic/pricing';
import { formatINR } from '../../utils/formatting';

interface PriceBreakdownProps {
  pricing: PricingOutput;
}

export function PriceBreakdown({ pricing }: PriceBreakdownProps) {
  const { lines, totalPaise, savingsPaise, savingsPercent, billingLabel } = pricing;

  const billingString =
    billingLabel === 'one-time'
      ? 'One-time payment'
      : `Billed ${formatINR(totalPaise)} / ${billingLabel}`;

  return (
    <div className="pb-breakdown">
      <ul className="pb-breakdown-lines" aria-label="Price breakdown">
        {lines.map(line => (
          <li
            key={line.label}
            className={`pb-breakdown-line ${line.isDiscount ? 'discount' : ''}`}
          >
            <span className="pb-breakdown-label">{line.label}</span>
            <span className="pb-breakdown-amount">
              {line.isDiscount ? '−' : ''}{formatINR(line.amountPaise)}
            </span>
          </li>
        ))}
      </ul>

      {savingsPaise > 0 && (
        <div className="pb-savings-line" role="status" aria-live="polite">
          <span> You save {formatINR(savingsPaise)}</span>
          <span>({savingsPercent.toFixed(1)}%)</span>
        </div>
      )}

      <div className="pb-total-row">
        <span className="pb-total-label">Total</span>
        <span className="pb-total-amount" aria-live="polite">
          {formatINR(totalPaise)}
        </span>
      </div>

      <div className="pb-billing-label">{billingString}</div>

      <button type="button" className="pb-cta-btn">
        Start your free trial
      </button>

    </div>
  );
}
