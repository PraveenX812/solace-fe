import { useScrollReveal } from '../../hooks/useScrollReveal';
import '../../styles/sections.css';

const STEPS = [
  { number: '01', title: 'Tell us about your nights.', desc: 'A two-minute check-in sets your baseline.' },
  { number: '02', title: 'Drift off, guided.',         desc: 'Pick a story, or let Solace choose for you.' },
  { number: '03', title: 'Wake to insight.',           desc: 'See what worked, and what to adjust.' },
];

export function HowItWorks() {
  const { ref, isVisible } = useScrollReveal<HTMLOListElement>({ threshold: 0.1 });

  return (
    <section id="how-it-works" className="section" aria-label="How it works">
      <div className="section-container">

        <div className="section-header reveal-slide-up is-visible">
          <span className="section-eyebrow">How it works</span>
          <h2 className="section-title">Three steps to better sleep</h2>
          <p className="section-subtitle">
            No complicated setup. Most people feel a difference by night three.
          </p>
        </div>

        <ol ref={ref} className="steps-list" aria-label="Steps to get started">
          {STEPS.map((step, index) => (
            <li
              key={step.number}
              className={`step reveal-slide-left ${isVisible ? 'is-visible' : ''}`}
              style={{ '--stagger': index } as React.CSSProperties}
            >
              <div className="step-number-wrap">
                <div className="step-number" aria-hidden="true">{step.number}</div>
              </div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>

      </div>
    </section>
  );
}
