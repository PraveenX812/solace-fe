import { calculateTotal, validatePromo } from '../logic/pricing';
import { formatINR } from '../utils/formatting';

function rupees(paise: number): string {
  return formatINR(paise);
}

function assert(label: string, actual: unknown, expected: unknown): void {
  const pass = JSON.stringify(actual) === JSON.stringify(expected);
  if (pass) {
    console.log(`  ✅ ${label}`);
  } else {
    console.error(`  ❌ ${label}`);
    console.error(`     Expected: ${JSON.stringify(expected)}`);
    console.error(`     Actual:   ${JSON.stringify(actual)}`);
  }
}

export function runPricingTests(): void {
  console.group('Pricing Logic Tests');

  // ── TC1: Monthly, no add-ons ──────────────────────────────────────────────
  console.group('TC1: Monthly, no add-ons, no promo');
  {
    const result = calculateTotal({
      planId: 'monthly',
      activeAddOns: new Set(),
      memberCount: 2,
      promoCode: null,
    });
    assert('total = ₹499', rupees(result.totalPaise), '₹499');
    assert('billingLabel = month', result.billingLabel, 'month');
    assert('savingsPaise = 0', result.savingsPaise, 0);
    assert('lines count = 1', result.lines.length, 1);
  }
  console.groupEnd();

  // ── TC2: Annual, no add-ons ───────────────────────────────────────────────
  console.group('TC2: Annual, no add-ons, no promo');
  {
    const result = calculateTotal({
      planId: 'annual',
      activeAddOns: new Set(),
      memberCount: 2,
      promoCode: null,
    });
    assert('total = ₹3,999', rupees(result.totalPaise), '₹3,999');
    assert('billingLabel = year', result.billingLabel, 'year');
    assert('savingsPaise = 198900', result.savingsPaise, 198900); // ₹1,989
    console.log(`  ℹ You save: ${rupees(result.savingsPaise)} (${result.savingsPercent}%)`);
  }
  console.groupEnd();

  // ── TC3: Annual + Coaching, no promo ─────────────────────────────────────
  console.group('TC3: Annual + Coaching, no promo');
  {
    const result = calculateTotal({
      planId: 'annual',
      activeAddOns: new Set(['coaching']),
      memberCount: 2,
      promoCode: null,
    });
    assert('total = ₹13,989', rupees(result.totalPaise), '₹13,989');
    assert('savingsPaise = 398700', result.savingsPaise, 398700); // ₹3,987
  }
  console.groupEnd();

  // ── TC4: Monthly + Family (3 members) ────────────────────────────────────
  console.group('TC4: Monthly + Family (3 members), no promo');
  {
    const result = calculateTotal({
      planId: 'monthly',
      activeAddOns: new Set(['family']),
      memberCount: 3,
      promoCode: null,
    });
    assert('total = ₹1,096', rupees(result.totalPaise), '₹1,096');
    assert('lines count = 2', result.lines.length, 2);
    assert('family line label', result.lines[1].label, 'Family Sharing (3 members)');
  }
  console.groupEnd();

  // ── TC5: Annual + Family (3) + WELCOME20 ─────────────────────────────────
  console.group('TC5: Annual + Family (3 members) + WELCOME20');
  {
    const result = calculateTotal({
      planId: 'annual',
      activeAddOns: new Set(['family']),
      memberCount: 3,
      promoCode: 'WELCOME20',
    });
    // subtotal = 399900 + 19900×3×10 = 399900 + 597000 = 996900
    // discount = round(996900 × 20 / 100) = 199380
    // total = 996900 - 199380 = 797520 paise = ₹7,975.20
    assert('promoStatus = valid', result.promoStatus?.state, 'valid');
    assert('totalPaise = 797520', result.totalPaise, 797520);
    assert('lines count = 3', result.lines.length, 3); // base + family + discount
    console.log(`  ℹ Total: ${rupees(result.totalPaise)}, Savings: ${rupees(result.savingsPaise)}`);
  }
  console.groupEnd();

  // ── TC6: Lifetime + WELCOME20 → REJECTED ─────────────────────────────────
  console.group('TC6: Lifetime + WELCOME20 → must be rejected');
  {
    const result = calculateTotal({
      planId: 'lifetime',
      activeAddOns: new Set(),
      memberCount: 2,
      promoCode: 'WELCOME20',
    });
    assert('promoStatus = invalid', result.promoStatus?.state, 'invalid');
    assert('correct message', result.promoStatus?.message, "WELCOME20 doesn't apply to Lifetime plans.");
    assert('total unchanged = ₹14,999', rupees(result.totalPaise), '₹14,999');
  }
  console.groupEnd();

  // ── TC7: FAMILY50 without Family Sharing → REJECTED ──────────────────────
  console.group('TC7: Monthly + FAMILY50, no Family Sharing → must be rejected');
  {
    const result = calculateTotal({
      planId: 'monthly',
      activeAddOns: new Set(),
      memberCount: 2,
      promoCode: 'FAMILY50',
    });
    assert('promoStatus = invalid', result.promoStatus?.state, 'invalid');
    assert('correct message', result.promoStatus?.message, 'Add Family Sharing to use FAMILY50.');
  }
  console.groupEnd();

  // ── TC8: Monthly + Family (3) + FAMILY50 ─────────────────────────────────
  console.group('TC8: Monthly + Family (3 members) + FAMILY50');
  {
    const result = calculateTotal({
      planId: 'monthly',
      activeAddOns: new Set(['family']),
      memberCount: 3,
      promoCode: 'FAMILY50',
    });
    // family = 19900 × 3 × 1 = 59700
    // FAMILY50 = round(59700 × 50 / 100) = 29850
    // total = 109600 - 29850 = 79750
    assert('promoStatus = valid', result.promoStatus?.state, 'valid');
    assert('totalPaise = 79750', result.totalPaise, 79750);
    console.log(`  ℹ Total: ${rupees(result.totalPaise)}`);
  }
  console.groupEnd();

  // ── TC9: Lifetime + Coaching + Stories ───────────────────────────────────
  console.group('TC9: Lifetime + Coaching + Stories, no promo');
  {
    const result = calculateTotal({
      planId: 'lifetime',
      activeAddOns: new Set(['coaching', 'stories']),
      memberCount: 2,
      promoCode: null,
    });
    // coaching = 99900 × 24 = 2397600, stories = 14900 × 24 = 357600
    // total = 1499900 + 2397600 + 357600 = 4255100
    assert('totalPaise = 4255100', result.totalPaise, 4255100);
    assert('billingLabel = one-time', result.billingLabel, 'one-time');
    console.log(`  ℹ Total: ${rupees(result.totalPaise)}`);
  }
  console.groupEnd();

  // ── TC10: SLEEP100 → expired ──────────────────────────────────────────────
  console.group('TC10: SLEEP100 → always expired');
  {
    const status = validatePromo('SLEEP100', {
      planId: 'monthly',
      activeAddOns: new Set(),
      memberCount: 2,
      promoCode: 'SLEEP100',
    });
    assert('state = invalid', status.state, 'invalid');
    assert('correct message', status.message, 'This code has expired.');
  }
  console.groupEnd();

  // ── TC11: Unknown code ────────────────────────────────────────────────────
  console.group('TC11: Unknown code → unrecognised');
  {
    const status = validatePromo('GARBAGE', {
      planId: 'monthly',
      activeAddOns: new Set(),
      memberCount: 2,
      promoCode: 'GARBAGE',
    });
    assert('state = invalid', status.state, 'invalid');
    assert('correct message', status.message, "We don't recognise that code.");
  }
  console.groupEnd();

  // ── TC12: Empty input → inert ─────────────────────────────────────────────
  console.group('TC12: Empty/whitespace → inert (no error)');
  {
    const s1 = validatePromo('', { planId: 'monthly', activeAddOns: new Set(), memberCount: 2, promoCode: null });
    const s2 = validatePromo('   ', { planId: 'monthly', activeAddOns: new Set(), memberCount: 2, promoCode: null });
    assert('empty → none', s1.state, 'none');
    assert('whitespace → none', s2.state, 'none');
    assert('empty message = null', s1.message, null);
  }
  console.groupEnd();

  // ── TC13: Member count clamping ───────────────────────────────────────────
  console.group('TC13: Member count clamped to [2, 5]');
  {
    const r1 = calculateTotal({
      planId: 'monthly',
      activeAddOns: new Set(['family']),
      memberCount: 1,  // below minimum — should clamp to 2
      promoCode: null,
    });
    const r2 = calculateTotal({
      planId: 'monthly',
      activeAddOns: new Set(['family']),
      memberCount: 6,  // above maximum — should clamp to 5
      promoCode: null,
    });
    // Clamped to 2: family = 19900 × 2 × 1 = 39800, total = 49900 + 39800 = 89700
    assert('memberCount=1 clamped: totalPaise = 89700', r1.totalPaise, 89700);
    // Clamped to 5: family = 19900 × 5 × 1 = 99500, total = 49900 + 99500 = 149400
    assert('memberCount=6 clamped: totalPaise = 149400', r2.totalPaise, 149400);
    assert('family label shows 2 members', r1.lines[1].label, 'Family Sharing (2 members)');
    assert('family label shows 5 members', r2.lines[1].label, 'Family Sharing (5 members)');
  }
  console.groupEnd();

  // ── TC14: Case-insensitive promo codes ────────────────────────────────────
  console.group('TC14: Lowercase promo code input works');
  {
    const status = validatePromo('welcome20', {
      planId: 'monthly',
      activeAddOns: new Set(),
      memberCount: 2,
      promoCode: 'welcome20',
    });
    assert('lowercase welcome20 → valid', status.state, 'valid');
  }
  console.groupEnd();

  console.groupEnd(); // 🧪 Pricing Logic Tests
}
