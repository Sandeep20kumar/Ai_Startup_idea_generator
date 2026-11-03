/**
 * startup-generator.ts
 * ---------------------------------------------------------------------------
 * "AI-like" structured generation engine.
 *
 * There is NO external API call here. The engine combines the user's inputs
 * with curated domain knowledge to produce a realistic, complete startup plan.
 *
 * To plug in a real LLM later, keep the `StartupPlan` shape and simply replace
 * `generateStartupPlan()` with an async server function that returns the same
 * object — every UI component reads from this type only.
 */

export const DOMAINS = [
  "Artificial Intelligence",
  "Healthcare",
  "Education",
  "Agriculture",
  "Finance",
  "Cyber Security",
  "Cloud Computing",
  "IoT",
  "E-commerce",
  "Travel",
  "Real Estate",
  "Food",
  "Fashion",
  "Other",
] as const;

export const AUDIENCES = [
  "Students",
  "Professionals",
  "Businesses",
  "Hospitals",
  "Farmers",
  "Teachers",
  "Children",
  "Everyone",
] as const;

export const BUDGETS = [
  "Low (< ₹50,000)",
  "Medium (₹50,000–₹5 Lakhs)",
  "High (> ₹5 Lakhs)",
] as const;

export const GOALS = [
  "Solve a Problem",
  "Improve Productivity",
  "Reduce Cost",
  "Automation",
  "Social Impact",
  "Innovation",
] as const;

export const TECHNOLOGIES = [
  "AI",
  "Machine Learning",
  "Blockchain",
  "Cloud",
  "IoT",
  "AR/VR",
  "Mobile App",
  "Web Application",
] as const;

export const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "Germany",
  "Canada",
  "Australia",
  "Singapore",
  "United Arab Emirates",
  "Japan",
  "Brazil",
  "South Africa",
  "Global",
] as const;

export type Domain = (typeof DOMAINS)[number];
export type Audience = (typeof AUDIENCES)[number];
export type Budget = (typeof BUDGETS)[number];
export type Goal = (typeof GOALS)[number];
export type Technology = (typeof TECHNOLOGIES)[number];

export interface StartupInput {
  domain: Domain;
  audience: Audience;
  budget: Budget;
  country: string;
  goal: Goal;
  technology: Technology;
}

export interface Competitor {
  name: string;
  strength: string;
  weakness: string;
}

export interface RiskItem {
  risk: string;
  mitigation: string;
}

export interface RoadmapItem {
  month: string;
  focus: string;
  deliverables: string[];
}

export interface BudgetLine {
  label: string;
  amount: string;
  share: number; // percentage of total
}

export interface TeamMember {
  role: string;
  responsibility: string;
}

export interface StartupPlan {
  id: string;
  createdAt: string;
  input: StartupInput;
  name: string;
  tagline: string;
  idea: string;
  problem: string;
  solution: string;
  targetCustomers: string[];
  businessModel: string[];
  revenueSources: string[];
  technologies: {
    languages: string[];
    frameworks: string[];
    database: string[];
    cloud: string[];
    aiFrameworks: string[];
    deployment: string[];
  };
  competitors: Competitor[];
  swot: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  marketing: { channel: string; plan: string }[];
  team: TeamMember[];
  budget: { total: string; lines: BudgetLine[] };
  roadmap: RoadmapItem[];
  risks: RiskItem[];
  futureScope: string[];
  investorPitch: string;
  metrics: { label: string; value: string; hint: string }[];
}

/* -------------------------------------------------------------------------- */
/* Domain knowledge base                                                       */
/* -------------------------------------------------------------------------- */

interface DomainKnowledge {
  keyword: string;
  problem: string;
  solution: string;
  competitors: Competitor[];
  marketNote: string;
  futureScope: string[];
}

const DOMAIN_DATA: Record<string, DomainKnowledge> = {
  "Artificial Intelligence": {
    keyword: "Intelligence",
    problem:
      "Teams drown in unstructured data and repetitive decisions, yet building reliable AI workflows still requires scarce, expensive specialists.",
    solution:
      "A no-code AI workflow studio where users describe an outcome in plain language and the platform assembles, evaluates and deploys the right chain of models with guardrails and audit trails.",
    competitors: [
      { name: "OpenAI Platform", strength: "Best-in-class frontier models and ecosystem", weakness: "Generic tooling; little vertical workflow depth" },
      { name: "Hugging Face", strength: "Huge open model hub and community", weakness: "Steep learning curve for non-engineers" },
      { name: "Scale AI", strength: "Enterprise data pipelines and labelling", weakness: "Expensive and enterprise-only motion" },
      { name: "Dataiku", strength: "Mature end-to-end analytics suite", weakness: "Heavy setup, legacy UX" },
      { name: "Zapier AI", strength: "Massive integration catalogue", weakness: "Shallow model control and evaluation" },
    ],
    marketNote: "the applied-AI tooling market",
    futureScope: [
      "Launch a vertical model marketplace with revenue share for creators",
      "Ship on-premise / private-cloud deployments for regulated industries",
      "Add autonomous multi-agent orchestration with human approval gates",
    ],
  },
  Healthcare: {
    keyword: "Care",
    problem:
      "Patients wait days for basic guidance while clinicians lose up to 40% of their time to documentation and fragmented records.",
    solution:
      "An AI clinical companion that triages symptoms, drafts structured notes from consultations and syncs a longitudinal patient timeline back into hospital systems.",
    competitors: [
      { name: "Practo", strength: "Strong consumer brand and doctor network", weakness: "Limited clinical AI depth" },
      { name: "Teladoc", strength: "Global telehealth scale", weakness: "High cost, slow product cycles" },
      { name: "Nuance DAX", strength: "Accurate ambient clinical documentation", weakness: "Enterprise-only pricing" },
      { name: "Ada Health", strength: "Well-validated symptom checker", weakness: "Weak provider-side workflow" },
      { name: "Local hospital portals", strength: "Existing patient trust", weakness: "Dated UX and no interoperability" },
    ],
    marketNote: "digital health services",
    futureScope: [
      "Expand into chronic-care remote monitoring with wearable integrations",
      "Obtain clinical certifications to sell directly to hospital networks",
      "Offer anonymised research datasets to pharma partners",
    ],
  },
  Education: {
    keyword: "Learn",
    problem:
      "One-size-fits-all courses ignore each learner's pace, so completion rates stay below 15% and teachers get no usable signal on who is struggling.",
    solution:
      "An adaptive learning engine that generates personalised study paths, practice sets and instant explanations, plus a teacher dashboard highlighting at-risk learners weekly.",
    competitors: [
      { name: "Khan Academy", strength: "Free, trusted content library", weakness: "Limited personalisation and local curricula" },
      { name: "Byju's", strength: "Huge distribution and brand recall", weakness: "Costly sales-heavy model, low engagement" },
      { name: "Coursera", strength: "University partnerships and credentials", weakness: "Not suited to school-level learners" },
      { name: "Duolingo", strength: "Best-in-class gamification", weakness: "Single subject focus" },
      { name: "Google Classroom", strength: "Free and widely deployed", weakness: "Administration tool, not a learning engine" },
    ],
    marketNote: "the global edtech market",
    futureScope: [
      "White-label the engine for schools, coaching centres and universities",
      "Add certification pathways with employer hiring partners",
      "Launch regional language support to reach tier-2 and tier-3 cities",
    ],
  },
  Agriculture: {
    keyword: "Agri",
    problem:
      "Smallholder farmers make irrigation, input and selling decisions on guesswork, losing 20–30% of potential yield and margin every season.",
    solution:
      "A crop intelligence platform combining satellite imagery, low-cost soil sensors and local price feeds to send actionable, vernacular advisories over the channels farmers already use.",
    competitors: [
      { name: "DeHaat", strength: "Full-stack input-to-market network", weakness: "Capital-intensive operations" },
      { name: "Ninjacart", strength: "Efficient supply-chain logistics", weakness: "Little on-farm advisory" },
      { name: "CropIn", strength: "Enterprise agri-data platform", weakness: "Sells to agribusiness, not farmers" },
      { name: "Government advisory apps", strength: "Free and official", weakness: "Generic, poor UX, low adoption" },
      { name: "Local input dealers", strength: "Trusted relationships", weakness: "Biased advice tied to product sales" },
    ],
    marketNote: "agri-tech advisory",
    futureScope: [
      "Bundle embedded crop insurance and input financing",
      "Expand to livestock and post-harvest storage intelligence",
      "License anonymised yield forecasts to commodity buyers",
    ],
  },
  Finance: {
    keyword: "Fin",
    problem:
      "People and small businesses hold data across a dozen accounts but get no coherent picture of cash flow, risk or the next best financial action.",
    solution:
      "An AI financial co-pilot that unifies accounts, forecasts cash runway, flags anomalies and recommends concrete moves with clear reasoning and compliance guardrails.",
    competitors: [
      { name: "Zerodha / brokers", strength: "Low-cost execution and trust", weakness: "No planning intelligence" },
      { name: "Intuit Mint-style apps", strength: "Clean budgeting UX", weakness: "Backward-looking, no advisory" },
      { name: "Razorpay Capital", strength: "Embedded SMB lending", weakness: "Narrow to payments customers" },
      { name: "Traditional advisors", strength: "Personal trust", weakness: "Expensive, not scalable" },
      { name: "Bank apps", strength: "Direct account access", weakness: "Siloed and poor experience" },
    ],
    marketNote: "fintech and embedded finance",
    futureScope: [
      "Add embedded lending and insurance distribution",
      "Launch a business tier with automated tax and compliance filing",
      "Offer an API so banks can white-label the advisory engine",
    ],
  },
  "Cyber Security": {
    keyword: "Secure",
    problem:
      "Small and mid-sized organisations face enterprise-grade attacks with no security team, and existing tools produce noise instead of decisions.",
    solution:
      "An autonomous security analyst that continuously maps the attack surface, prioritises the handful of exploitable issues and ships one-click, reversible fixes.",
    competitors: [
      { name: "CrowdStrike", strength: "Best-in-class endpoint detection", weakness: "Priced and staffed for enterprises" },
      { name: "Wiz", strength: "Excellent cloud posture visibility", weakness: "Cloud-only, high ticket size" },
      { name: "Qualys", strength: "Deep vulnerability database", weakness: "Overwhelming, legacy interface" },
      { name: "Managed SOC vendors", strength: "Human expertise", weakness: "Slow, expensive retainers" },
      { name: "Open-source scanners", strength: "Free", weakness: "No prioritisation or remediation" },
    ],
    marketNote: "the SMB security market",
    futureScope: [
      "Add compliance automation for SOC 2, ISO 27001 and DPDP",
      "Offer cyber-insurance partnerships priced on live posture scores",
      "Expand into supply-chain and third-party vendor risk",
    ],
  },
  "Cloud Computing": {
    keyword: "Cloud",
    problem:
      "Cloud bills grow 30% a year while engineering teams lack the time and visibility to tie spend back to features, customers or teams.",
    solution:
      "A cloud efficiency platform that maps every rupee of spend to a workload owner, simulates architecture changes and auto-applies safe savings policies.",
    competitors: [
      { name: "AWS Cost Explorer", strength: "Native and free", weakness: "Single cloud, no action layer" },
      { name: "CloudHealth", strength: "Mature multi-cloud reporting", weakness: "Enterprise pricing and setup" },
      { name: "Vantage", strength: "Great developer experience", weakness: "Mostly visibility, limited automation" },
      { name: "Kubecost", strength: "Strong Kubernetes granularity", weakness: "Narrow scope" },
      { name: "Consulting partners", strength: "Custom expertise", weakness: "One-off, not continuous" },
    ],
    marketNote: "cloud FinOps",
    futureScope: [
      "Add carbon-footprint reporting alongside cost",
      "Introduce autonomous rightsizing with rollback guarantees",
      "Expand into multi-cloud migration planning",
    ],
  },
  IoT: {
    keyword: "Sense",
    problem:
      "Connected devices generate torrents of telemetry, but failures are still discovered after downtime because data never becomes an operational decision.",
    solution:
      "An edge-to-cloud IoT intelligence layer that detects anomalies on-device, predicts failures days ahead and dispatches maintenance work orders automatically.",
    competitors: [
      { name: "AWS IoT Core", strength: "Scalable managed infrastructure", weakness: "Infrastructure, not outcomes" },
      { name: "Samsara", strength: "Strong fleet hardware plus software", weakness: "Hardware lock-in, high cost" },
      { name: "PTC ThingWorx", strength: "Industrial pedigree", weakness: "Complex, long deployments" },
      { name: "Siemens MindSphere", strength: "Deep OT integrations", weakness: "Rigid and expensive" },
      { name: "In-house dashboards", strength: "Tailored", weakness: "Fragile and unmaintained" },
    ],
    marketNote: "industrial IoT",
    futureScope: [
      "Offer a hardware reference kit for faster pilots",
      "Add digital-twin simulation for capacity planning",
      "Expand from factories into energy and smart buildings",
    ],
  },
  "E-commerce": {
    keyword: "Commerce",
    problem:
      "Independent sellers compete against marketplaces with better merchandising, yet lack the data science to personalise storefronts or forecast inventory.",
    solution:
      "A commerce intelligence layer that personalises every storefront visit, predicts demand per SKU and automates retention campaigns across WhatsApp and email.",
    competitors: [
      { name: "Shopify", strength: "Dominant store platform and app ecosystem", weakness: "Generic personalisation out of the box" },
      { name: "Amazon", strength: "Traffic and logistics", weakness: "Brands lose customer relationship" },
      { name: "Klaviyo", strength: "Powerful retention marketing", weakness: "Email-first, weak on-site personalisation" },
      { name: "Wix / WooCommerce", strength: "Cheap and flexible", weakness: "Fragmented plugin quality" },
      { name: "Agencies", strength: "Human creative", weakness: "Expensive and not real-time" },
    ],
    marketNote: "the D2C commerce stack",
    futureScope: [
      "Add embedded working-capital financing on predicted revenue",
      "Launch a creative studio generating product imagery and copy",
      "Expand into cross-border selling and compliance",
    ],
  },
  Travel: {
    keyword: "Voyage",
    problem:
      "Trip planning still means twenty tabs and generic listicles; travellers rarely get an itinerary matched to their budget, pace and interests.",
    solution:
      "An AI travel planner that builds day-by-day itineraries from real availability and pricing, then rebooks automatically when weather or delays disrupt the plan.",
    competitors: [
      { name: "MakeMyTrip", strength: "Inventory and brand", weakness: "Transactional, not personalised" },
      { name: "Booking.com", strength: "Global supply", weakness: "Search-first, no planning intelligence" },
      { name: "TripAdvisor", strength: "Review depth", weakness: "Cluttered, ad-driven" },
      { name: "Airbnb Experiences", strength: "Unique local supply", weakness: "Narrow category" },
      { name: "Travel agents", strength: "Personal service", weakness: "Slow and costly" },
    ],
    marketNote: "online travel",
    futureScope: [
      "Add a B2B API for airlines and hotel chains",
      "Introduce group and corporate trip coordination",
      "Layer in loyalty-point optimisation across programmes",
    ],
  },
  "Real Estate": {
    keyword: "Estate",
    problem:
      "Buyers and renters compare properties on stale listings with no reliable view of fair price, commute reality or long-term neighbourhood trends.",
    solution:
      "A property intelligence platform that scores every listing on fair value, liveability and resale outlook, with verified media and instant document checks.",
    competitors: [
      { name: "Zillow", strength: "Rich valuation data", weakness: "Limited outside the US" },
      { name: "99acres / Magicbricks", strength: "Listing volume", weakness: "Stale and duplicate listings" },
      { name: "NoBroker", strength: "Brokerage-free model", weakness: "Thin analytics" },
      { name: "Local brokers", strength: "Ground truth", weakness: "Opaque incentives" },
      { name: "Builder portals", strength: "First-party inventory", weakness: "Single-supplier bias" },
    ],
    marketNote: "proptech",
    futureScope: [
      "Add fractional investment products for retail investors",
      "Offer AI-assisted legal and title verification",
      "Expand into rental management and tenant services",
    ],
  },
  Food: {
    keyword: "Plate",
    problem:
      "Cloud kitchens and cafés run on intuition: menus, portions and procurement are unoptimised, so 8–12% of food and margin is wasted daily.",
    solution:
      "A kitchen intelligence platform that forecasts demand per dish, auto-generates procurement lists and re-prices menus dynamically to cut waste.",
    competitors: [
      { name: "Swiggy / Zomato", strength: "Demand aggregation", weakness: "High commissions, no ops tooling" },
      { name: "Petpooja", strength: "Widely adopted POS", weakness: "Reporting only, no prediction" },
      { name: "Toast", strength: "Strong US restaurant suite", weakness: "Limited international presence" },
      { name: "Rebel Foods", strength: "Operating excellence at scale", weakness: "Own brands, not a platform" },
      { name: "Spreadsheets", strength: "Free and familiar", weakness: "Manual and error-prone" },
    ],
    marketNote: "restaurant technology",
    futureScope: [
      "Add group purchasing to unlock supplier discounts",
      "Launch nutrition and sustainability scoring for menus",
      "Expand into franchise-wide multi-outlet benchmarking",
    ],
  },
  Fashion: {
    keyword: "Style",
    problem:
      "Fashion brands over-produce and still miss trends, while shoppers return a third of what they buy because fit and styling are guesswork.",
    solution:
      "A style intelligence platform pairing trend forecasting for brands with AI fit and outfit recommendations for shoppers, cutting returns and dead stock.",
    competitors: [
      { name: "Myntra", strength: "Catalogue scale and logistics", weakness: "Generic recommendations" },
      { name: "Stitch Fix", strength: "Human-plus-AI styling", weakness: "Costly operations, slow growth" },
      { name: "Zara", strength: "Fast supply chain", weakness: "Vertically closed, not a platform" },
      { name: "Shein", strength: "Trend velocity and price", weakness: "Sustainability and quality concerns" },
      { name: "Instagram shopping", strength: "Discovery and creators", weakness: "No fit or inventory intelligence" },
    ],
    marketNote: "fashion technology",
    futureScope: [
      "Add AR virtual try-on across the catalogue",
      "Offer resale and circular-fashion infrastructure",
      "License trend forecasts to manufacturers",
    ],
  },
  Other: {
    keyword: "Venture",
    problem:
      "The target users repeat manual, low-leverage work every day because existing tools were designed for a different era and a different scale.",
    solution:
      "A focused platform that automates the highest-friction workflow end to end, with measurable time and cost savings visible from week one.",
    competitors: [
      { name: "Incumbent suite vendor", strength: "Established relationships", weakness: "Slow innovation cycle" },
      { name: "Regional challenger", strength: "Local pricing advantage", weakness: "Limited product depth" },
      { name: "Horizontal no-code tools", strength: "Flexible", weakness: "Requires DIY assembly" },
      { name: "Manual / spreadsheet process", strength: "Zero cost", weakness: "Error-prone and unscalable" },
      { name: "Consultancies", strength: "Custom fit", weakness: "Expensive, non-recurring" },
    ],
    marketNote: "this category",
    futureScope: [
      "Expand from a single workflow into a full operating suite",
      "Open a partner and integration marketplace",
      "Enter adjacent geographies with a localised offering",
    ],
  },
};

const AUDIENCE_DATA: Record<string, { customers: string[]; channel: string; model: string }> = {
  Students: {
    customers: ["College and school students", "Exam aspirants", "Parents funding learning", "Campus clubs and societies"],
    channel: "College Outreach",
    model: "B2C",
  },
  Professionals: {
    customers: ["Early-career knowledge workers", "Team leads and managers", "Freelancers and consultants", "Employers buying seats"],
    channel: "SEO",
    model: "Freemium",
  },
  Businesses: {
    customers: ["Small and mid-sized businesses", "Operations and finance heads", "Startup founders", "Enterprise pilot teams"],
    channel: "Google Ads",
    model: "B2B",
  },
  Hospitals: {
    customers: ["Multi-speciality hospitals", "Clinic chains", "Diagnostic labs", "Independent practitioners"],
    channel: "Email Campaign",
    model: "B2B",
  },
  Farmers: {
    customers: ["Smallholder farmers", "Farmer producer organisations", "Agri input retailers", "Cooperative societies"],
    channel: "Influencer Marketing",
    model: "Marketplace",
  },
  Teachers: {
    customers: ["School teachers", "Private tutors", "Coaching institutes", "School administrators"],
    channel: "College Outreach",
    model: "SaaS",
  },
  Children: {
    customers: ["Children aged 6–14", "Parents", "Primary schools", "After-school programmes"],
    channel: "Social Media",
    model: "Subscription",
  },
  Everyone: {
    customers: ["Mainstream consumers", "Power users and enthusiasts", "Small teams", "Partner platforms"],
    channel: "Social Media",
    model: "Freemium",
  },
};

const TECH_STACKS: Record<string, Partial<StartupPlan["technologies"]>> = {
  AI: { languages: ["Python", "TypeScript"], aiFrameworks: ["OpenAI API", "LangChain", "Hugging Face Transformers"] },
  "Machine Learning": { languages: ["Python", "SQL"], aiFrameworks: ["PyTorch", "scikit-learn", "MLflow"] },
  Blockchain: { languages: ["Solidity", "TypeScript"], frameworks: ["Hardhat", "Ethers.js", "React"] },
  Cloud: { languages: ["Go", "TypeScript"], frameworks: ["Terraform", "Kubernetes", "React"] },
  IoT: { languages: ["C++", "Python", "TypeScript"], frameworks: ["MQTT", "Node-RED", "React"] },
  "AR/VR": { languages: ["C#", "TypeScript"], frameworks: ["Unity", "WebXR", "Three.js"] },
  "Mobile App": { languages: ["TypeScript", "Kotlin", "Swift"], frameworks: ["React Native", "Expo"] },
  "Web Application": { languages: ["TypeScript", "Python"], frameworks: ["React", "Tailwind CSS", "FastAPI"] },
};

const GOAL_ANGLE: Record<string, string> = {
  "Solve a Problem": "removing a painful, daily blocker for its users",
  "Improve Productivity": "giving each user back several hours every week",
  "Reduce Cost": "cutting recurring operating costs by a measurable margin",
  Automation: "automating a workflow that is still done by hand today",
  "Social Impact": "widening access for people currently underserved",
  Innovation: "creating a capability that simply did not exist before",
};

const BUDGET_PROFILE: Record<
  string,
  { total: string; lines: BudgetLine[]; teamSize: number; note: string }
> = {
  "Low (< ₹50,000)": {
    total: "₹50,000",
    lines: [
      { label: "Development Cost", amount: "₹22,000", share: 44 },
      { label: "Marketing Cost", amount: "₹12,000", share: 24 },
      { label: "Infrastructure Cost", amount: "₹8,000", share: 16 },
      { label: "Operations Cost", amount: "₹8,000", share: 16 },
    ],
    teamSize: 3,
    note: "a lean founder-built MVP using free tiers and open-source",
  },
  "Medium (₹50,000–₹5 Lakhs)": {
    total: "₹4,50,000",
    lines: [
      { label: "Development Cost", amount: "₹2,00,000", share: 45 },
      { label: "Marketing Cost", amount: "₹1,10,000", share: 24 },
      { label: "Infrastructure Cost", amount: "₹70,000", share: 16 },
      { label: "Operations Cost", amount: "₹70,000", share: 15 },
    ],
    teamSize: 5,
    note: "a small full-time core team shipping a production launch",
  },
  "High (> ₹5 Lakhs)": {
    total: "₹18,00,000",
    lines: [
      { label: "Development Cost", amount: "₹8,00,000", share: 45 },
      { label: "Marketing Cost", amount: "₹4,50,000", share: 25 },
      { label: "Infrastructure Cost", amount: "₹2,70,000", share: 15 },
      { label: "Operations Cost", amount: "₹2,80,000", share: 15 },
    ],
    teamSize: 6,
    note: "a funded team with paid acquisition and enterprise-grade infrastructure",
  },
};

const NAME_PREFIXES = ["Nova", "Zen", "Lumo", "Vera", "Orbit", "Kite", "Aura", "Helix", "Quanta", "Pulse", "Terra", "Echo"];
const NAME_SUFFIXES = ["ly", "ify", "wise", "grid", "labs", "flow", "mind", "works", "sphere", "core"];
const TAGLINE_SHAPES = [
  (d: string) => `${d}, on autopilot.`,
  (d: string) => `The intelligence layer for ${d.toLowerCase()}.`,
  (d: string) => `Decisions, not dashboards, for ${d.toLowerCase()}.`,
  (d: string) => `Turn ${d.toLowerCase()} data into daily wins.`,
  (d: string) => `Smarter ${d.toLowerCase()}, from day one.`,
];

/* -------------------------------------------------------------------------- */
/* Small deterministic-random helper (seeded so reports feel intentional)      */
/* -------------------------------------------------------------------------- */

function makeRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hashString(value: string) {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function pick<T>(rand: () => number, list: readonly T[]): T {
  return list[Math.floor(rand() * list.length)]!;
}

/* -------------------------------------------------------------------------- */
/* Main generator                                                              */
/* -------------------------------------------------------------------------- */

export function generateStartupPlan(input: StartupInput, variation = 0): StartupPlan {
  const knowledge = DOMAIN_DATA[input.domain] ?? DOMAIN_DATA["Other"]!;
  const audience = AUDIENCE_DATA[input.audience] ?? AUDIENCE_DATA["Everyone"]!;
  const budget = BUDGET_PROFILE[input.budget] ?? BUDGET_PROFILE["Medium (₹50,000–₹5 Lakhs)"]!;
  const stack = TECH_STACKS[input.technology] ?? TECH_STACKS["Web Application"]!;

  const seed = hashString(Object.values(input).join("|")) + variation * 7919;
  const rand = makeRandom(seed);

  const name = `${pick(rand, NAME_PREFIXES)}${knowledge.keyword}${rand() > 0.55 ? pick(rand, NAME_SUFFIXES) : ""}`;
  const tagline = pick(rand, TAGLINE_SHAPES)(input.domain);
  const angle = GOAL_ANGLE[input.goal] ?? "creating clear, measurable value";

  const idea = `${name} is a ${input.technology}-first platform for ${input.audience.toLowerCase()} in the ${input.domain} space, built for ${input.country}. It focuses on ${angle}. Users connect their existing data sources in minutes, and the system continuously turns that raw activity into ranked, explainable recommendations — with every suggestion tied to a measurable outcome such as hours saved, cost avoided or revenue unlocked. The first release is intentionally narrow: one workflow, done exceptionally well, delivered as ${budget.note}.`;

  const businessModel = Array.from(
    new Set([
      audience.model,
      input.audience === "Businesses" || input.audience === "Hospitals" ? "SaaS" : "Subscription",
      input.budget === "Low (< ₹50,000)" ? "Freemium" : "SaaS",
      rand() > 0.6 ? "Marketplace" : "Advertising",
    ]),
  );

  const revenueSources = [
    "Subscriptions — monthly and annual plans per user or per workspace",
    "Premium Plans — advanced analytics, higher limits and priority support",
    "API Services — usage-based access for partners and integrators",
    "Commission — a small fee on transactions facilitated by the platform",
    "Licensing — white-label deployments for large institutions",
    "Consulting — paid onboarding, migration and success packages",
    "Advertisements — sponsored, clearly-labelled partner placements on the free tier",
  ];

  const technologies: StartupPlan["technologies"] = {
    languages: stack.languages ?? ["TypeScript", "Python"],
    frameworks: stack.frameworks ?? ["React", "Tailwind CSS", "Node.js"],
    database: ["PostgreSQL", "Redis (cache)", rand() > 0.5 ? "pgvector" : "MongoDB"],
    cloud: [pick(rand, ["AWS", "Google Cloud", "Azure"]), "Cloudflare (CDN & edge)"],
    aiFrameworks: stack.aiFrameworks ?? ["OpenAI API", "LangChain", "scikit-learn"],
    deployment: ["Docker", "GitHub Actions CI/CD", "Vercel / Kubernetes", "Grafana + Sentry monitoring"],
  };

  const swot = {
    strengths: [
      `Sharp focus on ${input.audience.toLowerCase()} instead of a generic audience`,
      `${input.technology} at the core, not bolted on afterwards`,
      "Fast time-to-value: measurable results within the first week",
      `Cost structure suited to ${input.country} pricing expectations`,
    ],
    weaknesses: [
      "No brand recognition or distribution at launch",
      "Depends on customer data quality and integration access",
      `Small team (${budget.teamSize} people) limits parallel bets`,
      "Unit economics unproven until the first 100 paying users",
    ],
    opportunities: [
      `Steady double-digit growth in ${knowledge.marketNote}`,
      "Incumbents are slow to ship modern AI experiences",
      "Partnership and reseller channels are wide open",
      `Underserved demand outside metro markets in ${input.country}`,
    ],
    threats: [
      "A well-funded incumbent shipping a similar feature",
      "Rapid model/API price and capability shifts",
      "Regulatory and data-privacy changes in the sector",
      "Customer churn if the value is not visible monthly",
    ],
  };

  const marketing = [
    { channel: "Social Media", plan: `Build in public on LinkedIn, X and Instagram with weekly ${input.domain} teardowns and product demos.` },
    { channel: "SEO", plan: `Publish comparison and how-to content targeting "${input.domain.toLowerCase()} for ${input.audience.toLowerCase()}" long-tail keywords.` },
    { channel: "Google Ads", plan: "Run tightly-scoped intent campaigns on high-commercial keywords with a ₹500/day starting cap." },
    { channel: "Influencer Marketing", plan: `Partner with 10 micro-creators trusted by ${input.audience.toLowerCase()} for authentic walkthroughs.` },
    { channel: "Email Campaign", plan: "Nurture free signups with a 5-part onboarding sequence tied to activation milestones." },
    { channel: "College Outreach", plan: "Run campus workshops and a student ambassador programme for zero-cost distribution." },
  ];
  // Put the channel best matched to the audience first.
  marketing.sort((a, b) => (a.channel === audience.channel ? -1 : b.channel === audience.channel ? 1 : 0));

  const team: TeamMember[] = [
    { role: "Founder / CEO", responsibility: "Vision, fundraising, first 50 customer conversations" },
    { role: "Frontend Developer", responsibility: "React + Tailwind product UI, dashboards and responsiveness" },
    { role: "Backend Developer", responsibility: "APIs, data pipelines, integrations and security" },
    { role: "AI Engineer", responsibility: "Models, evaluation harness, prompt/feature engineering" },
    { role: "UI/UX Designer", responsibility: "Design system, user research and onboarding flows" },
    { role: "Marketing Manager", responsibility: "Content, campaigns, community and partnerships" },
  ].slice(0, Math.max(4, budget.teamSize));

  const roadmap: RoadmapItem[] = [
    { month: "Month 1", focus: "Research & Validation", deliverables: ["30 user interviews", "Competitive teardown", "Clickable prototype"] },
    { month: "Month 2", focus: "MVP Build", deliverables: ["Core workflow shipped", "Auth + billing scaffolding", "Private alpha with 10 users"] },
    { month: "Month 3", focus: "AI Layer", deliverables: [`${input.technology} engine v1`, "Evaluation and guardrails", "Accuracy benchmark published"] },
    { month: "Month 4", focus: "Public Beta", deliverables: ["Onboarding + self-serve signup", "First 100 active users", "Pricing experiments"] },
    { month: "Month 5", focus: "Monetisation", deliverables: ["Paid tiers live", "First 20 paying customers", "Support and SLA process"] },
    { month: "Month 6", focus: "Scale & Fundraise", deliverables: ["Partner integrations", "Investor data room", "Seed round conversations"] },
  ];

  const risks: RiskItem[] = [
    { risk: "Low adoption — users try once and never return", mitigation: "Instrument activation, run weekly cohort reviews and fix the biggest drop-off each sprint." },
    { risk: "AI output quality is inconsistent", mitigation: "Ship an evaluation suite, human-in-the-loop review and confidence scores on every recommendation." },
    { risk: "A larger competitor copies the feature", mitigation: "Compound defensibility through proprietary data, integrations and community." },
    { risk: "Data privacy or regulatory breach", mitigation: "Encrypt at rest and in transit, minimise PII, run quarterly audits and publish a clear policy." },
    { risk: "Cash runway shortfall", mitigation: `Keep burn inside ${budget.total} for 6 months, prioritise revenue-generating work and keep a 3-month buffer.` },
  ];

  const investorPitch = `${name} — ${tagline} ${input.audience} in ${input.country} lose time and money every single day because ${knowledge.problem.toLowerCase()} We solve it with ${knowledge.solution.charAt(0).toLowerCase() + knowledge.solution.slice(1)} We are targeting ${knowledge.marketNote}, monetising through ${businessModel.slice(0, 2).join(" and ")} plans, and our 6-month plan takes us from MVP to the first paying cohort on a ${budget.total} budget. We're raising to accelerate distribution — join us in ${angle}.`;

  return {
    id: `${Date.now().toString(36)}-${Math.floor(rand() * 1e6).toString(36)}`,
    createdAt: new Date().toISOString(),
    input,
    name,
    tagline,
    idea,
    problem: knowledge.problem,
    solution: knowledge.solution,
    targetCustomers: audience.customers,
    businessModel,
    revenueSources,
    technologies,
    competitors: knowledge.competitors,
    swot,
    marketing,
    team,
    budget: { total: budget.total, lines: budget.lines },
    roadmap,
    risks,
    futureScope: [
      ...knowledge.futureScope,
      `Expand beyond ${input.country} into two adjacent markets in year two`,
    ],
    investorPitch,
    metrics: [
      { label: "Market Fit Score", value: `${72 + Math.floor(rand() * 22)}/100`, hint: "Input alignment vs. market signals" },
      { label: "Time to MVP", value: `${8 + Math.floor(rand() * 8)} weeks`, hint: "With the estimated team" },
      { label: "Break-even", value: `Month ${9 + Math.floor(rand() * 8)}`, hint: "At modelled pricing" },
      { label: "Setup Budget", value: budget.total, hint: "Six-month operating plan" },
    ],
  };
}
