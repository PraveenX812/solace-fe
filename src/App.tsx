import { Hero }        from './components/sections/Hero';
import { TrustStrip }  from './components/sections/TrustStrip';
import { Features }    from './components/sections/Features';
import { HowItWorks }  from './components/sections/HowItWorks';
import { PlanBuilder } from './components/sections/PlanBuilder';
import { Testimonials } from './components/sections/Testimonials';
import { FAQ }         from './components/sections/FAQ';
import { FooterCTA }   from './components/sections/FooterCTA';

import './styles/animations.css';

function App() {
  return (
    <main>
      <Hero />
      <TrustStrip />
      <Features />
      <HowItWorks />
      <PlanBuilder />
      <Testimonials />
      <FAQ />
      <FooterCTA />
    </main>
  );
}

export default App;
