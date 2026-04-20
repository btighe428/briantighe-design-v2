import type { MapData } from './types';

export const map: MapData = {
  slug: 'ux-design',
  title: 'Contemporary Topics in User Experience Design',
  subtitle: 'A mind map of the field — principles, methods, tools, trends, challenges, directions',
  date: '2024-06-01',
  description:
    'A structured mind map of contemporary UX design: the six branches the field currently organizes around, and the sub-branches under each. Part of the Mind Maps series on Contemporary Topics in Innovation.',
  branchColors: [
    '#b23b3b', // UX Design Principles — red
    '#e08935', // UX Research Methods — orange
    '#d4a92a', // UX Design Tools and Technologies — yellow
    '#47a669', // Emerging Trends in UX Design — green
    '#3a9baa', // UX Design Challenges — teal
    '#4a6ba8', // Future Directions in UX Design — blue
  ],
  root: {
    label: 'Contemporary Topics in User Experience Design',
    children: [
      {
        label: 'UX Design Principles',
        children: [
          {
            label: 'User-Centered Design',
            children: [
              {
                label: 'Understanding User Needs',
                children: [
                  { label: 'User Research' },
                  { label: 'Personas' },
                  { label: 'User Journeys' },
                ],
              },
              {
                label: 'Design Thinking',
                children: [
                  { label: 'Empathy' },
                  { label: 'Ideation' },
                  { label: 'Prototyping and Testing' },
                ],
              },
            ],
          },
          {
            label: 'Accessibility and Inclusivity',
            children: [
              {
                label: 'Design for All',
                children: [
                  { label: 'Accessible Design Principles' },
                  { label: 'Inclusive Research and Testing' },
                ],
              },
              {
                label: 'Cultural Sensitivity in Design',
                children: [
                  { label: 'Global User Base' },
                  { label: 'Localization and Internationalization' },
                ],
              },
            ],
          },
          {
            label: 'Responsive and Adaptive Design',
            children: [
              {
                label: 'Cross-Platform Consistency',
                children: [
                  { label: 'Mobile, Tablet, and Desktop' },
                  { label: 'Adaptive Layouts' },
                ],
              },
              {
                label: 'Emerging Device Formats',
                children: [{ label: 'Wearables' }, { label: 'Smart Home Devices' }],
              },
            ],
          },
        ],
      },
      {
        label: 'UX Research Methods',
        children: [
          {
            label: 'Qualitative Research',
            children: [
              {
                label: 'Interviews and Focus Groups',
                children: [{ label: 'Focus Group Discussions' }],
              },
              { label: 'Ethnographic Studies', children: [{ label: 'Contextual Inquiry' }] },
            ],
          },
          {
            label: 'Quantitative Research',
            children: [
              {
                label: 'Surveys and Questionnaires',
                children: [{ label: 'Online Surveys' }, { label: 'User Feedback Forms' }],
              },
              {
                label: 'Usage Data Analysis',
                children: [{ label: 'Analytics and Metrics' }, { label: 'A/B Testing' }],
              },
            ],
          },
          {
            label: 'Usability Testing',
            children: [
              {
                label: 'Lab-Based Testing',
                children: [{ label: 'Controlled Environment' }, { label: 'Task Analysis' }],
              },
              {
                label: 'Remote Usability Testing',
                children: [{ label: 'Online Testing Tools' }, { label: 'Unmoderated Testing' }],
              },
            ],
          },
        ],
      },
      {
        label: 'UX Design Tools and Technologies',
        children: [
          {
            label: 'Design and Prototyping Tools',
            children: [
              {
                label: 'Sketch',
                children: [{ label: 'Prototyping Features' }, { label: 'Collaborative Design' }],
              },
              { label: 'Adobe XD', children: [{ label: 'Integration with Adobe Suite' }] },
              {
                label: 'Figma',
                children: [
                  { label: 'Real-Time Collaboration' },
                  { label: 'Design Systems and Libraries' },
                ],
              },
            ],
          },
          {
            label: 'User Testing Software',
            children: [
              {
                label: 'UsabilityHub',
                children: [{ label: 'Click Testing' }, { label: 'Design Feedback' }],
              },
              {
                label: 'Lookback',
                children: [{ label: 'Live User Interviews' }, { label: 'Session Recording' }],
              },
            ],
          },
          {
            label: 'Analytics and Feedback Tools',
            children: [
              {
                label: 'Google Analytics',
                children: [
                  { label: 'User Behavior Tracking' },
                  { label: 'Conversion Rate Optimization' },
                ],
              },
              {
                label: 'Hotjar',
                children: [{ label: 'Heatmaps' }, { label: 'User Session Recordings' }],
              },
            ],
          },
        ],
      },
      {
        label: 'Emerging Trends in UX Design',
        children: [
          {
            label: 'Voice User Interfaces (VUI)',
            children: [
              {
                label: 'Voice Assistants and Smart Speakers',
                children: [{ label: 'Amazon Alexa' }, { label: 'Google Assistant' }],
              },
              {
                label: 'Designing for Voice Interactions',
                children: [{ label: 'Conversation Design' }, { label: 'Voice Prototyping' }],
              },
            ],
          },
          {
            label: 'Augmented Reality (AR) and Virtual Reality (VR)',
            children: [
              {
                label: 'AR in Retail and E-commerce',
                children: [{ label: 'Virtual Try-On' }, { label: 'Interactive Product Demos' }],
              },
              {
                label: 'VR for Immersive Experiences',
                children: [
                  { label: 'Gaming and Entertainment' },
                  { label: 'Educational Applications' },
                ],
              },
            ],
          },
          {
            label: 'Artificial Intelligence in UX',
            children: [
              {
                label: 'Predictive User Experiences',
                children: [
                  { label: 'Machine Learning Algorithms' },
                  { label: 'Personalization and Recommendations' },
                ],
              },
              {
                label: 'AI-Driven Analytics and Insights',
                children: [
                  { label: 'User Behavior Prediction' },
                  { label: 'Automated Usability Testing' },
                ],
              },
            ],
          },
        ],
      },
      {
        label: 'UX Design Challenges',
        children: [
          {
            label: 'Balancing User Needs and Business Goals',
            children: [
              {
                label: 'Stakeholder Alignment',
                children: [
                  { label: 'Managing Expectations' },
                  { label: 'Communicating User Insights' },
                ],
              },
              {
                label: 'Design and ROI',
                children: [{ label: 'Measuring UX Impact' }, { label: 'Cost-Benefit Analysis' }],
              },
            ],
          },
          {
            label: 'Keeping Up with Rapid Technological Changes',
            children: [
              {
                label: 'Continuous Learning',
                children: [
                  { label: 'Staying Updated with Trends' },
                  { label: 'Skill Development' },
                ],
              },
              {
                label: 'Adapting to New Platforms and Devices',
                children: [
                  { label: 'Cross-Platform Design Challenges' },
                  { label: 'Emerging Technologies' },
                ],
              },
            ],
          },
          {
            label: 'Privacy and Ethical Considerations',
            children: [
              {
                label: 'Data Privacy and Security',
                children: [
                  { label: 'User Data Protection' },
                  { label: 'Ethical Design Practices' },
                ],
              },
              {
                label: 'Inclusive Design Ethics',
                children: [
                  { label: 'Avoiding Bias' },
                  { label: 'Designing for Diverse User Groups' },
                ],
              },
            ],
          },
        ],
      },
      {
        label: 'Future Directions in UX Design',
        children: [
          {
            label: 'Personalization and Customization',
            children: [
              {
                label: 'Adaptive User Experiences',
                children: [
                  { label: 'Context-Aware Interfaces' },
                  { label: 'User Preference Learning' },
                ],
              },
              {
                label: 'Customizable User Interfaces',
                children: [
                  { label: 'Modular Design Elements' },
                  { label: 'User-Controlled Customization' },
                ],
              },
            ],
          },
          {
            label: 'Integration of UX with Other Disciplines',
            children: [
              {
                label: 'UX and Product Management',
                children: [
                  { label: 'Collaborative Product Strategy' },
                  { label: 'User-Centric Development' },
                ],
              },
              {
                label: 'UX and Marketing',
                children: [
                  { label: 'Brand Experience Design' },
                  { label: 'User Journey Mapping' },
                ],
              },
            ],
          },
          {
            label: 'Advancements in UX Measurement',
            children: [
              {
                label: 'Quantifying User Experience',
                children: [
                  { label: 'UX Metrics and KPIs' },
                  { label: 'Experience Scoring Systems' },
                ],
              },
              {
                label: 'Evolution of UX Research Methods',
                children: [
                  { label: 'Automated User Research' },
                  { label: 'Advanced User Testing Techniques' },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};
