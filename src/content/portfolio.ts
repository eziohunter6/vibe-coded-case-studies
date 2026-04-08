/**
 * Portfolio content, swap images under public/images and public/brand
 * with your PNG exports when ready.
 */

export type ProjectFormat = "extended" | "mini";

export type ContentSection = {
  id: string;
  title: string;
  paragraphs: string[];
  image?: string;
  imageAlt?: string;
  emphasis?: boolean;
};

export type ExtendedProject = {
  format: "extended";
  slug: string;
  title: string;
  /** Short line under title on case page */
  tagline: string;
  role: string;
  year: string;
  client?: string;
  coverImage: string;
  coverAlt: string;
  heroImage: string;
  heroAlt: string;
  tags: string[];
  intro: string;
  sections: ContentSection[];
  reflection?: string[];
  /** Apple-style pull quote between hero and body */
  pullQuote?: { text: string; attribution?: string };
  /** Key facts row on case page */
  metrics?: { label: string; value: string }[];
};

export type MiniProject = {
  format: "mini";
  slug: string;
  title: string;
  tagline: string;
  role: string;
  year: string;
  coverImage: string;
  coverAlt: string;
  tags: string[];
  summary: string;
  highlights: { label: string; value: string }[];
  body: string[];
  /** Structured panel sections, when present, panel renders Problem / Challenge / Impact */
  problem?: string;
  challenge?: string[];
  impact?: string[];
  /** Optional external link (e.g. Figma presentation) shown as CTA in the panel */
  href?: string;
};

export type Project = ExtendedProject | MiniProject;

export const site = {
  name: "Utkarsh Raj",
  /** Short phrase for nav / metadata */
  title: "Sr. Product Designer",
  yearsExperience: "6+ years",
  metaDescription:
    "Utkarsh Raj, Senior Product Designer with 6+ years across commerce, operations, and consumer products. Research-led, systems-aware, outcome-focused.",
  /** Hero headline */
  heroLead: "I close the gap between your product and its users.",
  heroSupporting:
    "I partner with teams on products that have to work the first time, research-led flows, resilient systems, and UI that earns trust under pressure.",
  /** Single ribbon under hero */
  heroRibbon:
    "Product design · Systems · Research · Prototyping · Design leadership",
  workIntro:
    "Selected work. Full case studies walk through context, decisions, and outcomes. Shorter pieces open in place so you can skim without losing the thread.",
  miniIntro:
    "Additional projects, tighter stories, same rigor. A panel on larger screens; a sheet on your phone.",
  contactIntro:
    "Tell me about the problem you are hiring for, the team shape, and where design sits in the roadmap. I read everything and reply within a few days.",
  location: "Based in Gurgaon, India · comfortable across time zones",
  contact: {
    email: "utkarshraj7540@gmail.com",
    linkedin: "https://www.linkedin.com/in/utkarsh-raj-299386191?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    dribbble: "https://dribbble.com/utkarshraj7540",
  },
  brandMarks: [
    { srcLight: "/brand/spinny-light.png", srcDark: "/brand/spinny-dark.png", alt: "Spinny" },
    { srcLight: "/brand/et-light.png", srcDark: "/brand/et-dark.png", alt: "Economic Times" },
    { srcLight: "/brand/cleartrip-light.png", srcDark: "/brand/cleartrip-dark.png", alt: "Cleartrip" },
    { srcLight: "/brand/flipkart-light.png", srcDark: "/brand/flipkart-dark.png", alt: "Flipkart" },
    { srcLight: "/brand/deloitte-light.png", srcDark: "/brand/deloitte-dark.png", alt: "Deloitte" },
    { srcLight: "/brand/zostel-light.png", srcDark: "/brand/zostel-dark.png", alt: "Zostel" },
  ] as const,
} as const;

export const projects: Project[] = [
  {
    format: "extended",
    slug: "spinny-buy-homepage",
    title: "Redesigning Spinny's homepage for committed buyers",
    tagline:
      "Returning buyers with booked test drives landed on the same homepage as first-time visitors. The system already knew their state, the homepage just wasn't showing it. I redesigned it to surface each user's exact position in the journey.",
    role: "Lead Designer",
    year: "2025",
    client: "Spinny",
    coverImage: "/images/buy-homepage/thumbnail.jpg",
    coverAlt: "Spinny buy homepage redesign",
    heroImage: "/images/buy-homepage/thumbnail.jpg",
    heroAlt: "Spinny buy homepage redesign",
    tags: ["iOS", "Android", "PWA", "Research", "Systems"],
    metrics: [
      { label: "Role", value: "Lead Designer" },
      { label: "Team", value: "1 PM · 3 Eng · 1 Analyst" },
      { label: "Timeline", value: "4 weeks · 2025" },
      { label: "T2V uplift", value: "−5.14%" },
      { label: "U2D uplift", value: "+3.2%" },
      { label: "Scale", value: "2.5M MAU · A/B validated" },
    ],
    pullQuote: {
      text: "The homepage wasn't missing data. It was ignoring the data it already had.",
    },
    intro:
      "Spinny's homepage was built for discovery, browsing inventory, filtering, comparing. It served exploratory users well. But a large cohort of returning users had already committed: they'd scheduled a test drive, made a booking, or were waiting on delivery. For these users, the homepage was blind to where they were. Profile had the state. The homepage never looked at it.",
    sections: [
      {
        id: "problem",
        title: "Two users. One homepage.",
        paragraphs: [
          "Drop-offs peaked in the 48-hour gap between scheduling a test drive and the showroom visit, a window where committed intent could go cold.",
          "The Browser and The Buyer were being served identical experiences. Mapped across five attributes, State, Goal, Homepage fit, Intent, and Gap, the difference was stark. The Browser: browsing inventory, no commitment, homepage built for them. The Buyer: test drive booked, highest intent, homepage showing nothing relevant. The gap column was the same every row.",
          "Profile had the data. Drop-offs peaked in the 48-hour gap between scheduling and showroom visit. The homepage never surfaced any of it.",
        ],
        image: "/images/buy-homepage/problem.png",
        imageAlt: "Two user cohorts, The Browser vs The Buyer",
        emphasis: true,
      },
      {
        id: "journey",
        title: "Where the journey broke down.",
        paragraphs: [
          "I mapped the transactional lifecycle across four stages: Test Drive Scheduled, The Void, Showroom Visit, Booking & Delivery. Peak friction lived entirely in Stage 2, the 48-hour window after scheduling where users had no confirmation, no next step, and no signal the product remembered them.",
          "Every stage after scheduling depended on the user remembering what to do next without the product telling them. That's not a feature gap. That's a trust gap.",
        ],
        image: "/images/buy-homepage/journey.png",
        imageAlt: "Transactional lifecycle, 4 stages, peak friction at Stage 2",
      },
      {
        id: "competitive",
        title: "Nobody had solved this.",
        paragraphs: [
          "Before designing, I audited how competitors handle returning committed users across four platforms: Carvana (US), Cars24, CarWale, and Spinny.",
          "Carvana was the closest, a dashboard widget with delivery tracking, but only when logged in. Anonymous users saw the same generic homepage. Cars24 and CarWale showed identical inventory pages on return, transactional intent completely invisible to the interface. No platform in the Indian used-car market surfaces booking state on the homepage for returning committed users. The gap wasn't unique to Spinny, but that made it an opportunity, not an excuse.",
        ],
        image: "/images/buy-homepage/competitor.png",
        imageAlt: "Competitive audit, post-booking homepage experience",
      },
      {
        id: "reframe",
        title: "What if the homepage knew where you left off?",
        paragraphs: [
          "The design question became: what if the Spinny homepage knew exactly where a buyer left off and showed them the fastest way to finish? A returning buyer opens the app and instead of an inventory grid, sees their test drive details, the address, the time, one clear action. No search. No hunting through Profile. The homepage becomes a co-pilot, not a catalogue.",
          "Four real-world constraints shaped what was possible: ReactJS performance limits ruled out complex carousel patterns; the transaction dashboard lived in a separate team's codebase; leadership needed an evolutionary change, not a disruptive one; and we had four weeks, not four months.",
        ],
        image: "/images/buy-homepage/constraints.png",
        imageAlt: "Four constraints that shaped the solution space",
        emphasis: true,
      },
      {
        id: "ideation",
        title: "Two paths. One right answer.",
        paragraphs: [
          "I explored two structurally distinct approaches. Option 1, an Inline Banner, added contextual banners to the existing homepage. No structural change, fast to ship. Rejected: banners are easy to ignore, they don't fix the mismatch between page intent and user need, and they feel bolted on rather than designed in.",
          "Option 2, a State-Aware Homepage, kept one homepage but gave it two modes. Exploratory users see browsing unchanged. Committed users see their stage and one next action, automatically, with no navigation change. More complex to build, but solves the actual problem. Risk managed through phased rollout and fallback states. We also explored a snappable swipe interaction, de-prioritised due to ReactJS performance constraints and cognitive overhead. The right answer was clarity, not novelty.",
        ],
        image: "/images/buy-homepage/ideation.png",
        imageAlt: "Two design options, trade-off analysis",
      },
      {
        id: "final",
        title: "A homepage that knows where you are.",
        paragraphs: [
          "The final design is a state-aware homepage across all transaction stages. Each state surfaces only what is relevant to the user at that exact moment in their journey, relationship manager details, upcoming call time, car information, booking status, and one clear next action.",
          "State-adaptive components handle 128+ use cases across the transaction funnel. The system is modular, configurable, and additive, exploratory users still get the full browsing experience. Committed buyers get a co-pilot.",
        ],
        image: "/images/buy-homepage/outcome.png",
        imageAlt: "Final designs, state-aware homepage across all transaction stages",
        emphasis: true,
      },
    ],
    reflection: [
      "The hardest part wasn't the design, it was working within real team boundaries. The transaction dashboard lived in a separate team's codebase. Leadership wanted evolution, not disruption. Getting the homepage to surface state it already had required negotiating access, not just designing a new component.",
      "The Browser/Buyer split turned out to be a useful mental model beyond this project. Most homepage problems are actually cohort-blindness problems, a single surface trying to serve users at wildly different stages of intent. Once you name the cohorts, the solution space narrows fast.",
      "Outcome (A/B validated · 2.5M MAU): −5.14% T2V (Time-to-Visit). +3.2% U2D (User-to-Delivery). Uplift deepened further in the funnel, a signal this wasn't surface engagement, but genuine improvement in decision quality. The downstream metric moved most, not the top-of-funnel one.",
      "Transactional users don't need more features. They need the product to remember them.",
    ],
  },
  {
    format: "extended",
    slug: "car-comparison",
    title: "Comparison feature adding decision speed",
    tagline:
      "16% of users on the product detail page were already comparing cars, bouncing between listings, returning to the same ones repeatedly. The behaviour was in the data. I built the comparison layer that matched how they naturally decided.",
    role: "Lead Designer",
    year: "2025",
    client: "Spinny",
    coverImage: "/images/car-comparison/thumbnail.jpg",
    coverAlt: "Spinny car comparison feature",
    heroImage: "/images/car-comparison/cover.jpg",
    heroAlt: "Spinny car comparison feature",
    tags: ["iOS", "Android", "PWA", "Behavioural Research", "Decision Design"],
    metrics: [
      { label: "Role", value: "Lead Designer" },
      { label: "Team", value: "1 PM · 3 Eng · 1 Analyst" },
      { label: "Timeline", value: "6 weeks · 2024" },
      { label: "U2D uplift", value: "+5.3%" },
      { label: "Time-to-Visit", value: "−18.3%" },
      { label: "Scale", value: "~238K users · A/B validated" },
    ],
    pullQuote: {
      text: "The behaviour was already in the data. The opportunity wasn't to create demand, it was to build the decision architecture for users who already wanted to decide.",
    },
    intro:
      "Spinny had 2.3M users on the product detail page. 16.43% of them were comparing cars, bouncing between listings, returning to the same cars repeatedly, showing clear signs of active decision-making. But the product offered them nothing. No way to place two cars side by side. No tool to weigh specs, price, and value. Every comparison happened in the user's head or in browser tabs they managed themselves.",
    sections: [
      {
        id: "problem",
        title: "The A\u2192B\u2192A pattern.",
        paragraphs: [
          "Behavioural analysis revealed a pattern we named A\u2192B\u2192A: users would visit car A, go to car B, return to car A, go back to car B. The oscillation wasn't indecision, it was a user actively trying to decide without the right tool.",
          "Drop-offs spiked at this exact point. The product was watching users struggle and offering them nothing. There was no structured hierarchy to guide trade-offs between price, EMI, mileage, or ownership history.",
        ],
        image: "/images/car-comparison/problem.png",
        imageAlt: "A to B to A navigation pattern, behavioural signal",
        emphasis: true,
      },
      {
        id: "data",
        title: "The system provided information. It did not support decision-making.",
        paragraphs: [
          "High-intent users were retaining specifications in working memory, switching between PDPs repeatedly, and comparing non-prioritised attributes without any scaffold to reason across them.",
          "The data didn't show confused users. It showed capable users being let down by a product that hadn't kept up with how they naturally think.",
        ],
        image: "/images/car-comparison/data.png",
        imageAlt: "Behavioural data, high-intent user patterns on PDP",
      },
      {
        id: "hypothesis",
        title: "Support the decision. Don't interrupt it.",
        paragraphs: [
          "The hypothesis: introducing a structured comparison layer for behaviourally identified evaluators would reduce cognitive strain, improve interpretation clarity, and increase downstream progression.",
          "The key constraint, no explicit entry point. Adding a visible 'Compare' CTA would introduce artificial adoption bias and wouldn't match how users were already behaving. The trigger had to be behavioural.",
        ],
        image: "/images/car-comparison/hypothesis.png",
        imageAlt: "Hypothesis and design constraints",
        emphasis: true,
      },
      {
        id: "exploration",
        title: "Three structures. One right answer.",
        paragraphs: [
          "I explored three structural variants: a flat spec grid (equal-weight parameters, rejected for cognitive overload), a card-based comparison (visually clean but poor cross-attribute scannability), and a hierarchical model.",
          "The hierarchical model surfaced primary attributes first, Price, EMI, Ownership, Mileage, grouped secondary specs logically, and highlighted differences conditionally. Density was preserved without sacrificing hierarchy.",
        ],
        image: "/images/car-comparison/exploration.png",
        imageAlt: "Three structural variants, trade-off analysis",
      },
      {
        id: "testing",
        title: "Tested in person before a single pixel shipped.",
        paragraphs: [
          "I conducted in-person hub testing with 10 active evaluators comparing two structural variants. The key distinction: independent scales per parameter (Variant 1) vs. a consistent normalised scale across attributes (Variant 2).",
          "Users consistently reported Variant 2 as clearer. Decision confidence improved when differences were visually normalised. Users made quicker choices when primary attributes were emphasised. Variant 2 went to experiment rollout.",
        ],
        image: "/images/car-comparison/testing.png",
        imageAlt: "Floor testing, 10 evaluators, 2 structural variants",
        emphasis: true,
      },
      {
        id: "outcome",
        title: "Uplift increased deeper in the funnel.",
        paragraphs: [
          "The pattern of results told the real story: metrics improved more at later funnel stages than early ones, confirming improved decision quality, not just surface engagement.",
          "Randomised A/B test across ~238K eligible users. Business metrics: U2Tds +1.6%, U2T +3.8%, U2D +5.3%. User speed metrics: Time-to-Token \u221212.4%, Time-to-Visit \u221218.3%.",
        ],
        image: "/images/car-comparison/outcome.png",
        imageAlt: "A/B test outcomes, funnel metrics",
        emphasis: true,
      },
    ],
    reflection: [
      "High-intent comparison behaviour was already in the data. The opportunity wasn't to create demand, it was to build decision architecture for users who already wanted to decide. That distinction shapes what you build completely.",
      "The A→B→A pattern was the most useful thing the data gave us. It reframed the problem from 'users can't decide' to 'the product isn't helping users who already want to decide.' That reframe changed everything about scope, structure, and what we chose not to build.",
      "Structuring evaluation around weighted decision variables, not flat spec display, reduced cognitive friction for high-intent users and improved downstream qualification across all three key business metrics (U2Tds +1.6%, U2T +3.8%, U2D +5.3%). The deeper the funnel, the larger the improvement.",
    ],
  },
  {
    format: "mini",
    slug: "et-prime",
    title: "Improving ET Prime feature discoverability",
    tagline:
      "ET Prime subscribers were paying for features they couldn't find. I redesigned feature discovery to close the gap between what users paid for and what they actually used.",
    role: "Product designer",
    year: "2023",
    coverImage: "/images/analytics-cover.jpg",
    coverAlt: "ET Prime feature discoverability",
    tags: ["Mobile", "PWA", "Experience Revamp"],
    summary:
      "Paid subscribers were under-using premium features because the interface never surfaced them in context. The gap between subscription value and perceived value was a discoverability problem, not a product one.",
    highlights: [
      { label: "Renewals", value: "+28% Prime renewals post-launch, 8% above projection" },
      { label: "Subscriptions", value: "New subscription rate increased post-launch; stronger value perception at onboarding identified as primary driver" },
      { label: "Feature engagement", value: "Premium feature usage increased after contextual surfacing, users accessing paid features they previously had no path to" },
    ],
    body: [],
    problem:
      "ET Prime subscribers were paying for premium access but under-utilizing key features within the app. Low discoverability created a value perception gap, users couldn't fully experience what they had already paid for, impacting engagement and long-term retention.",
    challenge: [
      "Simplify onboarding while clearly communicating premium value, improving time-to-value without increasing drop-offs.",
      "Surface premium features contextually within a cluttered interface, enhancing visibility without disrupting core reading behaviour.",
      "Enable meaningful personalisation using existing user signals, improving relevance without adding cognitive or UI overhead.",
      "Align feature discovery with user intent, embedding premium exploration into natural consumption journeys rather than forcing promotion.",
    ],
    impact: [
      "+28% increase in Prime user renewals post-launch, exceeding projections by 8%.",
      "New subscription rate increased, stronger value perception at onboarding reduced the gap between what users paid for and what they understood they were getting.",
      "Premium feature engagement increased after contextual surfacing, validating that discoverability, not product quality, was the retention gap.",
    ],
    href: "https://www.figma.com/proto/aTR4rObDbhSFkR7KoDOiOS/Portfolio-Website?node-id=62-83&t=EcDlaxQr0arGC1bo-1&scaling=scale-down-width&content-scaling=fixed&page-id=1%3A3&starting-point-node-id=62%3A83",
  },
  {
    format: "mini",
    slug: "cleartrip-payments",
    title: "Reducing drop-offs at Payment Funnel",
    tagline:
      "~1,600 users were dropping off at trip summary despite a 3-step checkout. Opaque pricing and unclear coupon confirmation were killing intent at the highest-stakes moment in the funnel.",
    role: "Product designer",
    year: "2024",
    coverImage: "/images/checkout-cover.jpg",
    coverAlt: "Cleartrip payments page revamp",
    tags: ["Mobile", "PWA", "Experience Revamp"],
    summary:
      "~1,600 users were abandoning at trip summary, the highest-intent point in Cleartrip's checkout. The issue wasn't flow length; it was pricing opacity and missing coupon confirmation at the moment users needed certainty most.",
    highlights: [
      { label: "Drop-offs", value: "~1,600 users/period abandoning at trip summary, the highest-intent point in the funnel; pricing opacity and opaque coupon confirmation identified as primary drivers" },
      { label: "Trust signals", value: "Redesigned price breakdown and coupon confirmation to surface exact savings at the moment of hesitation, eliminating the last question before payment" },
      { label: "Conversion", value: "Checkout completion rate increased post-launch; reduced last-mile drop-offs contributed to higher transaction volume for Cleartrip" },
    ],
    body: [],
    problem:
      "Despite a simple 3-step flow (Review → Add Traveller → Pay), ~1,600 users were abandoning at trip summary, the highest-intent point in Cleartrip's checkout. Limited visibility of price breakdowns and unclear coupon confirmation reduced trust and weakened purchase motivation at the final step.",
    challenge: [
      "Improve pricing transparency without adding friction or visual clutter.",
      "Reinforce cost clarity and coupon confirmation to reduce last-mile hesitation.",
      "Reduce drop-offs while maintaining a fast checkout experience at peak user intent.",
      "Increase completion rates without increasing cognitive load in a high-stakes flow.",
    ],
    impact: [
      "Reduced payment-stage drop-offs; ~1,600-user abandonment cohort was the targeted baseline.",
      "Clearer pricing and coupon confirmation eliminated the primary trust gap at checkout.",
      "Checkout completion rate increased post-launch, contributing to higher transaction conversion.",
    ],
    href: "https://www.figma.com/proto/AaHU2t1WEMeJGvbdhi2kk7/Payments-page-Revamp?node-id=1826-1845&t=BU9KR1vWg6DsIfmq-1&scaling=scale-down-width&content-scaling=fixed&page-id=1517%3A56651&starting-point-node-id=1826%3A1845",
  },
  {
    format: "mini",
    slug: "release-craft",
    title: "Release craft the whole team could see",
    tagline:
      "Release QA lived in a doc nobody opened. I built a visual and interaction check kit that shipped alongside the design system, so designers and engineers shared the same pass/fail criteria before anything merged.",
    role: "Design lead",
    year: "2022",
    coverImage: "/images/placeholder-cover.svg",
    coverAlt: "Design QA workflow",
    tags: ["Process", "Quality"],
    summary:
      "Visual and interaction regressions were caught late, or not at all, because QA criteria lived outside the build process. I codified a check kit that sat beside the design system repo so criteria, versions, and owners stayed aligned.",
    highlights: [
      {
        label: "Regressions",
        value: "Token-heavy and motion component regressions shifted from post-ship to pre-merge, design QA became part of the build gate, not a retrospective",
      },
      {
        label: "Ownership",
        value: "Three-track structure (designer / engineer / QA) gave each role a defined lane; handoff ambiguity eliminated by versioned criteria that moved with the system",
      },
    ],
    body: [
      "Without a shared QA standard, design regressions surfaced in staging or post-ship, after the design team had already moved on. Token changes broke spacing at scale. Motion components drifted between design and implementation without anyone owning the delta. The problem wasn't process debt; it was that the criteria existed only in someone's head.",
      "I built a check kit versioned alongside the design system repo. Checks were categorised by ownership track: designers caught visual drift before handoff; engineers automated parameter-level checks; QA validated interaction fidelity at depth. All three tracks referenced the same document, tied to the same system version.",
      "The check kit turned QA from a memory game into a protocol. Regressions on token-heavy components dropped because the criteria were visible before merge, not discovered after. Ownership became structural, not whoever happened to be thorough that week.",
      "The portable lesson: QA criteria that live outside the build process are suggestions, not standards. Tie criteria to the artifact they govern and they travel with the work.",
    ],
  },
];

export function getExtendedProjects(): ExtendedProject[] {
  return projects.filter((p): p is ExtendedProject => p.format === "extended");
}

export function getMiniProjects(): MiniProject[] {
  return projects.filter((p): p is MiniProject => p.format === "mini");
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getExtendedBySlug(slug: string): ExtendedProject | undefined {
  const p = getProjectBySlug(slug);
  return p?.format === "extended" ? p : undefined;
}
