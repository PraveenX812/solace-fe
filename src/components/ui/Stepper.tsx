interface StepperProps {
  value: number;
  min: number;
  max: number;
  onChange: (newValue: number) => void;
  label: string; 
}

export function Stepper({ value, min, max, onChange, label }: StepperProps) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => onChange(Math.min(max, value + 1));

  return (
    <div className="pb-stepper" role="group" aria-label={label}>
      <button
        type="button"
        className="pb-stepper-btn"
        onClick={decrement}
        disabled={value <= min}
        aria-label={`Decrease ${label}`}
      >
        −
      </button>

      <span className="pb-stepper-value" aria-live="polite">
        {value}
      </span>

      <button
        type="button"
        className="pb-stepper-btn"
        onClick={increment}
        disabled={value >= max}
        aria-label={`Increase ${label}`}
      >
        +
      </button>
    </div>
  );
}
