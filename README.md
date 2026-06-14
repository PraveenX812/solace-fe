# Solace Frontend Assignment

## Live Deployment

[Live Demo](https://solace-fe-nine.vercel.app/)

## Running the Project Locally

This project was built using React, TypeScript, and Vite. To run it locally, follow these steps:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. To create a production build and test it:
   ```bash
   npm run build
   npm run preview
   ```

## Architectural Choices & State Management

### 1. State Orchestration (PlanBuilder)
The core business logic of the application resides in the PlanBuilder component. Instead of scattering state across multiple child components or using a global state manager like Redux (which would be overkill), I implemented a top-down data flow:
- `PlanBuilder.tsx` acts as the single source of truth for all pricing inputs (selected plan, active add-ons, member count, and applied promo code).
- Child components (`AddOnCard`, `PromoInput`, `Stepper`) are strictly pure, controlled components. They receive data via props and communicate interactions back up via callbacks. This ensures that the UI never falls out of sync with the calculation engine.

### 2. Business Logic Isolation
I decoupled the pricing calculation completely from the React components. The calculation engine lives in `src/logic/pricing.ts` as a pure TypeScript function. 
- **Floating Point Safety**: All calculations are performed in integer paise rather than floating-point rupees to eliminate IEEE-754 precision errors. 
- **Memoization**: Inside the React layer, the `calculateTotal()` function is wrapped in a `useMemo` hook. This guarantees that complex recalculations only occur when specific pricing dependencies change, preventing unnecessary CPU cycles during scroll or hover renders.

### 3. Styling & Animation Strategy
I opted for vanilla CSS with CSS Custom Properties (variables) over utility frameworks like Tailwind or heavy animation libraries like Framer Motion. 
- **CSS Variables**: Allowed for a clean, scalable design token system that directly maps to the provided design specifications.
- **Performance**: Animations rely exclusively on compositor-safe properties (`transform` and `opacity`) triggered by CSS classes. To orchestrate scroll reveals, I wrote a custom `useScrollReveal` hook using the native `IntersectionObserver` API. This approach kept the final JavaScript bundle exceptionally small (under 70kb gzipped) and ensured a flawless 60fps experience.
- **Micro-interactions**: The counting animation in the Trust Strip utilizes a custom `useCountUp` hook built directly on `requestAnimationFrame` and an `easeOutCubic` easing function, avoiding the jank commonly associated with `setInterval`.

## Performance

The application was optimized to meet strict performance requirements, resulting in a 90+ Lighthouse score on the mobile profile (production build). Key optimizations include moving Google Fonts out of CSS imports directly into the HTML head to unblock the critical rendering path, and deferring the hero SVG decoding.

### Lighthouse Score

![Lighthouse Performance Score](https://github.com/user-attachments/assets/b9714727-fbc8-4357-a594-ca4bb49be87b)
