import { Music2, BookOpen, Moon, Sunrise } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import '../../styles/sections.css';

const FEATURES = [
  { Icon: Music2,   name: 'Adaptive Soundscapes', desc: 'Audio that shifts with your sleep stage. Never jarring, always just enough.' },
  { Icon: BookOpen, name: '500+ Sleep Stories',    desc: 'Narrated journeys, from rain-soaked forests to slow trains across Europe.' },
  { Icon: Moon,     name: 'Wind-Down Rituals',     desc: 'Personalised routines that quietly tell your body the day is done.' },
  { Icon: Sunrise,  name: 'Morning Insights',      desc: 'A gentle read on your night, with one small thing to try tonight.' },
];

export function Features() {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section id="features" className="section" aria-label="Features">
      <div className="section-container">

        <div className="section-header reveal-slide-up is-visible">
          <span className="section-eyebrow">Features</span>
          <h2 className="section-title">Everything your night needs</h2>
          <p className="section-subtitle">
            Science-backed tools that work together to improve your sleep, starting tonight.
          </p>
        </div>

        <div ref={ref} className="features-grid">
          {FEATURES.map(({ Icon, name, desc }, index) => (
            <div
              key={name}
              className={`feature-card reveal-slide-up ${isVisible ? 'is-visible' : ''}`}
              style={{ '--stagger': index } as React.CSSProperties}
              data-index={index}
            >
              <div className="feature-icon" aria-hidden="true">
                <Icon size={22} strokeWidth={1.8} />
              </div>
              <h3 className="feature-name">{name}</h3>
              <p className="feature-desc">{desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
