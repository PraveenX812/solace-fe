import { useScrollReveal } from '../../hooks/useScrollReveal';
import '../../styles/sections.css';

export function FooterCTA() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.3 });

  return (
    <section id="footer-cta" className="footer-cta" aria-label="Start your trial">
      <div 
        ref={ref} 
        className={`footer-cta-container reveal-slide-up ${isVisible ? 'is-visible' : ''}`}
      >
        <h2 className="footer-cta-headline">Ready for a better night?</h2>
        <p className="footer-cta-sub">
          Join 1.2 million sleepers waking up clearer.
        </p>
        <a href="#plan-builder" className="btn btn-primary">
          Start your 7-day free trial
        </a>
        <p className="footer-note">Cancel anytime. No commitment.</p>
      </div>
    </section>
  );
}
