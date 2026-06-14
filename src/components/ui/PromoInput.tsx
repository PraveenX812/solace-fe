import type { PromoStatus } from '../../logic/pricing';

interface PromoInputProps {
  inputText: string;           
  promoStatus: PromoStatus | null; 
  onInputChange: (value: string) => void;
  onApply: () => void;          
  onClear: () => void;         
}

export function PromoInput({
  inputText,
  promoStatus,
  onInputChange,
  onApply,
  onClear,
}: PromoInputProps) {

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      onApply();
    }
  }

  const showMessage = promoStatus && promoStatus.state !== 'none';

  return (
    <div className="pb-promo">
      <span className="pb-section-label">Promo Code</span>

      <div className="pb-promo-row">
        <input
          type="text"
          className="pb-promo-input"
          placeholder="e.g. WELCOME20"
          value={inputText}
          onChange={e => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="characters"
          spellCheck={false}
          aria-label="Promo code"
          aria-describedby={showMessage ? 'promo-msg' : undefined}
        />

        <button
          type="button"
          className="pb-promo-btn"
          onClick={onApply}
          aria-label="Apply promo code"
        >
          Apply
        </button>
      </div>

      {showMessage && (
        <div
          id="promo-msg"
          className={`pb-promo-msg ${promoStatus.state}`}
          role="alert" 
        >
          {promoStatus.state === 'valid' ? '✓ ' : '✕ '}
          {promoStatus.state === 'valid' ? 'Code applied!' : promoStatus.message}

          <button
            type="button"
            className="pb-promo-clear"
            onClick={onClear}
            aria-label="Remove promo code"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
