import orbSvg from '../../assets/solace-hero-orb.svg';
import '../../styles/sections.css';

export function Hero() {
  return (
    <section id="hero" className="hero" aria-label="Hero">
      <div className="hero-inner">

        {/* ── Copy block ── */}
        <div className="hero-copy">
          <span className="hero-eyebrow">Sleep &amp; Meditation App</span>

          <h1 className="hero-headline">
            Sleep deeper.<br />Wake clearer.
          </h1>

          <p className="hero-sub">
            Adaptive soundscapes, guided wind-downs, and 500+ sleep stories
            that learn your night and adjust in real time.
          </p>

          <div className="hero-ctas">
            <a href="#plan-builder" className="btn btn-primary">
              Start free trial
            </a>
            <a href="#how-it-works" className="btn btn-ghost">
              See how it works
            </a>
          </div>
        </div>

        <img
          src={orbSvg}
          alt="Solace ambient orb — a breathing, glowing sphere"
          className="hero-orb"
          width={800}
          height={800}
          loading="lazy"
          decoding="async"
        />

      </div>
    </section>
  );
}
