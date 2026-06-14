import { useScrollReveal } from '../../hooks/useScrollReveal';
import '../../styles/sections.css';

const TESTIMONIALS = [
  { quote: 'Three weeks in, I slept through the night for the first time in years.', author: 'Aanya R.', location: 'Bengaluru', stars: 5 },
  { quote: 'The wind-down ritual is the only bedtime habit that ever stuck.',         author: 'Daniel M.', location: 'London',    stars: 5 },
  { quote: "I stopped doom-scrolling at midnight. That alone was worth it.",          author: 'Priya S.',  location: 'Mumbai',    stars: 5 },
];

export function Testimonials() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section id="testimonials" className="section" aria-label="Customer testimonials">
      <div className="section-container">

        <div className="section-header reveal-slide-up is-visible">
          <span className="section-eyebrow">Testimonials</span>
          <h2 className="section-title">Real nights. Real results.</h2>
        </div>

        <div ref={ref} className="testimonials-grid">
          {TESTIMONIALS.map((t, index) => (
            <figure
              key={t.author}
              className={`testimonial-card reveal-slide-up ${isVisible ? 'is-visible' : ''}`}
              style={{ '--stagger': index } as React.CSSProperties}
            >
              <div className="testimonial-stars" aria-label={`${t.stars} out of 5 stars`}>
                {'★'.repeat(t.stars)}
              </div>
              <blockquote className="testimonial-quote">{t.quote}</blockquote>
              <figcaption className="testimonial-author">
                — {t.author},&nbsp;
                <cite style={{ fontStyle: 'normal', color: 'var(--color-muted)', fontWeight: 400 }}>
                  {t.location}
                </cite>
              </figcaption>
            </figure>
          ))}
        </div>

      </div>
    </section>
  );
}
