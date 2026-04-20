import type { MapData } from './types';

export const map: MapData = {
  slug: 'history-of-innovation',
  title: 'The History of Innovation',
  subtitle:
    'Pre-industrial foundations through 2026 — seven epochs, the inventors, the institutions, the patterns',
  date: '2026-04-19',
  description:
    'A mind map of innovation across human history: scientific, industrial, informational, and contemporary epochs, plus the theoretical patterns (Kondratieff waves, Schumpeterian creative destruction, S-curves, disruptive innovation) that organize the whole. Named inventors, institutions, and inventions with dates across seven branches.',
  branchColors: [
    '#6b3a7c', // Pre-Industrial Foundations — deep purple
    '#b23b3b', // First Industrial Revolution — red
    '#e08935', // Second Industrial Revolution — orange
    '#d4a92a', // 20th Century Science and Engineering — gold
    '#47a669', // Information Age — green
    '#3a9baa', // Contemporary Era — teal
    '#4a6ba8', // Patterns and Theories — blue
  ],
  root: {
    label: 'The History of Innovation',
    children: [
      // --- Branch 1: Pre-Industrial Foundations ---------
      {
        label: 'Pre-Industrial Foundations, pre-1760',
        children: [
          {
            label: 'Ancient and Classical',
            children: [
              {
                label: 'Foundational technologies',
                children: [
                  { label: 'Wheel — Sumer, c. 3500 BCE' },
                  { label: 'Bronze and iron metallurgy' },
                  { label: 'Cuneiform writing — Mesopotamia, c. 3200 BCE' },
                  { label: 'Agriculture — Fertile Crescent, c. 10,000 BCE' },
                ],
              },
              {
                label: 'Greek and Roman engineering',
                children: [
                  { label: 'Archimedes — screw, lever, buoyancy' },
                  { label: 'Roman aqueducts and concrete' },
                  { label: 'Alexandrian mechanics (Hero, Ctesibius)' },
                ],
              },
              {
                label: 'Chinese inventions',
                children: [
                  { label: 'Papermaking — Cai Lun, 105 CE' },
                  { label: 'Printing — woodblock 7th c., movable type 11th c.' },
                  { label: 'Gunpowder, compass' },
                ],
              },
            ],
          },
          {
            label: 'Medieval and Islamic Golden Age',
            children: [
              {
                label: 'Islamic scholarship',
                children: [
                  { label: 'House of Wisdom, Baghdad c. 830' },
                  { label: 'Al-Khwarizmi — algebra, algorithms' },
                  { label: 'Ibn al-Haytham — optics, Book of Optics 1021' },
                ],
              },
              {
                label: 'European medieval',
                children: [
                  { label: 'Heavy plow, three-field rotation' },
                  { label: 'Windmills, waterwheels' },
                  { label: 'University of Bologna founded 1088' },
                ],
              },
            ],
          },
          {
            label: 'Gutenberg and Early Modern',
            children: [
              {
                label: 'The printing revolution',
                children: [
                  { label: 'Johannes Gutenberg movable type, c. 1440' },
                  { label: 'Gutenberg Bible c. 1455' },
                  { label: 'By 1500 over 20M books printed in Europe' },
                ],
              },
              {
                label: 'Age of Exploration',
                children: [
                  { label: 'Mariner compass, astrolabe' },
                  { label: 'Columbus 1492, Vasco da Gama 1498' },
                  { label: 'Portuguese caravel design' },
                ],
              },
            ],
          },
          {
            label: 'The Scientific Revolution',
            children: [
              {
                label: 'Astronomy and physics',
                children: [
                  { label: 'Copernicus heliocentrism 1543' },
                  { label: 'Galileo telescope 1609; Dialogue 1632' },
                  { label: 'Kepler laws of planetary motion' },
                  { label: 'Newton Principia 1687' },
                ],
              },
              {
                label: 'Institutional foundations',
                children: [
                  { label: 'Royal Society founded 1660' },
                  { label: 'Académie des Sciences 1666' },
                  { label: 'Philosophical Transactions — first journal 1665' },
                ],
              },
              {
                label: 'Experimental method',
                children: [
                  { label: 'Bacon Novum Organum 1620' },
                  { label: 'Boyle — air pump, Sceptical Chymist 1661' },
                  { label: 'Hooke Micrographia 1665' },
                ],
              },
            ],
          },
        ],
      },

      // --- Branch 2: First Industrial Revolution --------
      {
        label: 'First Industrial Revolution, 1760–1840',
        children: [
          {
            label: 'Steam Power',
            children: [
              {
                label: 'Early steam engines',
                children: [
                  { label: 'Newcomen atmospheric engine 1712' },
                  { label: 'James Watt separate condenser 1769' },
                  { label: 'Boulton & Watt Soho Manufactory 1775' },
                ],
              },
              {
                label: 'Steam applied',
                children: [
                  { label: 'High-pressure steam — Trevithick 1801' },
                  { label: 'Rocket locomotive — Stephenson 1829' },
                  { label: 'Steamboat — Fulton Clermont 1807' },
                ],
              },
            ],
          },
          {
            label: 'Textiles',
            children: [
              {
                label: 'Mechanization',
                children: [
                  { label: 'Spinning jenny — Hargreaves 1764' },
                  { label: 'Water frame — Arkwright 1769' },
                  { label: 'Spinning mule — Crompton 1779' },
                  { label: 'Power loom — Cartwright 1785' },
                ],
              },
              {
                label: 'Cotton and factory',
                children: [
                  { label: 'Cotton gin — Eli Whitney 1794' },
                  { label: 'Cromford mill — first factory, 1771' },
                  { label: 'Manchester as Cottonopolis' },
                ],
              },
            ],
          },
          {
            label: 'Iron, Coal, and Transport',
            children: [
              {
                label: 'Iron production',
                children: [
                  { label: 'Abraham Darby — coke smelting 1709' },
                  { label: 'Henry Cort puddling process 1784' },
                  { label: 'Bessemer steel process 1856 (late era)' },
                ],
              },
              {
                label: 'Transport infrastructure',
                children: [
                  { label: 'Bridgewater Canal 1761' },
                  { label: 'Turnpike trusts; macadamized roads' },
                  { label: 'Liverpool–Manchester railway 1830' },
                ],
              },
            ],
          },
          {
            label: 'Innovation Institutions',
            children: [
              {
                label: 'Informal networks',
                children: [
                  { label: 'Lunar Society of Birmingham — Boulton, Watt, Wedgwood, Darwin' },
                  { label: 'British patent system strengthened post-1624' },
                ],
              },
              {
                label: 'Industrial pioneers',
                children: [
                  { label: 'Josiah Wedgwood — pottery and division of labor' },
                  { label: 'Richard Arkwright — factory system' },
                  { label: 'Matthew Boulton — Soho, mass production' },
                ],
              },
            ],
          },
        ],
      },

      // --- Branch 3: Second Industrial Revolution -------
      {
        label: 'Second Industrial Revolution, 1870–1914',
        children: [
          {
            label: 'Electricity',
            children: [
              {
                label: 'Foundational science',
                children: [
                  { label: 'Faraday electromagnetic induction 1831' },
                  { label: 'Maxwell equations 1865' },
                ],
              },
              {
                label: 'Thomas Edison',
                children: [
                  { label: 'Menlo Park lab 1876 — first industrial R&D' },
                  { label: 'Phonograph 1877' },
                  { label: 'Incandescent bulb Oct 1879' },
                  { label: 'Pearl Street Station 1882 — first power grid' },
                ],
              },
              {
                label: 'Tesla and AC',
                children: [
                  { label: 'Nikola Tesla — polyphase AC induction motor' },
                  { label: 'Westinghouse AC system' },
                  { label: 'War of Currents AC vs DC late 1880s' },
                  { label: 'Niagara Falls AC power 1895' },
                ],
              },
            ],
          },
          {
            label: 'Internal Combustion and Automotive',
            children: [
              {
                label: 'Engine development',
                children: [
                  { label: 'Otto 4-stroke engine 1876' },
                  { label: 'Daimler high-speed engine 1885' },
                  { label: 'Benz Patent-Motorwagen 1885' },
                  { label: 'Diesel engine 1893' },
                ],
              },
              {
                label: 'Mass automotive',
                children: [
                  { label: 'Ford Model T 1908' },
                  { label: 'Moving assembly line 1913 — 93 min to build' },
                  { label: 'Model T price $850 → $260 by 1925' },
                ],
              },
            ],
          },
          {
            label: 'Chemistry and Communication',
            children: [
              {
                label: 'Chemical industry',
                children: [
                  { label: 'Haber–Bosch nitrogen fixation 1909' },
                  { label: 'German dyestuffs industry — BASF, Hoechst, Bayer' },
                  { label: 'Aspirin — Bayer 1897' },
                  { label: 'Solvay process for soda ash 1861' },
                ],
              },
              {
                label: 'Communication',
                children: [
                  { label: 'Telephone — Bell 1876' },
                  { label: 'Wireless telegraphy — Marconi 1895' },
                  { label: 'Transatlantic wireless 1901' },
                  { label: 'Audion triode — de Forest 1906' },
                ],
              },
            ],
          },
          {
            label: 'Organizational Innovation',
            children: [
              {
                label: 'Scientific management',
                children: [
                  { label: 'Frederick Winslow Taylor — Principles 1911' },
                  { label: 'Time-motion studies — Gilbreths' },
                ],
              },
              {
                label: 'Fordism and mass production',
                children: [
                  { label: 'Ford Highland Park 1913' },
                  { label: 'Five-dollar day 1914' },
                  { label: 'Standardization + interchangeable parts' },
                ],
              },
              {
                label: 'Industrial research labs',
                children: [
                  { label: 'GE Research Lab 1900 — Willis Whitney' },
                  { label: 'Bell Labs 1925 (evolved from AT&T)' },
                  { label: 'DuPont central research 1902' },
                ],
              },
            ],
          },
        ],
      },

      // --- Branch 4: 20th C. Science & Engineering ------
      {
        label: '20th-Century Science and Engineering, 1914–1970',
        children: [
          {
            label: 'Physics Revolution',
            children: [
              {
                label: 'Relativity',
                children: [
                  { label: 'Einstein special relativity 1905' },
                  { label: 'General relativity 1915' },
                  { label: 'Eddington eclipse confirmation 1919' },
                ],
              },
              {
                label: 'Quantum mechanics',
                children: [
                  { label: 'Planck quanta 1900; Bohr atom 1913' },
                  { label: 'Heisenberg, Schrödinger, Dirac 1925–28' },
                  { label: 'Copenhagen interpretation' },
                ],
              },
              {
                label: 'Nuclear physics',
                children: [
                  { label: 'Chadwick neutron 1932' },
                  { label: 'Fission — Hahn, Meitner 1938' },
                  { label: 'Manhattan Project 1942–45' },
                ],
              },
            ],
          },
          {
            label: 'Computing Origins',
            children: [
              {
                label: 'Theoretical foundations',
                children: [
                  { label: 'Turing — On Computable Numbers 1936' },
                  { label: 'Shannon information theory 1948' },
                  { label: 'Von Neumann architecture 1945' },
                ],
              },
              {
                label: 'Early machines',
                children: [
                  { label: 'Zuse Z3 1941' },
                  { label: 'Colossus — Bletchley Park 1943' },
                  { label: 'ENIAC 1946; UNIVAC I 1951' },
                ],
              },
              {
                label: 'Transistor and ICs',
                children: [
                  { label: 'Bardeen, Brattain, Shockley transistor 1947' },
                  { label: 'Noyce / Kilby integrated circuit 1958–59' },
                  { label: 'IBM System/360 announced 1964' },
                ],
              },
            ],
          },
          {
            label: 'Biology and Medicine',
            children: [
              {
                label: 'Antibiotics',
                children: [
                  { label: 'Fleming penicillin 1928' },
                  { label: 'Mass production WWII' },
                  { label: 'Streptomycin — Waksman 1944' },
                ],
              },
              {
                label: 'Molecular biology',
                children: [
                  { label: 'DNA double helix — Watson, Crick, Franklin 1953' },
                  { label: 'Genetic code cracked 1966' },
                  { label: 'Recombinant DNA — Boyer, Cohen 1973' },
                ],
              },
              {
                label: 'Public health technology',
                children: [
                  { label: 'Salk polio vaccine 1955' },
                  { label: 'Green Revolution — Borlaug 1960s' },
                  { label: 'Heart transplant — Barnard 1967' },
                ],
              },
            ],
          },
          {
            label: 'Aerospace and the Cold War Push',
            children: [
              {
                label: 'Aviation',
                children: [
                  { label: 'Wright brothers first flight Dec 17, 1903' },
                  { label: 'Jet engine — Whittle 1930, von Ohain 1939' },
                  { label: 'Sound barrier — Yeager 1947' },
                ],
              },
              {
                label: 'Space',
                children: [
                  { label: 'Sputnik — Oct 4, 1957' },
                  { label: 'Yuri Gagarin first human in space, April 12, 1961' },
                  { label: 'Apollo 11 Moon landing, July 20, 1969' },
                ],
              },
              {
                label: 'R&D institutions',
                children: [
                  { label: 'RAND Corporation 1948' },
                  { label: 'DARPA founded 1958 as ARPA' },
                  { label: 'NASA 1958 (evolved from NACA)' },
                ],
              },
            ],
          },
        ],
      },

      // --- Branch 5: Information Age --------------------
      {
        label: 'Information Age, 1970–2010',
        children: [
          {
            label: 'Microelectronics and PCs',
            children: [
              {
                label: "Moore's Law era",
                children: [
                  { label: "Moore's 1965 paper projecting transistor scaling" },
                  { label: 'Intel 4004 Nov 1971' },
                  { label: 'Intel 8086 1978 → x86 dominance' },
                ],
              },
              {
                label: 'Personal computers',
                children: [
                  { label: 'Homebrew Computer Club March 1975' },
                  { label: 'Apple II 1977; IBM PC 1981' },
                  { label: 'Macintosh GUI 1984' },
                  { label: 'Windows 95 GUI goes mainstream' },
                ],
              },
              {
                label: 'Software foundations',
                children: [
                  { label: 'UNIX — Bell Labs 1969' },
                  { label: 'Microsoft founded 1975' },
                  { label: 'Open source: GNU 1983, Linux 1991' },
                ],
              },
            ],
          },
          {
            label: 'Internet and Web',
            children: [
              {
                label: 'Early networks',
                children: [
                  { label: 'ARPANET first message Oct 29, 1969' },
                  { label: 'TCP/IP — Cerf and Kahn 1974' },
                  { label: 'Ethernet — Metcalfe 1973' },
                ],
              },
              {
                label: 'World Wide Web',
                children: [
                  { label: 'Tim Berners-Lee CERN proposal 1989' },
                  { label: 'First website Dec 1990' },
                  { label: 'Mosaic 1993; Netscape 1994' },
                ],
              },
              {
                label: 'Commercial web',
                children: [
                  { label: 'Amazon 1994; eBay 1995' },
                  { label: 'Google founded 1998; PageRank' },
                  { label: 'Dot-com bubble and crash 2000' },
                ],
              },
            ],
          },
          {
            label: 'Mobile and Wireless',
            children: [
              {
                label: 'Cellular networks',
                children: [
                  { label: '1G analog 1980s; 2G GSM 1991' },
                  { label: '3G 2001; 4G LTE 2009' },
                ],
              },
              {
                label: 'Smartphone era',
                children: [
                  { label: 'BlackBerry late 1990s–2000s' },
                  { label: 'iPhone Jan 9, 2007' },
                  { label: 'Android Open Handset Alliance Nov 2007' },
                ],
              },
            ],
          },
          {
            label: 'Biotech Industrialization',
            children: [
              {
                label: 'Genomics',
                children: [
                  { label: 'PCR — Kary Mullis 1983' },
                  { label: 'Human Genome Project 1990–2003' },
                  { label: 'Next-gen sequencing — Illumina 2006' },
                ],
              },
              {
                label: 'Biotech industry',
                children: [
                  { label: 'Genentech founded 1976' },
                  { label: 'First recombinant insulin — Humulin 1982' },
                  { label: 'Monoclonal antibody drugs' },
                ],
              },
            ],
          },
        ],
      },

      // --- Branch 6: Contemporary Era -------------------
      {
        label: 'Contemporary Era, 2010–2026',
        children: [
          {
            label: 'Artificial Intelligence',
            children: [
              {
                label: 'Deep learning breakthrough',
                children: [
                  { label: 'AlexNet Sept 2012 (Krizhevsky, Sutskever, Hinton)' },
                  { label: 'AlphaGo defeats Lee Sedol March 2016' },
                  { label: 'Transformer paper — Vaswani et al. 2017' },
                ],
              },
              {
                label: 'Generative AI',
                children: [
                  { label: 'GPT-3 June 2020; ChatGPT Nov 2022' },
                  { label: 'Claude — Anthropic 2023' },
                  { label: 'GPT-4 March 2023; GPT-5 2025' },
                  { label: 'DALL-E, Midjourney, Stable Diffusion 2022' },
                ],
              },
              {
                label: 'AI-native development',
                children: [
                  { label: 'Copilot — GitHub + OpenAI 2021' },
                  { label: 'Cursor 2023; Claude Code May 2025' },
                  { label: 'Model Context Protocol — Anthropic Nov 2024' },
                ],
              },
            ],
          },
          {
            label: 'Biotechnology Breakthroughs',
            children: [
              {
                label: 'CRISPR and gene editing',
                children: [
                  { label: 'Doudna, Charpentier CRISPR-Cas9 2012' },
                  { label: 'Nobel Prize 2020' },
                  { label: 'Casgevy approved Dec 2023 — first CRISPR therapy' },
                ],
              },
              {
                label: 'mRNA and vaccines',
                children: [
                  { label: 'Karikó, Weissman mRNA foundational work' },
                  { label: 'COVID-19 vaccines — Pfizer/BioNTech, Moderna 2020' },
                  { label: 'Nobel Prize 2023' },
                ],
              },
              {
                label: 'Longevity and drug discovery',
                children: [
                  { label: 'AlphaFold — DeepMind 2018, 2020' },
                  { label: 'Altos Labs $3B launch 2022' },
                  { label: 'GLP-1 class — Ozempic, Wegovy, Mounjaro mainstream 2023' },
                ],
              },
            ],
          },
          {
            label: 'Space and Energy',
            children: [
              {
                label: 'Commercial space',
                children: [
                  { label: 'SpaceX Falcon 9 first reuse March 2017' },
                  { label: 'Starlink constellation — first launch May 2019' },
                  { label: 'Starship test flights 2023–25' },
                ],
              },
              {
                label: 'Energy transition',
                children: [
                  { label: 'Solar PV cost down ~90% 2010–2020' },
                  { label: 'Tesla Model S 2012; Model 3 2017' },
                  { label: 'IRA passed Aug 2022; $370B climate spend' },
                  { label: 'Commonwealth Fusion Systems targeting net gain late 2020s' },
                ],
              },
            ],
          },
          {
            label: 'Quantum and Advanced Computing',
            children: [
              {
                label: 'Quantum milestones',
                children: [
                  { label: 'Google Sycamore "quantum supremacy" Oct 2019' },
                  { label: 'IBM 127-qubit Eagle 2021' },
                  { label: 'Google Willow chip Dec 2024 — error correction threshold' },
                ],
              },
              {
                label: 'Chips arms race',
                children: [
                  { label: 'NVIDIA H100 2022; Blackwell B200 2024' },
                  { label: 'CHIPS Act — Aug 2022 $52B' },
                  { label: 'TSMC Arizona fab 2024' },
                ],
              },
            ],
          },
        ],
      },

      // --- Branch 7: Patterns and Theories --------------
      {
        label: 'Patterns and Theories of Innovation',
        children: [
          {
            label: 'Long-Cycle and Wave Theories',
            children: [
              {
                label: 'Kondratieff waves',
                children: [
                  { label: 'Nikolai Kondratieff — 40–60 year cycles 1925' },
                  { label: 'K-wave mapping to industrial revolutions' },
                ],
              },
              {
                label: 'Schumpeterian creative destruction',
                children: [
                  { label: 'Joseph Schumpeter — Theory of Economic Development 1911' },
                  { label: 'Capitalism, Socialism and Democracy 1942' },
                  { label: 'Entrepreneur as innovator' },
                ],
              },
              {
                label: 'Perez technological revolutions',
                children: [
                  { label: 'Carlota Perez — Technological Revolutions and Financial Capital 2002' },
                  { label: 'Installation vs deployment phases' },
                ],
              },
            ],
          },
          {
            label: 'Diffusion and Adoption',
            children: [
              {
                label: 'Diffusion of innovations',
                children: [
                  { label: 'Everett Rogers — 1962 book' },
                  { label: 'Innovators, Early Adopters, Early/Late Majority, Laggards' },
                ],
              },
              {
                label: 'Crossing the chasm',
                children: [
                  { label: 'Geoffrey Moore — 1991 book' },
                  { label: 'Chasm between early adopters and mainstream' },
                ],
              },
              {
                label: 'Network effects',
                children: [
                  { label: "Metcalfe's Law — network value n²" },
                  { label: 'Reed on group-forming networks' },
                ],
              },
            ],
          },
          {
            label: 'Disruption and S-curves',
            children: [
              {
                label: 'Disruptive innovation',
                children: [
                  { label: "Clayton Christensen — Innovator's Dilemma 1997" },
                  { label: 'Low-end and new-market disruption' },
                  { label: 'Jobs-to-be-done framework' },
                ],
              },
              {
                label: 'Technology S-curves',
                children: [
                  { label: 'Richard Foster — Innovation: The Attacker\'s Advantage 1986' },
                  { label: 'Paradigm discontinuities' },
                ],
              },
              {
                label: 'Innovator\'s dilemmas',
                children: [
                  { label: 'Core vs context; resource-allocation bias' },
                  { label: 'Sustaining vs disruptive trajectories' },
                ],
              },
            ],
          },
          {
            label: 'Systems, Ecosystems, and Combinatorics',
            children: [
              {
                label: 'National and regional systems',
                children: [
                  { label: 'Freeman — National Systems of Innovation 1987' },
                  { label: 'Porter — Competitive Advantage of Nations 1990' },
                  { label: 'Silicon Valley as ecosystem (Saxenian 1994)' },
                ],
              },
              {
                label: 'Open and user innovation',
                children: [
                  { label: 'Henry Chesbrough — Open Innovation 2003' },
                  { label: 'Eric von Hippel — Democratizing Innovation 2005' },
                ],
              },
              {
                label: 'Combinatorial innovation',
                children: [
                  { label: 'W. Brian Arthur — The Nature of Technology 2009' },
                  { label: 'Technology as recombination of prior parts' },
                  { label: 'Hal Varian — "combinatorial innovation" coinage' },
                ],
              },
              {
                label: 'Institutional economics',
                children: [
                  { label: 'Douglass North — institutions as innovation substrate' },
                  { label: "Mariana Mazzucato — The Entrepreneurial State 2013" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};
