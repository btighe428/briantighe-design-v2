import type { MapData } from './types';

export const map: MapData = {
  slug: 'silicon-valley-history',
  title: 'Silicon Valley Innovation History',
  subtitle:
    'Seven eras, 1900–2030 — radio and vacuum tubes to post-AGI economies',
  date: '2026-04-19',
  description:
    'An expanded mind map of Silicon Valley from its pre-semiconductor radio origins through the AI era and speculative 2030 horizons. Seven branches, four sub-branches each, ~200 named facts — people, companies, products, dates — transcribing the structure of the region as a research scaffold.',
  branchColors: [
    '#6b3a7c', // Origins — deep purple
    '#b23b3b', // Semiconductor — red
    '#e08935', // Microprocessor & PC — orange
    '#d4a92a', // Internet & Dot-Com — gold
    '#47a669', // Mobile & Social — green
    '#3a9baa', // AI — teal
    '#4a6ba8', // Future & Challenges — blue
  ],
  root: {
    label: 'Silicon Valley Innovation History',
    children: [
      // --- Branch 1: Origins -------------------------------
      {
        label: 'Origins, 1900–1955',
        children: [
          {
            label: 'Radio and Vacuum Tube Roots',
            children: [
              {
                label: 'Federal Telegraph Company',
                children: [
                  { label: 'Founded 1909 in Palo Alto by Cyril Elwell' },
                  { label: 'Licensed Poulsen arc transmitter from Denmark' },
                  { label: 'First US transcontinental radio link, 1912' },
                ],
              },
              {
                label: 'Lee de Forest at Federal Telegraph',
                children: [
                  { label: 'Joined 1911; refined the Audion triode' },
                  { label: 'Demonstrated amplification in Palo Alto, 1912' },
                ],
              },
              {
                label: 'Eitel-McCullough (Eimac)',
                children: [
                  { label: 'Founded 1934 San Bruno by Eitel & McCullough' },
                  { label: 'Supplied high-power tubes for WWII radar' },
                ],
              },
            ],
          },
          {
            label: "Stanford's Catalytic Role",
            children: [
              {
                label: 'Frederick Terman',
                children: [
                  { label: 'Dean of Engineering 1944' },
                  { label: '"Father of Silicon Valley"' },
                  { label: 'Radio Engineering, 1932 — standard textbook' },
                  { label: 'Mentored Hewlett and Packard as grad students' },
                ],
              },
              {
                label: 'Stanford Industrial Park',
                children: [
                  { label: 'Opened 1951, Terman\'s idea' },
                  { label: 'First US university research park' },
                  { label: 'Early tenants: Varian, HP, Kodak, GE' },
                ],
              },
              {
                label: 'Stanford Research Institute (SRI)',
                children: [
                  { label: 'Founded 1946 as Stanford\'s contract research arm' },
                  { label: 'Spun off independent nonprofit, 1970' },
                ],
              },
            ],
          },
          {
            label: 'Founding Firms',
            children: [
              {
                label: 'Hewlett-Packard',
                children: [
                  { label: 'Founded 1939 by Bill Hewlett & Dave Packard' },
                  { label: 'Garage at 367 Addison Ave, Palo Alto' },
                  { label: 'Model 200A oscillator; Disney Fantasia deal (1940)' },
                ],
              },
              {
                label: 'Varian Associates',
                children: [
                  { label: 'Founded 1948 by Russell & Sigurd Varian' },
                  { label: 'Commercialized the klystron microwave tube' },
                ],
              },
              {
                label: 'Litton Industries',
                children: [
                  { label: 'Charles Litton founded Litton Engineering Labs, 1932' },
                  { label: 'Redwood City; precision vacuum-tube manufacturing' },
                ],
              },
              {
                label: 'Ampex',
                children: [
                  { label: 'Founded 1944 San Carlos by Alexander Poniatoff' },
                  { label: 'Model 200 audio tape recorder 1948 (Crosby-backed)' },
                  { label: 'Quadruplex videotape recorder, 1956' },
                ],
              },
            ],
          },
          {
            label: 'Military and Semiconductor Prelude',
            children: [
              {
                label: 'WWII and Cold War Funding',
                children: [
                  { label: 'Moffett Field commissioned 1933' },
                  { label: 'MIT Rad Lab radar work drove Bay Area tube demand' },
                  { label: 'Postwar DoD contracts to Stanford labs' },
                ],
              },
              {
                label: 'Bell Labs Transistor (East Coast)',
                children: [
                  { label: 'Bardeen, Brattain, Shockley invent transistor 1947 (Murray Hill)' },
                ],
              },
              {
                label: 'Shockley Moves West',
                children: [
                  { label: 'Shockley Semiconductor Lab opens Mountain View, 1955' },
                  { label: 'Seeds Fairchild\'s 1957 semiconductor division' },
                ],
              },
            ],
          },
        ],
      },

      // --- Branch 2: Semiconductor Era ---------------------
      {
        label: 'Semiconductor Era, 1955–1975',
        children: [
          {
            label: 'Shockley Semiconductor Lab',
            children: [
              {
                label: 'William Shockley',
                children: [
                  { label: '1956 Nobel (with Bardeen, Brattain) for transistor' },
                  { label: 'Founded lab in Mountain View, 1956' },
                  { label: 'Pushed four-layer diode over silicon transistors' },
                ],
              },
              {
                label: 'Management failures',
                children: [
                  { label: 'Required lie-detector tests of staff' },
                  { label: 'Posted salaries publicly; paranoid leadership' },
                  { label: 'Arnold Beckman (Beckman Instruments) funded the lab' },
                ],
              },
            ],
          },
          {
            label: 'The Traitorous Eight, 1957',
            children: [
              {
                label: 'The defectors',
                children: [
                  { label: 'Robert Noyce, Gordon Moore, Jean Hoerni, Jay Last' },
                  { label: 'Victor Grinich, Eugene Kleiner, Sheldon Roberts, Julius Blank' },
                ],
              },
              {
                label: 'The departure',
                children: [
                  { label: 'Resigned September 18, 1957' },
                  { label: "Kleiner's letter to Hayden Stone reached Arthur Rock" },
                  { label: 'Sherman Fairchild funded them with $1.5M' },
                ],
              },
            ],
          },
          {
            label: 'Fairchild Semiconductor',
            children: [
              {
                label: 'Founding and leadership',
                children: [
                  { label: 'Founded 1957 Palo Alto; Noyce as GM by 1959' },
                  { label: "Hoerni's planar process, 1959" },
                  { label: "Noyce's integrated circuit patent filed July 1959" },
                ],
              },
              {
                label: 'Products and rivalry',
                children: [
                  { label: '1961 Micrologic IC family for Apollo and Minuteman' },
                  { label: "Competed with Kilby's TI IC (1958)" },
                  { label: 'Hit $130M revenue by 1966' },
                ],
              },
            ],
          },
          {
            label: 'The Fairchildren and Venture Capital',
            children: [
              {
                label: 'Major spin-offs',
                children: [
                  { label: 'Intel founded 1968 by Noyce + Moore; Grove employee #3' },
                  { label: 'AMD founded 1969 by Jerry Sanders' },
                  { label: 'National Semiconductor revived 1967 under Sporck' },
                  { label: 'Signetics (1961), Intersil (1967), LSI Logic (1981)' },
                ],
              },
              {
                label: 'Sand Hill Road VC',
                children: [
                  { label: 'Arthur Rock backed Fairchild 1957, Intel 1968' },
                  { label: 'Kleiner Perkins founded 1972 (Kleiner + Perkins)' },
                  { label: 'Sequoia founded 1972 by Don Valentine (ex-Fairchild)' },
                ],
              },
              {
                label: 'Intel milestones',
                children: [
                  { label: '3101 SRAM 1969; 1103 DRAM 1970 kills magnetic core' },
                  { label: 'Intel 4004 shipped Nov 1971 (Faggin, Hoff)' },
                  { label: 'Intel 8080 released 1974' },
                ],
              },
            ],
          },
        ],
      },

      // --- Branch 3: Microprocessor & PC -------------------
      {
        label: 'Microprocessor and PC Era, 1971–1995',
        children: [
          {
            label: 'Intel and the Microprocessor Revolution',
            children: [
              {
                label: 'Founding chips',
                children: [
                  { label: '4004 (1971, Faggin, Hoff, Mazor)' },
                  { label: '8008 (1972), 8080 (1974)' },
                  { label: '8086 (1978) launches x86 architecture' },
                ],
              },
              {
                label: 'Market expansion',
                children: [
                  { label: '80286 (1982), 80386 (1985), 80486 (1989)' },
                  { label: 'IBM PC contract (1981) cements x86 dominance' },
                  { label: 'Pentium (1993) under Andy Grove' },
                ],
              },
              {
                label: 'Competitors and spinouts',
                children: [
                  { label: 'Zilog Z80 (1976, Faggin after leaving Intel)' },
                  { label: 'AMD founded 1969, Jerry Sanders' },
                  { label: 'MIPS Computer Systems (1984, John Hennessy)' },
                ],
              },
            ],
          },
          {
            label: 'Personal Computer Emergence',
            children: [
              {
                label: 'Hobbyist roots',
                children: [
                  { label: 'Homebrew Computer Club (March 1975, Menlo Park)' },
                  { label: 'Gordon French and Fred Moore, first meeting' },
                  { label: 'MITS Altair 8800 (1975) as catalyst' },
                ],
              },
              {
                label: 'Apple',
                children: [
                  { label: 'Apple I (1976, Wozniak + Jobs, Los Altos garage)' },
                  { label: 'Apple II (1977); VisiCalc (1979, Bricklin, Frankston)' },
                  { label: 'Macintosh January 24, 1984; Super Bowl "1984" ad' },
                ],
              },
              {
                label: 'Rivals and gaming',
                children: [
                  { label: 'Commodore PET (1977), VIC-20, C64 (1982)' },
                  { label: 'Atari 2600 (1977), Nolan Bushnell, Pong (1972)' },
                  { label: 'Electronic Arts (1982, Trip Hawkins)' },
                ],
              },
            ],
          },
          {
            label: 'Workstations, Networks, Graphics',
            children: [
              {
                label: 'Sun Microsystems (1982)',
                children: [
                  { label: 'Founders: Khosla, Bechtolsheim, McNealy, Bill Joy' },
                  { label: 'SPARC architecture (1987), Solaris, NFS' },
                ],
              },
              {
                label: 'Silicon Graphics (1982, Jim Clark)',
                children: [
                  { label: 'IRIS workstations, Geometry Engine, IRIX' },
                ],
              },
              {
                label: 'Cisco Systems (1984)',
                children: [
                  { label: 'Leonard Bosack and Sandy Lerner at Stanford' },
                  { label: 'AGS multiprotocol router; IPO 1990' },
                ],
              },
            ],
          },
          {
            label: 'Xerox PARC and Enterprise Software',
            children: [
              {
                label: 'PARC inventions (founded 1970)',
                children: [
                  { label: 'Alto (1973), Smalltalk, bitmapped GUI' },
                  { label: 'Ethernet (1973, Bob Metcalfe)' },
                  { label: 'Laser printer (Gary Starkweather)' },
                  { label: 'Mouse refined (Engelbart 1968 → PARC productization)' },
                ],
              },
              {
                label: 'Database and tools',
                children: [
                  { label: 'Oracle (1977, Larry Ellison, Miner, Oates)' },
                  { label: 'Sybase (1984), Informix (1980)' },
                ],
              },
              {
                label: 'Publishing and creative',
                children: [
                  { label: 'Adobe (1982, Warnock + Geschke, ex-PARC)' },
                  { label: 'PostScript (1984), Illustrator (1987), Photoshop (1990)' },
                ],
              },
            ],
          },
        ],
      },

      // --- Branch 4: Internet & Dot-Com --------------------
      {
        label: 'Internet and Dot-Com Era, 1993–2007',
        children: [
          {
            label: 'Web Browsers and the IPO Spark',
            children: [
              {
                label: 'Mosaic and Netscape',
                children: [
                  { label: 'Mosaic (1993, NCSA, Marc Andreessen)' },
                  { label: 'Netscape Navigator (1994, Andreessen + Jim Clark)' },
                  { label: 'Netscape IPO Aug 9, 1995 kickstarted dot-com boom' },
                ],
              },
              {
                label: 'Browser Wars',
                children: [
                  { label: 'Internet Explorer bundled with Windows 95' },
                  { label: 'Mozilla open-sourced (1998)' },
                  { label: 'Firefox 1.0 (2004)' },
                ],
              },
            ],
          },
          {
            label: 'Search and Portals',
            children: [
              {
                label: 'First-generation search',
                children: [
                  { label: 'Yahoo! (1994, Jerry Yang, David Filo, Stanford)' },
                  { label: 'Lycos (1994, Carnegie Mellon)' },
                  { label: 'Excite, AltaVista (DEC 1995), InfoSeek' },
                ],
              },
              {
                label: "Google's rise",
                children: [
                  { label: 'Founded 1998, Larry Page + Sergey Brin, Menlo Park garage' },
                  { label: 'PageRank algorithm' },
                  { label: 'AdWords (2000); IPO August 2004' },
                ],
              },
            ],
          },
          {
            label: 'E-Commerce and Payments',
            children: [
              {
                label: 'Marketplaces',
                children: [
                  { label: 'Amazon (1994, Jeff Bezos, Seattle)' },
                  { label: 'eBay (1995, Pierre Omidyar, San Jose)' },
                  { label: 'Priceline (1997, Walker and Michael Loeb)' },
                ],
              },
              {
                label: 'Payments and infrastructure',
                children: [
                  { label: 'PayPal (2000 merger of Confinity/X.com; Thiel, Musk)' },
                  { label: 'Cisco routing backbone; Sun servers' },
                  { label: 'Akamai CDN (1998, MIT)' },
                ],
              },
            ],
          },
          {
            label: 'Bubble, Bust, Web 2.0 Rebirth',
            children: [
              {
                label: 'Dot-com bubble and crash',
                children: [
                  { label: 'Pets.com, Webvan, Boo.com flameouts (2000)' },
                  { label: 'NASDAQ peak March 10, 2000 (5,048)' },
                  { label: 'Bottom October 2002' },
                ],
              },
              {
                label: 'Venture capital maturation',
                children: [
                  { label: 'Benchmark Capital (eBay bet)' },
                  { label: 'Kleiner Perkins (Netscape, Google)' },
                  { label: 'Sequoia (Yahoo, Google, PayPal)' },
                ],
              },
              {
                label: 'Web 2.0 and social',
                children: [
                  { label: 'Blogger (1999, Evan Williams), WordPress (2003)' },
                  { label: 'Wikipedia (2001, Jimmy Wales)' },
                  { label: 'LinkedIn (2003, Reid Hoffman), MySpace (2003)' },
                  { label: 'Flickr (2004), YouTube (Feb 2005)' },
                  { label: 'Facebook moves to Palo Alto (2004–05)' },
                ],
              },
            ],
          },
        ],
      },

      // --- Branch 5: Mobile & Social -----------------------
      {
        label: 'Mobile and Social Era, 2007–2020',
        children: [
          {
            label: 'Mobile Revolution',
            children: [
              {
                label: 'iPhone launch',
                children: [
                  { label: 'Jobs unveils Jan 9, 2007 Macworld "three revolutionary products"' },
                  { label: 'Phone, iPod, internet communicator in one device' },
                  { label: 'First sale June 29, 2007 at $499' },
                ],
              },
              {
                label: 'App Store and iPad',
                children: [
                  { label: 'App Store launched July 10, 2008' },
                  { label: 'iPad unveiled Jan 27, 2010' },
                  { label: 'Created mobile developer economy' },
                ],
              },
              {
                label: 'Android rise',
                children: [
                  { label: 'Founded 2003 (Rubin, Miner, Sears)' },
                  { label: 'Google acquired Android August 2005' },
                  { label: 'T-Mobile G1 launched October 22, 2008' },
                  { label: 'Open Handset Alliance Nov 2007' },
                ],
              },
            ],
          },
          {
            label: 'Social Networks',
            children: [
              {
                label: 'Facebook trajectory',
                children: [
                  { label: 'Zuckerberg drops Harvard, Palo Alto office 2004' },
                  { label: 'Sean Parker founding president 2004–05' },
                  { label: 'Sheryl Sandberg COO March 2008' },
                  { label: 'IPO May 18, 2012 at $38/share' },
                ],
              },
              {
                label: 'Facebook acquisitions',
                children: [
                  { label: 'Instagram April 9, 2012 for $1B' },
                  { label: 'WhatsApp February 19, 2014 for $19B' },
                ],
              },
              {
                label: 'Other platforms',
                children: [
                  { label: 'Twitter launched March 21, 2006 (Dorsey, Williams, Stone)' },
                  { label: 'Snapchat founded 2011 by Evan Spiegel at Stanford' },
                  { label: 'Pinterest launched March 2010 by Ben Silbermann' },
                ],
              },
            ],
          },
          {
            label: 'Cloud and On-Demand',
            children: [
              {
                label: 'Cloud infrastructure',
                children: [
                  { label: 'AWS S3 launched March 14, 2006' },
                  { label: 'Google App Engine launched April 2008' },
                  { label: 'Salesforce pioneered SaaS from 1999' },
                ],
              },
              {
                label: 'Gig economy',
                children: [
                  { label: 'Uber founded March 2009 (Kalanick, Camp)' },
                  { label: 'Airbnb founded August 2008 (Chesky, Gebbia, Blecharczyk)' },
                  { label: 'Lyft launched summer 2012 (Green, Zimmer)' },
                  { label: 'DoorDash founded 2013 at Stanford (Tony Xu)' },
                ],
              },
            ],
          },
          {
            label: 'Fintech and Capital',
            children: [
              {
                label: 'Fintech founders',
                children: [
                  { label: 'Stripe founded 2010 (Patrick + John Collison, YC)' },
                  { label: 'Square February 2009 (Dorsey, McKelvey)' },
                  { label: 'Robinhood April 2013 (Tenev, Bhatt)' },
                ],
              },
              {
                label: 'Y Combinator maturation',
                children: [
                  { label: 'Founded March 2005 (Graham, Livingston)' },
                  { label: 'Primary operations to Mountain View 2009' },
                  { label: 'Demo Day model scaled hundreds of startups' },
                ],
              },
              {
                label: 'Late-decade liquidity',
                children: [
                  { label: 'SPAC wave surged 2019–20' },
                  { label: 'Uber IPO May 10, 2019 at $45/share' },
                  { label: 'Airbnb IPO December 10, 2020' },
                ],
              },
            ],
          },
        ],
      },

      // --- Branch 6: AI Era --------------------------------
      {
        label: 'AI Era, 2015–2026',
        children: [
          {
            label: 'Deep Learning Foundations and Frontier Labs',
            children: [
              {
                label: 'Pre-2015 breakthroughs',
                children: [
                  { label: 'AlexNet 2012 (Krizhevsky, Sutskever, Hinton)' },
                  { label: 'Google Brain (Dean, Ng)' },
                  { label: 'DeepMind acquired by Google Jan 2014, ~$500M' },
                ],
              },
              {
                label: 'Game-playing milestones',
                children: [
                  { label: 'AlphaGo defeats Lee Sedol March 2016' },
                  { label: 'Google DeepMind merger April 2023' },
                ],
              },
              {
                label: 'Meta and Apple research',
                children: [
                  { label: 'Meta FAIR (Yann LeCun)' },
                  { label: 'Apple Intelligence unveiled WWDC June 2024' },
                ],
              },
            ],
          },
          {
            label: 'OpenAI Trajectory',
            children: [
              {
                label: 'Founding and early era',
                children: [
                  { label: 'Founded Dec 2015 (Altman, Musk, Sutskever, Brockman)' },
                  { label: 'Musk departs board 2018' },
                  { label: 'GPT-2 (2019), GPT-3 (June 2020), DALL-E (Jan 2021)' },
                ],
              },
              {
                label: 'ChatGPT breakout',
                children: [
                  { label: 'ChatGPT launched Nov 30, 2022' },
                  { label: 'Microsoft $10B investment Jan 2023' },
                  { label: 'GPT-4 March 2023' },
                ],
              },
              {
                label: 'Governance and scaling',
                children: [
                  { label: 'Altman ouster and reinstatement Nov 2023' },
                  { label: 'Sora Feb 2024' },
                  { label: 'GPT-5 release' },
                ],
              },
            ],
          },
          {
            label: 'Anthropic and Claude',
            children: [
              {
                label: 'Founding',
                children: [
                  { label: 'Founded 2021 by Dario and Daniela Amodei (ex-OpenAI)' },
                  { label: '$4B Amazon investment' },
                ],
              },
              {
                label: 'Model releases',
                children: [
                  { label: 'Claude launched 2023' },
                  { label: 'Claude 3 Opus March 2024' },
                  { label: 'Claude 3.5 Sonnet June 2024' },
                ],
              },
              {
                label: 'Developer platform',
                children: [
                  { label: 'Claude Artifacts June 2024' },
                  { label: 'Model Context Protocol Nov 2024' },
                  { label: 'Claude Code Feb 2025 preview, GA May 2025 with Claude 4' },
                ],
              },
            ],
          },
          {
            label: 'Infrastructure and AI-Native Startups',
            children: [
              {
                label: 'NVIDIA and silicon',
                children: [
                  { label: 'H100 dominance; Blackwell B200 2024' },
                  { label: 'Jensen Huang; NVIDIA tops $3T market cap 2024' },
                  { label: 'CUDA moat; Apple Neural Engine; Google TPU' },
                ],
              },
              {
                label: 'AI-native coding tools',
                children: [
                  { label: 'Cursor (Anysphere, 2022), $29.3B val Nov 2025, $2B ARR Apr 2026' },
                  { label: 'v0 by Vercel; Bolt.new (StackBlitz, Oct 2024)' },
                  { label: 'Lovable (Dec 2024, Anton Osika), $6.6B val' },
                  { label: 'Replit Agent (Sept 2024)' },
                ],
              },
              {
                label: 'Rival model labs',
                children: [
                  { label: 'xAI (2023, Musk)' },
                  { label: 'Mistral, Cohere, Perplexity' },
                ],
              },
              {
                label: 'Compute arms race',
                children: [
                  { label: 'Stargate $500B (OpenAI + Oracle + SoftBank) Jan 2025' },
                  { label: 'Microsoft $80B compute spend' },
                ],
              },
            ],
          },
        ],
      },

      // --- Branch 7: Future & Challenges -------------------
      {
        label: 'Future and Challenges, 2020–2030',
        children: [
          {
            label: 'Tech Lash and Regulatory Reckoning',
            children: [
              {
                label: 'Cultural critique',
                children: [
                  { label: 'Cambridge Analytica scandal, March 2018' },
                  { label: 'Netflix "The Social Dilemma", September 2020' },
                  { label: 'Zuckerberg Congressional hearings (Apr 2018, Oct 2019)' },
                ],
              },
              {
                label: 'Antitrust enforcement',
                children: [
                  { label: 'DOJ v. Google filed Oct 2020, monopoly ruling Aug 2024' },
                  { label: 'FTC v. Meta ongoing since Dec 2020' },
                  { label: 'Lina Khan named FTC Chair June 2021' },
                ],
              },
              {
                label: 'AI and platform law',
                children: [
                  { label: 'Section 230 scrutiny intensifies post-2020' },
                  { label: 'California SB 1047 vetoed by Newsom Sept 2024' },
                  { label: 'EU AI Act passed March 2024' },
                ],
              },
            ],
          },
          {
            label: 'Housing, Inequality, and Geographic Diffusion',
            children: [
              {
                label: 'Bay Area affordability crisis',
                children: [
                  { label: 'Median Bay Area home price exceeds $1.4M' },
                  { label: 'Prop 13 (1978) entrenches tax inequity' },
                  { label: 'Persistent San Francisco homelessness crisis' },
                ],
              },
              {
                label: 'COVID remote-work exodus',
                children: [
                  { label: 'March 2020 pandemic triggers mass remote shift' },
                  { label: 'Miami Mayor Suarez "how can I help" tweet Dec 2020' },
                  { label: 'Florida no-state-tax migration wave' },
                ],
              },
              {
                label: 'Austin as secondary hub',
                children: [
                  { label: 'Tesla HQ relocation to Austin October 2021' },
                  { label: 'Oracle HQ move to Austin December 2020' },
                ],
              },
            ],
          },
          {
            label: 'Climate, Bio, and Space Frontiers',
            children: [
              {
                label: 'Climate tech',
                children: [
                  { label: 'Tesla founded 2003; Musk joins as chair 2004' },
                  { label: 'Gigafactory Nevada 2016; SolarCity acquired 2016' },
                  { label: 'Stripe Climate, Climeworks scale post-2022 IRA' },
                ],
              },
              {
                label: 'Biotech convergence',
                children: [
                  { label: 'Doudna CRISPR work UC Berkeley 2012; Nobel 2020' },
                  { label: 'Genentech founded 1976, South San Francisco' },
                  { label: '23andMe 2006 (Anne Wojcicki); Recursion drug discovery' },
                ],
              },
              {
                label: 'Commercial space',
                children: [
                  { label: 'SpaceX founded 2002, Hawthorne CA' },
                  { label: 'Starlink constellation deployment' },
                  { label: 'Blue Origin (Bezos), Kent WA, SV-adjacent capital' },
                ],
              },
            ],
          },
          {
            label: 'Crypto Retreat and Post-AGI Speculation',
            children: [
              {
                label: 'Web3 skepticism',
                children: [
                  { label: 'FTX collapse November 2022; SBF convicted 2023' },
                  { label: 'Coinbase founded 2012 SF, IPO April 2021' },
                  { label: 'Decentralization narrative weakens post-2022' },
                ],
              },
              {
                label: 'Post-AGI economy',
                children: [
                  { label: 'Agent economies and high-leverage small teams' },
                  { label: 'College-graduate job displacement concerns' },
                  { label: 'Reshoring AI compute infrastructure' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};
