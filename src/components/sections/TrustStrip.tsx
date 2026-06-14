import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useCountUp }      from '../../hooks/useCountUp';
import '../../styles/sections.css';

const STATS = [
  { prefix: '',  numeric: 1.2,  suffix: 'M',   decimals: 1, label: 'nights guided'                   },
  { prefix: '+', numeric: 47,   suffix: ' min', decimals: 0, label: 'average extra sleep per night'    },
  { prefix: '',  numeric: 4.8,  suffix: '★',    decimals: 1, label: 'App Store rating'                 },
  { prefix: '',  numeric: 92,   suffix: '%',    decimals: 0, label: 'fall asleep faster in week one'   },
];

function StatPill({ stat, isActive }: { stat: typeof STATS[0]; isActive: boolean }) {
  const scale = Math.pow(10, stat.decimals);
  const scaledTarget = Math.round(stat.numeric * scale);
  const rawValue = useCountUp({ target: scaledTarget, duration: 2200, isActive });
  const displayValue = (rawValue / scale).toFixed(stat.decimals);

  return (
    <div className="stat-pill">
      <span
        className="stat-number"
        aria-label={`${stat.prefix}${stat.numeric}${stat.suffix} — ${stat.label}`}
      >
        {stat.prefix}{displayValue}{stat.suffix}
      </span>
      <span className="stat-label" aria-hidden="true">
        {stat.label}
      </span>
    </div>
  );
}

export function TrustStrip() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.3 });

  return (
    <div
      ref={ref}
      className={`trust-strip reveal-slide-up ${isVisible ? 'is-visible' : ''}`}
      role="region"
      aria-label="Key statistics"
    >
      <div className="section-container">
        <div className="trust-pills">
          {STATS.map(stat => (
            <StatPill key={stat.label} stat={stat} isActive={isVisible} />
          ))}
        </div>
      </div>
    </div>
  );
}
