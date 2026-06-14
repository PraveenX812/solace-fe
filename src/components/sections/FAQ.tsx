import { useState, useRef, useEffect } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import '../../styles/sections.css';

const FAQS = [
  {
    question: 'How does the free trial work?',
    answer: 'You have 7 days to explore the full Solace library and plan builder. If you cancel before the trial ends, you will not be charged. We send a reminder email on day 5 so you are never caught off guard.'
  },
  {
    question: 'Can I change my plan later?',
    answer: 'Yes. You can switch from monthly to annual at any time (and we will prorate the difference). You can also add or remove family members or coaching sessions whenever you need.'
  },
  {
    question: 'Is Family Sharing limited to my household?',
    answer: 'No. You can invite anyone — parents, siblings, or friends — regardless of where they live. Each person gets their own private account and history.'
  },
  {
    question: 'Do I need headphones?',
    answer: 'While headphones provide the most immersive experience for our spatial audio soundscapes, playing Solace quietly through your phone speaker on your nightstand works perfectly well for the guided rituals and sleep stories.'
  }
];

function FaqItem({ question, answer, index }: { question: string, answer: string, index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState<number | undefined>(isOpen ? undefined : 0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    
    const exactHeight = contentRef.current.scrollHeight;

    if (isOpen) {
      setHeight(exactHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (isOpen && contentRef.current) {
        setHeight(contentRef.current.scrollHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className={`faq-item ${isOpen ? 'is-open' : ''}`}>
      <button
        className="faq-btn"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${index}`}
      >
        <span className="faq-question">{question}</span>
        <span className="faq-icon" aria-hidden="true">+</span>
      </button>

      <div
        id={`faq-answer-${index}`}
        className="faq-answer-wrapper"
        style={{ height: height !== undefined ? `${height}px` : undefined }}
      >
        <div ref={contentRef} className="faq-answer">
          {answer}
        </div>
      </div>
    </div>
  );
}

export function FAQ() {
  const { ref: headerRef, isVisible: headerVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.2 });
  const { ref: listRef, isVisible: listVisible } = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section id="faq" className="section" aria-label="Frequently asked questions">
      <div className="section-container faq-container">

        <div 
          ref={headerRef} 
          className={`section-header reveal-slide-up ${headerVisible ? 'is-visible' : ''}`}
        >
          <span className="section-eyebrow">FAQ</span>
          <h2 className="section-title">Common questions</h2>
        </div>

        <div 
          ref={listRef} 
          className={`faq-list reveal-fade ${listVisible ? 'is-visible' : ''}`}
        >
          {FAQS.map((faq, index) => (
            <FaqItem
              key={index}
              index={index}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
