import type { MapData } from './types';

export const map: MapData = {
  slug: 'venture-capital',
  title: 'Contemporary Topics in Venture Capital',
  subtitle:
    'Six branches — emerging areas, strategies, players, risks, advancements, outlook',
  date: '2026-04-19',
  description:
    'An expanded mind map of contemporary venture capital as it stands in 2026 — the sectors attracting capital, the strategies firms deploy, the named players across tiers, the structural risks, the tooling revolution inside the industry itself, and the 2030 horizon.',
  branchColors: [
    '#b23b3b', // Emerging Investment Areas — red
    '#e08935', // Investment Strategies — orange
    '#d4a92a', // Key Players — gold
    '#47a669', // Challenges and Risks — green
    '#3a9baa', // Technological Advancements in VC — teal
    '#4a6ba8', // Future Outlook — blue
  ],
  root: {
    label: 'Contemporary Topics in Venture Capital',
    children: [
      // --- Branch 1: Emerging Investment Areas -----------
      {
        label: 'Emerging Investment Areas',
        children: [
          {
            label: 'Artificial Intelligence and ML',
            children: [
              {
                label: 'Foundation model labs',
                children: [
                  { label: 'OpenAI ($157B val 2024)' },
                  { label: 'Anthropic ($61.5B val early 2025)' },
                  { label: 'Mistral (Paris, $6B val 2024)' },
                  { label: 'xAI (Musk, $50B val 2024)' },
                ],
              },
              {
                label: 'AI coding and agent tools',
                children: [
                  { label: 'Cursor (Anysphere) — $29.3B val Nov 2025' },
                  { label: 'Lovable — $6.6B val Dec 2025' },
                  { label: 'Bolt.new (StackBlitz) — $700M val Jan 2025' },
                  { label: 'Replit — Agent products 2024–25' },
                ],
              },
              {
                label: 'Vertical AI applications',
                children: [
                  { label: 'Harvey (legal) — Sequoia backing' },
                  { label: 'Abridge (health dictation)' },
                  { label: 'Cognition (Devin)' },
                  { label: 'Glean (enterprise search)' },
                ],
              },
              {
                label: 'AI infrastructure',
                children: [
                  { label: 'CoreWeave — GPU cloud' },
                  { label: 'Cerebras — wafer-scale chips' },
                  { label: 'Groq — inference silicon' },
                  { label: 'Together AI, Anyscale' },
                ],
              },
            ],
          },
          {
            label: 'Climate Tech and Clean Energy',
            children: [
              {
                label: 'Battery and storage',
                children: [
                  { label: 'Form Energy — iron-air long duration' },
                  { label: 'Sila Nanotech — silicon anode' },
                  { label: 'QuantumScape — solid-state battery' },
                ],
              },
              {
                label: 'Fusion and advanced nuclear',
                children: [
                  { label: 'Helion (Sam Altman-backed) — 2028 net energy goal' },
                  { label: 'Commonwealth Fusion Systems — MIT spinout' },
                  { label: 'Oklo — SMR nuclear' },
                ],
              },
              {
                label: 'Direct air capture and removal',
                children: [
                  { label: 'Climeworks (Zurich)' },
                  { label: 'Heirloom Carbon Technologies' },
                  { label: 'Stripe Climate purchase consortium' },
                ],
              },
              {
                label: 'Sustainable transport',
                children: [
                  { label: 'Rivian — 2021 IPO' },
                  { label: 'Archer Aviation — eVTOL' },
                  { label: 'Joby Aviation — eVTOL' },
                ],
              },
            ],
          },
          {
            label: 'Biotech and HealthTech',
            children: [
              {
                label: 'CRISPR and gene editing',
                children: [
                  { label: 'Editas Medicine (Doudna-adjacent)' },
                  { label: 'Intellia Therapeutics' },
                  { label: 'Beam Therapeutics' },
                ],
              },
              {
                label: 'AI-driven drug discovery',
                children: [
                  { label: 'Recursion Pharmaceuticals' },
                  { label: 'Insilico Medicine' },
                  { label: 'Isomorphic Labs (DeepMind spinout)' },
                ],
              },
              {
                label: 'Longevity',
                children: [
                  { label: 'Altos Labs ($3B launch, Bezos, Milner)' },
                  { label: 'NewLimit (Silverstein-funded)' },
                  { label: 'Retro Biosciences (Altman-backed)' },
                ],
              },
              {
                label: 'Digital health and telemedicine',
                children: [
                  { label: 'Hims & Hers — 2021 SPAC' },
                  { label: 'Ro (formerly Roman)' },
                  { label: 'Carbon Health' },
                ],
              },
            ],
          },
          {
            label: 'Defense, Dual-Use, and Space',
            children: [
              {
                label: 'Defense tech',
                children: [
                  { label: 'Anduril — $14B val 2024' },
                  { label: 'Palantir (public 2020)' },
                  { label: 'Shield AI — autonomous' },
                  { label: 'Saronic, Vannevar, Epirus' },
                ],
              },
              {
                label: 'Commercial space',
                children: [
                  { label: 'SpaceX — $350B private val 2024' },
                  { label: 'Relativity Space' },
                  { label: 'Varda (in-space manufacturing)' },
                ],
              },
              {
                label: 'Dual-use hardware',
                children: [
                  { label: 'Skydio (drones)' },
                  { label: 'Shield AI Hivemind' },
                ],
              },
            ],
          },
        ],
      },

      // --- Branch 2: Investment Strategies ---------------
      {
        label: 'Investment Strategies',
        children: [
          {
            label: 'Stage-Focused Investing',
            children: [
              {
                label: 'Pre-seed and seed',
                children: [
                  { label: 'Y Combinator (March 2005, Graham/Livingston)' },
                  { label: '500 Global, SOSV, Pear VC' },
                  { label: 'Micro-fund scene: Susa, Hustle Fund, Afore' },
                ],
              },
              {
                label: 'Series A',
                children: [
                  { label: 'Benchmark (1995), First Round (2004)' },
                  { label: 'Founder Collective (2009)' },
                  { label: 'Greylock Series A pod' },
                ],
              },
              {
                label: 'Growth and late stage',
                children: [
                  { label: 'Tiger Global — 2021 pace, 2022 pullback' },
                  { label: 'Coatue Management' },
                  { label: 'Insight Partners' },
                  { label: 'General Atlantic' },
                ],
              },
            ],
          },
          {
            label: 'Thesis-Driven Investing',
            children: [
              {
                label: 'Climate-focused funds',
                children: [
                  { label: 'Lowercarbon Capital (Chris Sacca)' },
                  { label: 'Breakthrough Energy Ventures (Gates)' },
                  { label: 'Energize Capital' },
                ],
              },
              {
                label: 'Crypto-focused',
                children: [
                  { label: 'Paradigm (Ehrsam, Huang)' },
                  { label: 'a16z crypto (Chris Dixon)' },
                  { label: 'Polychain Capital' },
                ],
              },
              {
                label: 'Frontier/contrarian',
                children: [
                  { label: "Founders Fund (Thiel, 2005)" },
                  { label: 'Khosla Ventures' },
                  { label: 'Lux Capital (deep tech)' },
                ],
              },
            ],
          },
          {
            label: 'Alternative Capital Structures',
            children: [
              {
                label: 'Solo GPs',
                children: [
                  { label: 'Harry Stebbings (20VC)' },
                  { label: 'Elad Gil' },
                  { label: 'Matt Turck' },
                  { label: 'Lachy Groom' },
                ],
              },
              {
                label: 'Rolling funds and syndicates',
                children: [
                  { label: 'AngelList rolling funds' },
                  { label: 'SPVs — deal-by-deal capital' },
                  { label: 'Syndicate model (Naval 2013)' },
                ],
              },
              {
                label: 'Scout programs',
                children: [
                  { label: 'Sequoia Scout (2009)' },
                  { label: 'First Round Angel Track' },
                  { label: 'a16z cultural leadership fund' },
                ],
              },
            ],
          },
          {
            label: 'Specialized Approaches',
            children: [
              {
                label: 'Corporate VC',
                children: [
                  { label: 'Intel Capital (1991)' },
                  { label: 'Salesforce Ventures' },
                  { label: 'NVIDIA NVentures' },
                  { label: 'Google Ventures (GV)' },
                ],
              },
              {
                label: 'Impact and mission-driven',
                children: [
                  { label: 'TPG Rise Fund' },
                  { label: 'DBL Partners' },
                  { label: 'Omidyar Network' },
                ],
              },
              {
                label: 'Sovereign and institutional',
                children: [
                  { label: 'Saudi PIF — OpenAI, major cap' },
                  { label: 'Mubadala (UAE)' },
                  { label: 'Temasek (Singapore)' },
                  { label: 'University endowments: Yale, Harvard, MIT' },
                ],
              },
            ],
          },
        ],
      },

      // --- Branch 3: Key Players -------------------------
      {
        label: 'Key Players',
        children: [
          {
            label: 'Legacy top-tier firms',
            children: [
              {
                label: 'Sequoia Capital',
                children: [
                  { label: 'Founded 1972 by Don Valentine' },
                  { label: 'Apple, Oracle, Cisco, Google, Airbnb' },
                  { label: 'Split into US, India, China arms 2023' },
                ],
              },
              {
                label: 'Kleiner Perkins',
                children: [
                  { label: 'Founded 1972 (Kleiner, Perkins)' },
                  { label: 'Netscape, Amazon, Google early rounds' },
                  { label: "Mamoon Hamid, Ilya Fushman leadership" },
                ],
              },
              {
                label: 'Andreessen Horowitz (a16z)',
                children: [
                  { label: 'Founded 2009 by Marc Andreessen + Ben Horowitz' },
                  { label: 'First stage-agnostic full-stack VC' },
                  { label: '$40B+ AUM; crypto, bio, American Dynamism verticals' },
                ],
              },
              {
                label: 'Benchmark',
                children: [
                  { label: 'Founded 1995; eBay, Twitter, Uber, Snapchat' },
                  { label: 'Sarah Tavel, Bill Gurley era' },
                ],
              },
            ],
          },
          {
            label: 'Growth-stage specialists',
            children: [
              {
                label: 'Tiger Global Management',
                children: [
                  { label: 'Chase Coleman (Tiger Cubs lineage)' },
                  { label: '2021 pace-setting, 2022 pullback' },
                ],
              },
              {
                label: 'Coatue and Insight',
                children: [
                  { label: 'Coatue — Philippe Laffont' },
                  { label: 'Insight Partners — software focus' },
                ],
              },
              {
                label: 'Thrive Capital',
                children: [
                  { label: 'Josh Kushner, founded 2010' },
                  { label: 'Lead investor in OpenAI Series C 2023' },
                ],
              },
            ],
          },
          {
            label: 'Ascendant powers',
            children: [
              {
                label: 'General Catalyst',
                children: [
                  { label: 'Founded 2000, Cambridge MA → global' },
                  { label: 'Merged with La Famiglia 2023' },
                ],
              },
              {
                label: 'Accel and Greylock',
                children: [
                  { label: 'Accel — Facebook Series A' },
                  { label: 'Greylock — LinkedIn, Airbnb' },
                ],
              },
              {
                label: 'Lightspeed Venture Partners',
                children: [
                  { label: 'Snap, Affirm, Epic Games' },
                  { label: 'Global offices across US, India, Israel' },
                ],
              },
            ],
          },
          {
            label: 'Angels and solo capitalists',
            children: [
              {
                label: 'Naval Ravikant',
                children: [
                  { label: 'AngelList founder (2010)' },
                  { label: 'Early angel in Uber, Twitter, others' },
                ],
              },
              {
                label: 'Elad Gil',
                children: [
                  { label: 'Solo GP; $1B+ fund 2024' },
                  { label: 'Airbnb, Stripe, Airtable early' },
                ],
              },
              {
                label: 'Garry Tan and Floodgate',
                children: [
                  { label: 'Garry Tan — YC President (2023–)' },
                  { label: 'Mike Maples Jr. — Floodgate (2006)' },
                ],
              },
            ],
          },
        ],
      },

      // --- Branch 4: Challenges and Risks ----------------
      {
        label: 'Challenges and Risks',
        children: [
          {
            label: 'Valuation and Return Dynamics',
            children: [
              {
                label: 'Post-2021 compression',
                children: [
                  { label: 'NASDAQ peak Nov 2021, ~35% drawdown 2022' },
                  { label: 'Down rounds: Stripe 2023 $50B → $55B recovery' },
                  { label: 'Zombie unicorns — valued private, unexit-able' },
                ],
              },
              {
                label: 'Power-law intensification',
                children: [
                  { label: 'Top 5% of funds capture 95% of returns (CA Ventures data)' },
                  { label: 'AI winner-take-most dynamics' },
                ],
              },
            ],
          },
          {
            label: 'Regulatory and Legal',
            children: [
              {
                label: 'Antitrust scrutiny',
                children: [
                  { label: 'DOJ antitrust probe of Microsoft-OpenAI (2024)' },
                  { label: 'FTC investigation of AI partnerships' },
                  { label: 'EU Digital Markets Act' },
                ],
              },
              {
                label: 'Securities regulation',
                children: [
                  { label: 'Carried-interest taxation debate' },
                  { label: 'Accredited-investor rules' },
                  { label: 'Secondary-market SEC review' },
                ],
              },
              {
                label: 'Compliance burdens',
                children: [
                  { label: 'Rule 506(c) amendments' },
                  { label: 'Know-your-LP requirements' },
                ],
              },
            ],
          },
          {
            label: 'Exit Environment',
            children: [
              {
                label: 'IPO market',
                children: [
                  { label: 'Near-drought 2022–23' },
                  { label: 'Figma IPO NYSE August 2025 — revival signal' },
                  { label: 'Klaviyo (2023), Instacart (2023) mixed debuts' },
                ],
              },
              {
                label: 'M&A activity',
                children: [
                  { label: 'Adobe–Figma $20B terminated Dec 2023 (regulatory)' },
                  { label: 'Cisco–Splunk $28B (2024)' },
                  { label: 'Microsoft–Activision $75B (2023)' },
                ],
              },
              {
                label: 'Secondary markets',
                children: [
                  { label: 'Tender offers and continuation funds' },
                  { label: 'Forge, EquityZen growth' },
                  { label: 'GP-led secondaries' },
                ],
              },
            ],
          },
          {
            label: 'LP and Capital-Formation Risk',
            children: [
              {
                label: 'Endowment pullback',
                children: [
                  { label: 'Denominator effect 2022–23' },
                  { label: 'Yale, Harvard reducing VC allocation %' },
                ],
              },
              {
                label: 'Pension fund scrutiny',
                children: [
                  { label: 'CalPERS, CalSTRS fee pressure' },
                  { label: 'Transparency mandates' },
                ],
              },
              {
                label: 'LP concentration',
                children: [
                  { label: 'Sovereign wealth anchors (PIF, Mubadala)' },
                  { label: 'Family office rise' },
                ],
              },
            ],
          },
        ],
      },

      // --- Branch 5: Technological Advancements in VC ----
      {
        label: 'Technological Advancements in VC',
        children: [
          {
            label: 'AI-Powered Deal Sourcing',
            children: [
              {
                label: 'Signal mining',
                children: [
                  { label: 'SignalFire — data-driven sourcing' },
                  { label: 'EQT Motherbrain — internal AI platform' },
                  { label: 'Correlation Ventures — quant VC' },
                ],
              },
              {
                label: 'Founder/market research',
                children: [
                  { label: 'Harmonic — company intelligence' },
                  { label: 'Specter — startup signals' },
                ],
              },
            ],
          },
          {
            label: 'Portfolio and Fund Operations',
            children: [
              {
                label: 'Cap table and fund admin',
                children: [
                  { label: 'Carta (cap tables, secondaries)' },
                  { label: 'AngelList Venture (fund admin)' },
                  { label: 'Pulley, Cake Equity' },
                ],
              },
              {
                label: 'CRM and relationship management',
                children: [
                  { label: 'Affinity — relationship-graph CRM' },
                  { label: 'Attio (relationship intelligence)' },
                ],
              },
            ],
          },
          {
            label: 'Data and Analytics Platforms',
            children: [
              {
                label: 'Private-market data',
                children: [
                  { label: 'PitchBook (Morningstar-owned)' },
                  { label: 'Crunchbase' },
                  { label: 'CB Insights' },
                ],
              },
              {
                label: 'Thematic research',
                children: [
                  { label: 'Tegus — expert calls' },
                  { label: 'AlphaSense — financial research' },
                ],
              },
            ],
          },
          {
            label: 'Blockchain and Tokenization',
            children: [
              {
                label: 'On-chain deal structures',
                children: [
                  { label: 'Tokenized SPVs (experimental)' },
                  { label: 'Syndicate protocol' },
                ],
              },
              {
                label: 'DAO-adjacent capital',
                children: [
                  { label: 'Metacartel Ventures' },
                  { label: 'Orange DAO (YC alumni)' },
                ],
              },
            ],
          },
        ],
      },

      // --- Branch 6: Future Outlook ----------------------
      {
        label: 'Future Outlook and Trends',
        children: [
          {
            label: 'AI-Native Firm Structures',
            children: [
              {
                label: 'New-vintage AI-focused firms',
                children: [
                  { label: 'Conviction (Sarah Guo, 2022)' },
                  { label: 'Radical Ventures' },
                  { label: 'Sound Ventures (Ashton Kutcher)' },
                ],
              },
              {
                label: 'AI-augmented diligence',
                children: [
                  { label: 'Internal Claude/ChatGPT memos' },
                  { label: 'Automated market-map generation' },
                ],
              },
            ],
          },
          {
            label: 'Geographic Diversification',
            children: [
              {
                label: 'US secondary hubs',
                children: [
                  { label: 'Austin, Miami, NYC capital rise 2020–25' },
                  { label: 'Tesla HQ move to Austin Oct 2021' },
                ],
              },
              {
                label: 'Middle East capital flow',
                children: [
                  { label: 'Saudi PIF anchors into tech' },
                  { label: 'Mubadala, Abu Dhabi G42' },
                  { label: 'Kuwait Investment Authority' },
                ],
              },
              {
                label: 'Emerging-market rise',
                children: [
                  { label: 'India: Flipkart, Zomato, Lenskart' },
                  { label: 'Southeast Asia: Grab, GoTo, Sea' },
                  { label: 'Latin America: Nubank, MercadoLibre' },
                ],
              },
            ],
          },
          {
            label: 'Evolving Fund Structures',
            children: [
              {
                label: 'Evergreen and open-ended funds',
                children: [
                  { label: 'Sequoia restructured 2021 as evergreen' },
                  { label: 'General Atlantic permanent capital' },
                ],
              },
              {
                label: 'VC/PE hybrid models',
                children: [
                  { label: 'Thoma Bravo software strategy' },
                  { label: 'Insight Vision Fund-style mega-funds' },
                ],
              },
              {
                label: 'Decentralized autonomous investing',
                children: [
                  { label: 'DAOs as LP vehicles (speculative)' },
                  { label: 'Tokenized fund interests' },
                ],
              },
            ],
          },
          {
            label: 'Power-Law Concentration in the AI Era',
            children: [
              {
                label: 'Outlier economics',
                children: [
                  { label: 'Cursor: $100M ARR in 12 months, fastest ever' },
                  { label: 'One-person unicorns plausible with AI leverage' },
                ],
              },
              {
                label: 'Talent consolidation',
                children: [
                  { label: 'Research talent flowing to frontier labs' },
                  { label: 'Cursor, OpenAI poaching from each other' },
                ],
              },
              {
                label: 'Compute arms race',
                children: [
                  { label: 'Stargate $500B (OpenAI + Oracle + SoftBank) Jan 2025' },
                  { label: 'Microsoft $80B compute spend 2025' },
                  { label: 'Capex-intensive VC models emerging' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};
