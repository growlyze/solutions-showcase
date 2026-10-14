// Edit this file to add/remove case studies or categories. One case study can carry multiple tags.

// `logoFile`: official icon-only mark shipped locally in public/logos/ — either provided
//   directly by the user, or downloaded from the vendor's own site/CDN, or (Power BI) from
//   Microsoft's official PowerBI-Icons repo. See README for the exact source of each file.
// `fill: true`: the image already has its own solid background baked in (a filled square/
//   rounded tile), so it's rendered edge-to-edge with no extra badge background behind it.
//   Omit `fill` for transparent icon-only files (WhatsApp, Power BI) — those get a white
//   backing tile so the glyph itself doesn't disappear into the dark theme.
// `logo`: slug from simpleicons.org, used only where no official icon-only file was available.
// `tint`: accent color group for the icon background — only visible on categories with no
//   logo file (plain emoji), since a logo image fully covers the tile either way. Used to give
//   related categories (AI agents, PM tools, reporting) their own recognizable color at a glance.
// `group`: which labeled section this category sits under on the home page (see GROUPS
//   below).
// If a logo fails to load, app.js falls back to `icon` (emoji) so the UI never breaks.
const CATEGORIES = [
  { slug: 'custom-saas', icon: '☁️', tint: 'indigo', group: 'saas', name: 'Custom SaaS Platforms', description: 'Full, ready-to-run software products built from scratch around one business’s exact workflow — not just an automation, a whole system.' },
  { slug: 'n8n', icon: '🔗', logoFile: 'logos/n8n.png', fill: true, group: 'automation', name: 'n8n Automations', description: 'Behind-the-scenes workflows that connect your apps and AI models so work moves on its own, no manual steps.' },
  { slug: 'zapier', icon: '⚡', logoFile: 'logos/zapier.png', fill: true, group: 'automation', name: 'Zapier Automations', description: 'Quick, no-code automations that connect your everyday apps so one action triggers the next automatically.' },
  { slug: 'make', icon: '⚡', logoFile: 'logos/make.jpg', fill: true, group: 'automation', name: 'Make Automations', description: 'Visual, no-code workflows in Make.com that move data between your apps without writing any code.' },
  { slug: 'google-apps-script', icon: '📜', logo: 'googleappsscript', group: 'automation', name: 'Google Apps Script', description: 'Custom scripts that connect Gmail, Sheets, Drive, and Docs directly — automation built right into Google Workspace.' },
  { slug: 'python', icon: '🐍', logo: 'python', group: 'automation', name: 'Python Automation', description: 'Custom Python pipelines and services for teams whose integrations need more than a no-code platform can offer.' },
  { slug: 'ai-agents', icon: '🤖', tint: 'violet', group: 'ai', name: 'AI Agents', description: 'General-purpose AI agents you can point at almost any repetitive task to take it off your plate.' },
  { slug: 'ai-whatsapp', icon: '💬', logoFile: 'logos/whatsapp.svg', group: 'ai', name: 'AI Agents for WhatsApp', description: 'AI that chats with customers directly on WhatsApp — answering questions and taking orders automatically.' },
  { slug: 'ecommerce-agents', icon: '🛒', tint: 'orange', group: 'ai', name: 'AI Agents for Ecommerce', description: 'AI built specifically for online stores — automating customer chats, order updates, and daily operations.' },
  { slug: 'clickup', icon: '✅', logoFile: 'logos/clickup.webp', fill: true, group: 'pm', name: 'ClickUp Setups', description: 'Ready-to-use ClickUp workspaces for running projects, teams, and day-to-day operations in one place.' },
  { slug: 'monday', icon: '📅', logoFile: 'logos/monday.png', fill: true, group: 'pm', name: 'Monday.com Setups', description: 'Ready-to-use Monday.com boards for tracking projects and keeping teams aligned on what’s next.' },
  { slug: 'airtable', icon: '🗂️', logoFile: 'logos/airtable.png', fill: true, group: 'pm', name: 'Airtable', description: 'Custom Airtable databases for organizing your data and day-to-day operations without the spreadsheet mess.' },
  { slug: 'power-bi', icon: '📊', logoFile: 'logos/power-bi.svg', group: 'reporting', name: 'Power BI', description: 'Power BI dashboards that turn raw numbers into clear visual reports anyone on the team can read.' },
  { slug: 'looker-studio', icon: '📈', logoFile: 'logos/looker-studio.png', fill: true, group: 'reporting', name: 'Looker Studio', description: 'Looker Studio dashboards that turn raw numbers into clear visual reports anyone on the team can read.' },
  { slug: 'dashboards', icon: '🖥️', tint: 'blue', group: 'reporting', name: 'Dashboards & Reporting', description: 'Live dashboards that pull numbers from every tool you use into one place, updated automatically.' },
];

// Section order and labels for the home page grid.
const GROUPS = [
  { key: 'saas', title: 'Custom SaaS Platforms' },
  { key: 'automation', title: 'Automation Platforms' },
  { key: 'ai', title: 'AI Agents' },
  { key: 'pm', title: 'Project & Ops Management' },
  { key: 'reporting', title: 'Reporting & Dashboards' },
];

const CASE_STUDIES = [
  {
    id: 'meinburomeister',
    title: 'AI-Powered Construction Report SaaS (MeinBüromeister)',
    description: 'Turning construction-site voice notes, photos, and messages into structured reports through an automated AI-powered backend for German trade companies.',
    source: 'Notion',
    url: 'https://hip-buttercup-705.notion.site/MeinB-romeister-AI-Powered-W-A-Construction-Report-SaaS-365b33f9293f809a9b4cf680e2d6eccd',
    tags: [
      'custom-saas'
    ],
    content: [
      {
        type: 'eyebrow',
        text: 'Overview'
      },
      {
        type: 'p',
        text: 'MeinBüromeister is a B2B SaaS platform for German construction and trade companies. It allows workers to submit job updates through WhatsApp instead of preparing every report manually. The backend organizes incoming information, generates structured reports, and asks workers to review them before submission.'
      },
      {
        type: 'subheading',
        text: 'The Business Problem'
      },
      {
        type: 'p',
        text: 'Construction workers often send separate voice notes, photos, and text corrections from job sites. Office staff must identify the correct customer and project, organize materials and working hours, and format the information into professional reports. This creates repetitive administrative work and makes report preparation more time-consuming. The goal was to reduce this manual effort while keeping workers involved in reviewing and approving their reports.'
      },
      {
        type: 'subheading',
        text: 'The Solution'
      },
      {
        type: 'p',
        text: 'An n8n-based backend receives WhatsApp messages and groups related inputs into a single session. OpenAI Whisper transcribes voice recordings, while Claude AI extracts relevant report information into structured data. After the worker reviews and approves the report, the backend stores it in Supabase for delivery to the office dashboard. Supporting workflows automate customer onboarding, subscription management, team access, and error handling.'
      },
      {
        type: 'subheading',
        text: 'Project Snapshot'
      },
      {
        type: 'p',
        text: 'A production backend connecting WhatsApp messaging, AI-powered report extraction, worker approval, report storage, customer onboarding, and subscription lifecycle management.'
      },
      {
        type: 'eyebrow',
        text: 'How the System Works'
      },
      {
        type: 'subheading',
        text: 'System Architecture'
      },
      {
        type: 'p',
        text: 'The backend is organized around an n8n automation layer that sits between WhatsApp, the AI services used for transcription and extraction, and the Supabase/Stripe infrastructure that powers the office dashboard.'
      },
      {
        type: 'subheading',
        text: 'Supporting Integrations'
      },
      {
        type: 'list',
        items: [
          'Stripe: Checkout, subscription lifecycle events, plan changes, and subscription-based access rules.',
          'Supabase Auth: Authentication support for the application.',
          'Supabase Storage: Storage for uploaded photos and other media.',
          'Docker: Supports the self-hosted deployment environment.'
        ]
      },
      {
        type: 'eyebrow',
        text: 'Core Automation Workflows'
      },
      {
        type: 'p',
        text: 'The backend is built around interconnected n8n workflows that automate WhatsApp message handling, AI-powered report generation, customer onboarding, and subscription management. Each workflow handles a specific responsibility and integrates with the relevant APIs and backend services to support the complete reporting lifecycle. Some main automation workflows are shown below.'
      },
      {
        type: 'subheading',
        text: '1. Core Onboarding & Workflow Management'
      },
      {
        type: 'p',
        text: 'This workflow handles company onboarding, setup-code verification, worker registration, subscription checks, report approval, project management, and notifications through interconnected n8n automation nodes.'
      },
      {
        type: 'img',
        file: 'case-content/meinburomeister/image1.png',
        caption: 'Core onboarding and workflow management — company setup, worker registration, subscription checks, report approval, project handling, and notifications across 15 interconnected automation groups.'
      },
      {
        type: 'subheading',
        text: '2. AI-Powered Report Processing Workflow'
      },
      {
        type: 'p',
        text: 'This workflow processes WhatsApp messages using Whisper and Claude AI to extract structured report data, enrich customer and project details, validate reports, and handle database updates and notifications.'
      },
      {
        type: 'img',
        file: 'case-content/meinburomeister/image2.png',
        caption: 'AI-powered report processing — message intake, voice transcription, Claude-based data extraction, report generation, and save/notification handling.'
      },
      {
        type: 'eyebrow',
        text: 'Product Experience'
      },
      {
        type: 'subheading',
        text: 'Report inbox'
      },
      {
        type: 'img',
        file: 'case-content/meinburomeister/image3.png',
        caption: 'The office inbox organizes incoming reports by date, technician, customer/project, category, and status.'
      },
      {
        type: 'subheading',
        text: 'Customers and projects'
      },
      {
        type: 'img',
        file: 'case-content/meinburomeister/image4.png',
        caption: 'The project view groups customers and highlights open-report counts and recent work.'
      },
      {
        type: 'subheading',
        text: 'WhatsApp work history'
      },
      {
        type: 'img',
        file: 'case-content/meinburomeister/image5.png',
        caption: 'Workers review and approve each AI-generated report directly in WhatsApp before it goes to the office.'
      },
      {
        type: 'stats',
        items: [
          {
            value: '<30s',
            label: 'Voice note to structured report'
          }
        ]
      },
      {
        type: 'img',
        file: 'case-content/meinburomeister/image6.png',
        caption: 'Once approved, the report is saved, confirmed back to the worker on WhatsApp, and delivered to the office as a PDF.'
      },
      {
        type: 'eyebrow',
        text: 'Core Backend Capabilities'
      },
      {
        type: 'list',
        items: [
          'AI Report Extraction: Supports four report categories — Rapport, Aufmaß, Neues Angebot, and Notiz. The AI extracts work descriptions, materials, dimensions, and working hours while using prompt guardrails to reduce invented details.',
          'Multi-Input Session Handling: Groups related voice notes, photos, captions, and corrections into a single processing session instead of treating every incoming message as a separate report.',
          'Project Matching and Clarification: Uses available employee and project records to associate reports with the correct destination. When a match is ambiguous, the workflow can request clarification.',
          'Onboarding and Access Management: Supports company setup, worker invitations, registration tracking, and access checks to ensure incoming messages are routed correctly.',
          'Subscription Lifecycle Management: Handles relevant Stripe events and subscription states, including active, canceling, and canceled subscriptions. It also manages plan mapping and seat limits.',
          'Failure Handling and Validation: Validates incoming data and AI-generated output, handles incomplete sessions and invalid actions, and provides controlled paths for processing failures.'
        ]
      },
      {
        type: 'eyebrow',
        text: 'Results & Metrics'
      },
      {
        type: 'stats',
        items: [
          {
            value: '5',
            label: 'Production workflows'
          },
          {
            value: '5',
            label: 'Testing rounds'
          },
          {
            value: '30+',
            label: 'Test scenarios per round'
          },
          {
            value: '25+',
            label: 'Bugs found & fixed'
          }
        ]
      },
      {
        type: 'p',
        text: 'The project delivered five production workflows connecting WhatsApp, AI-powered report extraction, Supabase, and Stripe. Across five rounds of end-to-end testing, more than 25 bugs were identified and fixed, with over 30 test scenarios executed per round.'
      },
      {
        type: 'eyebrow',
        text: 'Technical Challenges & Solutions'
      },
      {
        type: 'p',
        text: 'During development and end-to-end testing, several integration and AI reliability issues required targeted solutions.'
      },
      {
        type: 'subheading',
        text: '1. Stripe Subscription Data Handling'
      },
      {
        type: 'label',
        text: 'Challenge'
      },
      {
        type: 'p',
        text: 'The Stripe checkout event did not always contain all the subscription information required by the workflow.'
      },
      {
        type: 'label',
        text: 'Solution'
      },
      {
        type: 'p',
        text: 'Retrieved the complete subscription details directly through the Stripe API before continuing with subscription processing.'
      },
      {
        type: 'label',
        text: 'Outcome'
      },
      {
        type: 'p',
        text: 'Improved the reliability of subscription data handling.'
      },
      {
        type: 'subheading',
        text: '2. Subscription Plan Mapping'
      },
      {
        type: 'label',
        text: 'Challenge'
      },
      {
        type: 'p',
        text: 'Mapping subscription plans based on payment amounts could lead to incorrect plan identification.'
      },
      {
        type: 'label',
        text: 'Solution'
      },
      {
        type: 'p',
        text: 'Used Stripe product IDs to identify plans instead of relying on monetary amounts.'
      },
      {
        type: 'label',
        text: 'Outcome'
      },
      {
        type: 'p',
        text: 'Made plan identification more consistent across subscription events.'
      },
      {
        type: 'subheading',
        text: '3. AI Hallucination Control'
      },
      {
        type: 'label',
        text: 'Challenge'
      },
      {
        type: 'p',
        text: 'Claude AI could occasionally introduce materials or details that were not present in the worker’s input.'
      },
      {
        type: 'label',
        text: 'Solution'
      },
      {
        type: 'p',
        text: 'Refined the AI prompt with guardrails to discourage unsupported details and keep extraction grounded in the supplied information.'
      },
      {
        type: 'label',
        text: 'Outcome'
      },
      {
        type: 'p',
        text: 'Improved the consistency of structured report generation.'
      },
      {
        type: 'subheading',
        text: '4. Supabase PATCH Response Handling'
      },
      {
        type: 'label',
        text: 'Challenge'
      },
      {
        type: 'p',
        text: 'Some Supabase PATCH operations returned empty responses, creating difficulties for downstream workflow nodes.'
      },
      {
        type: 'label',
        text: 'Solution'
      },
      {
        type: 'p',
        text: 'Explicitly referenced upstream node outputs where required instead of relying on the PATCH response to provide all subsequent data.'
      },
      {
        type: 'label',
        text: 'Outcome'
      },
      {
        type: 'p',
        text: 'Made downstream data handling more reliable.'
      },
      {
        type: 'subheading',
        text: '5. End-to-End Integration Testing'
      },
      {
        type: 'label',
        text: 'Challenge'
      },
      {
        type: 'p',
        text: 'The system depended on multiple connected services, including WhatsApp, AI models, Supabase, and Stripe, making integration failures difficult to isolate.'
      },
      {
        type: 'label',
        text: 'Solution'
      },
      {
        type: 'p',
        text: 'Conducted five rounds of end-to-end testing, covering more than 30 scenarios per round, and fixed over 25 identified bugs.'
      },
      {
        type: 'label',
        text: 'Outcome'
      },
      {
        type: 'p',
        text: 'Improved integration reliability across the production workflows.'
      },
      {
        type: 'eyebrow',
        text: 'Key Takeaways & Future Development'
      },
      {
        type: 'subheading',
        text: 'Key Takeaways'
      },
      {
        type: 'list',
        items: [
          'Workflow automation: Built and integrated five production n8n workflows connecting WhatsApp, AI services, Supabase, and Stripe.',
          'AI reliability: Improved structured report extraction through prompt engineering, validation, and guardrails against unsupported details.',
          'Integration engineering: Resolved issues involving Stripe subscription events, plan mapping, and Supabase response handling.',
          'End-to-end testing: Completed five testing rounds, identifying and fixing more than 25 bugs across the integrated system.',
          'Cross-functional collaboration: Coordinated with the frontend engineer on database requirements and data contracts to connect backend workflows with the React dashboard.'
        ]
      },
      {
        type: 'subheading',
        text: 'Closing Summary'
      },
      {
        type: 'p',
        text: 'MeinBüromeister demonstrates how workflow automation, AI-powered information extraction, and integrated SaaS infrastructure can simplify construction reporting. The primary contribution was engineering the backend workflows and integrations that connect field communication with structured reports, subscription management, and the office dashboard.'
      }
    ]
  },
  {
    id: 'ai-agents-ecommerce',
    title: 'AI Agents for Ecommerce Brands',
    description: 'AI agents built for ecommerce brands to automate customer interactions and operations.',
    source: 'Notion',
    url: 'https://bit.ly/42E2n1a',
    tags: [
      'ecommerce-agents',
      'ai-agents'
    ],
    content: [
      {
        type: 'heading',
        text: 'AI-Powered Customer Support Agent'
      },
      {
        type: 'subheading',
        text: 'AI-Powered Ticket Resolution Using SOPs & Product Manuals'
      },
      {
        type: 'subheading',
        text: '1. The Problem: Manual Customer Support Doesn’t Scale'
      },
      {
        type: 'p',
        text: 'Before automation, customer support teams faced daily operational friction:'
      },
      {
        type: 'p',
        text: 'Agents manually read long tickets and threads'
      },
      {
        type: 'label',
        text: 'Switching between'
      },
      {
        type: 'list',
        items: [
          'SOP documents',
          'Product manuals',
          'Order details'
        ]
      },
      {
        type: 'label',
        text: 'Inconsistent decisions for'
      },
      {
        type: 'list',
        items: [
          'Returns',
          'Refunds',
          'Warranty claims',
          'Slow response times during peak volume',
          'Risk of policy mistakes due to human interpretation',
          'Outdated manuals leading to incorrect answers'
        ]
      },
      {
        type: 'label',
        text: 'Resulting Issues'
      },
      {
        type: 'list',
        items: [
          'High manual workload for support agents',
          'Inconsistent, non-standard replies',
          'Longer resolution times',
          'Difficult onboarding for new agents',
          'Poor scalability as ticket volume increased'
        ]
      },
      {
        type: 'p',
        text: 'Core challenge: Teams had the knowledge — but no system to retrieve, apply, and respond consistently at scale.'
      },
      {
        type: 'subheading',
        text: '2. Results After Automation'
      },
      {
        type: 'label',
        text: 'Once the AI support agent was implemented'
      },
      {
        type: 'list',
        items: [
          'Tickets are classified and understood automatically',
          'SOPs and product manuals are applied consistently',
          'Draft responses are generated instantly in the customer’s language',
          'Agents focus only on complex or exceptional cases',
          'Knowledge stays up-to-date automatically'
        ]
      },
      {
        type: 'label',
        text: 'Time & Effort Savings'
      },
      {
        type: 'label',
        text: 'Before'
      },
      {
        type: 'list',
        items: [
          '50–100 routine tickets/day',
          '~2–4 hours/day spent reading manuals and drafting replies'
        ]
      },
      {
        type: 'label',
        text: 'After'
      },
      {
        type: 'list',
        items: [
          'Fully automated',
          'Humantime required = 10–15 minutes'
        ]
      },
      {
        type: 'label',
        text: 'Monthly impact'
      },
      {
        type: 'list',
        items: [
          '~50–60 hours saved per team per month',
          'Equivalent to freeing 1–1.5 full-time support agents'
        ]
      },
      {
        type: 'label',
        text: 'Accuracy & Consistency Gains'
      },
      {
        type: 'list',
        items: [
          '100% rule-based SOP application',
          'Product-specific questions answered accurately',
          'Reduced human error and knowledge drift'
        ]
      },
      {
        type: 'subheading',
        text: '3. The Solution: AI Customer Support Agent'
      },
      {
        type: 'p',
        text: 'This system acts as a virtual senior support agent:'
      },
      {
        type: 'list',
        items: [
          'Reads tickets automatically',
          'Applies SOPs and business rules consistently',
          'Retrieves answers from product manuals or knowledge bases',
          'Drafts accurate, human-ready responses',
          'Keeps knowledge always up-to-date',
          'Escalates only complex or edge-case tickets'
        ]
      },
      {
        type: 'subheading',
        text: '4. How the System Works'
      },
      {
        type: 'subheading',
        text: 'Phase 1: Ticket Intake & Understanding'
      },
      {
        type: 'p',
        text: 'New customer ticket arrives'
      },
      {
        type: 'label',
        text: 'AI'
      },
      {
        type: 'list',
        items: [
          'Reads full conversation',
          'Understands customer intent',
          'Detects language automatically',
          'Identifies if ticket is valid or spam',
          'All tickets are logged temporarily to ensure nothing is lost'
        ]
      },
      {
        type: 'subheading',
        text: 'Phase 2: Smart Ticket Classification'
      },
      {
        type: 'label',
        text: 'Identifies'
      },
      {
        type: 'list',
        items: [
          'Ticket type: Product usage, warranty, return, refund, missing/defective items, order status, payment issues',
          'Relevant details: Order ID, Product SKU, Purchase date, Urgency',
          'Determines which SOP or product manual should be applied'
        ]
      },
      {
        type: 'subheading',
        text: 'Phase 3: SOP-Driven Decision Making'
      },
      {
        type: 'label',
        text: 'Applies company SOPs exactly as written'
      },
      {
        type: 'list',
        items: [
          'Warranty rules',
          'Return eligibility',
          'Refund conditions',
          'Price-based thresholds',
          'Decisions are consistent, never improvised'
        ]
      },
      {
        type: 'subheading',
        text: 'Phase 4: Product Manual Intelligence (RAG)'
      },
      {
        type: 'list',
        items: [
          'Searches latest product manuals for product-specific questions',
          'Understands instructions, specifications, troubleshooting',
          'Provides accurate, up-to-date answers'
        ]
      },
      {
        type: 'subheading',
        text: 'Phase 5: Drafting the Response'
      },
      {
        type: 'label',
        text: 'For every ticket, AI generates'
      },
      {
        type: 'label',
        text: '1️⃣ Customer Reply Draft'
      },
      {
        type: 'list',
        items: [
          'Friendly tone, clear explanation',
          'Written in the customer’s language',
          'Ready to send'
        ]
      },
      {
        type: 'label',
        text: '2️⃣ Internal Support Notes'
      },
      {
        type: 'list',
        items: [
          'Reasoning behind the reply',
          'SOP/manual used',
          'Suggested next steps'
        ]
      },
      {
        type: 'subheading',
        text: 'Phase 6: Continuous Knowledge Updates'
      },
      {
        type: 'list',
        items: [
          'Product manuals monitored and updated automatically',
          'SOPs synchronized',
          'Outdated information removed',
          'Knowledge always current without manual uploads'
        ]
      },
      {
        type: 'subheading',
        text: '5. Business Value'
      },
      {
        type: 'list',
        items: [
          'Massive Reduction in Manual Reading: Agents no longer scan long SOPs/manuals',
          'Consistent Policy Application: Every customer gets rule-based answers',
          'Faster First Responses: Drafts created instantly',
          'Multi-Language Support: Handles multiple languages automatically',
          'Zero Knowledge Drift: Manuals and SOPs stay current',
          'Agent Confidence: Clear internal reasoning supports decisions'
        ]
      },
      {
        type: 'subheading',
        text: '6. Expected Impact'
      },
      {
        type: 'label',
        text: 'Time Savings'
      },
      {
        type: 'list',
        items: [
          'Agents spend less time reading and researching',
          'Faster handling of routine tickets'
        ]
      },
      {
        type: 'label',
        text: 'Error Reduction'
      },
      {
        type: 'list',
        items: [
          'No policy deviations',
          'No outdated manual references'
        ]
      },
      {
        type: 'label',
        text: 'Faster Resolution Times'
      },
      {
        type: 'list',
        items: [
          'Accurate replies prepared instantly',
          'Less back-and-forth with customers'
        ]
      },
      {
        type: 'label',
        text: 'Knowledge Reuse'
      },
      {
        type: 'list',
        items: [
          'SOPs and manuals applied to every ticket',
          'No unused documentation'
        ]
      },
      {
        type: 'label',
        text: 'Cost Efficiency'
      },
      {
        type: 'list',
        items: [
          'AI costs ~$30–40/month per agent workflow',
          'Far cheaper than hiring additional support staff',
          'Enterprise-level intelligence at low cost'
        ]
      },
      {
        type: 'subheading',
        text: '7. How to Replicate This System'
      },
      {
        type: 'list',
        items: [
          'Built using AI + Workflow Automation (n8n, Zapier, etc.) + Knowledge Base (Sheets/PostgreSQL/Supabase)',
          'Open the JSON workflow'
        ]
      },
      {
        type: 'label',
        text: 'Copy the attached workflow JSON'
      },
      {
        type: 'p',
        text: 'Customer support Agent.json'
      },
      {
        type: 'label',
        text: 'Open Workflow Automation Tool'
      },
      {
        type: 'list',
        items: [
          'Create a new workflow',
          'Import/paste JSON into editor',
          'Save workflow and rename it'
        ]
      },
      {
        type: 'label',
        text: 'Connect Credentials'
      },
      {
        type: 'list',
        items: [
          'Ticket Platform API: Enable new ticket events → forward to webhook',
          'Knowledge Base: Google Sheets/PostgreSQL/Supabase for SOPs, manuals, and embeddings',
          'AI Models: OpenAI GPT models for classification, RAG reasoning, and embedding generation'
        ]
      },
      {
        type: 'label',
        text: 'Test the Workflow'
      },
      {
        type: 'p',
        text: 'Send test ticket'
      },
      {
        type: 'label',
        text: 'Verify'
      },
      {
        type: 'list',
        items: [
          'Ticket ingestion works',
          'Classification & knowledge retrieval run correctly',
          'Draft responses appear',
          'Data logged correctly',
          'No errors or missing outputs'
        ]
      },
      {
        type: 'label',
        text: 'Enable the Workflow'
      },
      {
        type: 'label',
        text: 'Toggle Active'
      },
      {
        type: 'label',
        text: 'From now on'
      },
      {
        type: 'list',
        items: [
          'Tickets are processed automatically',
          'SOPs/manuals applied consistently',
          'Draft responses ready for human review or auto-send',
          'Knowledge updates happen automatically'
        ]
      },
      {
        type: 'subheading',
        text: '8. Final Outcome'
      },
      {
        type: 'label',
        text: 'With this AI Customer Support Agent'
      },
      {
        type: 'list',
        items: [
          'Support teams work faster with less effort',
          'Customers receive accurate, consistent answers',
          'Policies and SOPs are applied correctly every time',
          'Knowledge stays fresh without manual work',
          'Support scales without adding headcount'
        ]
      },
      {
        type: 'p',
        text: 'This system turns manual, error-prone support into a fast, reliable, and fully automated AI-driven operation.'
      },
      {
        type: 'img',
        file: 'case-content/ai-agents-ecommerce/image1.png'
      },
      {
        type: 'img',
        file: 'case-content/ai-agents-ecommerce/image2.png'
      },
      {
        type: 'heading',
        text: 'AI-Powered Fashion Campaign Image Generation'
      },
      {
        type: 'subheading',
        text: '1. The Problem: Manual Image Creation for Fashion Campaigns'
      },
      {
        type: 'p',
        text: 'Before automation, the creative team manually handled photo shoots and model image generation, resulting in:'
      },
      {
        type: 'list',
        items: [
          'Time-consuming image conceptualization and generation processes',
          'Need for specialist prompt engineering for AI image generation',
          'Fragmented workflows managing product images',
          'Delays and inconsistency in campaign visuals'
        ]
      },
      {
        type: 'p',
        text: 'The goal was to integrate the entire creative photo shoot pipeline into one automated, AI-powered system to rapidly produce consistent, high-quality fashion campaign images.'
      },
      {
        type: 'subheading',
        text: '2. The Goal: Fully Automated Photo Shoot Workflow in One System'
      },
      {
        type: 'p',
        text: 'By using n8n with AI models and image generation APIs, this workflow:'
      },
      {
        type: 'list',
        items: [
          'Allows uploading a product item image via a simple form trigger',
          'Automatically analyzes the product to build a creative prompt',
          'Generates a photo-realistic product model image matching the style',
          'Further generates high-quality eCommerce and lifestyle product prompts referencing the model and product images',
          'Produces final photorealistic campaign images dynamically and uploads them to Google Drive',
          'Streamlines the entire creative direction and image generation process from one system'
        ]
      },
      {
        type: 'subheading',
        text: '3. System Architecture (Simplified)'
      },
      {
        type: 'subheading',
        text: 'Phase 1: Image Input & Model Creation'
      },
      {
        type: 'list',
        items: [
          'Form Trigger initiates with a clothing image upload',
          'Convert uploaded image to base64 for API usage',
          'Build creative prompt with internal logic for garment analysis and ideal model persona',
          'Call AI image generation API (Google Gemini model) to create a unique fashion model images',
          'Save and upload model images to Google Drive'
        ]
      },
      {
        type: 'subheading',
        text: 'Phase 2: Prompt Generation & Result Image Creation'
      },
      {
        type: 'list',
        items: [
          'Use the generated model image and the original clothing image as references',
          'Build multiple detailed image prompts for eCommerce studio shots and lifestyle scenarios',
          'Generate corresponding photorealistic images via AI API calls',
          'Validate generation success and upload final images to Google Drive'
        ]
      },
      {
        type: 'subheading',
        text: '4. RealWorld Impact'
      },
      {
        type: 'p',
        text: 'Here is how the automation changes creative production:'
      },
      {
        type: 'label',
        text: '🟦 Zero manual promptwriting'
      },
      {
        type: 'p',
        text: 'All creative direction and prompt engineering is baked into the workflow.'
      },
      {
        type: 'label',
        text: '🟦 Consistent, onbrand visuals'
      },
      {
        type: 'p',
        text: 'Every product gets a full set of standardized eCommerce shots plus lifestyle scenes.'
      },
      {
        type: 'label',
        text: '🟦 Massive time savings'
      },
      {
        type: 'p',
        text: 'What used to take hours of backandforth between creative, photography, and AI tools now runs in minutes.'
      },
      {
        type: 'label',
        text: '🟦 Scalable for any catalog'
      },
      {
        type: 'p',
        text: 'You can run this for 1 product or 1,000 products with the same quality bar.'
      },
      {
        type: 'label',
        text: '🟦 Organized assets'
      },
      {
        type: 'p',
        text: 'All outputs go straight into the right Google Drive folder, named in a predictable way.'
      },
      {
        type: 'subheading',
        text: '5. Expected Impact'
      },
      {
        type: 'label',
        text: 'Here are the KPIs this automation improves'
      },
      {
        type: 'label',
        text: 'Time Savings'
      },
      {
        type: 'p',
        text: 'Manual creative + prompt time reduced by 70–90%.'
      },
      {
        type: 'p',
        text: 'A brand manager or designer saves several hours per campaign.'
      },
      {
        type: 'label',
        text: 'Error & Inconsistency Reduction'
      },
      {
        type: 'p',
        text: 'No more forgotten angles, missing lifestyle shots, or halfbaked prompts.'
      },
      {
        type: 'p',
        text: 'Every product gets the same full coverage: front, angle, back, detail, plus lifestyle.'
      },
      {
        type: 'label',
        text: 'Content Production Speed'
      },
      {
        type: 'p',
        text: 'Campaignready visuals can be generated the same day products arrive.'
      },
      {
        type: 'p',
        text: 'Faster gotomarket for new drops and collections.'
      },
      {
        type: 'label',
        text: 'Asset Organization'
      },
      {
        type: 'p',
        text: '100% of generated images land in the correct Google Drive folder.'
      },
      {
        type: 'p',
        text: 'Standard naming like “AI Model” and “Result #X” keeps sets easy to browse.'
      },
      {
        type: 'label',
        text: 'Creative ROI'
      },
      {
        type: 'p',
        text: 'You reuse the same expert logic and creative direction across unlimited products.'
      },
      {
        type: 'p',
        text: 'More content, more speed, and less dependency on external shoots for every variation.'
      },
      {
        type: 'img',
        file: 'case-content/ai-agents-ecommerce/image3.png'
      },
      {
        type: 'heading',
        text: 'AI-Powered 24/7 Voice Support Agent for eCommerce Stores'
      },
      {
        type: 'subheading',
        text: '1. The Problem: Support Calls Don’t Scale'
      },
      {
        type: 'p',
        text: 'Before automation, customer support teams manually handled calls:'
      },
      {
        type: 'list',
        items: [
          'Repeating the same answers about products, sizes, shipping, returns, and order status',
          'Switching between CRM, store backend, and knowledge documents mid-call',
          'Missing calls during peak hours or off-hours',
          'Providing inconsistent answers depending on which agent handled the call'
        ]
      },
      {
        type: 'label',
        text: 'Impact per team'
      },
      {
        type: 'list',
        items: [
          'Long wait times and dropped calls',
          'Frustrated customers with basic questions',
          'No standardized knowledge usage',
          'High dependency on human agents for repetitive FAQs'
        ]
      },
      {
        type: 'p',
        text: 'Core challenge: Teams needed a 24/7 system to handle most customer queries automatically, using the store’s own data as a trusted knowledge base.'
      },
      {
        type: 'subheading',
        text: '2. Results After Automation'
      },
      {
        type: 'label',
        text: 'Once the AI voice agent was implemented'
      },
      {
        type: 'list',
        items: [
          'Calls are answered instantly, any time of day or night',
          'FAQs are resolved automatically without human intervention',
          'Escalation happens only for complex or high-risk issues',
          'Responses are fully aligned with the store’s product and policy data',
          'Human agents focus on complex, high-value calls'
        ]
      },
      {
        type: 'label',
        text: 'Time & Effort Savings'
      },
      {
        type: 'label',
        text: 'Before'
      },
      {
        type: 'list',
        items: [
          '100–200 repetitive calls/week',
          '~2–3 hours/day of agent time spent on FAQs'
        ]
      },
      {
        type: 'label',
        text: 'After'
      },
      {
        type: 'list',
        items: [
          'Fully automated',
          'Humantime required = 10–15 minutes'
        ]
      },
      {
        type: 'label',
        text: 'Monthly impact'
      },
      {
        type: 'list',
        items: [
          '~40–60 hours saved per month per support team',
          'Equivalent to freeing up 1–1.5 full-time support agents'
        ]
      },
      {
        type: 'label',
        text: 'Accuracy & Consistency Gains'
      },
      {
        type: 'list',
        items: [
          '100% of FAQs answered correctly',
          'Calls aligned with latest store policies',
          'Reduced human error and improvisation'
        ]
      },
      {
        type: 'subheading',
        text: '3. The Solution: AI-Powered Voice Agent'
      },
      {
        type: 'p',
        text: 'This system acts as a virtual support agent, capable of handling most customer queries autonomously:'
      },
      {
        type: 'list',
        items: [
          '24/7 natural, human-like voice answers',
          'Uses the eCommerce store’s knowledge base (products, pricing, inventory, policies, FAQs)',
          'Resolves common queries end-to-end without human intervention',
          'Escalates only complex or edge-case calls to human agents'
        ]
      },
      {
        type: 'subheading',
        text: '4. How the System Works'
      },
      {
        type: 'subheading',
        text: 'Phase 1: Knowledge Base & Store Data'
      },
      {
        type: 'list',
        items: [
          'Collect product, pricing, inventory, policy, and FAQ information',
          'Structure it as a real-time queryable knowledge base',
          'Keep it synchronized to avoid outdated information'
        ]
      },
      {
        type: 'subheading',
        text: 'Phase 2: Voice Agent Flow'
      },
      {
        type: 'label',
        text: 'Incoming Call'
      },
      {
        type: 'list',
        items: [
          'Customer dials the support number',
          'VAPI answers with a natural greeting'
        ]
      },
      {
        type: 'label',
        text: 'Intent & Query Understanding'
      },
      {
        type: 'list',
        items: [
          'Converts speech to text',
          'Analyzes intent (product info, order help, policy clarification)'
        ]
      },
      {
        type: 'label',
        text: 'Knowledge Base Lookup'
      },
      {
        type: 'label',
        text: 'Searches store data for relevant answers'
      },
      {
        type: 'list',
        items: [
          'Product details (sizes, colors, availability)',
          'Shipping fees and delivery times',
          'Return/refund/exchange policies',
          'Promotions and bundles',
          'Can query order details for authenticated users (order ID/email)'
        ]
      },
      {
        type: 'label',
        text: 'Voice Response Generation'
      },
      {
        type: 'list',
        items: [
          'Crafts a natural, friendly answer',
          'Converts text to speech and plays it in real-time'
        ]
      },
      {
        type: 'label',
        text: 'Multi-Turn Conversation'
      },
      {
        type: 'list',
        items: [
          'Maintains context across follow-up questions',
          'Handles dynamic conversations about products, orders, or policies'
        ]
      },
      {
        type: 'label',
        text: 'Escalation to Human (Optional)'
      },
      {
        type: 'list',
        items: [
          'Complex or high-risk calls forwarded',
          'Callback requests or ticket created with full transcript'
        ]
      },
      {
        type: 'subheading',
        text: '5. Business Value'
      },
      {
        type: 'list',
        items: [
          '24/7 Instant Responses: Customers get accurate answers anytime',
          'Lower Load on Support Team: AI handles repetitive FAQs automatically',
          'Consistent, On-Brand Answers: Responses aligned with store knowledge',
          'Faster Resolution: FAQs resolved in seconds instead of minutes',
          'Better Data Utilization: Product and policy data powers voice interactions'
        ]
      },
      {
        type: 'subheading',
        text: '6. Expected Impact'
      },
      {
        type: 'label',
        text: 'Time Savings'
      },
      {
        type: 'list',
        items: [
          'Human agents spend fewer hours on repetitive calls',
          'Focus shifts to complex, high-value issues'
        ]
      },
      {
        type: 'label',
        text: 'Error Reduction'
      },
      {
        type: 'list',
        items: [
          'Fewer incorrect or improvised answers',
          'Fully aligned with latest product and policy data'
        ]
      },
      {
        type: 'label',
        text: 'Call Handling Speed'
      },
      {
        type: 'list',
        items: [
          'FAQs resolved in 1–2 exchanges',
          'Reduced call transfers and hold times'
        ]
      },
      {
        type: 'label',
        text: 'Knowledge Utilization'
      },
      {
        type: 'list',
        items: [
          'Centralized product and policy data reused automatically',
          'Store knowledge drives consistent voice support'
        ]
      },
      {
        type: 'subheading',
        text: '7. How You Can Duplicate This System'
      },
      {
        type: 'p',
        text: 'Built using VAPI + n8n + Slack + Google Sheets.'
      },
      {
        type: 'label',
        text: 'Create the VAPI Call Agent'
      },
      {
        type: 'list',
        items: [
          'Configure greeting & voice tone',
          'Connect to store knowledge base'
        ]
      },
      {
        type: 'label',
        text: 'Ensure it can'
      },
      {
        type: 'label',
        text: 'Answer FAQs'
      },
      {
        type: 'p',
        text: 'Handle product & policy questions'
      },
      {
        type: 'label',
        text: 'Add Webhook to VAPI'
      },
      {
        type: 'list',
        items: [
          'Add a call-end webhook',
          'Point to an n8n Webhook node',
          'Import the n8n Workflow',
          'Create a new workflow'
        ]
      },
      {
        type: 'label',
        text: 'Import JSON'
      },
      {
        type: 'label',
        text: 'ShopTalk AI – Call Summary & Lead Capture (1).json'
      },
      {
        type: 'list',
        items: [
          'Connect Tools in n8n',
          'Webhook → paste URL into VAPI',
          'Slack → select summary channel',
          'Sheets → select spreadsheet & columns'
        ]
      },
      {
        type: 'label',
        text: 'Test the Flow'
      },
      {
        type: 'list',
        items: [
          'Make a test call',
          'Ask questions and express scheduling intent',
          'End call'
        ]
      },
      {
        type: 'label',
        text: 'Verify'
      },
      {
        type: 'list',
        items: [
          'Slack summary appears',
          'Sheet row is added (if applicable)'
        ]
      },
      {
        type: 'label',
        text: 'Enable the Workflow'
      },
      {
        type: 'list',
        items: [
          'Activate the workflow',
          'The AI voice agent now handles customer calls automatically, 24/7, with minimal human input'
        ]
      },
      {
        type: 'subheading',
        text: '8. Final Outcome'
      },
      {
        type: 'label',
        text: 'With this automation'
      },
      {
        type: 'list',
        items: [
          'Customer queries are answered instantly, any time',
          'Human agents are freed from repetitive calls (~40–60 hours/month saved)',
          'Answers are accurate, consistent, and on-brand',
          'Complex issues are escalated only when necessary',
          'Support operations scale without adding headcount'
        ]
      },
      {
        type: 'p',
        text: 'This system turns manual, error-prone customer support into a fast, reliable, and fully automated 24/7 voice operation.'
      },
      {
        type: 'heading',
        text: 'AI-Powered Social Media Content Creation'
      },
      {
        type: 'subheading',
        text: '1. The Problem: Social Media Management Is Inconsistent'
      },
      {
        type: 'p',
        text: 'Before automation, creating and publishing social media content required juggling multiple tools and manual steps:'
      },
      {
        type: 'list',
        items: [
          'Writing captions repeatedly for each platform',
          'Designing post images manually',
          'Maintaining content variety without duplication',
          'Tracking approvals via email or chat',
          'Posting manually on LinkedIn',
          'Losing visibility into what was drafted, approved, or published'
        ]
      },
      {
        type: 'label',
        text: 'Impact per team'
      },
      {
        type: 'list',
        items: [
          '2–4 hours/day spent manually creating, approving, and publishing posts',
          'Risk of duplicate, missed, or unapproved posts',
          'Inconsistent brand messaging across channels'
        ]
      },
      {
        type: 'p',
        text: 'Core challenge: Teams needed a single system to reliably create, review, approve, and publish content at scale — without operational chaos.'
      },
      {
        type: 'subheading',
        text: '2. Results After Automation'
      },
      {
        type: 'label',
        text: 'Once the automation was implemented'
      },
      {
        type: 'list',
        items: [
          'Captions and images are generated automatically',
          'Posts are published only after approval',
          'One centralized control panel tracks all content',
          'Manual effort in content creation and publishing is nearly eliminated'
        ]
      },
      {
        type: 'label',
        text: 'Time & Effort Savings'
      },
      {
        type: 'label',
        text: 'Before'
      },
      {
        type: 'p',
        text: '3 hours/day × 20 workdays ≈ 60 hours/month'
      },
      {
        type: 'label',
        text: 'After'
      },
      {
        type: 'list',
        items: [
          'Fully automated',
          'Humantime required = 5–10 minutes for approvals'
        ]
      },
      {
        type: 'label',
        text: 'Monthly impact'
      },
      {
        type: 'list',
        items: [
          '~50–55 hours saved per team per month',
          'Equivalent to freeing more than 1 full-time resource for other tasks'
        ]
      },
      {
        type: 'label',
        text: 'Accuracy & Consistency Gains'
      },
      {
        type: 'list',
        items: [
          '100% approved posts follow brand tone and guidelines',
          'No accidental or duplicate publishing',
          'Content is tracked and auditable in one system'
        ]
      },
      {
        type: 'subheading',
        text: '3. The Solution: AI-Powered Social Media Automation'
      },
      {
        type: 'p',
        text: 'This automation acts as a virtual social media manager:'
      },
      {
        type: 'list',
        items: [
          'Generates LinkedIn captions using AI based on topic, brand tone, and content goals',
          'Creates post images automatically aligned with captions',
          'Uses Google Sheets as a centralized control panel',
          'Sends posts for approval and publishes automatically once approved',
          'Logs all content and live URLs for tracking and reporting'
        ]
      },
      {
        type: 'subheading',
        text: '4. How the System Works'
      },
      {
        type: 'subheading',
        text: 'Phase 1: AI Caption Generation'
      },
      {
        type: 'p',
        text: 'Triggered automatically when a new row is added to Google Sheets'
      },
      {
        type: 'label',
        text: 'AI generates captions based on'
      },
      {
        type: 'list',
        items: [
          'Topic',
          'Brand context',
          'Content objective',
          'Captions are structured, formatted, and optimized for LinkedIn',
          'Stored in Google Sheets for visibility and approvals'
        ]
      },
      {
        type: 'subheading',
        text: 'Phase 2: Image & Post Creation'
      },
      {
        type: 'p',
        text: 'Caption is used to generate an AI-powered post image'
      },
      {
        type: 'label',
        text: 'Image uploaded to Google Drive'
      },
      {
        type: 'label',
        text: 'Google Sheets logs'
      },
      {
        type: 'label',
        text: 'Image URL'
      },
      {
        type: 'list',
        items: [
          'Caption',
          'Status (pending/approved/published)',
          'Eliminates manual image design while keeping visuals aligned with content'
        ]
      },
      {
        type: 'subheading',
        text: 'Phase 3: Approval & Publishing'
      },
      {
        type: 'list',
        items: [
          'Approval emails are sent automatically',
          'Posts are blocked until approval is received',
          'Only approved posts are published on LinkedIn'
        ]
      },
      {
        type: 'label',
        text: 'Google Sheets is updated with'
      },
      {
        type: 'list',
        items: [
          'Publishing status',
          'Live post URL',
          'Ensures no missed or duplicate posts'
        ]
      },
      {
        type: 'subheading',
        text: '5. Business Value'
      },
      {
        type: 'list',
        items: [
          'End-to-End Automation: From caption generation to publishing in one workflow',
          'Centralized Control Panel: Full visibility of drafts, approvals, and published posts',
          'Consistent Brand Voice: AI ensures tone and style are consistent',
          'Approval-Safe Publishing: No post goes live without explicit approval',
          'Full Tracking & Reporting: All posts logged with status and live URLs',
          'Time & Cost Savings: ~50+ hours/month saved per team, reduced reliance on designers'
        ]
      },
      {
        type: 'subheading',
        text: '6. How You Can Duplicate This System'
      },
      {
        type: 'p',
        text: 'Open the JSON workflow'
      },
      {
        type: 'label',
        text: 'Click the attached file'
      },
      {
        type: 'label',
        text: 'Social Media Automation Workflow.json'
      },
      {
        type: 'list',
        items: [
          'Copy all content from the JSON file',
          'Open n8n (cloud or self-hosted)',
          'Log in to your n8n instance',
          '➕ Create a new workflow',
          'Paste the JSON into the editor',
          'Save the workflow'
        ]
      },
      {
        type: 'label',
        text: 'Rename to: Social Media Content Automation'
      },
      {
        type: 'list',
        items: [
          'Update credentials & connections',
          'Google Sheets: Connect OAuth credentials, ensure columns for Topic, Caption, Image URL, Status, Post URL',
          'AI Caption Generation: Add AI credentials, verify brand context and prompt setup',
          'Image Generation: Confirm image prompts are derived from captions and saved to Drive',
          'Approval & Publishing: Configure email/LinkedIn credentials, ensure workflow updates Google Sheets correctly',
          'Run a full workflow test',
          'Execute workflow manually'
        ]
      },
      {
        type: 'label',
        text: 'Verify end-to-end'
      },
      {
        type: 'list',
        items: [
          'Captions & images appear in control panel',
          'Approval logic blocks unapproved posts',
          'Approved posts publish correctly',
          'Statuses and URLs update accurately',
          'Enable the workflow'
        ]
      },
      {
        type: 'label',
        text: 'Toggle to Active'
      },
      {
        type: 'p',
        text: 'Content creation, approval, and publishing now run automatically with minimal manual input'
      },
      {
        type: 'subheading',
        text: '7. Final Outcome'
      },
      {
        type: 'label',
        text: 'With this automation'
      },
      {
        type: 'list',
        items: [
          'Social media content creation becomes fast, consistent, and repeatable',
          'Posting is approval-safe and error-free',
          'Teams operate from one centralized control panel',
          'Social media operations scale without increasing workload',
          'Manual effort is reduced by ~50 hours/month, freeing time for strategic work'
        ]
      },
      {
        type: 'p',
        text: 'This system turns manual, error-prone social media management into a predictable, auditable, and fully automated workflow.'
      },
      {
        type: 'heading',
        text: 'AI-Powered E-Commerce Product Price Monitoring'
      },
      {
        type: 'subheading',
        text: '1. The Problem: Manual Price Checking Wastes Time'
      },
      {
        type: 'p',
        text: 'Before automation, tracking product prices across online stores was slow, repetitive, and error-prone:'
      },
      {
        type: 'label',
        text: 'Users had to manually'
      },
      {
        type: 'list',
        items: [
          'Open multiple product pages',
          'Check prices repeatedly',
          'Record or remember previous prices'
        ]
      },
      {
        type: 'label',
        text: 'Often missed opportunities'
      },
      {
        type: 'list',
        items: [
          'Price drops',
          'Limited-time deals',
          'No historical visibility into price trends',
          'Buying decisions were based on guesswork rather than data'
        ]
      },
      {
        type: 'label',
        text: 'Impact per user'
      },
      {
        type: 'list',
        items: [
          '30–60 minutes per day spent manually checking prices',
          'Missed savings on deals and discounts',
          'Decisions based on incomplete information'
        ]
      },
      {
        type: 'p',
        text: 'Core challenge: People want to buy at the right time but don’t want to constantly monitor prices themselves.'
      },
      {
        type: 'subheading',
        text: '2. Results After Automation'
      },
      {
        type: 'label',
        text: 'Once the automation was implemented'
      },
      {
        type: 'list',
        items: [
          'Price monitoring happens automatically every day',
          'Alerts are sent only when meaningful changes occur',
          'Users make data-driven purchasing decisions',
          'Historical price trends are logged and accessible',
          'No human involvement is needed for routine checks'
        ]
      },
      {
        type: 'label',
        text: 'Time & Effort Savings'
      },
      {
        type: 'label',
        text: 'Before'
      },
      {
        type: 'p',
        text: '45 minutes/day × 30 days ≈ 22.5 hours/month'
      },
      {
        type: 'label',
        text: 'After'
      },
      {
        type: 'list',
        items: [
          'Fully automated',
          'Humantime required = near zero'
        ]
      },
      {
        type: 'label',
        text: 'Monthly impact'
      },
      {
        type: 'list',
        items: [
          '~20–25 hours saved per user per month',
          'Equivalent to freeing 0.5 full-time workdays per user'
        ]
      },
      {
        type: 'label',
        text: 'Accuracy & Opportunity Gains'
      },
      {
        type: 'list',
        items: [
          '100% of monitored prices captured accurately',
          'Never miss a price drop or limited-time deal',
          'Improved buying decisions based on AI analysis'
        ]
      },
      {
        type: 'subheading',
        text: '3. The Solution: AI-Powered Price Monitoring System'
      },
      {
        type: 'p',
        text: 'This automation acts as a virtual price tracker and analyst:'
      },
      {
        type: 'list',
        items: [
          'Scheduled scraping collects product prices automatically',
          'Google Sheets logs historical prices',
          'AI evaluates trends and identifies best-value opportunities',
          'Notifications sent via Slack, email, or preferred channels',
          'Only meaningful changes trigger alerts, reducing noise'
        ]
      },
      {
        type: 'subheading',
        text: '4. How the System Works'
      },
      {
        type: 'subheading',
        text: 'Phase 1: Scheduled Price Collection'
      },
      {
        type: 'p',
        text: 'Workflow runs automatically (daily, or custom schedule)'
      },
      {
        type: 'label',
        text: 'Visits product pages and extracts'
      },
      {
        type: 'list',
        items: [
          'Product name',
          'Current price',
          'Skips incomplete or erroneous entries'
        ]
      },
      {
        type: 'subheading',
        text: 'Phase 2: Price Comparison & History Logging'
      },
      {
        type: 'list',
        items: [
          'Prices for multiple products are compared',
          'Each run adds a new row to Google Sheets',
          'Builds a complete price history over time'
        ]
      },
      {
        type: 'subheading',
        text: 'Phase 3: AI-Driven Analysis'
      },
      {
        type: 'label',
        text: 'AI evaluates'
      },
      {
        type: 'list',
        items: [
          'Current price vs historical prices',
          'Which product offers the best value today',
          'Significant changes worthy of notification'
        ]
      },
      {
        type: 'subheading',
        text: 'Phase 4: Smart Notifications'
      },
      {
        type: 'label',
        text: 'Sends alerts only when'
      },
      {
        type: 'list',
        items: [
          'Price drops significantly',
          'A better deal appears',
          'Stays silent if no meaningful change occurs',
          'Notifications sent via Slack, email, or other channels',
          'Notification'
        ]
      },
      {
        type: 'subheading',
        text: '5. Business Value'
      },
      {
        type: 'list',
        items: [
          'Zero Manual Monitoring: No human effort required for routine checks',
          'Never Miss a Deal: Immediate alerts for better prices',
          'Data-Driven Decisions: AI identifies the optimal product choice',
          'Historical Visibility: Full record of price trends for smarter buying',
          'Reduced Noise: Only meaningful alerts, no unnecessary notifications',
          'Time & Cost Savings: ~20–25 hours/month saved per user'
        ]
      },
      {
        type: 'subheading',
        text: '6. How You Can Duplicate This System'
      },
      {
        type: 'p',
        text: 'Open the JSON workflow'
      },
      {
        type: 'label',
        text: 'Click the attached file'
      },
      {
        type: 'label',
        text: 'E-Commerce Price Monitoring Automation.json'
      },
      {
        type: 'list',
        items: [
          'Copy all content from the JSON file',
          'Open n8n (cloud or self-hosted)',
          'Log in to your n8n instance',
          '➕ Create a new workflow'
        ]
      },
      {
        type: 'label',
        text: 'Click New → Workflow'
      },
      {
        type: 'p',
        text: 'Name it temporarily; rename later'
      },
      {
        type: 'label',
        text: 'Import / Paste the JSON'
      },
      {
        type: 'list',
        items: [
          'Paste the copied JSON into the workflow editor',
          'n8n rebuilds all nodes and connections automatically',
          'Update credentials & connections',
          'Scheduler / Cron Node: Set frequency (daily, weekly, or custom)',
          'HTTP / Scraping Nodes: Update product URLs, test extraction',
          'Google Sheets: Add credentials, select spreadsheet and columns (Product, Price, Date, Comparison Result)'
        ]
      },
      {
        type: 'label',
        text: 'AI Analysis Node: Add API credentials (OpenAI / Gemini)'
      },
      {
        type: 'list',
        items: [
          'Notification Node: Slack or email credentials, configure messages',
          'Run a full workflow test',
          'Manually execute the workflow'
        ]
      },
      {
        type: 'label',
        text: 'Verify end-to-end'
      },
      {
        type: 'list',
        items: [
          'Data collection → analysis → notification',
          'Ensure no alerts if prices haven’t changed',
          'Enable the workflow',
          'Toggle workflow to Active',
          'System now monitors prices automatically, analyzes trends, and sends alerts only when necessary'
        ]
      },
      {
        type: 'subheading',
        text: '7. Final Outcome'
      },
      {
        type: 'label',
        text: 'With this automation'
      },
      {
        type: 'list',
        items: [
          'Price monitoring is fully automated',
          'Buying decisions are data-driven and timely',
          'Users save 20–25 hours per month',
          'Deals are never missed',
          'Alerts are meaningful and non-intrusive'
        ]
      },
      {
        type: 'p',
        text: 'This system turns slow, error-prone manual price tracking into a fast, reliable, and fully automated workflow.'
      },
      {
        type: 'img',
        file: 'case-content/ai-agents-ecommerce/image4.png'
      },
      {
        type: 'heading',
        text: 'AI-Powered Meta Ads Reporting'
      },
      {
        type: 'subheading',
        text: '1. The Problem: Manual Meta Ads Analysis Is Time-Consuming'
      },
      {
        type: 'p',
        text: 'Before this system, marketers spent hours manually collecting and analyzing campaign data for Facebook and Instagram:'
      },
      {
        type: 'list',
        items: [
          'Gathering metrics from multiple campaigns and ad sets took 6–8 hours per week per marketer',
          'Detecting underperforming ads was reactive, often 30–40% of low-performing ads weren’t optimized in time',
          'Scaling campaigns beyond 5–10 ad sets was difficult',
          'Decisions were based on intuition rather than data'
        ]
      },
      {
        type: 'subheading',
        text: '2. The Results After Automation'
      },
      {
        type: 'p',
        text: 'After implementing AI-Powered Meta Ads Reporting:'
      },
      {
        type: 'list',
        items: [
          'Reporting time dropped from 6–8 hours to under 1 hour per week',
          '90% of underperforming ads were flagged in real time instead of being missed',
          'Campaign response time improved from 1–2 days to under 1 hour',
          'ROAS increased by 15–25% due to faster budget and creative optimizations',
          'Each marketer saved approximately 7 hours per week (~364 hours per year)',
          'Campaign management scaled from 10 ad sets to 50+ ad sets without adding staff',
          'Human errors in campaign adjustments dropped by ~90%'
        ]
      },
      {
        type: 'subheading',
        text: '3. The Goal: Fully Automated Meta Ads Insights'
      },
      {
        type: 'label',
        text: 'The system was designed to'
      },
      {
        type: 'list',
        items: [
          'Automatically pull campaign, ad set, and ad-level data',
          'Analyze performance with AI',
          'Generate actionable recommendations for budgets, targeting, and creatives',
          'Provide natural language query support through AI assistants',
          'Monitor campaigns continuously and alert users for deviations'
        ]
      },
      {
        type: 'subheading',
        text: '3. System Architecture'
      },
      {
        type: 'subheading',
        text: 'Phase 1: Data Collection & Normalization'
      },
      {
        type: 'list',
        items: [
          'Pulls all campaign metrics automatically: impressions, clicks, CTR, conversions, ROAS, CPA, spend, and budget utilization',
          'Cleans and normalizes data for AI analysis'
        ]
      },
      {
        type: 'subheading',
        text: 'Phase 2: AI-Powered Performance Analysis'
      },
      {
        type: 'list',
        items: [
          'AI detects trends, anomalies, and underperforming ads automatically',
          'Flags ads with CTR below benchmark, low ROAS, or conversion anomalies'
        ]
      },
      {
        type: 'subheading',
        text: 'Phase 3: Optimization Recommendations'
      },
      {
        type: 'list',
        items: [
          'AI suggests budget reallocations, audience adjustments, and creative improvements',
          'Prioritized by expected impact on KPIs'
        ]
      },
      {
        type: 'subheading',
        text: 'Phase 4: Reporting & Alerts'
      },
      {
        type: 'list',
        items: [
          'Real-time dashboards for CTR, CPA, ROAS, conversions, spend, and impressions',
          'Alerts triggered automatically for KPI deviations'
        ]
      },
      {
        type: 'subheading',
        text: 'Phase 5: AI-Assisted Campaign Management'
      },
      {
        type: 'list',
        items: [
          'Users request campaign changes through natural language',
          'AI validates and executes changes automatically',
          'Every adjustment tracked for impact on KPIs'
        ]
      },
      {
        type: 'subheading',
        text: '4. Real-World Impact'
      },
      {
        type: 'label',
        text: '🟦 Massive Time Savings'
      },
      {
        type: 'p',
        text: 'Each marketer saves ~7 hours/week, translating to ~364 hours/year'
      },
      {
        type: 'label',
        text: '🟦 Faster Optimization'
      },
      {
        type: 'p',
        text: 'Campaign adjustments happen within 1 hour instead of 1–2 days'
      },
      {
        type: 'label',
        text: '🟦 Improved ROI'
      },
      {
        type: 'p',
        text: 'ROAS increases by 15–25% due to timely reallocations and creative optimization'
      },
      {
        type: 'label',
        text: '🟦 Error Reduction'
      },
      {
        type: 'p',
        text: 'Human errors in campaign adjustments drop by ~90%'
      },
      {
        type: 'label',
        text: '🟦 Scalability'
      },
      {
        type: 'p',
        text: 'Campaign management scales from 10 ad sets to 50+ ad sets per account without extra staff'
      },
      {
        type: 'subheading',
        text: '5. Final Outcome'
      },
      {
        type: 'label',
        text: 'With AI-Powered Meta Ads Reporting'
      },
      {
        type: 'list',
        items: [
          'Campaign analysis is fully automated',
          'Marketers make faster, data-driven decisions',
          'ROI improves through budget and creative optimization',
          'Time savings allow focus on strategy rather than manual work',
          'Scaling campaigns is simple, accurate, and efficient'
        ]
      },
      {
        type: 'heading',
        text: 'AI-Powered Shopify Abandoned Cart Recovery System'
      },
      {
        type: 'subheading',
        text: '1. The Problem: Abandoned Carts Were Leaving Revenue on the Table'
      },
      {
        type: 'p',
        text: 'Before automation, abandoned carts were handled manually or not followed up at all:'
      },
      {
        type: 'list',
        items: [
          'Teams had to manually check Shopify for abandoned checkouts',
          'Writing reminder emails took time and effort',
          'Most carts were never followed up consistently',
          'Emails were generic, not personalized',
          'Delays caused customers to lose purchase intent'
        ]
      },
      {
        type: 'label',
        text: 'On average'
      },
      {
        type: 'list',
        items: [
          'Each abandoned cart follow-up took 5–7 minutes',
          'Most stores only followed up once per day or skipped entirely',
          'Many potential sales were lost simply due to no timely reminder'
        ]
      },
      {
        type: 'p',
        text: 'For stores with 40–60 abandoned carts per day, this resulted in:'
      },
      {
        type: 'list',
        items: [
          '3–5 hours of manual work daily, or',
          'No follow-up at all, leading to permanent revenue loss'
        ]
      },
      {
        type: 'subheading',
        text: '2. Results After Automation'
      },
      {
        type: 'p',
        text: 'After implementing the abandoned cart recovery automation:'
      },
      {
        type: 'list',
        items: [
          'Follow-up emails are sent automatically within the right time window',
          '100% of abandoned carts receive a recovery attempt',
          'Email personalization happens instantly using AI',
          'Manual work is reduced by 90–95%',
          'Recovery emails are sent within minutes, not hours'
        ]
      },
      {
        type: 'label',
        text: 'Time & Revenue Impact'
      },
      {
        type: 'label',
        text: 'Before'
      },
      {
        type: 'list',
        items: [
          '~6 minutes per cart',
          '50 carts/day = ~5 hours/day'
        ]
      },
      {
        type: 'label',
        text: 'After'
      },
      {
        type: 'list',
        items: [
          'Fully automated',
          'Human effort = near zero'
        ]
      },
      {
        type: 'label',
        text: 'Monthly time savings'
      },
      {
        type: 'p',
        text: '~100–120 hours saved per month'
      },
      {
        type: 'label',
        text: 'Revenue uplift (conservative example)'
      },
      {
        type: 'list',
        items: [
          'If only 5–8% of abandoned carts convert',
          'And average cart value is $50',
          'That’s $100–$200+ recovered per day',
          '$3,000–$6,000+ per month in recovered revenue'
        ]
      },
      {
        type: 'subheading',
        text: '3. The Solution: AI-Powered Abandoned Cart Recovery'
      },
      {
        type: 'p',
        text: 'This system works like an always-on sales assistant:'
      },
      {
        type: 'list',
        items: [
          'Detects abandoned carts automatically',
          'Waits before sending reminders to avoid spamming',
          'Confirms the cart is still abandoned',
          'Generates a personalized recovery email using AI',
          'Sends the email instantly without manual input'
        ]
      },
      {
        type: 'p',
        text: 'The entire process runs silently in the background.'
      },
      {
        type: 'subheading',
        text: '4. How the Automation Works'
      },
      {
        type: 'list',
        items: [
          'Shopify provides abandoned checkout data',
          'n8n controls timing and logic',
          'AI writes friendly, personalized recovery emails',
          'Gmail delivers messages directly to customers'
        ]
      },
      {
        type: 'p',
        text: 'No dashboards to monitor. No buttons to click.'
      },
      {
        type: 'subheading',
        text: '5. Business Value'
      },
      {
        type: 'list',
        items: [
          'Captures revenue that would otherwise be lost',
          'Removes repetitive manual follow-up work',
          'Improves customer experience with timely reminders',
          'Ensures every cart gets equal attention',
          'Scales automatically as store traffic grows'
        ]
      },
      {
        type: 'subheading',
        text: '6. How You Can Duplicate This System'
      },
      {
        type: 'p',
        text: 'Open the JSON file preview'
      },
      {
        type: 'label',
        text: 'Open the attached file'
      },
      {
        type: 'list',
        items: [
          'Shopify Abandoned Checkout Recovery with Order Verification (1).json',
          'Select all text (Ctrl/Cmd + A) and copy (Ctrl/Cmd + C)'
        ]
      },
      {
        type: 'label',
        text: 'Open Make.com'
      },
      {
        type: 'label',
        text: 'Log in to Make.com'
      },
      {
        type: 'label',
        text: 'Go to Scenarios'
      },
      {
        type: 'p',
        text: 'Click Create a new scenario'
      },
      {
        type: 'label',
        text: 'Choose Import Blueprint'
      },
      {
        type: 'list',
        items: [
          'Paste the copied JSON and click Save',
          'Save & name the scenario'
        ]
      },
      {
        type: 'label',
        text: 'Click Save'
      },
      {
        type: 'label',
        text: 'Rename it to'
      },
      {
        type: 'label',
        text: 'Shopify Abandoned Checkout Recovery with Order Verification'
      },
      {
        type: 'list',
        items: [
          'Update connections (important)',
          'Shopify',
          'Reconnect your Shopify account',
          'Ensure checkout status is set to abandoned',
          'Delay module',
          'Review delay timing (used to confirm the cart is still abandoned)',
          'Filter / verification',
          'Confirms checkout is not duplicated or already completed',
          'OpenAI',
          'Add your OpenAI API key',
          'Verify the email body is generated correctly (no subject, no emojis)'
        ]
      },
      {
        type: 'label',
        text: 'Email (Gmail / SMTP)'
      },
      {
        type: 'list',
        items: [
          'Reconnect email account',
          'Map customer email dynamically',
          'Subject: You left something behind',
          'Test the scenario',
          'Click Run once'
        ]
      },
      {
        type: 'label',
        text: 'Confirm flow'
      },
      {
        type: 'list',
        items: [
          'Abandoned checkout detected',
          'Cart rechecked',
          'AI email generated',
          'Recovery email sent',
          'Enable the scenario',
          'Turn the scenario ON',
          'Set a schedule (e.g. every 15–60 minutes)'
        ]
      },
      {
        type: 'p',
        text: 'The system now automatically sends AI-written recovery emails for verified abandoned checkouts.'
      },
      {
        type: 'subheading',
        text: '7. Final Outcome'
      },
      {
        type: 'label',
        text: 'With this automation in place'
      },
      {
        type: 'list',
        items: [
          'Abandoned cart recovery becomes reliable and consistent',
          'Sales teams no longer chase carts manually',
          'Customers receive timely, personalized reminders',
          'Revenue increases without increasing workload'
        ]
      },
      {
        type: 'p',
        text: 'This workflow transforms abandoned carts from a missed opportunity into an automated revenue recovery system.'
      },
      {
        type: 'heading',
        text: 'AI-Powered Whatsapp message Assistant'
      },
      {
        type: 'subheading',
        text: '1. The Problem: WhatsApp Customer Support Didn’t Scale'
      },
      {
        type: 'p',
        text: 'Before this automation, customer support over WhatsApp was fully manual and increasingly difficult to manage:'
      },
      {
        type: 'p',
        text: 'Staff had to reply to every WhatsApp message manually'
      },
      {
        type: 'label',
        text: 'Repetitive questions about'
      },
      {
        type: 'list',
        items: [
          'Products',
          'Prices',
          'Availability',
          'Store policies',
          'Voice messages required listening and interpretation',
          'Image-based questions (e.g. product photos) needed human review',
          'Responses depended on who was replying, causing inconsistency',
          'Support was unavailable outside business hours'
        ]
      },
      {
        type: 'p',
        text: 'For a small business receiving 80–120 WhatsApp messages per day, this meant:'
      },
      {
        type: 'list',
        items: [
          '4–6 hours/day spent answering routine questions',
          'Delayed replies during peak hours',
          'Missed inquiries outside working hours',
          'High dependency on trained staff with product knowledge'
        ]
      },
      {
        type: 'label',
        text: 'Core challenge'
      },
      {
        type: 'p',
        text: 'WhatsApp was the main customer channel, but human-only support could not keep up without increasing headcount.'
      },
      {
        type: 'subheading',
        text: '2. Results After Automation'
      },
      {
        type: 'p',
        text: 'Once the WhatsApp AI Business Assistant was deployed:'
      },
      {
        type: 'list',
        items: [
          '70–85% of incoming queries were handled automatically',
          'Customers received instant replies — even outside business hours',
          'Voice messages were transcribed and answered automatically',
          'Image-based queries (products, issues) were understood by AI',
          'Answers were consistent, accurate, and policy-aligned',
          'Human agents only handled complex or edge-case conversations'
        ]
      },
      {
        type: 'label',
        text: 'Time & Workload Impact'
      },
      {
        type: 'label',
        text: 'Before automation'
      },
      {
        type: 'list',
        items: [
          '~3–4 minutes per WhatsApp message',
          '100 messages/day = ~5–6 hours/day'
        ]
      },
      {
        type: 'label',
        text: 'After automation'
      },
      {
        type: 'list',
        items: [
          'Human involvement only for ~15–30 messages/day',
          'Manual time reduced to ~1–1.5 hours/day'
        ]
      },
      {
        type: 'label',
        text: 'Net savings'
      },
      {
        type: 'list',
        items: [
          '3–4 hours saved per day',
          '90–120 hours saved per month'
        ]
      },
      {
        type: 'p',
        text: 'This allowed the business to scale WhatsApp support without hiring additional staff.'
      },
      {
        type: 'subheading',
        text: '3. The Solution: An AI Assistant Inside WhatsApp'
      },
      {
        type: 'p',
        text: 'The system acts as a virtual support agent that lives directly inside WhatsApp:'
      },
      {
        type: 'list',
        items: [
          'Understands text, voice, and images',
          'Remembers conversation context',
          'Searches business knowledge instantly',
          'Responds naturally like a human agent',
          'Chooses whether to reply with text or voice'
        ]
      },
      {
        type: 'p',
        text: 'Customers never feel like they’re talking to a bot — just fast, helpful support.'
      },
      {
        type: 'subheading',
        text: '4. How the System Works'
      },
      {
        type: 'list',
        items: [
          'Customers message the business on WhatsApp',
          'AI understands the message type and intent',
          'Business knowledge is retrieved using semantic search',
          'A context-aware response is generated',
          'Reply is sent instantly via WhatsApp'
        ]
      },
      {
        type: 'p',
        text: 'All of this happens automatically in seconds.'
      },
      {
        type: 'subheading',
        text: '5. Business Value'
      },
      {
        type: 'list',
        items: [
          'Major reduction in repetitive support workload',
          'Faster response times improve customer satisfaction',
          'Consistent answers across all customers',
          'Supports multilingual conversations naturally',
          'Operates 24/7 without staff availability',
          'No changes required to customer behavior'
        ]
      },
      {
        type: 'subheading',
        text: '6. Reliability & Safety'
      },
      {
        type: 'list',
        items: [
          'Uses verified business knowledge only',
          'Falls back gracefully when information is unclear',
          'Never processes payments or sensitive data',
          'Human escalation can be added anytime'
        ]
      },
      {
        type: 'p',
        text: 'This ensures trust, safety, and accuracy at scale.'
      },
      {
        type: 'subheading',
        text: '7. How to Replicate This System'
      },
      {
        type: 'p',
        text: 'Built using WhatsApp Cloud API + n8n + OpenAI + Supabase Vector Store.'
      },
      {
        type: 'label',
        text: 'Set Up WhatsApp Cloud API'
      },
      {
        type: 'label',
        text: 'Configure'
      },
      {
        type: 'list',
        items: [
          'WhatsApp Business account',
          'Phone number ID',
          'Webhook events for incoming messages'
        ]
      },
      {
        type: 'label',
        text: 'Ensure it can'
      },
      {
        type: 'list',
        items: [
          'Receive text, voice, and image messages',
          'Send text and audio replies'
        ]
      },
      {
        type: 'label',
        text: 'Create WhatsApp Webhook in n8n'
      },
      {
        type: 'list',
        items: [
          'Create a Webhook Trigger node in n8n',
          'Copy the webhook URL'
        ]
      },
      {
        type: 'label',
        text: 'Paste this URL into'
      },
      {
        type: 'p',
        text: 'Meta → WhatsApp → Webhooks configuration'
      },
      {
        type: 'p',
        text: 'This connects WhatsApp messages to the automation.'
      },
      {
        type: 'list',
        items: [
          'Import the n8n Workflow',
          'Create a new workflow in n8n'
        ]
      },
      {
        type: 'label',
        text: 'Import the JSON file'
      },
      {
        type: 'label',
        text: 'AI-Powered WhatsApp Assistant.json'
      },
      {
        type: 'label',
        text: 'Connect AI & Data Services'
      },
      {
        type: 'label',
        text: 'Configure the following nodes'
      },
      {
        type: 'list',
        items: [
          'OpenAI',
          'Add your OpenAI API key'
        ]
      },
      {
        type: 'label',
        text: 'Enable'
      },
      {
        type: 'list',
        items: [
          'Chat model',
          'Audio transcription',
          'Image analysis',
          'Text-to-speech'
        ]
      },
      {
        type: 'label',
        text: 'Supabase Vector Store'
      },
      {
        type: 'p',
        text: 'Add Supabase project URL & API key'
      },
      {
        type: 'label',
        text: 'Confirm vector table contains'
      },
      {
        type: 'list',
        items: [
          'Products',
          'FAQs',
          'Policies',
          'Business information'
        ]
      },
      {
        type: 'p',
        text: 'This enables accurate AI responses (RAG).'
      },
      {
        type: 'label',
        text: 'Configure Message Routing'
      },
      {
        type: 'p',
        text: 'Open the Switch node'
      },
      {
        type: 'label',
        text: 'Verify routing rules'
      },
      {
        type: 'label',
        text: 'Text → AI Agent'
      },
      {
        type: 'label',
        text: 'Voice → Transcription → AI Agent'
      },
      {
        type: 'label',
        text: 'Image → Image analysis → AI Agent'
      },
      {
        type: 'p',
        text: 'This keeps processing efficient and cost-effective.'
      },
      {
        type: 'label',
        text: 'Test the Flow'
      },
      {
        type: 'label',
        text: 'Send test messages on WhatsApp'
      },
      {
        type: 'list',
        items: [
          'Text question (e.g., product inquiry)',
          'Voice message',
          'Image (product photo)'
        ]
      },
      {
        type: 'label',
        text: 'Verify'
      },
      {
        type: 'list',
        items: [
          'Correct intent detection',
          'Accurate answers from business knowledge',
          'Responses returned via WhatsApp',
          'Voice replies work when triggered'
        ]
      },
      {
        type: 'label',
        text: 'Enable the Workflow'
      },
      {
        type: 'label',
        text: 'Toggle the workflow to Active'
      },
      {
        type: 'p',
        text: 'The assistant is now live'
      },
      {
        type: 'p',
        text: 'Customers can now chat with your AI assistant 24/7 on WhatsApp.'
      },
      {
        type: 'subheading',
        text: '8. Final Outcome'
      },
      {
        type: 'p',
        text: 'With the WhatsApp AI Business Assistant in production:'
      },
      {
        type: 'list',
        items: [
          'Customer support became faster and more reliable',
          'Staff focused on higher-value conversations',
          'Customers received instant, accurate help',
          'Support scaled naturally with business growth'
        ]
      },
      {
        type: 'p',
        text: 'The system transformed WhatsApp from a manual support burden into an always-on AI-powered customer assistant.'
      }
    ]
  },
  {
    id: 'clickup-boots-bags',
    title: 'ClickUp Structure — Boots & Bags (Ecommerce Dropshipping)',
    description: 'Detailed ClickUp workspace structure for an ecommerce dropshipping store’s operations.',
    source: 'Notion',
    url: 'https://glass-suit-7f2.notion.site/Detailed-ClickUp-Structure-for-an-E-commerce-Store-Boots-and-Bags-Dropshipping-2260fcd1ff4649178ed0e6209ada5423?pvs=4',
    tags: [
      'clickup'
    ],
    content: [
      {
        type: 'eyebrow',
        text: 'Main Folder: Boots & Bags E-Commerce Operations'
      },
      {
        type: 'heading',
        text: 'Fulfillment'
      },
      {
        type: 'label',
        text: 'Lists'
      },
      {
        type: 'list',
        items: [
          'Orders Management: Automatically imports orders from Shopify.',
          'Custom Fields: Order ID, Customer Name, Order Date, Status, Product SKU, Quantity, Shipping Address.',
          'Automations: Notify fulfillment team upon new order entry; tag urgent orders based on delivery date.',
          'Out of Stock: Tracks inventory shortages.',
          'Custom Fields: Product ID, Last Available Date, Expected Restock Date, Supplier Contact.',
          'Automations: Alert purchasing manager when stock levels drop below a predefined threshold.',
          'Disputed Orders: Manages customer disputes.',
          'Custom Fields: Order ID, Dispute Reason, Resolution Status, Customer Contact, Resolution Date.',
          'Automations: Escalate unresolved disputes over 5 days old to senior management.',
          'Order Reshipment: Manages reshipment processes.',
          'Custom Fields: Original Order ID, Reshipment Reason, New Tracking Number, Reshipment Status.',
          'Automations: Generate a reshipment task when a customer service request is approved; notify logistics.'
        ]
      },
      {
        type: 'label',
        text: 'Templates'
      },
      {
        type: 'list',
        items: [
          'Order Processing Checklist: Includes steps for verifying, packing, and shipping orders.',
          'Dispute Resolution Guide: Detailed steps for handling disputes, including escalation paths.'
        ]
      },
      {
        type: 'heading',
        text: 'Customer Service'
      },
      {
        type: 'label',
        text: 'Lists'
      },
      {
        type: 'list',
        items: [
          'Reshipment Requests: Handles manual entry of reshipment requests, linked to Fulfillment’s Order Reshipment list.',
          'Custom Fields: Customer ID, Request Date, Issue Description, Resolution Status, Agent Handling.',
          'Automations: Create a linked task in Order Reshipment upon approval; notify customer when processed.'
        ]
      },
      {
        type: 'label',
        text: 'Templates'
      },
      {
        type: 'list',
        items: [
          'Customer Inquiry Response Template: Predefined responses for common inquiries and issues.'
        ]
      },
      {
        type: 'heading',
        text: 'Collection and Product Pages'
      },
      {
        type: 'label',
        text: 'Lists'
      },
      {
        type: 'list',
        items: [
          'Product Research: For adding potential new products.',
          'Custom Fields: Product ID, Research Date, Approval Status, Market Analysis, Supplier Details.',
          'Automations: Move approved products to the Product Upload list; notify the upload team.',
          'Product Upload: Prepares products for listing on Shopify.',
          'Custom Fields: Product ID, Upload Date, SEO Keywords, Price, Image URLs.',
          'Automations: Notify marketing once product is live for promotional activities.'
        ]
      },
      {
        type: 'label',
        text: 'Templates'
      },
      {
        type: 'list',
        items: [
          'Product Proposal Template: Includes comprehensive fields for proposing new products.',
          'Product Upload Checklist: Steps for uploading products, ensuring all data fields are completed.'
        ]
      },
      {
        type: 'heading',
        text: 'Marketing'
      },
      {
        type: 'label',
        text: 'Lists'
      },
      {
        type: 'list',
        items: [
          'Facebook Marketing: Manages Facebook ad campaigns.',
          'Custom Fields: Campaign ID, Start Date, End Date, Target Audience, Budget, Actual Spend, ROI.',
          'Automations: Generate weekly performance reports; adjust budgets based on performance metrics.',
          'Google Ads & Bing Marketing: Manages PPC campaigns across platforms.',
          'Email, SMS, WhatsApp, and Push Notifications: Coordinates all direct marketing campaigns.',
          'Custom Fields: Campaign Type, Content Schedule, Engagement Rate, Conversion Rate.',
          'Automations: Schedule campaigns based on customer interaction history; A/B test messaging.'
        ]
      },
      {
        type: 'heading',
        text: 'Website and Branding'
      },
      {
        type: 'subheading',
        text: 'Website Health Checks'
      },
      {
        type: 'p',
        text: 'Routine audits to ensure optimal functionality and performance of the website.'
      },
      {
        type: 'label',
        text: 'Custom Fields'
      },
      {
        type: 'list',
        items: [
          'Check Date: Date when the check was performed.',
          'Performance Score: Scores from tools like Google PageSpeed Insights.',
          'SEO Score: SEO performance indicators.',
          'Issues Identified: Specific issues found during the check.',
          'Urgency Level: Priority rating for issue resolution (Low, Medium, High).',
          'Resolution Status: Current status of the issue (Pending, In Progress, Resolved).'
        ]
      },
      {
        type: 'label',
        text: 'Automations'
      },
      {
        type: 'list',
        items: [
          'Trigger a task for tech team to review any \'High\' urgency issues immediately.',
          'Schedule next check based on the previous performance score (lower scores result in more frequent checks).'
        ]
      },
      {
        type: 'subheading',
        text: 'Branding Consistency Reviews'
      },
      {
        type: 'p',
        text: 'Regular reviews to ensure all marketing materials and online content adhere to brand guidelines.'
      },
      {
        type: 'label',
        text: 'Custom Fields'
      },
      {
        type: 'list',
        items: [
          'Review Date: When the review was conducted.',
          'Inconsistencies Found: Details of any deviations from brand guidelines.',
          'Corrected: Checkbox to indicate whether the issue has been resolved.',
          'Responsible Team Member: Who is in charge of resolving the inconsistency.'
        ]
      },
      {
        type: 'label',
        text: 'Automations'
      },
      {
        type: 'list',
        items: [
          'Notify marketing manager of any inconsistencies found.',
          'Set reminders for follow-up checks one week after the initial review.'
        ]
      },
      {
        type: 'subheading',
        text: 'User Experience Optimization'
      },
      {
        type: 'p',
        text: 'Ongoing optimization tasks aimed at improving the overall user experience on the website.'
      },
      {
        type: 'label',
        text: 'Custom Fields'
      },
      {
        type: 'list',
        items: [
          'Task ID: Unique identifier for each optimization task.',
          'Initiation Date: Date when the task was started.',
          'Expected Impact: Estimated improvement in user engagement or satisfaction.',
          'Completion Date: When the task was completed.',
          'Impact Review: Follow-up evaluation of the task’s effectiveness.'
        ]
      },
      {
        type: 'label',
        text: 'Automations'
      },
      {
        type: 'list',
        items: [
          'Automatically generate a follow-up task upon task completion to review its impact after 30 days.',
          'Prioritize tasks based on expected impact, focusing first on those with potential for highest user engagement improvement.'
        ]
      }
    ]
  },
    {
    id: 'clickup-taraki',
    title: 'ClickUp Structure — Taraki Staffing Company',
    description: 'Detailed ClickUp workspace structure for a staffing company’s operations.',
    source: 'Notion',
    url: 'https://glass-suit-7f2.notion.site/Detailed-ClickUp-Structure-for-Taraki-Staffing-Company-6b1a78de474d4db8ac8ab56047edde64?pvs=4',
    tags: [
      'clickup'
    ],
    content: [
      {
        type: 'eyebrow',
        text: 'Main Folder: Taraki Staffing Operations'
      },
      {
        type: 'heading',
        text: 'Recruitment'
      },
      {
        type: 'label',
        text: 'Lists'
      },
      {
        type: 'list',
        items: [
          'Job Postings: Manages the lifecycle of job openings.',
          'Custom Fields: Job ID, Role Title, Department, Status (Open, Filled, On Hold), Date Posted, Location, Salary Range, Job Description.',
          'Automations: Notify recruitment team when a job is posted; send email alerts when status changes; auto-archive roles once filled; reminder for follow-up if position remains unfilled past a target date.',
          'Candidate Screening: Initial assessments to filter candidates.',
          'Custom Fields: Candidate ID, Name, Contact Information, Screening Date, Screening Outcome, Resume Link, Screening Notes.',
          'Automations: Move successful candidates to ‘Interview Scheduling’; send rejection emails automatically to unsuccessful candidates.',
          'Interview Scheduling: Organizes interviews between candidates and hiring managers.',
          'Custom Fields: Interview ID, Candidate ID, Scheduled Date, Interviewer, Format (Virtual, In-person), Interview Notes, Follow-Up Required.',
          'Automations: Reminder notifications to both interviewers and candidates 24 hours before; post-interview follow-up task creation.',
          'Offer Management: Handles job offers and negotiations.',
          'Custom Fields: Candidate ID, Offer Date, Acceptance Status, Start Date, Offer Details, Salary Offered, Benefits.',
          'Automations: Update job posting status to ‘Filled’ upon offer acceptance; trigger onboarding tasks upon offer acceptance.'
        ]
      },
      {
        type: 'heading',
        text: 'Client Management'
      },
      {
        type: 'label',
        text: 'Lists'
      },
      {
        type: 'list',
        items: [
          'Client Accounts: Information and management of all active clients.',
          'Custom Fields: Client ID, Company Name, Contact Person, Service Level Agreement, Account Manager, Last Contact Date, Next Scheduled Review.',
          'Automations: Quarterly review reminders to account managers; update tasks for annual contract renewal.',
          'Project Requests: Staffing requests and requirements from clients.',
          'Custom Fields: Request ID, Client ID, Required Positions, Urgency, Fulfillment Status, Details of Requirements, Expected Fulfillment Date.',
          'Automations: Alert recruitment team when a new request is categorized as ‘Urgent’; status update notifications to clients.'
        ]
      },
      {
        type: 'heading',
        text: 'Compliance and Onboarding'
      },
      {
        type: 'label',
        text: 'Lists'
      },
      {
        type: 'list',
        items: [
          'Compliance Tracking: Ensures all placements meet legal and regulatory requirements.',
          'Custom Fields: Placement ID, Compliance Checklist, Verification Date, Issues, Resolution Status, Compliance Officer.',
          'Automations: Compliance verification task triggered upon every new placement; alerts for unresolved compliance issues.',
          'Employee Onboarding: Streamlined tasks and resources for new hires.',
          'Custom Fields: Employee ID, Onboarding Date, Required Documents, Training Schedule, Onboarding Complete, Mentor Assigned.',
          'Automations: Trigger onboarding process when an offer is accepted; checklists for mentors; notification when onboarding is incomplete.'
        ]
      },
      {
        type: 'heading',
        text: 'Performance Management'
      },
      {
        type: 'label',
        text: 'Lists'
      },
      {
        type: 'list',
        items: [
          'Employee Reviews: Systematic performance reviews.',
          'Custom Fields: Employee ID, Review Period, Performance Score, Feedback, Improvement Plan, Reviewer.',
          'Automations: Schedule next review based on the last review date; reminders for pending reviews; generation of performance improvement tasks if needed.',
          'Client Feedback: Feedback from clients about placed employees.',
          'Custom Fields: Client ID, Employee ID, Feedback Date, Satisfaction Level, Specific Comments, Follow-Up Actions.',
          'Automations: Generate follow-up tasks for client satisfaction management; periodic feedback requests to clients.'
        ]
      }
    ]
  },
    {
    id: 'clickup-vsp',
    title: 'ClickUp — Automating Operations for Veterinary Specialist Partners',
    description: 'ClickUp setup used to automate operations for a veterinary specialist partnership.',
    source: 'Notion',
    url: 'https://glass-suit-7f2.notion.site/Case-Study-Automating-Operations-for-Veterinary-Specialist-Partners-105616625a2a80bc910cfb4d07ff6aea?pvs=74',
    tags: [
      'clickup'
    ],
    content: [
      {
        type: 'heading',
        text: 'Introduction'
      },
      {
        type: 'p',
        text: 'Veterinary Specialist Partners (VSP) is a specialized veterinary hospital with locations in Louisville and Evansville. The hospital is renowned for its expert management of complex medical diseases in pets, ranging from autoimmune disorders and various cancers to critical care involving advanced surgical procedures. Prior to the implementation of automation, VSP managed appointments, patient records, and inter-departmental communications manually, leading to inefficiencies and potential delays in patient care.'
      },
      {
        type: 'p',
        text: 'Recognizing the need to enhance their operational efficiencies and patient service delivery, VSP partnered with our team to transition from a fully manual system to a fully automated one, streamlining everything from appointment booking to patient follow-ups and referrals management.'
      },
      {
        type: 'heading',
        text: 'Background'
      },
      {
        type: 'p',
        text: 'The hospital faced several operational challenges:'
      },
      {
        type: 'list',
        items: [
          'Manual Appointment Scheduling and Management: Reliance on phone and in-person scheduling led to bottlenecks and increased administrative overhead.',
          'Fragmented Patient Records Management: Patient histories and treatment records were dispersed across various platforms, complicating data retrieval and management.',
          'Inconsistent Follow-Up Communications: Manual processes for scheduling follow-ups and managing patient reminders were prone to human error and inefficiency.'
        ]
      },
      {
        type: 'heading',
        text: 'Objectives'
      },
      {
        type: 'p',
        text: 'The primary goal was to automate critical aspects of VSP’s operations, including:'
      },
      {
        type: 'list',
        items: [
          'Appointment Scheduling and Management: Automate the entire appointment lifecycle, from booking to cancellation.',
          'Patient Data Centralization: Create a unified system for managing patient histories and treatment records.',
          'Automated Communication: Streamline communication with patients regarding appointments and follow-ups.'
        ]
      },
      {
        type: 'heading',
        text: 'Solutions Implemented'
      },
      {
        type: 'subheading',
        text: 'ClickUp Integration and Automation'
      },
      {
        type: 'subheading',
        text: 'Calendly to ClickUp Integration'
      },
      {
        type: 'list',
        items: [
          'New Appointments: Automatically captures every new appointment booked via Calendly and adds it to ClickUp. Distinct lists for different appointment types are maintained for both Louisville and Evansville locations.',
          'Tags and Lists: Appointments are tagged with specific descriptors (e.g., new appointment, recheck appointment) and sorted into corresponding lists in ClickUp to ensure easy access and organization.'
        ]
      },
      {
        type: 'subheading',
        text: 'JotForm Integration'
      },
      {
        type: 'list',
        items: [
          'Form Submission Tracking: Monitors patient compliance with required JotForm submissions post-appointment scheduling. If a form is not submitted, automated reminders are sent via email and SMS two days before the appointment to ensure completion.',
          'Medical Information Integration: Captures and integrates patient medical information from JotForm into ClickUp, linking it directly with the patient’s appointment record for streamlined access.'
        ]
      },
      {
        type: 'subheading',
        text: 'Lab Results Automation'
      },
      {
        type: 'p',
        text: 'Email Integration: Automatically imports email communications and attachments from associated labs directly into ClickUp. This ensures that all pertinent lab results are accessible within the patient’s specific task, eliminating the need for manual email checks and data entry.'
      },
      {
        type: 'subheading',
        text: 'Appointment Cancellation Handling'
      },
      {
        type: 'p',
        text: 'Automated Cancellation Management: If an appointment is canceled in Calendly, the system automatically removes the appointment from the active list and moves it to a ‘Cancelled Appointments’ list. This helps in maintaining accurate and up-to-date appointment statuses without manual intervention.'
      },
      {
        type: 'subheading',
        text: 'Centralized Appointment Management'
      },
      {
        type: 'list',
        items: [
          'Unified Appointment List: A master list called ‘Appointments’ captures and consolidates every appointment from both Louisville and Evansville, regardless of type. This list serves a referral department that requires visibility across all bookings.',
          'Cross-List Synchronization: Changes made in any appointment’s custom fields are dynamically updated across both location-specific and centralized appointment lists. This ensures consistency and accuracy in appointment details across the board.'
        ]
      },
      {
        type: 'subheading',
        text: 'Past Appointment Pruning'
      },
      {
        type: 'p',
        text: 'Automated Cleanup: The system automatically removes appointments whose dates have passed from all lists in ClickUp, helping to keep the database current and focused only on upcoming and actionable appointments.'
      },
      {
        type: 'subheading',
        text: 'Enhanced Scheduling and Reminders'
      },
      {
        type: 'list',
        items: [
          'RingCentral Integration: Utilizes RingCentral to send automated SMS reminders about upcoming appointments, reducing no-show rates and ensuring patients are adequately prepared for their visits.',
          'Dropdown Functionality for Cancellations: Enables staff to cancel appointments directly in ClickUp via a dropdown field change, which then reflects in both ClickUp and Calendly, streamlining the process.'
        ]
      },
      {
        type: 'heading',
        text: 'Outcomes and Results'
      },
      {
        type: 'subheading',
        text: 'Improved Operational Efficiency'
      },
      {
        type: 'list',
        items: [
          'Streamlined Appointment Management: Reduced administrative burden and errors related to manual appointment handling.',
          'Centralized Data Management: Achieved a unified view of patient and lab data across all locations, enhancing data-driven decision-making.'
        ]
      },
      {
        type: 'subheading',
        text: 'Enhanced Communication'
      },
      {
        type: 'list',
        items: [
          'Automated Patient Reminders: Improved patient preparation and reduced no-shows through timely automated reminders.',
          'Referral Hospital Coordination: Strengthened relationships and improved data sharing with referral hospitals.'
        ]
      },
      {
        type: 'heading',
        text: 'Technical Highlights'
      },
      {
        type: 'list',
        items: [
          'ClickUp Customizations: Leveraged custom fields, lists, and automation to create a tailored workflow management system.',
          'Integration Suite: Seamlessly integrated with Calendly, JotForm, Gmail, RingCentral, and Slack to centralize operations and communications.'
        ]
      },
      {
        type: 'heading',
        text: 'Future Steps and Sustainability'
      },
      {
        type: 'list',
        items: [
          'Continue refining the integration based on user feedback and system performance.',
          'Explore additional automation opportunities to further enhance efficiency and patient care.'
        ]
      },
      {
        type: 'heading',
        text: 'Screenshots'
      },
      {
        type: 'img',
        file: 'case-content/clickup-vsp/image1.png'
      },
      {
        type: 'img',
        file: 'case-content/clickup-vsp/image2.png'
      },
      {
        type: 'img',
        file: 'case-content/clickup-vsp/image3.png'
      },
      {
        type: 'img',
        file: 'case-content/clickup-vsp/image4.png'
      },
      {
        type: 'heading',
        text: 'Conclusion'
      },
      {
        type: 'p',
        text: 'The implementation of ClickUp and the integration of essential tools have revolutionized Veterinary Specialist Partners’ operations, positioning them to continue delivering exceptional care with enhanced efficiency and accuracy. This case study illustrates the power of tailored automation solutions in solving complex operational challenges in healthcare environments.'
      }
    ]
  },
    {
    id: 'monday-vsp',
    title: 'Monday.com Setup — Veterinary Specialist Partners',
    description: 'Monday.com board setup built for Veterinary Specialist Partners’ operations.',
    source: 'Notion',
    url: 'https://glass-suit-7f2.notion.site/Setup-of-VSP-with-Monday-com-114616625a2a8028a61ce5cc2cb1f31d?pvs=4',
    tags: [
      'monday'
    ],
    content: [
      {
        type: 'heading',
        text: 'Introduction'
      },
      {
        type: 'p',
        text: 'Veterinary Specialist Partners (VSP) is a specialized veterinary hospital network with facilities in Louisville and Evansville, known for its expert handling of complex medical conditions in pets. Before automating their operations, VSP managed appointments, patient records, and inter-departmental communications manually, which often led to inefficiencies and potential delays in patient care.'
      },
      {
        type: 'p',
        text: 'To enhance operational efficiency and patient service delivery, VSP partnered with our team to transition from a fully manual system to an automated solution using monday.com, aiming to streamline processes from appointment booking to patient follow-ups and referrals management.'
      },
      {
        type: 'heading',
        text: 'Background'
      },
      {
        type: 'p',
        text: 'The hospital faced significant operational challenges:'
      },
      {
        type: 'list',
        items: [
          'Manual Appointment Scheduling and Management: Dependent on phone and in-person scheduling, causing bottlenecks and increased administrative overhead.',
          'Fragmented Patient Records Management: Dispersed patient histories and treatment records across various platforms, complicating data retrieval and management.',
          'Inconsistent Follow-Up Communications: Manual processes for scheduling follow-ups and managing patient reminders were error-prone and inefficient.'
        ]
      },
      {
        type: 'heading',
        text: 'Objectives'
      },
      {
        type: 'p',
        text: 'The main objectives for implementing monday.com were to:'
      },
      {
        type: 'list',
        items: [
          'Automate Appointment Scheduling and Management: Streamline the entire appointment lifecycle, from booking through cancellation.',
          'Centralize Patient Data: Create a unified system for managing patient histories and treatment records.',
          'Automate Communication: Enhance communication with patients regarding appointments and follow-ups.'
        ]
      },
      {
        type: 'heading',
        text: 'Solutions Implemented'
      },
      {
        type: 'subheading',
        text: 'Monday.com Integration and Automation'
      },
      {
        type: 'subheading',
        text: 'Automated Appointment System'
      },
      {
        type: 'list',
        items: [
          'Automated Appointments: Every new appointment booked is automatically captured and added to a specific monday.com board designated for appointments. Separate groups are maintained for each type of appointment and location.',
          'Patient Registration and Check-In: Automated processes for patient registration and check-in ensure that all necessary patient information is captured and stored in monday.com, linked directly to their respective appointment entries.'
        ]
      },
      {
        type: 'subheading',
        text: 'Integration with External Scheduling Tools'
      },
      {
        type: 'list',
        items: [
          'Calendly Integration: Direct integration with Calendly allows seamless synchronization of appointment bookings and cancellations, updating monday.com boards in real-time.',
          'Email and SMS Reminders: Automated email and SMS reminders are set up to notify patients about upcoming appointments, using integration with email platforms and SMS gateways.'
        ]
      },
      {
        type: 'subheading',
        text: 'Patient Records Management'
      },
      {
        type: 'list',
        items: [
          'Centralized Records: All patient records are consolidated within monday.com. Custom forms are used to collect and upload medical histories, treatment records, and other relevant documents directly into the system.',
          'Access Control: Different access levels are set for various team members, ensuring sensitive patient information is handled securely and in compliance with medical privacy regulations.'
        ]
      },
      {
        type: 'subheading',
        text: 'Task Automation for Follow-Ups and Referrals'
      },
      {
        type: 'list',
        items: [
          'Follow-Up Automation: Automated tasks are created for follow-ups, ensuring patients receive timely care post-appointment. These tasks are linked to specific appointments for easy tracking.',
          'Referral Management: A dedicated board manages referrals to and from other specialists. Each referral triggers specific workflows to ensure no patient is overlooked and all records are shared with relevant parties.'
        ]
      },
      {
        type: 'heading',
        text: 'Outcomes and Results'
      },
      {
        type: 'subheading',
        text: 'Improved Operational Efficiency'
      },
      {
        type: 'list',
        items: [
          'Streamlined Appointment Handling: Reduction in administrative workload and minimized errors related to manual appointment management.',
          'Centralized Data Management: Unified patient records enhanced data-driven decision-making, enabling better patient care and easier compliance with healthcare regulations.'
        ]
      },
      {
        type: 'subheading',
        text: 'Enhanced Communication'
      },
      {
        type: 'list',
        items: [
          'Reliable Patient Reminders: Decreased no-show rates through timely, automated reminders.',
          'Improved Referral Coordination: Strengthened relationships with other healthcare providers and ensured comprehensive patient care through efficient referral management.'
        ]
      },
      {
        type: 'heading',
        text: 'Technical Highlights'
      },
      {
        type: 'list',
        items: [
          'monday.com Customizations: Extensive use of custom fields, automation rules, and integrations tailored the workflow specifically to VSP’s needs.',
          'Integration Suite: Seamless integration with external tools like Calendly, email platforms, SMS gateways, and medical record software to centralize operations and communication.'
        ]
      },
      {
        type: 'heading',
        text: 'Future Steps and Sustainability'
      },
      {
        type: 'list',
        items: [
          'Ongoing Optimization: Continual refinement of the system based on user feedback and evolving needs.',
          'Expansion of Automation: Exploring further automation opportunities to enhance other areas of hospital operations.'
        ]
      },
      {
        type: 'heading',
        text: 'Conclusion'
      },
      {
        type: 'p',
        text: 'The implementation of monday.com revolutionized VSP’s operations, enabling them to deliver exceptional care with greater efficiency and precision. This case study demonstrates the transformative impact of customized automation solutions in complex healthcare settings, proving monday.com’s capability to handle intricate workflows and extensive data management.'
      }
    ]
  },
  {
    id: 'airtable-legal',
    title: 'Rebuilding Case Management on Airtable (Legal)',
    description: 'How Harrington & Cole LLP replaced four disconnected tools with one Airtable workspace — cutting matter-intake time by 68% and automating 1,200+ status touchpoints a month.',
    source: 'Case Study',
    url: '',
    tags: ['airtable'],
    content: [
  { type: 'list', items: [
    'Client: Harrington & Cole LLP',
    'Industry: Legal services',
    'Practice areas: Litigation, Corporate, Employment',
    'Firm size: 42 attorneys, 18 staff',
    'Project duration: 11 weeks (discovery → go-live)',
    'Deliverables: 10 tables, 8 automations, 3 interfaces',
  ] },

  { type: 'eyebrow', text: 'Executive Summary' },
  { type: 'heading', text: 'A modern operating system for a mid-size law firm' },
  { type: 'p', text: 'Harrington & Cole LLP is a 60-person law firm headquartered in Halifax, Nova Scotia, with three practice groups and a docket of roughly 230 active matters at any given time. By early 2025 the firm was running case intake, conflict checks, scheduling and time capture across four disconnected systems: a legacy practice-management tool, shared Excel files on a network drive, Outlook calendars, and a paper intake form. Status updates lived in attorneys’ heads and email threads.' },
  { type: 'p', text: 'Over an 11-week engagement we replaced this patchwork with a single Airtable workspace — purpose-built tables, role-specific Interfaces for attorneys and paralegals, and an automation layer that handles the firm’s repetitive coordination work. The implementation was delivered without disruption to billable work and went live with all 60 users on the same day.' },
  { type: 'subheading', text: 'Outcomes after 90 days in production' },
  { type: 'stats', items: [
    { value: '68%', label: 'Faster matter intake' },
    { value: '1,284', label: 'Automated touchpoints / mo.' },
    { value: '0', label: 'Missed SOL deadlines' },
    { value: '$41K', label: 'Recovered WIP in Q1' },
  ] },
  { type: 'label', text: 'At a glance' },
  { type: 'p', text: 'Before: 4 systems, ~6 hrs to open a new matter, manual conflict checks, scheduling done by email.' },
  { type: 'p', text: 'After: 1 Airtable workspace, ~2 hrs to open a matter end-to-end, conflict-check workflow runs in < 60 seconds, hearing prep tasks auto-spawn 14 days out.' },

  { type: 'eyebrow', text: 'Background' },
  { type: 'heading', text: 'The client and the problem' },
  { type: 'subheading', text: 'About the firm' },
  { type: 'p', text: 'Harrington & Cole LLP serves regional commercial clients across Atlantic Canada. Three practice groups — litigation, corporate / transactional, and employment — share a managing partner, a central paralegal pool, and a single billing department. The firm had grown roughly 40% in headcount over five years; its tooling had not kept up.' },
  { type: 'subheading', text: 'The pain points that triggered the project' },
  { type: 'list', items: [
    'Matter intake took up to six hours. A new lead required duplicate data entry across four systems, with manual conflict checks against an Excel register that one paralegal owned.',
    'Status was invisible. Partners had no reliable view of which matters were stuck in discovery, which were close to trial, or which had open balances over 60 days.',
    'Deadline slips were happening. Two near-misses on statute-of-limitations dates in 2024 prompted the managing partner to require automated alerting as a non-negotiable.',
    'Time capture was lossy. Attorneys logged time at week-end from memory; the firm estimated 6–9% of billable hours were being lost.',
    'Reporting was a fire drill. The monthly management report took the office manager roughly two days to assemble from exports.',
  ] },
  { type: 'subheading', text: 'Why Airtable' },
  { type: 'p', text: 'The firm evaluated three traditional practice-management products and Airtable. The decision came down to three factors: (1) the firm wanted a system its own staff could change without a vendor ticket, (2) the data model needed to fit the firm’s terminology rather than force the firm into a vendor’s, and (3) the integration story with Slack, Outlook and DocuSign needed to be straightforward. Airtable’s linked-record model, Interface Designer, and native automation framework made it the right fit.' },

  { type: 'eyebrow', text: 'Approach' },
  { type: 'heading', text: 'How the implementation was run' },
  { type: 'p', text: 'We delivered the implementation in four phases over eleven weeks. A core working group — the managing partner, two senior associates (one per practice area), the office manager, and a paralegal lead — met twice a week to validate the data model, review prototypes, and sign off on go-live readiness.' },
  { type: 'table', headers: ['Phase', 'Weeks', 'What we did', 'Output'], rows: [
    ['1. Discovery', '1–2', 'Shadowed intake, conflict-check and billing workflows. Mapped 14 existing data sources. Interviewed 11 attorneys and staff.', 'Process map, data dictionary, ranked pain-point list.'],
    ['2. Data model & schema', '3–4', 'Designed 10-table relational schema. Built linked records for Cases ↔ Clients ↔ Hearings ↔ Documents ↔ Tasks ↔ Time entries.', 'Live Airtable base with sample data; ER diagram.'],
    ['3. Interfaces & automations', '5–8', 'Built the Attorney Dashboard, the Paralegal Workbench and the Partner Reporting interfaces. Designed and tested 8 automations.', '3 production interfaces; automation library.'],
    ['4. Migration, training, go-live', '9–11', 'Migrated 1,847 historical matters, trained all 60 users in three cohorts, ran a 5-day parallel-run before cutover.', 'Single-day cutover with zero data loss.'],
  ] },
  { type: 'subheading', text: 'Guiding principles' },
  { type: 'list', items: [
    'Match the firm’s vocabulary. Field names mirror how attorneys actually speak (e.g. matter, not project; SOL date, not deadline).',
    'One source of truth. Every piece of data lives in exactly one table; everywhere else uses a linked record, lookup or rollup.',
    'Make the right thing the easy thing. Intake, conflict checks, and time capture were redesigned so the compliant workflow is the fastest workflow.',
    'Internal ownership. The office manager and one senior paralegal were trained as base administrators; they own day-to-day changes.',
  ] },

  { type: 'eyebrow', text: 'What Was Built' },
  { type: 'heading', text: 'The Cases table — the heart of the workspace' },
  { type: 'p', text: 'Every matter the firm works on is a record in the Cases table. From here, attorneys can see the entire docket grouped by practice area, filtered to their own matters, or sliced by stage. The grid below shows the production view used by senior associates each morning to triage their day.' },
  { type: 'img', file: 'case-content/airtable-legal/page5-img1.png', caption: 'Figure 1 — The Cases grid view, grouped by practice area. Coloured stage chips give partners an at-a-glance read on where every matter sits. The footer rolls up open balances and average days-open across the visible records.' },
  { type: 'subheading', text: 'Highlights of this view' },
  { type: 'list', items: [
    'Grouping by practice area mirrors how the managing partner thinks about workload distribution.',
    'Stage is a single-select with a controlled vocabulary (Intake → Pleadings → Discovery → Negotiation → Trial Prep → Closed). It drives both the kanban view and three automations.',
    'Lead Attorney links to the Staff table, so renaming or reassigning happens in one place.',
    'Open Balance at the bottom is a rollup from the Time entries table — no manual reconciliation needed.',
  ] },
  { type: 'subheading', text: 'Two more views the firm uses every day' },
  { type: 'p', text: 'Kanban by stage is how partners review pipeline in their Monday morning meeting. Dragging a card moves the matter through the lifecycle and triggers the corresponding automation chain.' },
  { type: 'img', file: 'case-content/airtable-legal/page6-img1.png', caption: 'Figure 2 — Kanban view of the Cases table, grouped by stage. Card colour and the avatar in the corner make ownership obvious even on a wall display.' },
  { type: 'subheading', text: 'The expanded matter record' },
  { type: 'p', text: 'Clicking any row opens a full-detail view of the matter. This is the single screen attorneys live in when they’re working a case — it consolidates parties, deadlines, team, financials and notes. WIP and Open Balance are rollups from the linked Time entries table; the Statute of Limitations warning is a formula that turns red automatically inside 90 days.' },
  { type: 'img', file: 'case-content/airtable-legal/page7-img1.png', caption: 'Figure 3 — The expanded record view for matter CASE-2024-0142. Rollups, formulas and linked records mean every number on this screen is computed live from the underlying tables — nothing is manually maintained.' },

  { type: 'eyebrow', text: 'The Data Model' },
  { type: 'heading', text: 'Ten tables, one source of truth' },
  { type: 'p', text: 'The base is built around Cases as the central entity. Everything else — clients, hearings, documents, tasks, time, communications — links to a case. This single design decision is what makes the rollups, formulas and automations possible.' },
  { type: 'img', file: 'case-content/airtable-legal/page8-img1.png', caption: 'Figure 4 — The 10-table schema. Lines indicate linked-record relationships. Cases is the hub; Documents, Tasks, Time entries and Communications all link to a case.' },
  { type: 'subheading', text: 'Field-level decisions worth calling out' },
  { type: 'list', items: [
    'Stage is a single-select with synced colour. Changes here trigger 3 different automations.',
    'SOL date is paired with a formula days_until_sol; the alert automation reads the formula field, so all date logic lives in one place.',
    'Conflict_clear on Clients is a checkbox controlled by the conflict-check automation — an intake matter is blocked from advancing until this is true.',
    'Time entries rolls up into Cases as WIP and Open Balance, so billing reports build themselves.',
    'Communications is populated by the Gmail and Outlook integrations — every email about a matter is logged automatically.',
  ] },

  { type: 'eyebrow', text: 'Interfaces' },
  { type: 'heading', text: 'Three role-based interfaces, one underlying base' },
  { type: 'p', text: 'Different people in the firm need different things from the same data. We built three Interfaces on top of the base, each tailored to a role. All three read from and write to the same tables — there is no duplication.' },
  { type: 'subheading', text: 'The Attorney Dashboard' },
  { type: 'p', text: 'This is the screen attorneys open when they sit down at their desk. It surfaces the four KPIs that matter to them, the next 30 days of hearings, and their personal task list — all filtered to their own user automatically.' },
  { type: 'img', file: 'case-content/airtable-legal/page9-img1.png', caption: 'Figure 5 — The Attorney Dashboard interface, scoped to the logged-in user. KPI cards on top; upcoming hearings and personal tasks below. Click-through on any matter title opens the full case record in a side panel.' },
  { type: 'subheading', text: 'Two other interfaces' },
  { type: 'list', items: [
    'Paralegal Workbench — task-centric view. Paralegals can claim open tasks, log time directly against a matter, and upload signed documents which auto-update the matter’s stage.',
    'Partner Reporting — read-only firm-wide view with charts: matters by stage, WIP trend, top 10 oldest open balances, attorney utilisation. Replaces what used to be a 2-day monthly reporting exercise.',
  ] },

  { type: 'eyebrow', text: 'Automations' },
  { type: 'heading', text: 'Automating the repetitive coordination work' },
  { type: 'p', text: 'Eight automations remove roughly 1,200 manual touchpoints from the firm’s month. None of them replace an attorney’s judgment — they remove the surrounding paperwork.' },
  { type: 'img', file: 'case-content/airtable-legal/page10-img1.png', caption: 'Figure 6 — The Automations panel. Eight automations, six currently enabled, with run counts visible per automation. The detail pane on the right shows the trigger and three actions of the hearing-reminder workflow.' },
  { type: 'subheading', text: 'The automation catalogue' },
  { type: 'p', text: 'Each automation is owned by a named person on the working group, documented in a Notion runbook, and reviewed quarterly.' },
  { type: 'table', headers: ['#', 'Automation', 'Trigger', 'Actions', 'Replaces'], rows: [
    ['1', 'New case → Conflict check workflow', 'Record created in Cases with stage = Intake', 'Searches Clients table for matches against parties, opposing counsel and judges. Posts result to Slack and sets conflict_clear if no match.', 'Manual lookup in Excel register'],
    ['2', 'Hearing date approaching (14 d)', 'days_until formula on Hearings = 14 and status = Scheduled', 'Slack DM to lead attorney + creates 4 prep tasks (brief, exhibits, witness prep, filings).', 'Calendar reminders + paralegal phone calls'],
    ['3', 'Statute of limitations alert (90/30/7 days)', 'Cases.days_until_sol formula crosses each threshold', 'Email to lead attorney; at 30d also CCs managing partner; at 7d escalates to a Slack channel.', 'Memory + a paper wall calendar'],
    ['4', 'Document e-signed → update matter stage', 'Webhook from DocuSign on signed engagement letter', 'Sets matter stage to Pleadings (or Drafting), creates kickoff tasks, notifies billing.', 'Manual stage update + email to billing'],
    ['5', 'Time entry > 8 hr/day → notify partner', 'Time entry created with hours > 8 on a single day', 'Slack DM to managing partner with link to the entry.', 'End-of-month review (often too late)'],
    ['6', 'Client onboarding sequence', 'Clients.conflict_clear changes to true', 'Sends client engagement letter via DocuSign, creates Drive folder with templates, books an intake call.', 'Three separate manual checklists'],
    ['7', 'Weekly WIP digest', 'Schedule: every Monday 7:00 AM', 'Builds per-attorney summary of WIP, billed and aged AR; emails each lead attorney their digest.', 'Office manager spending Friday building reports'],
    ['8', 'Stale matter (no activity 30 d)', 'Schedule: nightly scan', 'Sets a flag field; visible on the Partner Reporting interface for follow-up.', 'Nothing — these matters used to disappear'],
  ] },
  { type: 'subheading', text: 'Worked example — automation #2 in detail' },
  { type: 'list', items: [
    'Trigger: a record in Hearings where the days_until formula evaluates to exactly 14 and status is Scheduled.',
    'Action 1 — Find records: looks up the parent Case via the linked-record field to retrieve the lead attorney and client.',
    'Action 2 — Send Slack: DMs the lead attorney with a deep link back to the case record and a one-line summary of the hearing.',
    'Action 3 — Create tasks: creates four pre-templated prep tasks in the Tasks table, all linked to the same matter, with sensible default due dates working back from the hearing.',
    'Replaced: three different paralegals each maintaining their own version of a hearing-prep checklist, and the senior associate manually pinging attorneys.',
  ] },

  { type: 'eyebrow', text: 'Integrations' },
  { type: 'heading', text: 'How the workspace connects to the rest of the stack' },
  { type: 'p', text: 'Airtable doesn’t replace email, calendars, document storage or e-signature — and shouldn’t. It coordinates them.' },
  { type: 'table', headers: ['System', 'Direction', 'What flows', 'Mechanism'], rows: [
    ['Outlook / Microsoft 365', 'Two-way', 'Hearings sync to attorney calendars; calendar invites for new hearings auto-create Hearing records.', 'Microsoft Graph + Airtable sync'],
    ['Gmail (firm address)', 'One-way (in)', 'Email referencing a matter ID is logged to the Communications table with a link back to the thread.', 'Native Airtable Gmail integration'],
    ['DocuSign', 'Two-way', 'Engagement letters dispatched from Airtable; signed status triggers automation #4.', 'Webhooks via Airtable Automations'],
    ['Slack', 'One-way (out)', 'Hearing reminders, SOL alerts, time-entry alerts, weekly WIP digests.', 'Native Slack action in Airtable Automations'],
    ['Google Drive', 'One-way (out)', 'On client onboarding, a structured matter folder is created with the firm’s standard subfolder template.', 'Drive API call from Airtable script action'],
    ['Notion', 'Reference only', 'Runbooks for each automation live in Notion; each Automation record has a URL field linking to its runbook.', 'Manual link'],
  ] },
  { type: 'subheading', text: 'Permissions & data handling' },
  { type: 'list', items: [
    'Workspace plan: Airtable Business with SAML SSO via the firm’s identity provider. Two-factor authentication enforced for all 60 users.',
    'Field-level permissions: rate cards, WIP and AR fields are read-only to associates; visible only to partners on the Partner Reporting interface.',
    'Privileged matters: a checkbox on Cases hides a matter from all users not on its team via a row-level filter applied to every view.',
    'Audit: Airtable’s revision history is retained, and a nightly snapshot is exported to the firm’s encrypted backup bucket.',
  ] },

  { type: 'eyebrow', text: 'Results' },
  { type: 'heading', text: 'Measurable change after 90 days in production' },
  { type: 'table', headers: ['Metric', 'Before', 'After', 'Change'], rows: [
    ['Matter intake (lead → opened)', '≈ 6 hours', '≈ 1 hr 55 min', '−68%'],
    ['Conflict check turnaround', 'Up to 48 hr', '< 60 sec (automated)', '−99%'],
    ['Missed SOL deadlines (rolling 12 mo.)', '2 near-misses', '0', '−100%'],
    ['Monthly management report build time', '≈ 14 hours', '≈ 25 min (live dashboard)', '−97%'],
    ['Time-entry capture latency', 'Avg. 4.2 days', 'Avg. 0.6 days', '−86%'],
    ['WIP recovered Q1 (vs. prior quarter)', '—', '$41,200', '+ revenue'],
    ['Automated touchpoints / month', '0', '1,284 (across 6 active flows)', '—'],
    ['Active users (firm-wide)', '—', '60 / 60', '100% adoption'],
  ] },
  { type: 'subheading', text: 'In the words of the firm' },
  { type: 'quote', text: 'The thing that surprised me wasn’t the dashboards — it was the fact that we don’t talk about case status in hallways anymore. Everyone is looking at the same picture, and the system tells us when something needs attention before it becomes a fire. We have not had a near-miss on a deadline since the day we went live.', attribution: 'Managing Partner — Harrington & Cole LLP' },
  { type: 'subheading', text: 'What we’d do again, and what we’d change' },
  { type: 'list', items: [
    'Worked well: embedding the working group from week one. Every design decision had a real attorney’s name attached to it, which made go-live painless.',
    'Worked well: shipping the Attorney Dashboard before the Partner Reporting interface. Adoption is driven by the people doing the work, not the people watching the work.',
    'Would change: we waited until phase 3 to wire up the Outlook two-way sync. In hindsight, that should have been in phase 2 — calendars are how attorneys actually work.',
    'Would change: add a fifth interface for the firm’s receptionist. Inbound caller intake is still slightly clunky.',
  ] },
]
  },
  {
    id: 'airtable-saas',
    title: 'Cutting Churn Before the Ticket Arrives (SaaS)',
    description: 'How Loomstack Inc. consolidated its customer-success stack into a single Airtable workspace — surfacing at-risk accounts 47 days earlier and lifting net revenue retention from 102% to 114%.',
    source: 'Case Study',
    url: '',
    tags: ['airtable'],
    content: [
  { type: 'list', items: [
    'Client: Loomstack Inc.',
    'Industry: B2B SaaS — workflow automation',
    'Segment: Series B, Enterprise + Mid-Market',
    'Company size: 180 employees, 14 CSMs',
    'Project duration: 9 weeks (discovery → go-live)',
    'Deliverables: 11 tables, 9 automations, 3 interfaces',
  ] },

  { type: 'eyebrow', text: 'Executive Summary' },
  { type: 'heading', text: 'A purpose-built customer-success workspace' },
  { type: 'p', text: 'Loomstack Inc. is a Series B B2B SaaS company providing workflow automation tooling to mid-market and enterprise customers, with roughly $24M ARR across 280 paying accounts. By Q4 2025 the customer success team was operating across five disconnected tools: HubSpot for CRM data, Zendesk for support tickets, Stripe for subscriptions, a homegrown product-usage dashboard, and a sprawl of Google Sheets for everything that didn’t fit elsewhere. Health scoring was a quarterly spreadsheet exercise, and renewal forecasts were assembled by hand the week before each board meeting.' },
  { type: 'p', text: 'Over a 9-week engagement we replaced this stack’s coordination layer with a single Airtable workspace — a unified accounts table, computed health scores updated nightly, role-specific Interfaces for CSMs and the VP, and an automation suite that triggers playbooks before churn risk turns into a churn ticket. HubSpot, Zendesk and Stripe still own their primary data; Airtable is the operating surface on top.' },
  { type: 'subheading', text: 'Outcomes after 90 days in production' },
  { type: 'stats', items: [
    { value: '114%', label: 'Net revenue retention' },
    { value: '47 d', label: 'Earlier risk detection' },
    { value: '3,742', label: 'Automated runs / mo.' },
    { value: '$1.2M', label: 'Saved ARR (Q1)' },
  ] },
  { type: 'label', text: 'At a glance' },
  { type: 'p', text: 'Before: 5 disconnected tools, quarterly health scoring done in a spreadsheet, renewal forecast assembled by hand, average risk detection lag of 51 days.' },
  { type: 'p', text: 'After: 1 Airtable workspace as the CS operating layer, health scores recomputed nightly, live forecast on the VP dashboard, average risk detection lag of 4 days.' },

  { type: 'eyebrow', text: 'Background' },
  { type: 'heading', text: 'The client and the problem' },
  { type: 'subheading', text: 'About Loomstack' },
  { type: 'p', text: 'Loomstack sells a workflow automation platform to mid-market and enterprise operations teams across North America and EMEA. Headcount is 180; the customer-facing org is split into 14 CSMs (segmented by Enterprise / Mid-Market), 6 support engineers, and 4 account executives covering expansion. The CS leadership reports to a VP of Customer Success who in turn reports to the COO.' },
  { type: 'subheading', text: 'The pain points that triggered the project' },
  { type: 'list', items: [
    'Churn was being detected too late. The first signal an account was in trouble was usually a renewal coming up in 30 days and a CSM scrambling. Two enterprise logos worth $640K combined churned in Q3 2025 with effectively no warning.',
    'Health scoring was theatre. A quarterly spreadsheet exercise produced colour-coded statuses that nobody trusted — by the time it shipped, the underlying data was already 4–6 weeks stale.',
    'CSMs lived in eight tabs. A typical customer review meant opening HubSpot, Zendesk, Stripe, Mixpanel, the usage dashboard, the renewal sheet, the QBR notes doc, and the Slack channel — for every account.',
    'Forecasts were unreliable. The VP’s renewal forecast was built in a spreadsheet from CSM-submitted estimates; variance against actuals was running ±22% per quarter.',
    'Playbooks didn’t run. The CS playbook library lived in Notion but was almost never triggered, because nothing automatically noticed when a playbook should fire.',
  ] },
  { type: 'subheading', text: 'Why Airtable' },
  { type: 'p', text: 'Loomstack evaluated three category-leading customer success platforms and Airtable. The decision came down to four factors: (1) Loomstack already had clean data sitting in HubSpot, Zendesk and Stripe — what they needed wasn’t another database, but a coordination layer on top, (2) the CS ops team wanted to own the system and iterate on it weekly without a vendor implementation queue, (3) the health-score formula needed to be theirs, not a vendor’s black box, and (4) integration with Slack was non-negotiable. Airtable’s linked-record model, sync sources, and native Slack actions made it the right fit.' },

  { type: 'eyebrow', text: 'Approach' },
  { type: 'heading', text: 'How the implementation was run' },
  { type: 'p', text: 'We delivered the implementation in four phases over nine weeks. A core working group — the VP of Customer Success, two senior CSMs (one per segment), the head of CS Ops, and a RevOps analyst — met twice a week to validate the data model, review prototypes, and approve each automation before it went live.' },
  { type: 'table', headers: ['Phase', 'Weeks', 'What we did', 'Output'], rows: [
    ['1. Discovery', '1–2', 'Shadowed CSMs through 5 customer reviews. Audited HubSpot, Zendesk, Stripe and the usage dashboard. Workshopped the health-score formula with leadership.', 'Process map, data dictionary, agreed health-score definition.'],
    ['2. Data model & sync', '3–4', 'Designed 11-table relational schema. Configured one-way syncs from HubSpot (accounts/contacts), Stripe (subscriptions) and Zendesk (tickets).', 'Live Airtable base with synced data; ER diagram.'],
    ['3. Interfaces & automations', '5–7', 'Built the CSM Command Center, the Account Detail Workspace and the VP Forecast Room. Designed and tested 9 automations.', '3 production interfaces; automation library.'],
    ['4. Pilot, training, go-live', '8–9', 'Piloted with 4 CSMs for one week, trained all 14 CSMs and the VP team, ran a 3-day shadow-mode period before full cutover.', 'Single-day cutover; 14 / 14 CSMs active on day 1.'],
  ] },
  { type: 'subheading', text: 'Guiding principles' },
  { type: 'list', items: [
    'Don’t replace systems of record. HubSpot, Zendesk and Stripe stay as systems of record. Airtable is the system of action on top — pulling from each, surfacing what matters, and writing back where appropriate.',
    'One health score, one definition. Health is a single formula owned by CS leadership, not three competing scores. Every place it appears in the workspace is the same calculation.',
    'Surface signals, don’t bury them. An at-risk account should be impossible to miss. Risk surfaces on the CSM dashboard, the VP forecast, and as a Slack alert — within 24 hours of the signal.',
    'CS Ops owns the base. The head of CS Ops and a RevOps analyst were trained as base administrators and now ship changes weekly without engineering or vendor involvement.',
  ] },

  { type: 'eyebrow', text: 'What Was Built' },
  { type: 'heading', text: 'The Accounts table — the heart of the workspace' },
  { type: 'p', text: 'Every paying customer is a record in the Accounts table. From here, CSMs can see their book of business at a glance, sliced by segment, plan, health band, or renewal window. The grid below shows the production view used by the VP each Monday to triage the team’s at-risk accounts.' },
  { type: 'img', file: 'case-content/airtable-saas/page5-img1.png', caption: 'Figure 1 — The Accounts grid view, grouped by segment and coloured by health band. The footer rolls up total ARR and counts at-risk / critical accounts across the visible records.' },
  { type: 'subheading', text: 'Highlights of this view' },
  { type: 'list', items: [
    'Health is a coloured chip driven by a formula on the record. It’s the same calculation everywhere it’s shown.',
    'ARR is a rollup from the linked Subscriptions table, which is one-way synced from Stripe — no double-entry, no drift.',
    'CSM is a linked record to the Staff table, so rebalancing books happens in one place and propagates everywhere.',
    'NPS (last) is a lookup from the most recent record in the NPS Responses table, refreshed automatically.',
  ] },
  { type: 'subheading', text: 'Two more views the team uses every day' },
  { type: 'p', text: 'Kanban by health band is the view the VP uses on Monday morning. Cards are stack-ordered by ARR, so the largest at-risk accounts always sit at the top. The colour bar on the left of each card encodes the band; the avatar in the corner is the CSM.' },
  { type: 'img', file: 'case-content/airtable-saas/page6-img1.png', caption: 'Figure 2 — Kanban view of the Accounts table, grouped by health band. Healthy / At risk / Critical / Onboarding / Churned columns make book composition obvious in one glance.' },
  { type: 'subheading', text: 'The expanded account record' },
  { type: 'p', text: 'Clicking any row opens the full account detail. This is the screen a CSM lives in during a customer review — every field a CSM might want is on one page, computed live from the underlying tables. The Health Score, Usage Trend, Open Tickets and Days to Renewal all turn red automatically when they cross their respective thresholds.' },
  { type: 'img', file: 'case-content/airtable-saas/page7-img1.png', caption: 'Figure 3 — The expanded record view for ENT-00142 (Halcyon Robotics). Notice that the timeline at the bottom shows the champion-change event detected on Apr 18 that automatically triggered a save playbook.' },

  { type: 'eyebrow', text: 'The Data Model' },
  { type: 'heading', text: 'Eleven tables, one source of truth' },
  { type: 'p', text: 'The base is built around Accounts as the central entity. Everything else — contacts, subscriptions, tickets, health scores, renewals, playbooks, NPS responses — links back to an account. This single design decision is what makes the rollups, formulas and automations possible.' },
  { type: 'img', file: 'case-content/airtable-saas/page8-img1.png', caption: 'Figure 4 — The 11-table schema. Accounts is the hub; Subscriptions and Tickets are synced from Stripe and Zendesk respectively; the rest is native to Airtable.' },
  { type: 'subheading', text: 'Field-level decisions worth calling out' },
  { type: 'list', items: [
    'health_score is a single formula combining four sub-scores: usage (40%), support (25%), NPS (20%), commercial signals (15%). Weights live in a Settings table so leadership can tune them without code changes.',
    'health_band is a derived formula (Healthy / At risk / Critical) with bands at 80 and 60 — the only place the thresholds are defined in the entire workspace.',
    'days_to_renewal is a formula reading from renewal_date; the renewal automations all read this field, so date arithmetic lives in one place.',
    'Subscriptions is one-way synced from Stripe — Airtable doesn’t write back. ARR is rolled up from synced rows.',
    'Tickets is one-way synced from Zendesk every 15 minutes — open_tickets on the Account is a count rollup.',
  ] },

  { type: 'eyebrow', text: 'Interfaces' },
  { type: 'heading', text: 'Three role-based interfaces, one underlying base' },
  { type: 'p', text: 'Different people on the CS org need different things from the same data. We built three Interfaces on top of the base, each tailored to a role. All three read from and write to the same tables — there is no duplication.' },
  { type: 'subheading', text: 'The CSM Command Center' },
  { type: 'p', text: 'This is the screen a CSM opens when they sit down at their desk. It surfaces the four KPIs that matter to them, the live health distribution of their book, a renewal forecast for the next six months, and a prioritised list of accounts that need attention today — all filtered to their book automatically.' },
  { type: 'img', file: 'case-content/airtable-saas/page9-img1.png', caption: 'Figure 5 — The CSM Command Center, scoped to the logged-in CSM. KPI cards on top; health distribution and renewal forecast charts below; on the right, the accounts that need attention today, sorted by ARR × risk.' },
  { type: 'subheading', text: 'Two other interfaces' },
  { type: 'list', items: [
    'Account Detail Workspace — the single screen a CSM uses during a customer review. Live health timeline, ticket history, usage chart, contacts directory, active playbooks, and a notes stream — all on one scrollable page.',
    'VP Forecast Room — read-only org-wide view for CS leadership. Net revenue retention trend, weighted renewal forecast by quarter, churn-risk dollar amount, and CSM utilisation. Replaces what used to be a manual Friday afternoon spreadsheet exercise.',
  ] },

  { type: 'eyebrow', text: 'Automations' },
  { type: 'heading', text: 'Automating the work that catches churn early' },
  { type: 'p', text: 'Nine automations remove roughly 3,700 manual touchpoints from the team’s month — but more importantly, they catch churn signals while there’s still time to act. None of them replace a CSM’s judgment; they make sure no signal slips through.' },
  { type: 'img', file: 'case-content/airtable-saas/page10-img1.png', caption: 'Figure 6 — The Automations panel. Nine automations, eight currently enabled, with run counts visible per automation. The detail pane on the right shows the trigger and three actions of the renewal-playbook workflow.' },
  { type: 'subheading', text: 'The automation catalogue' },
  { type: 'p', text: 'Each automation is owned by a named person on the CS Ops team, documented in a Notion runbook, and reviewed monthly.' },
  { type: 'table', headers: ['#', 'Automation', 'Trigger', 'Actions', 'Replaces'], rows: [
    ['1', 'Health score recompute (nightly)', 'Schedule: 2:00 AM, every night', 'Runs the health-score formula across all accounts; writes a row into Health Scores; updates health_band.', 'Quarterly spreadsheet exercise'],
    ['2', 'Score drop > 15 pts → Alert CSM', 'Health Scores.delta_30d < −15', 'Slack DM to CSM + tags account as ‘momentum loss’; logs into the activity timeline.', 'Nothing — drops were missed'],
    ['3', 'Renewal in 90/60/30 days → Playbook', 'Accounts.days_to_renewal IN (90, 60, 30)', 'Branches on plan + health to pick playbook (e.g. Enterprise + <80 → exec save). Spawns 5 linked tasks.', 'Manual playbook lookup in Notion'],
    ['4', 'Trial ending in 7 days → Sales handoff', 'Subscriptions.status = trial AND term_end in 7 days', 'Creates handoff record; assigns AE; Slack DM to AE with usage summary; books a calendar slot.', 'CSM-to-AE handoff via email'],
    ['5', 'New ticket P1 → Slack war room', 'Tickets.priority = P1 (synced from Zendesk)', 'Posts to #cs-warroom; tags CSM, AE, support engineer; creates a Linear issue if flagged.', 'Manual Slack post by support'],
    ['6', 'NPS detractor → Recovery sequence', 'NPS Responses.score ≤ 6', 'Sets account flag; emails CSM with NPS comment; creates a follow-up task due in 48 hours.', 'NPS responses going unread'],
    ['7', 'Usage anomaly → Tag account', 'Usage signal: WAU drop > 25% w/w', 'Sets a ‘usage_drop’ tag; surfaces it on CSM dashboard ‘Needs attention’ panel.', 'Caught (sometimes) at quarter-end'],
    ['8', 'Onboarding day 14/30/60 check-ins', 'Schedule: nightly scan of accounts in Onboarding', 'Spawns the right check-in task at each milestone; emails customer with the day-30 product-tour link.', 'Three different CSM templates'],
    ['9', 'Champion change detected → Playbook', 'Contacts.is_primary changes OR HubSpot role-change signal', 'Creates ‘Champion change’ playbook record; spawns a 5-step exec-meeting save plan.', 'Nothing — usually noticed too late'],
  ] },
  { type: 'subheading', text: 'Worked example — automation #3 in detail' },
  { type: 'list', items: [
    'Trigger: nightly check on every Account where days_to_renewal equals exactly 90, 60, or 30 and status = Active.',
    'Action 1 — Conditional branch: evaluates plan + health. Enterprise + health < 80 routes to Playbook A: Executive Save; everything else routes to Playbook B: Standard Renewal.',
    'Action 2 — Create Playbook + tasks: writes a row in the Playbooks table linked to the account, then spawns 5 tasks with due dates working back from the renewal date.',
    'Action 3 — Notify: Slack DM to the CSM with a deep link to the account; appends the record to the VP’s weekly forecast view.',
    'Replaced: CSMs manually checking renewal calendars and looking up playbooks in Notion — frequently the wrong playbook, frequently too late.',
  ] },

  { type: 'eyebrow', text: 'Integrations' },
  { type: 'heading', text: 'How the workspace connects to the SaaS stack' },
  { type: 'p', text: 'Airtable doesn’t replace HubSpot, Zendesk, Stripe, or the product analytics warehouse — it coordinates them.' },
  { type: 'table', headers: ['System', 'Direction', 'What flows', 'Mechanism'], rows: [
    ['HubSpot', 'One-way (in)', 'Accounts and Contacts sync nightly. Field-level mapping for industry, employee count, lifecycle stage and owner.', 'Airtable HubSpot sync source'],
    ['Stripe', 'One-way (in)', 'Subscription rows sync every 4 hours. ARR rolls up from subscription records to the account.', 'Stripe → Airtable via Zapier'],
    ['Zendesk', 'One-way (in)', 'Tickets sync every 15 minutes. Priority, status, assignee, and time-open are all rollup-able.', 'Native Zendesk sync'],
    ['Slack', 'One-way (out)', 'Health drops, P1 tickets, renewal-playbook triggers, NPS detractor alerts.', 'Native Slack action in Automations'],
    ['Mixpanel / Snowflake', 'One-way (in)', 'Daily WAU and feature-adoption metrics per account, used as inputs to the health score.', 'Snowflake → Airtable via reverse-ETL'],
    ['Linear', 'One-way (out)', 'P1 tickets that need engineering escalation create a Linear issue with customer context attached.', 'Linear API call from script action'],
    ['Gmail / Outlook', 'One-way (out)', 'Customer-facing emails (NPS follow-ups, day-30 onboarding tour) sent from automation actions.', 'Native email actions'],
  ] },
  { type: 'subheading', text: 'Permissions & data handling' },
  { type: 'list', items: [
    'Workspace plan: Airtable Business with SAML SSO via the company’s identity provider. Two-factor authentication enforced for all users.',
    'Field-level permissions: ARR and renewal amounts are read-only for CSMs and hidden from support engineers; visible to AEs and the VP.',
    'Book-level filtering: CSMs see only their own accounts by default on every interface; the VP sees the full org. No CSM can edit another CSM’s accounts.',
    'Audit: Airtable’s revision history is retained, and a nightly backup is exported to the company’s S3 bucket via the Airtable API.',
  ] },

  { type: 'eyebrow', text: 'Results' },
  { type: 'heading', text: 'Measurable change after 90 days in production' },
  { type: 'table', headers: ['Metric', 'Before', 'After', 'Change'], rows: [
    ['Net revenue retention (NRR)', '102%', '114%', '+12 pts'],
    ['Average risk-detection lag', '51 days', '4 days', '−92%'],
    ['Renewal forecast variance', '± 22%', '± 6%', '−73%'],
    ['At-risk ARR identified earlier', '—', '$1.2M (Q1)', '+ saved revenue'],
    ['CSM time spent on reporting', '≈ 6 hr / week', '≈ 45 min / week', '−87%'],
    ['Playbook trigger rate', '≈ 14% of cases', '100% of cases', '+ coverage'],
    ['Automated touchpoints / month', '0', '3,742 across 8 active flows', '—'],
    ['CSM adoption (firm-wide)', '—', '14 / 14 active on day 1', '100%'],
  ] },
  { type: 'subheading', text: 'In the words of the team' },
  { type: 'quote', text: 'The thing that changed isn’t really the dashboard — it’s that the team has time. My CSMs aren’t building reports any more, they’re actually talking to customers. And when an account starts going sideways, we know about it the next morning, not three weeks later when the renewal blows up. We saved $1.2M of ARR last quarter that would otherwise have walked out the door.', attribution: 'VP of Customer Success — Loomstack Inc.' },
  { type: 'subheading', text: 'What we’d do again, and what we’d change' },
  { type: 'list', items: [
    'Worked well: co-designing the health-score formula with leadership in week 1. Because they owned it from day one, nobody argued with the scores once they started shipping.',
    'Worked well: shipping the CSM Command Center first and the VP Forecast Room last. Adoption follows the front line.',
    'Would change: we underestimated the data-cleanup burden in HubSpot during phase 2. About 11% of accounts had missing or stale ownership; cleaning that up consumed three days we hadn’t planned for.',
    'Would change: add an in-product feedback widget that writes directly to the NPS Responses table — the current Typeform-based flow has a higher drop-off than we’d like.',
  ] },
]
  },
  {
    id: 'powerbi-bnb-heaven',
    title: 'Power BI — Turning Five Booking Systems Into One Revenue Engine',
    description: 'A governed Power BI model and two dashboards that replaced three days of manual owner-statement assembly with an automated daily refresh for a short-term rental portfolio.',
    source: 'Portfolio',
    tags: [
      'power-bi'
    ],
    content: [
      {
        type: 'eyebrow',
        text: 'Power BI Case Study'
      },
      {
        type: 'p',
        text: 'BnB Heaven — short-term rental & boutique B&B management · 6-week engagement'
      },
      {
        type: 'stats',
        items: [
          {
            value: '5 → 1',
            label: 'Systems unified'
          },
          {
            value: '~90%',
            label: 'Less reporting effort'
          },
          {
            value: 'Daily',
            label: 'Automated 06:00 refresh'
          },
          {
            value: '6 wks',
            label: 'Concept to live rollout'
          }
        ]
      },
      {
        type: 'p',
        text: 'BnB Heaven manages a portfolio of short-term rentals and boutique B&Bs across the UK. Bookings arrived from Airbnb, Booking.com, Vrbo and their own direct site; cleaning and turnovers lived in the ops tool; finance sat in the accounting system. Owner statements and the monthly board pack took three days to assemble by hand. This case study shows how we consolidated everything into one governed Power BI model with two dashboards — cutting reporting effort by roughly 90% and giving the team occupancy, rate and channel-profitability numbers they finally trust.'
      },
      {
        type: 'eyebrow',
        text: 'The Challenge'
      },
      {
        type: 'p',
        text: 'Before the project, \'how are we doing?\' was a surprisingly hard question to answer. Three problems came up in every conversation with the team.'
      },
      {
        type: 'list',
        items: [
          'Bookings scattered across platforms: Revenue lived in Airbnb, Booking.com, Vrbo and the direct site, with turnovers in the PMS and money in accounting. Nobody could see occupancy, nightly rate and net revenue in one place without exporting several files first.',
          'Owner statements ate three days a month: A manager rebuilt every owner statement and the board pack by hand — copy, paste, reconcile, repeat. By the time they were ready the numbers were weeks old, and one slip meant redoing the lot.',
          'No shared version of the truth: Channel profitability after platform fees was invisible. It wasn’t clear which channels actually paid off once commissions were taken out, so pricing and listing decisions were made on gut feel.'
        ]
      },
      {
        type: 'eyebrow',
        text: 'The Approach'
      },
      {
        type: 'p',
        text: 'Rather than bolt a chart onto each platform, we built one properly modelled layer underneath a small number of focused dashboards. Four phases over six weeks:'
      },
      {
        type: 'list',
        items: [
          'Discovery & metric definitions (week 1): Workshops to agree exactly what occupancy, ADR, RevPAR and net-of-fees revenue mean — one signed-off definition each, so the model has a single source of truth.',
          'Connect & clean with Power Query (weeks 2–3): ETL into all five sources, standardised property and channel keys, and consistent handling of platform fees, refunds and cancellations so figures reconcile to the accounts.',
          'Star-schema model & DAX (weeks 3–4): A clean fact-and-dimension model with a shared date table, reusable DAX measures (occupancy, ADR, RevPAR, YoY, target) and row-level security so each owner sees only their own properties.',
          'Dashboards, refresh & handover (weeks 5–6): Two role-based dashboards, an on-premises gateway for the automated 06:00 refresh, plus training and a short written guide so the team can extend the model themselves.'
        ]
      },
      {
        type: 'eyebrow',
        text: 'The Solution'
      },
      {
        type: 'subheading',
        text: 'Executive overview'
      },
      {
        type: 'p',
        text: 'The board-level view answers leadership’s core questions on one screen: where revenue comes from, how occupancy and rate are trending, which properties and channels pull their weight, and whether the year is on target.'
      },
      {
        type: 'img',
        file: 'case-content/powerbi-bnb-heaven/image1.png',
        caption: 'Revenue & Occupancy — the executive overview page, live in Power BI Desktop: KPIs, revenue trend, channel mix, property and location breakdowns and target attainment.'
      },
      {
        type: 'subheading',
        text: 'Operations & guests'
      },
      {
        type: 'p',
        text: 'The operations view is a daily working screen for the wider team: booking volume against occupancy, manager contribution, the direct-site booking funnel and guest satisfaction by location.'
      },
      {
        type: 'img',
        file: 'case-content/powerbi-bnb-heaven/image2.png',
        caption: 'Operations & Guest Experience — bookings vs occupancy, manager revenue, booking funnel and 5-star reviews by location.'
      },
      {
        type: 'list',
        items: [
          'Cumulative revenue vs operating cost shows the margin gap at a glance.',
          'Channel donut exposes reliance on commission-heavy platforms vs direct.',
          'Top-property table ranks by revenue with live YoY growth flags.',
          'Gauge tracks progress against the £4.55M annual target (106%).'
        ]
      },
      {
        type: 'eyebrow',
        text: 'Under the Hood'
      },
      {
        type: 'table',
        headers: [
          'Layer',
          'What We Built',
          'Tools'
        ],
        rows: [
          [
            'Sources',
            'Airbnb, Booking.com, Vrbo, direct site, PMS / channel manager, accounting',
            'REST / API / file connectors'
          ],
          [
            'Ingest & clean',
            'Dedupe, key standardisation, fee / refund / cancellation handling',
            'Power Query (M)'
          ],
          [
            'Model',
            'Star schema, shared date table, reusable measures',
            'Power BI model + DAX'
          ],
          [
            'Governance',
            'Row-level security by owner / manager, documented definitions',
            'RLS roles'
          ],
          [
            'Delivery',
            'Two role-based dashboards, automated daily refresh',
            'Power BI Service + gateway'
          ]
        ]
      },
      {
        type: 'eyebrow',
        text: 'The Results'
      },
      {
        type: 'stats',
        items: [
          {
            value: '+5.6pts',
            label: 'Occupancy rate'
          },
          {
            value: '+0.14',
            label: 'Guest rating'
          },
          {
            value: '3 days → 0',
            label: 'Manual reporting'
          },
          {
            value: '106%',
            label: 'Of annual target'
          }
        ]
      },
      {
        type: 'table',
        headers: [
          'Measure',
          'Before',
          'After'
        ],
        rows: [
          [
            'Owner statements & board pack',
            '~3 days, manual',
            'Automatic, ready by 06:00'
          ],
          [
            'Data freshness',
            '~3 weeks old',
            'Refreshed daily'
          ],
          [
            'Channel profit (net of fees)',
            'Invisible',
            'Live, per channel'
          ],
          [
            'Sources reconciled',
            'Manually, error-prone',
            'Reconciled to accounts automatically'
          ]
        ]
      },
      {
        type: 'p',
        text: 'With channel profitability visible net of platform fees, BnB Heaven leaned into direct bookings and trimmed commission-heavy inventory — finishing the year 6% ahead of target.'
      }
    ]
  },
    {
    id: 'powerbi-healthcare',
    title: 'Power BI — One Live View of a Multi-Site Clinic Network',
    description: 'A governed Power BI model unifying scheduling, EHR, billing and finance across four systems into two role-based dashboards refreshed every morning.',
    source: 'Portfolio',
    tags: [
      'power-bi'
    ],
    content: [
      {
        type: 'eyebrow',
        text: 'Power BI Case Study · Healthcare'
      },
      {
        type: 'p',
        text: 'Multi-site clinic network — scheduling, EHR, billing & finance unified · 6-week engagement'
      },
      {
        type: 'stats',
        items: [
          {
            value: '128,400',
            label: 'Appointments / yr'
          },
          {
            value: '86.4%',
            label: 'Provider utilisation'
          },
          {
            value: '7.8%',
            label: 'No-show rate'
          },
          {
            value: '32 days',
            label: 'Days in AR'
          }
        ]
      },
      {
        type: 'quote',
        text: 'Reports that used to take days across sites now land by 6am — and we act on them the same morning.',
        attribution: 'Operations Director'
      },
      {
        type: 'p',
        text: 'The network ran on four disconnected systems — scheduling, the EHR, billing/claims and finance. Leadership could never see patient flow, provider utilisation and revenue-cycle health in the same place, and each site’s monthly report was rebuilt by hand. I consolidated all four into one governed Power BI model behind two role-based dashboards, refreshed automatically every morning — turning days of manual reporting into a screen the team reads with their coffee.'
      },
      {
        type: 'eyebrow',
        text: 'What Was Leaking'
      },
      {
        type: 'list',
        items: [
          'Siloed systems: Scheduling, EHR, billing and finance never lined up, so no-shows, utilisation and collections couldn’t be seen together.',
          'Manual per-site reporting: Every site’s pack was rebuilt by hand — weeks behind by the time it landed, and easy to get wrong.',
          'Invisible revenue leakage: Denials, AR aging and slow collections weren’t tracked in one place, so cash slipped through unnoticed.'
        ]
      },
      {
        type: 'eyebrow',
        text: 'Dashboard One — Patient Flow & Utilisation'
      },
      {
        type: 'p',
        text: 'Appointments vs utilisation, department mix, top sites, a day-by-hour utilisation heat map and capacity gauge.'
      },
      {
        type: 'img',
        file: 'case-content/powerbi-healthcare/image1.png',
        caption: 'Patient Flow & Utilisation — Executive Overview'
      },
      {
        type: 'list',
        items: [
          'Utilisation heatmap: Spots under-used clinic slots by day and hour at a glance.',
          'Sites & departments: Ranks volume and no-shows together, site by site.',
          'Volume vs utilisation: Pairs appointment growth with the utilisation trend.',
          'Capacity gauge: Tracks attainment against the plan — currently 96%.'
        ]
      },
      {
        type: 'eyebrow',
        text: 'Dashboard Two — Revenue Cycle & Claims'
      },
      {
        type: 'p',
        text: 'Billed vs collection rate, a claims funnel, AR aging buckets and net revenue by payer.'
      },
      {
        type: 'img',
        file: 'case-content/powerbi-healthcare/image2.png',
        caption: 'Revenue Cycle & Claims'
      },
      {
        type: 'list',
        items: [
          'Claims funnel: Shows where submissions fall out before they’re paid.',
          'AR aging: Flags the £84K stuck in 90+ days for chase-up.',
          'Billed vs collected: Tracks the collection rate month over month.',
          'Payer mix: Splits net revenue across NHS, insurers and self-pay.'
        ]
      },
      {
        type: 'eyebrow',
        text: 'How It’s Built'
      },
      {
        type: 'table',
        headers: [
          'Stage',
          'What We Built',
          'Tools'
        ],
        rows: [
          [
            'Sources',
            '4 systems: Scheduling · EHR · Billing · GL',
            'REST / API / file connectors'
          ],
          [
            'Clean',
            'Key standardisation',
            'Power Query'
          ],
          [
            'Model',
            'Star schema, shared date table, DAX',
            'Power BI model + DAX'
          ],
          [
            'Secure',
            'RLS by site, per-site access',
            'RLS roles'
          ],
          [
            'Deliver',
            '06:00 refresh via gateway & service',
            'Power BI Service + gateway'
          ]
        ]
      },
      {
        type: 'eyebrow',
        text: 'The Impact'
      },
      {
        type: 'label',
        text: 'After six weeks'
      },
      {
        type: 'stats',
        items: [
          {
            value: '+5.0pts',
            label: 'Provider utilisation'
          },
          {
            value: '−2.1pts',
            label: 'No-show rate'
          },
          {
            value: '−6 days',
            label: 'Days in AR'
          },
          {
            value: '3 days → 0',
            label: 'Manual reporting'
          }
        ]
      },
      {
        type: 'p',
        text: 'With utilisation and no-shows visible by site and hour, the network reallocated clinic slots and tightened reminders — lifting utilisation five points while trimming no-shows, and replacing days of manual work with an automatic 6am refresh reconciled to the ledger.'
      }
    ]
  },
  {
    id: 'ecommerce-pnl-tracker',
    title: 'Automated P&L & Sales Tracker for Ecommerce (Google Sheets)',
    description: 'A single Google Sheets template that turns raw sales, COGS and marketing cost data into live real-vs-estimated profit numbers for any date range.',
    source: 'Portfolio',
    tags: [
      'dashboards'
    ],
    content: [
      {
        type: 'eyebrow',
        text: 'Finance & Sales Reporting'
      },
      {
        type: 'p',
        text: 'An automated profit & loss tracker built in Google Sheets for an ecommerce business. Pulling sales, real COGS, marketing spend and other expenses into one model, it calculates real vs. estimated profit automatically for any date range instead of being rebuilt by hand every month.'
      },
      {
        type: 'stats',
        items: [
          {
            value: '$1.18M',
            label: 'Total sales (period)'
          },
          {
            value: '$54.6K',
            label: 'Total real profit'
          },
          {
            value: '4.61%',
            label: 'Real profit margin'
          },
          {
            value: '$587K',
            label: 'Total marketing cost'
          }
        ]
      },
      {
        type: 'img',
        file: 'case-content/ecommerce-pnl-tracker/image1.png',
        caption: 'Monthly sales and profit dashboard — total sales, real/estimated profit, margins and marketing cost calculated automatically from raw order data.'
      },
      {
        type: 'img',
        file: 'case-content/ecommerce-pnl-tracker/image2.png',
        caption: 'The same template applied to a different brand — totals, COGS and marketing cost recalculated instantly for any date range.'
      },
      {
        type: 'subheading',
        text: 'Daily and 30-day views'
      },
      {
        type: 'p',
        text: 'A daily dashboard view surfaces total and trailing-30-day sales, profit and expense metrics side by side, so the team can catch a bad week before it becomes a bad month.'
      },
      {
        type: 'img',
        file: 'case-content/ecommerce-pnl-tracker/image3.png',
        caption: 'Daily dashboard — total and last-30-days sales, profit and expense metrics side by side for fast day-to-day monitoring.'
      },
      {
        type: 'subheading',
        text: 'Rolling breakdowns'
      },
      {
        type: 'p',
        text: 'A rolling 12-month view breaks total profit down into COGS, marketing cost, other expenses and disputes won, so the team can see exactly where margin is being gained or lost.'
      },
      {
        type: 'img',
        file: 'case-content/ecommerce-pnl-tracker/image4.png',
        caption: 'Last-12-months pie chart breaking total profit down into COGS, marketing cost, other expenses and disputes won.'
      },
      {
        type: 'subheading',
        text: 'Multi-channel traffic & revenue tracking'
      },
      {
        type: 'p',
        text: 'A weekly tracker pulls Google Analytics traffic and Klaviyo email/SMS performance into the same sheet, so acquisition and retention sit next to the P&L instead of in separate tools.'
      },
      {
        type: 'img',
        file: 'case-content/ecommerce-pnl-tracker/image5.png',
        caption: 'Weekly tracker pulling Google Analytics traffic and Klaviyo email/SMS performance into the same sheet for a complete picture.'
      },
      {
        type: 'p',
        text: 'Built as a single Google Sheets template so finance and marketing read the same numbers without exporting from five different tools first.'
      }
    ]
  },
    {
    id: 'ad-performance-dashboards',
    title: 'Looker Studio — Multi-Channel Ad Performance Dashboards',
    description: 'Looker Studio dashboards consolidating Meta, Google, Taboola, AppLovin and Newsbreak ad performance into live spend, revenue and ROAS views.',
    source: 'Portfolio',
    tags: [
      'looker-studio'
    ],
    content: [
      {
        type: 'eyebrow',
        text: 'Paid Media Reporting'
      },
      {
        type: 'p',
        text: 'Built in Looker Studio to track ad spend, revenue and ROAS across every channel in one place, replacing manual exports pulled separately from each ad platform.'
      },
      {
        type: 'subheading',
        text: 'Meta ads tracking'
      },
      {
        type: 'stats',
        items: [
          {
            value: '21,767',
            label: 'Clicks'
          },
          {
            value: '627,879',
            label: 'Impressions'
          },
          {
            value: '$35.2K',
            label: 'Spend'
          },
          {
            value: '3.47%',
            label: 'CTR (all)'
          }
        ]
      },
      {
        type: 'img',
        file: 'case-content/ad-performance-dashboards/image1.png',
        caption: 'Meta Ads dashboard overview — clicks, link clicks, impressions, ROAS and spend for a single brand’s campaigns.'
      },
      {
        type: 'img',
        file: 'case-content/ad-performance-dashboards/image2.png',
        caption: 'Campaign-level breakdown — ROAS, clicks, spend, impressions and CPM for every ad and campaign, filterable by name.'
      },
      {
        type: 'subheading',
        text: 'Multi-channel performance — Facebook, Google, Taboola, AppLovin, Newsbreak'
      },
      {
        type: 'p',
        text: 'A larger account-level dashboard rolls spend, revenue and profit up across every paid channel, with a dedicated page per platform for campaign-level detail.'
      },
      {
        type: 'stats',
        items: [
          {
            value: '$3.94M',
            label: 'Facebook spend (9 mo.)'
          },
          {
            value: '$3.99M',
            label: 'Facebook revenue'
          },
          {
            value: '1.01',
            label: 'Facebook ROAS'
          },
          {
            value: '27,184',
            label: 'Orders'
          }
        ]
      },
      {
        type: 'img',
        file: 'case-content/ad-performance-dashboards/image3.png',
        caption: 'Facebook performance overview across a 9-month window — spend, revenue, ROAS and profit margin alongside a daily revenue-vs-spend trend.'
      },
      {
        type: 'img',
        file: 'case-content/ad-performance-dashboards/image4.png',
        caption: 'Google Ads dashboard for the same account — cost, revenue, orders, profit and ROAS alongside clicks and conversion rate.'
      },
      {
        type: 'p',
        text: 'Both dashboards run on Looker Studio so paid media and finance read from the same live numbers instead of separate exports from each ad platform.'
      }
    ]
  },
  {
    id: 'whatsapp-voice-business-agent',
    title: 'WhatsApp Voice & Business Agent with n8n',
    description: 'Turning customer voice notes, photos and text messages on WhatsApp into instant, database-backed answers through an n8n workflow.',
    source: 'Notion',
    url: 'https://app.notion.com/p/Case-Study-WhatsApp-Voice-Business-Agent-with-n8n-3f8b33f9293f80c99ee6e059b27be16e',
    tags: [
      'n8n',
      'ai-whatsapp'
    ],
    content: [
      {
        type: 'eyebrow',
        text: 'Overview'
      },
      {
        type: 'p',
        text: 'This project is a WhatsApp business assistant for an online store. Customers write, speak or send a photo, and the workflow replies on WhatsApp with facts taken from the store’s Supabase product database, answering by voice when the customer used voice. It runs on n8n cloud with OpenAI models and replaces manual answering of repetitive product questions.'
      },
      {
        type: 'subheading',
        text: 'The business problem'
      },
      {
        type: 'p',
        text: 'Store owners answer the same questions all day: is this in stock, what does it cost, how long is delivery. Customers send these as voice notes, typed messages or screenshots of a product, so a simple keyword bot cannot read them. Slow replies lose sales, and a bot that guesses prices or stock damages trust.'
      },
      {
        type: 'subheading',
        text: 'The solution'
      },
      {
        type: 'p',
        text: 'An n8n workflow receives every WhatsApp message and routes it by type. Voice notes are transcribed, photos are described by a vision model, and text goes straight through. All three are normalized into one message and passed to an AI agent that must look up facts in Supabase before answering. The reply goes back as text, or as a voice note when the customer sent audio. Memory keyed on the customer’s phone number keeps the conversation connected.'
      },
      {
        type: 'subheading',
        text: 'Project snapshot'
      },
      {
        type: 'table',
        headers: [
          'Item',
          'Detail'
        ],
        rows: [
          [
            'Platform',
            'n8n cloud'
          ],
          [
            'Channel',
            'WhatsApp Business Cloud API'
          ],
          [
            'Input types',
            'Voice note, text, photo'
          ],
          [
            'AI models',
            'OpenAI transcription, GPT-4o-mini vision, GPT-4.1-mini agent, OpenAI speech'
          ],
          [
            'Knowledge base',
            'Supabase vector store, products table'
          ],
          [
            'Workflow size',
            '21 nodes after cleanup (22 in the first export)'
          ]
        ]
      },
      {
        type: 'eyebrow',
        text: 'How the System Works'
      },
      {
        type: 'p',
        text: 'Every message passes through six stages, from the customer’s WhatsApp message to the reply, in a single n8n workflow.'
      },
      {
        type: 'table',
        headers: [
          'Step',
          'Process'
        ],
        rows: [
          [
            '1. WhatsApp input',
            'The customer sends a voice note, a text or a photo. The WhatsApp Trigger node receives it.'
          ],
          [
            '2. Routing',
            'A Switch node checks the message type and sends it down the audio, text or image path.'
          ],
          [
            '3. Media handling',
            'Voice notes and photos are downloaded through the WhatsApp media API. A voice note is transcribed and a photo is described by a vision model.'
          ],
          [
            '4. Normalizing',
            'Edit Fields nodes turn each path into the same two fields: the message text and the customer’s phone number as session id.'
          ],
          [
            '5. AI agent',
            'The agent looks up facts in the Supabase products table, thinks again, and writes a short reply. It remembers the conversation by phone number.'
          ],
          [
            '6. Reply',
            'If the customer sent audio, the reply is converted to speech and sent as a voice note. Otherwise it is sent as text.'
          ]
        ]
      },
      {
        type: 'label',
        text: 'The workflow in n8n'
      },
      {
        type: 'img',
        file: 'case-content/whatsapp-voice-business-agent/image1.jpg',
        caption: 'The top branch handles voice notes, the middle branch handles text, and the bottom branch handles photos. All three meet at the AI Agent, which has its model, memory, a Think tool and the Supabase Vector Store attached.'
      },
      {
        type: 'label',
        text: 'Supporting integrations'
      },
      {
        type: 'list',
        items: [
          'WhatsApp Business Cloud API: receives customer messages, downloads media and sends replies.',
          'OpenAI: transcribes audio, describes images, runs the agent (GPT-4.1-mini) and creates the spoken reply.',
          'Supabase: vector store over the products table, queried by the agent as a tool.',
          'n8n Simple Memory: keeps recent messages per customer phone number.'
        ]
      },
      {
        type: 'eyebrow',
        text: 'Core Workflow Configuration'
      },
      {
        type: 'p',
        text: 'The workflow is built from a handful of node groups. Each one has a single job and passes the same two fields forward, so the agent never needs to know how the message arrived.'
      },
      {
        type: 'table',
        headers: [
          'Node group',
          'Configuration'
        ],
        rows: [
          [
            'WhatsApp Trigger',
            'Listens for message updates from the WhatsApp Business Cloud API.'
          ],
          [
            'Switch',
            'Three rules: audio (by mime type), text (by message type) and image (by mime type).'
          ],
          [
            'Download media + HTTP Request',
            'Gets the media URL from WhatsApp, then downloads the file with the WhatsApp credential. Used for both audio and images.'
          ],
          [
            'Transcribe a recording',
            'OpenAI audio transcription of the downloaded voice note.'
          ],
          [
            'Analyze image',
            'OpenAI vision (GPT-4o-mini) on the downloaded photo, returned as a text description.'
          ],
          [
            'Edit Fields (three)',
            'Set userMessage (the text, transcript or image description) and sessionId (the customer’s phone number).'
          ],
          [
            'AI Agent',
            'GPT-4.1-mini with a system prompt: short WhatsApp-style replies under 80 words, one emoji at most, never guess, answer only from the database, hand complex issues to human support.'
          ],
          [
            'Simple Memory',
            'Window memory keyed on the customer’s phone number.'
          ],
          [
            'Supabase Vector Store',
            'Retrieve-as-tool on the products table, with OpenAI embeddings.'
          ],
          [
            'Think',
            'A reasoning tool the agent can use before answering.'
          ],
          [
            'If',
            'Checks whether the original message was audio.'
          ],
          [
            'Generate audio + Send voice reply',
            'Turns the answer into speech and sends it back as an audio message.'
          ],
          [
            'Send message',
            'Sends the answer as a WhatsApp text message.'
          ]
        ]
      },
      {
        type: 'eyebrow',
        text: 'Product Experience'
      },
      {
        type: 'p',
        text: 'These three mockups show how the assistant is meant to feel on the customer’s phone, one for each input type. They are illustrative designs, not screenshots of live conversations. The status messages (“Transcribing…”, “Searching our catalog…”) and the Shopify order lookup and replacement order shown in scenarios 1 and 3 are not in the current workflow and belong to a planned extension.'
      },
      {
        type: 'subheading',
        text: 'Scenario 1: voice input'
      },
      {
        type: 'img',
        file: 'case-content/whatsapp-voice-business-agent/image2.jpg',
        caption: 'The customer sends a voice note. The workflow transcribes it, the agent finds the answer, and the reply comes back as a voice note because the customer used voice.'
      },
      {
        type: 'subheading',
        text: 'Scenario 2: text input'
      },
      {
        type: 'img',
        file: 'case-content/whatsapp-voice-business-agent/image3.png',
        caption: 'A typed question goes straight to the agent, which checks the product data and answers in two or three short lines, with a follow-up question to move the sale forward.'
      },
      {
        type: 'subheading',
        text: 'Scenario 3: image input'
      },
      {
        type: 'img',
        file: 'case-content/whatsapp-voice-business-agent/image4.jpg',
        caption: 'A photo is described by the vision model, and that description is handled as the customer’s message. In the current workflow the agent matches it against the product table. Order lookup and replacement orders are future work.'
      },
      {
        type: 'eyebrow',
        text: 'Results & Metrics'
      },
      {
        type: 'p',
        text: 'The workflow is built and cleaned up, and no live customer data has been measured yet. The figures below describe what was delivered. Response time, accuracy and conversion numbers should be added after a pilot with real conversations.'
      },
      {
        type: 'table',
        headers: [
          'Metric',
          'Result'
        ],
        rows: [
          [
            'Production workflows',
            '1 main agent workflow'
          ],
          [
            'n8n nodes',
            '21 after cleanup'
          ],
          [
            'Input types supported',
            '3: voice note, text, photo'
          ],
          [
            'Reply formats',
            '2: text and voice note'
          ],
          [
            'AI models used',
            '4: transcription, vision, agent, speech'
          ],
          [
            'Knowledge source',
            'Supabase products table, searched by the agent as a tool'
          ],
          [
            'Workflow defects fixed',
            '2 (placeholder Code node, wrong message type)'
          ],
          [
            'Live response time and accuracy',
            'Not measured yet'
          ]
        ]
      },
      {
        type: 'eyebrow',
        text: 'Technical Challenges & Solutions'
      },
      {
        type: 'p',
        text: 'Reviewing the exported workflow turned up problems that would have stopped it from working in production.'
      },
      {
        type: 'subheading',
        text: 'Voice reply could not be sent'
      },
      {
        type: 'label',
        text: 'Challenge'
      },
      {
        type: 'p',
        text: 'The voice path ended in a Code node that still held the placeholder YOUR_BASE64_STRING_HERE, and the send node used the document message type.'
      },
      {
        type: 'label',
        text: 'Solution'
      },
      {
        type: 'p',
        text: 'Removed the Code node, connected “Generate audio” directly to the send node, renamed it “Send voice reply”, and set its message type to audio with the customer’s number as recipient.'
      },
      {
        type: 'label',
        text: 'Outcome'
      },
      {
        type: 'p',
        text: 'The voice path is complete from the audio message to the voice reply.'
      },
      {
        type: 'subheading',
        text: 'Credentials missing after import'
      },
      {
        type: 'label',
        text: 'Challenge'
      },
      {
        type: 'p',
        text: 'After importing the workflow into a new n8n account, every WhatsApp, OpenAI and Supabase node showed a warning.'
      },
      {
        type: 'label',
        text: 'Solution'
      },
      {
        type: 'p',
        text: 'Reselect the credentials on each flagged node. For presentations, a demo copy with sample output pinned on the main-path nodes can be used.'
      },
      {
        type: 'label',
        text: 'Outcome'
      },
      {
        type: 'p',
        text: 'The nodes can be run green once credentials are set. A demo copy was prepared for the voice path.'
      },
      {
        type: 'subheading',
        text: 'AI answers must stay factual'
      },
      {
        type: 'label',
        text: 'Challenge'
      },
      {
        type: 'p',
        text: 'A sales assistant that invents prices or stock levels loses customer trust.'
      },
      {
        type: 'label',
        text: 'Solution'
      },
      {
        type: 'p',
        text: 'The system prompt requires the agent to retrieve facts from Supabase before answering, to ask when data is missing, and to hand complex issues to human support. Replies are capped at 80 words.'
      },
      {
        type: 'label',
        text: 'Outcome'
      },
      {
        type: 'p',
        text: 'Answers stay short and grounded in the product table.'
      },
      {
        type: 'subheading',
        text: 'Secrets inside workflow files'
      },
      {
        type: 'label',
        text: 'Challenge'
      },
      {
        type: 'p',
        text: 'A related Shopify workflow contains an access token written directly into its HTTP nodes.'
      },
      {
        type: 'label',
        text: 'Solution'
      },
      {
        type: 'p',
        text: 'Rotate the token and move it into an n8n credential before sharing or publishing that workflow.'
      },
      {
        type: 'label',
        text: 'Outcome'
      },
      {
        type: 'p',
        text: 'Open item, to be done by the store owner.'
      },
      {
        type: 'eyebrow',
        text: 'Key Takeaways & Future Development'
      },
      {
        type: 'subheading',
        text: 'Key takeaways'
      },
      {
        type: 'list',
        items: [
          'One agent for three input types: routing by message type and normalizing to the same two fields keeps the agent simple.',
          'Grounded answers: forcing a database lookup before every reply is what keeps the assistant safe to put in front of customers.',
          'Voice in, voice out: answering in the customer’s own format makes the assistant feel natural on WhatsApp.'
        ]
      },
      {
        type: 'subheading',
        text: 'Future development'
      },
      {
        type: 'list',
        items: [
          'Connect Shopify so the agent can check order status and create replacement orders, as shown in the mockups.',
          'Add progress messages such as “Transcribing your voice message” while longer steps run.',
          'Hand over to a human on WhatsApp, with the conversation passed to the support team.',
          'Run a pilot with real customers and record response time, answer accuracy and sales conversion.',
          'Move secrets such as the Shopify token into n8n credentials.'
        ]
      }
    ]
  },
  {
    id: 'enterprise-ticketing-pipeline',
    title: 'Enterprise Ticketing & Revenue Data Pipeline',
    description: 'Turning daily ticketing PDFs and emails from multiple vendors into one automated revenue dashboard for a music festival organizer.',
    source: 'Notion',
    url: 'https://app.notion.com/p/Case-Study-Enterprise-Ticketing-Revenue-Data-Pipeline-3f8b33f9293f8021af07dd2b4da74de2',
    tags: [
      'python'
    ],
    content: [
      {
        type: 'eyebrow',
        text: 'Overview'
      },
      {
        type: 'p',
        text: 'Palm Tree Crew, a live music festival organizer, needed accurate daily revenue and attendance numbers across several cities. We built a custom Python pipeline on Google Cloud that reads vendor audit emails, applies the client’s business rules, stores everything in BigQuery and renders an executive dashboard in Google Sheets with no manual steps.'
      },
      {
        type: 'subheading',
        text: 'The business problem'
      },
      {
        type: 'p',
        text: 'Every day the operations team downloaded static PDF audits from Ticketmaster, Front Gate Tickets and Posh. They split passes by hand (a 2-Day Pass counts toward both Friday and Saturday) and typed the numbers into a master Google Sheet. The work took hours and invited mistakes. VIP Table and Corporate Sponsorship revenue lived in separate spreadsheets, so leadership never saw total gross and remaining capacity in one place.'
      },
      {
        type: 'subheading',
        text: 'The solution'
      },
      {
        type: 'p',
        text: 'A cloud-hosted ETL pipeline runs on a schedule. It intercepts vendor emails through the Gmail API, parses PDF and HTML reports with custom Python code, calculates the client’s metrics, loads the results into Google BigQuery and rebuilds a styled Google Sheets dashboard. Offline revenue from other spreadsheets is linked in through a manual configuration area.'
      },
      {
        type: 'subheading',
        text: 'Project snapshot'
      },
      {
        type: 'table',
        headers: [
          'Item',
          'Detail'
        ],
        rows: [
          [
            'Client',
            'Palm Tree Crew'
          ],
          [
            'Industry',
            'Live events and entertainment (music festivals)'
          ],
          [
            'Language',
            'Python, written as custom code'
          ],
          [
            'Cloud',
            'Google Cloud Run and Cloud Scheduler'
          ],
          [
            'Data warehouse',
            'Google BigQuery'
          ],
          [
            'Integrations',
            'Gmail API, Google Sheets API'
          ],
          [
            'Ticketing sources',
            'Ticketmaster (PDF), Front Gate Tickets (HTML email), Posh'
          ]
        ]
      },
      {
        type: 'eyebrow',
        text: 'How the System Works'
      },
      {
        type: 'p',
        text: 'The pipeline runs once per reporting cycle with no human steps, from vendor email to finished dashboard.'
      },
      {
        type: 'table',
        headers: [
          'Step',
          'Process'
        ],
        rows: [
          [
            '1. Scheduled start',
            'Google Cloud Scheduler triggers the Python service on Cloud Run.'
          ],
          [
            '2. Email ingestion',
            'The Gmail API, with secure OAuth, picks up the daily audit emails from each ticketing vendor.'
          ],
          [
            '3. Parsing',
            'Vendor-specific parsers read the data: a PDF scraper for Ticketmaster, an HTML table parser for Front Gate Tickets.'
          ],
          [
            '4. Business logic',
            'Code applies the client’s rules: the 2-Day Rule, wrap rates and capacity detection.'
          ],
          [
            '5. Warehouse load',
            'Results are written to BigQuery in three tables, so every ticket sold keeps an audit trail.'
          ],
          [
            '6. Dashboard render',
            'The Google Sheets API rebuilds a formatted executive dashboard, including linked offline revenue.'
          ]
        ]
      },
      {
        type: 'label',
        text: 'Architecture'
      },
      {
        type: 'img',
        file: 'case-content/enterprise-ticketing-pipeline/image1.jpg',
        caption: 'Vendor emails enter through Gmail, the Python service on Cloud Run parses them and applies the client’s rules, BigQuery keeps the history, and the Google Sheets dashboard shows the result.'
      },
      {
        type: 'p',
        text: 'Offline VIP and sponsorship sheets are linked into the dashboard with IMPORTRANGE.'
      },
      {
        type: 'eyebrow',
        text: 'Core Pipeline Components'
      },
      {
        type: 'p',
        text: 'The pipeline is custom Python code split into four parts, each with one job.'
      },
      {
        type: 'subheading',
        text: 'Automated ingestion and parsing'
      },
      {
        type: 'p',
        text: 'The Gmail API with secure OAuth intercepts the daily audit emails from each vendor. Bespoke parsing engines handle the unstructured formats:'
      },
      {
        type: 'list',
        items: [
          'Ticketmaster: a custom PDF scraper that bypasses AWS API Gateway redirects, reads complex tabular data and adjusts to unannounced layout changes by the vendor.',
          'Front Gate Tickets: an HTML parser that extracts inline tables directly from the email body.'
        ]
      },
      {
        type: 'subheading',
        text: 'Business logic'
      },
      {
        type: 'p',
        text: 'The code applies the client’s own rules instead of only moving data:'
      },
      {
        type: 'list',
        items: [
          'The 2-Day Rule: splits a multi-day pass into the correct daily attendance buckets, for example one 2-Day Pass counts toward both Friday and Saturday.',
          'Wrap rates: computes 24-hour sales velocity.',
          'Dynamic capacities: detects and adjusts venue capacity limits from live vendor reports, so no hardcoded limit goes out of date.'
        ]
      },
      {
        type: 'subheading',
        text: 'Data warehouse'
      },
      {
        type: 'p',
        text: 'All parsed data goes into Google BigQuery to keep full fidelity and prevent double-counting. Three tables hold the history of every ticket sold:'
      },
      {
        type: 'table',
        headers: [
          'Table',
          'Purpose'
        ],
        rows: [
          [
            'raw_reports',
            'The original report as received from each vendor.'
          ],
          [
            'report_lines',
            'The individual lines parsed out of each report.'
          ],
          [
            'daily_snapshots',
            'The calculated daily position used by the dashboard.'
          ]
        ]
      },
      {
        type: 'subheading',
        text: 'Dynamic dashboard rendering'
      },
      {
        type: 'p',
        text: 'The final step renders an executive-ready Google Sheets dashboard. The code formats the layout, freezes rows, color-codes stale data feeds and calculates multi-day averages.'
      },
      {
        type: 'p',
        text: 'A #MANUAL configuration area lets non-technical team members link external spreadsheets with =IMPORTRANGE() for offline VIP Table and Sponsorship revenue. The dashboard syncs this data automatically, so total top-line revenue appears in one view.'
      },
      {
        type: 'eyebrow',
        text: 'Product Experience'
      },
      {
        type: 'p',
        text: 'The executive team sees one Google Sheets dashboard that is rebuilt automatically from the BigQuery data. It formats itself, freezes the header rows, color-codes feeds that have not updated and shows multi-day averages, daily wrap rates and remaining capacity per show.'
      },
      {
        type: 'eyebrow',
        text: 'Results & Impact'
      },
      {
        type: 'p',
        text: 'The daily reporting cycle went from hours of manual transcription to no manual steps. The report gives no counts of events, hours saved or revenue, so none are stated here.'
      },
      {
        type: 'table',
        headers: [
          'Area',
          'Result'
        ],
        rows: [
          [
            'Manual data entry',
            'None. The pipeline runs on Google Cloud Scheduler.'
          ],
          [
            'Data accuracy',
            'Transcription errors and arithmetic mistakes removed. The dashboard is the single source of truth for executives.'
          ],
          [
            'Revenue view',
            'Online ticket sales and offline VIP and sponsorship revenue in one top-line view.'
          ],
          [
            'Onboarding new shows',
            'A standard New Show Onboarding Template lets the client add a festival or ticketing platform in minutes.'
          ],
          [
            'Decision support',
            'Real-time capacity and daily wrap rates inform ad spend and tier pricing.'
          ]
        ]
      },
      {
        type: 'eyebrow',
        text: 'Technical Challenges & Solutions'
      },
      {
        type: 'subheading',
        text: 'Unstructured vendor formats'
      },
      {
        type: 'label',
        text: 'Challenge'
      },
      {
        type: 'p',
        text: 'Ticketmaster sends static PDFs behind AWS API Gateway redirects, and Front Gate sends tables inside email bodies.'
      },
      {
        type: 'label',
        text: 'Solution'
      },
      {
        type: 'p',
        text: 'A custom PDF scraper that follows the redirects and adapts to layout changes, plus an HTML parser for inline tables.'
      },
      {
        type: 'label',
        text: 'Outcome'
      },
      {
        type: 'p',
        text: 'Both vendors feed the pipeline without manual downloads.'
      },
      {
        type: 'subheading',
        text: 'Business rules that were done in the operator’s head'
      },
      {
        type: 'label',
        text: 'Challenge'
      },
      {
        type: 'p',
        text: 'A 2-Day Pass had to be split across Friday and Saturday by hand.'
      },
      {
        type: 'label',
        text: 'Solution'
      },
      {
        type: 'p',
        text: 'The 2-Day Rule, wrap rates and capacity detection are coded into the pipeline.'
      },
      {
        type: 'label',
        text: 'Outcome'
      },
      {
        type: 'p',
        text: 'Consistent daily buckets with no mental math.'
      },
      {
        type: 'subheading',
        text: 'Outdated hardcoded limits'
      },
      {
        type: 'label',
        text: 'Challenge'
      },
      {
        type: 'p',
        text: 'Venue capacities change, and fixed numbers in code go stale.'
      },
      {
        type: 'label',
        text: 'Solution'
      },
      {
        type: 'p',
        text: 'Capacities are read from live vendor reports.'
      },
      {
        type: 'label',
        text: 'Outcome'
      },
      {
        type: 'p',
        text: 'The dashboard shows current remaining capacity.'
      },
      {
        type: 'subheading',
        text: 'Double-counting and audit trail'
      },
      {
        type: 'label',
        text: 'Challenge'
      },
      {
        type: 'p',
        text: 'Daily reports overlap, so repeated loads could count a ticket twice.'
      },
      {
        type: 'label',
        text: 'Solution'
      },
      {
        type: 'p',
        text: 'A three-table BigQuery design (raw_reports, report_lines, daily_snapshots) keeps the original data and the calculated snapshots separate.'
      },
      {
        type: 'label',
        text: 'Outcome'
      },
      {
        type: 'p',
        text: 'A historical record of every ticket sold.'
      },
      {
        type: 'subheading',
        text: 'Offline revenue in separate sheets'
      },
      {
        type: 'label',
        text: 'Challenge'
      },
      {
        type: 'p',
        text: 'VIP Tables and Sponsorships were tracked outside the main sheet and maintained by non-technical staff.'
      },
      {
        type: 'label',
        text: 'Solution'
      },
      {
        type: 'p',
        text: 'A #MANUAL configuration area where staff link external sheets with =IMPORTRANGE().'
      },
      {
        type: 'label',
        text: 'Outcome'
      },
      {
        type: 'p',
        text: 'Offline revenue appears in the dashboard without code changes.'
      },
      {
        type: 'eyebrow',
        text: 'Key Takeaways & Future Development'
      },
      {
        type: 'subheading',
        text: 'Key takeaways'
      },
      {
        type: 'list',
        items: [
          'End-to-end automation: email ingestion, parsing, calculation, storage and reporting run without human input.',
          'Custom code where vendors give no API: parsing PDFs and email tables made the data reachable.',
          'Built for scale: a decoupled design and an onboarding template let the client add shows and platforms quickly.'
        ]
      },
      {
        type: 'subheading',
        text: 'Future development'
      },
      {
        type: 'list',
        items: [
          'Add parsers for further ticketing platforms as the client adds vendors.',
          'Add alerts when a vendor email is missing or a report layout changes.',
          'Extend the dashboard with ad-spend data to compare against sales velocity.'
        ]
      }
    ]
  },
  {
    id: 'support-email-clickup-automation',
    title: 'Support Email to ClickUp Ticket Automation',
    description: 'Turning every email sent to a shared support inbox into a correctly routed, duplicate-free ClickUp ticket through one n8n workflow.',
    source: 'Notion',
    url: 'https://app.notion.com/p/Case-Study-Support-Email-to-ClickUp-Ticket-Automation-3f8b33f9293f805a8817ed5ead187f96',
    tags: [
      'n8n',
      'clickup'
    ],
    content: [
      {
        type: 'eyebrow',
        text: 'Overview'
      },
      {
        type: 'p',
        text: 'This project is a support-intake automation for RefureTech. Customers email the shared support address, and the n8n workflow reads each message, works out which client it belongs to from the sender’s email domain, and files it in ClickUp. It becomes a new ticket in that client’s support list, a ticket in a triage list when the client is unknown, or a comment when a ticket for the conversation already exists. Attachments and earlier messages in the thread travel with it.'
      },
      {
        type: 'subheading',
        text: 'The business problem'
      },
      {
        type: 'p',
        text: 'Support requests arrive as ordinary email. Copying them into a ticket system by hand is slow and easy to get wrong: the wrong client, a missed reply, an attachment left behind in the inbox. The work grows with every new client. Automating it is not simple either, because ClickUp has its own Email ClickApp that sends a confirmation to the customer and files later replies as comments. A naive automation creates duplicate tickets or, worse, turns its own confirmation emails into new tickets in an endless loop.'
      },
      {
        type: 'subheading',
        text: 'The solution'
      },
      {
        type: 'p',
        text: 'A single n8n workflow polls the support inbox every minute. It looks up the client list stored in ClickUp, matches the sender by domain, checks four different ways whether the conversation already has a ticket or is already managed by ClickUp, and only then creates a ticket or comment. It uses plain, explainable rules in code nodes rather than an AI model, so every decision can be traced to a header, a subject line or a ClickUp field. Wherever a step could fail, the workflow prefers a duplicate ticket over a lost customer email.'
      },
      {
        type: 'subheading',
        text: 'Project snapshot'
      },
      {
        type: 'img',
        file: 'case-content/support-email-clickup-automation/image1.png',
        caption: 'Project snapshot.'
      },
      {
        type: 'eyebrow',
        text: 'How the System Works'
      },
      {
        type: 'p',
        text: 'Every email passes through six stages, from arrival in the inbox to a ticket in ClickUp, inside one workflow.'
      },
      {
        type: 'table',
        headers: [
          'Step',
          'Process'
        ],
        rows: [
          [
            '1. Email input',
            'The Gmail Trigger polls the INBOX label every minute. The full message is fetched and its HTML body is converted to Markdown so it reads cleanly inside a ticket.'
          ],
          [
            '2. Client matching',
            'The workflow reads the client list from ClickUp, where each client has a Domain, a folder id and a support list id. A code node picks the customer contact from the To, Cc and From addresses and matches its domain (or a parent domain) to a client. Free-mail and internal domains are never mapped.'
          ],
          [
            '3. Duplicate checks',
            'Three lookups run: a ClickUp search by Gmail thread id, a ClickUp search by the thread ClickUp’s own confirmation email started, and a fetch of the full Gmail thread history.'
          ],
          [
            '4. Decision',
            'Route Decision labels the email new, default, comment or skip. Two guard nodes can still turn a write into a skip: one if ClickUp’s ticket id is at the end of the subject, one if the mail headers show a machine-generated reply.'
          ],
          [
            '5. Ticket action',
            'A Switch creates a ticket in the client’s list, creates a ticket in the triage list, or adds a comment to the existing ticket. The description holds the new message plus earlier messages in the conversation.'
          ],
          [
            '6. Attachments, label, sync',
            'Attachments are downloaded and uploaded to the ticket, and the Gmail message is labelled as processed. For new tickets the workflow waits two minutes, finds ClickUp’s confirmation email and stores its thread id on the ticket so later replies are recognised.'
          ]
        ]
      },
      {
        type: 'label',
        text: 'The workflow in n8n'
      },
      {
        type: 'img',
        file: 'case-content/support-email-clickup-automation/image2.jpg',
        caption: 'The chain on the left reads the email, matches the client and checks for duplicates. The Switch in the middle sends each email to one of three ticket actions. Each action ends in its own attachment branch and a Gmail label step, and new tickets also pass through the wait and confirmation sync.'
      },
      {
        type: 'label',
        text: 'Supporting integrations'
      },
      {
        type: 'list',
        items: [
          'Gmail: trigger, message fetch with attachments, thread history, and labelling processed messages.',
          'ClickUp: client routing data, ticket and comment creation, attachment upload, and custom fields that store the Gmail thread id and ClickUp’s email thread id.',
          'Error workflow: a separate n8n workflow is attached in the settings to handle failures of this one.'
        ]
      },
      {
        type: 'eyebrow',
        text: 'Core Workflow Configuration'
      },
      {
        type: 'p',
        text: 'The workflow is built from a handful of node groups. Each has a single job, and the routing decision is carried forward as one item holding the same fields (contact, domain, folder, list, thread id, reason, action), so the ticket nodes never need to know how the decision was reached.'
      },
      {
        type: 'table',
        headers: [
          'Node group',
          'Configuration'
        ],
        rows: [
          [
            'Gmail Trigger',
            'Polls every minute, restricted to the INBOX label on purpose. ClickUp sends its confirmation as the support address, which leaves a copy in Sent. Polling Sent would turn that confirmation into a ticket and trigger another confirmation, forever.'
          ],
          [
            'Get HTML + Markdown',
            'Fetches the full message and converts the HTML body to Markdown. Retries up to 3 times, 2 seconds apart.'
          ],
          [
            'Get Support ID',
            'ClickUp node that lists the client tasks. Each carries the custom fields Domain, folder_id and support_list_id.'
          ],
          [
            'Find ID from Domain (code)',
            'Builds a domain-to-client map, ignores free-mail and internal domains, records domain collisions, picks the customer contact (mapped client first, then any external address, then the sender), validates every address, fills up to 20 Cc fields and applies the one hard skip: the self-addressed ClickUp acknowledgment.'
          ],
          [
            'Find Existing Ticket / Find ClickUp Email Thread',
            'Two ClickUp API searches by custom field: the Gmail thread id, and the thread id of ClickUp’s own confirmation. If either call fails the workflow continues with no result, so a ticket is still created.'
          ],
          [
            'Get Thread History',
            'Gmail API call for every message in the conversation. Failure is non-fatal: the ticket is created with the newest email only.'
          ],
          [
            'Route Decision (code)',
            'Decides clickup_synced, comment, new or default, and assembles the ticket description with the earlier messages, capped at 60,000 characters.'
          ],
          [
            'ClickUp Already Owns This? (code)',
            'Skips when the subject ends with a ClickUp ticket id such as #RTS-1234, or the confirmation wording is found. Anchored to the end of the subject so a customer’s own mid-subject reference such as #PO-88231 still gets a ticket.'
          ],
          [
            'Machine Auto-Reply? (code)',
            'Skips out-of-office and bounce mail by reading headers (Auto-Submitted, X-Auto-Response-Suppress, Precedence, empty Return-Path), never the subject wording.'
          ],
          [
            'Switch',
            'Six rules: new, default, comment, loop guard (skip), ClickUp synced (skip), auto-reply (skip). The fallback output goes to the triage list so an unexpected value cannot drop an email.'
          ],
          [
            'Create a task / Create Default Task',
            'ClickUp nodes that create the ticket with the Markdown description, customer contact, recipient, up to 20 Cc contacts and the Gmail thread id as custom fields. Tickets opened mid-chain are titled with an [Ongoing thread] prefix.'
          ],
          [
            'Add Comment to Existing Task',
            'Posts the new email as a comment on the tracked ticket without notifying everyone.'
          ],
          [
            'Attachment branches (3 sets)',
            'Re-fetch the message with attachments, split them out, keep only files with a real file extension, upload them to the ticket and add the Gmail label. Emails without attachments still reach the label step.'
          ],
          [
            'Wait + confirmation sync',
            'Waits 2 minutes, re-reads the task for its custom id, searches Gmail for ClickUp’s confirmation and saves its thread id into the ticket so future replies are recognised.'
          ]
        ]
      },
      {
        type: 'eyebrow',
        text: 'Product Experience and Routing Scenarios'
      },
      {
        type: 'p',
        text: 'Every email the workflow has handled is marked with a Ticketed label in Gmail, so the team can see at a glance which messages already have a ticket or comment in ClickUp. Replies on the same conversation carry the label too.'
      },
      {
        type: 'subheading',
        text: 'Routing scenarios'
      },
      {
        type: 'p',
        text: 'These scenarios show how the workflow treats the main kinds of email. They are illustrative, derived from the workflow logic, and are not recordings of real customer emails.'
      },
      {
        type: 'table',
        headers: [
          'Scenario',
          'What arrives',
          'What the workflow does',
          'Result'
        ],
        rows: [
          [
            '1. Mapped client, new request',
            'A first email from someone at a client whose domain is in the ClickUp client list.',
            'Matches the domain, finds no existing ticket, routes to the client’s folder and support list, uploads attachments, labels the email, then syncs ClickUp’s confirmation thread id after 2 minutes.',
            'New ticket in the client’s support list.'
          ],
          [
            '2. Unknown domain',
            'An email from a domain that is not mapped, or with no usable contact address.',
            'Falls to the default branch. The ticket is still created, in the default triage list, with the sender as contact.',
            'New ticket in the triage list for a person to assign.'
          ],
          [
            '3. Reply on a tracked conversation',
            'A follow-up where a ticket already exists for the Gmail thread but ClickUp does not own the thread.',
            'Finds the ticket by the Gmail thread id custom field and posts the email as a comment, then handles any attachments.',
            'Comment and files added to the existing ticket.'
          ],
          [
            '4a. ClickUp-owned reply',
            'A customer reply whose subject ends with a ClickUp ticket id.',
            'Stops without writing. ClickUp’s Email ClickApp is already filing replies as comments, so acting would duplicate the ticket.',
            'Skipped, no duplicate.'
          ],
          [
            '4b. Out-of-office or bounce',
            'A vacation responder or delivery failure notice.',
            'Detected from mail headers and skipped. A colleague’s real reply on the same thread is not skipped, because headers are checked instead of subject words.',
            'Skipped, real replies kept.'
          ],
          [
            '4c. Our own confirmation',
            'The ClickUp acknowledgment, sent from the support address back to the support address.',
            'Hard skip by the loop guard.',
            'Skipped, loop prevented.'
          ]
        ]
      },
      {
        type: 'eyebrow',
        text: 'Results & Metrics'
      },
      {
        type: 'p',
        text: 'The workflow is live and has run on the real support inbox. Business figures such as hours saved, tickets per week and routing accuracy have not been measured yet.'
      },
      {
        type: 'table',
        headers: [
          'Metric',
          'Result'
        ],
        rows: [
          [
            'Production workflows',
            '1 main workflow, plus an error workflow attached in settings'
          ],
          [
            'n8n nodes',
            '38'
          ],
          [
            'Trigger',
            'Gmail polling every minute, INBOX only'
          ],
          [
            'Routing outcomes',
            '6: new, default, comment, and three skip outcomes'
          ],
          [
            'Duplicate guards',
            '4 layers: Gmail thread id, ClickUp email thread id, ticket id in subject, confirmation wording'
          ],
          [
            'Failure handling',
            'Retries up to 3 times, 2 seconds apart, on every network node. Lookups fail open, so an email becomes a ticket rather than being lost.'
          ],
          [
            'Reply channels covered',
            'Mapped client, unknown domain, existing thread, attachments'
          ]
        ]
      },
      {
        type: 'label',
        text: 'Execution history (29 Sep to 12 Oct 2026)'
      },
      {
        type: 'table',
        headers: [
          'Metric',
          'Result'
        ],
        rows: [
          [
            'Executions retained in n8n',
            '11'
          ],
          [
            'Successful',
            '11 (100%)'
          ],
          [
            'Failed or crashed',
            '0'
          ],
          [
            'Run time',
            '9 runs took about 2 minutes (the path with the built-in 2-minute wait for ClickUp’s confirmation). 2 runs took about 4 seconds (paths without that wait).'
          ],
          [
            'Hours saved, accuracy, duplicate rate',
            'Not measured yet'
          ]
        ]
      },
      {
        type: 'p',
        text: 'The execution count reflects only the executions n8n still retains and is not a full volume figure. The link between run time and path is inferred from the workflow design.'
      },
      {
        type: 'eyebrow',
        text: 'Technical Challenges & Solutions'
      },
      {
        type: 'p',
        text: 'Most of the engineering effort went into edge cases around ClickUp’s own email feature and around real-world email, where a simple “new email creates ticket” flow breaks quickly.'
      },
      {
        type: 'subheading',
        text: 'The workflow could answer itself forever'
      },
      {
        type: 'label',
        text: 'Challenge'
      },
      {
        type: 'p',
        text: 'ClickUp sends its confirmation email from the support address, so a copy lands in Sent. If the workflow read Sent, that confirmation would become a ticket, which triggers another confirmation, and so on.'
      },
      {
        type: 'label',
        text: 'Solution'
      },
      {
        type: 'p',
        text: 'The trigger watches INBOX only, and a loop guard in code skips any email sent from the support address with the support address in To or Cc. It is the only unconditional skip.'
      },
      {
        type: 'label',
        text: 'Outcome'
      },
      {
        type: 'p',
        text: 'The loop is closed twice, at the trigger and in the logic.'
      },
      {
        type: 'subheading',
        text: 'Duplicate tickets next to ClickUp’s Email ClickApp'
      },
      {
        type: 'label',
        text: 'Challenge'
      },
      {
        type: 'p',
        text: 'Once a ticket exists, ClickUp already files replies as comments and sends its own acknowledgment. Creating another ticket from the same reply duplicates work and makes ClickUp send the customer a second acknowledgment.'
      },
      {
        type: 'label',
        text: 'Solution'
      },
      {
        type: 'p',
        text: 'Four independent checks decide whether ClickUp owns the conversation: a stored ClickUp email thread id, the ticket id at the end of the subject, the confirmation wording in the thread, and the Gmail thread id on an existing ticket. The subject check is the most dependable, because older tickets lack the stored thread id and the confirmation wording can change.'
      },
      {
        type: 'label',
        text: 'Outcome'
      },
      {
        type: 'p',
        text: 'Replies on ClickUp-managed conversations are skipped and n8n stays out of the way.'
      },
      {
        type: 'subheading',
        text: 'Out-of-office mail versus a colleague covering for someone'
      },
      {
        type: 'label',
        text: 'Challenge'
      },
      {
        type: 'p',
        text: 'An auto-reply sets the subject to “Out of Office Re: …”. A colleague who replies on the same thread keeps that subject, so matching subject words would silently drop a genuine customer email.'
      },
      {
        type: 'label',
        text: 'Solution'
      },
      {
        type: 'p',
        text: 'The check reads mail headers that no human mail client sets (Auto-Submitted, X-Auto-Response-Suppress, Precedence, empty Return-Path). If the headers cannot be matched confidently to the right message, nothing is skipped.'
      },
      {
        type: 'label',
        text: 'Outcome'
      },
      {
        type: 'p',
        text: 'Machine mail is filtered out, and real replies with the same subject still become tickets.'
      },
      {
        type: 'subheading',
        text: 'A duplicate is acceptable, a lost email is not'
      },
      {
        type: 'label',
        text: 'Challenge'
      },
      {
        type: 'p',
        text: 'Lookups against ClickUp and Gmail can fail, and an email that stops the workflow is a customer who never gets answered.'
      },
      {
        type: 'label',
        text: 'Solution'
      },
      {
        type: 'p',
        text: 'The ticket-search and thread-history calls retry three times and then continue with no result. Missing results default to creating a ticket, the Switch fallback sends unknown outcomes to the triage list, and the split-out steps continue on error so every email still reaches the labelling step.'
      },
      {
        type: 'label',
        text: 'Outcome'
      },
      {
        type: 'p',
        text: 'Failures become an extra ticket or less context, never a dropped message.'
      },
      {
        type: 'subheading',
        text: 'Tickets opened in the middle of a conversation'
      },
      {
        type: 'label',
        text: 'Challenge'
      },
      {
        type: 'p',
        text: 'When the first email the workflow sees is already a reply, a ticket with only the latest message has no background.'
      },
      {
        type: 'label',
        text: 'Solution'
      },
      {
        type: 'p',
        text: 'The full Gmail thread is fetched, earlier messages are sorted by date and appended to the ticket description (with sender, recipient, date and subject), capped at 60,000 characters, and the title gets an [Ongoing thread] prefix.'
      },
      {
        type: 'label',
        text: 'Outcome'
      },
      {
        type: 'p',
        text: 'A person opening the ticket sees the whole conversation.'
      },
      {
        type: 'subheading',
        text: 'Malformed addresses breaking ticket creation'
      },
      {
        type: 'label',
        text: 'Challenge'
      },
      {
        type: 'p',
        text: 'ClickUp rejects the whole task when an email-typed field receives something that is not an address, such as a group name or undisclosed-recipients. Messy Cc lines and display names are common.'
      },
      {
        type: 'label',
        text: 'Solution'
      },
      {
        type: 'p',
        text: 'Header values are normalised, every address is validated, the support address is never mapped into contact fields, and Cc contacts are capped at 20 fields with the overflow count recorded.'
      },
      {
        type: 'label',
        text: 'Outcome'
      },
      {
        type: 'p',
        text: 'Odd headers no longer cause ticket creation to fail.'
      },
      {
        type: 'subheading',
        text: 'Secrets inside the workflow (open item)'
      },
      {
        type: 'label',
        text: 'Challenge'
      },
      {
        type: 'p',
        text: 'The ClickUp API token is written directly into the Authorization header of 8 HTTP Request nodes instead of an n8n credential, so it is visible to anyone who can open or export the workflow.'
      },
      {
        type: 'label',
        text: 'Solution'
      },
      {
        type: 'p',
        text: 'Create a ClickUp credential in n8n, switch those nodes to it, and rotate the token.'
      },
      {
        type: 'label',
        text: 'Outcome'
      },
      {
        type: 'p',
        text: 'Not done yet. The token is deliberately not reproduced in this document.'
      },
      {
        type: 'eyebrow',
        text: 'Key Takeaways & Future Development'
      },
      {
        type: 'subheading',
        text: 'Key takeaways'
      },
      {
        type: 'list',
        items: [
          'Design for the tool next door: the hardest part was coexisting with ClickUp’s own email automation, not creating tickets. Layered duplicate checks solved it.',
          'Headers over words: deciding on machine-readable signals, such as mail headers and a ticket id anchored to the end of the subject, keeps genuine emails from being filtered out.',
          'Fail open: choosing a duplicate over a lost email at every failure point makes the automation safe to leave running on a customer-facing inbox.',
          'Configuration in ClickUp, not in code: adding a client means filling in three fields on a ClickUp task, with no change to the workflow.'
        ]
      },
      {
        type: 'subheading',
        text: 'Future development'
      },
      {
        type: 'list',
        items: [
          'Move the ClickUp token into an n8n credential and rotate it.',
          'Log every skipped email (loop guard, ClickUp-owned, auto-reply) to a sheet or channel so skips can be audited.',
          'Surface the domain collisions the code already detects, for example with an alert, so two clients cannot silently share a domain.',
          'Replace the fixed 2-minute wait with a short retry loop that looks for ClickUp’s confirmation email.',
          'Merge the three near-identical attachment branches into one shared sub-workflow.',
          'Run a measured pilot and record tickets per week, time saved, routing accuracy and duplicate rate to complete the results section.'
        ]
      }
    ]
  },
  {
    id: 'hubspot-industry-classifier',
    title: 'HubSpot Industry Classifier with Gemini',
    description: 'Automatically sorting a backlog of HubSpot companies into industry groups with Google Gemini, and flagging the ones that need a human.',
    source: 'Notion',
    url: 'https://app.notion.com/p/Case-Study-HubSpot-Industry-Classifier-with-Gemini-3f8b33f9293f803d98c7d26f12c57c56',
    tags: [
      'n8n',
      'ai-agents'
    ],
    content: [
      {
        type: 'eyebrow',
        text: 'Overview'
      },
      {
        type: 'p',
        text: 'This project is an automation that fills in the Industry Group field on HubSpot company records. An n8n workflow runs every hour, takes companies from a HubSpot list, skips the ones that already have an industry group, asks Google Gemini to pick one group for each, and writes the answer back to HubSpot together with a confidence score and a one-line reason. Companies it cannot classify with confidence are marked Needs R&D for a person to review instead of being forced into a wrong category.'
      },
      {
        type: 'subheading',
        text: 'The business problem'
      },
      {
        type: 'p',
        text: 'A CRM is only useful for segmentation and reporting when every company has an industry. Filling the field by hand for a long backlog of companies is slow, and different people choose different categories for the same kind of business. Letting an AI write straight into the CRM brings its own risks: an invented category, a low-confidence guess recorded as fact, or the same company processed over and over.'
      },
      {
        type: 'subheading',
        text: 'The solution'
      },
      {
        type: 'p',
        text: 'The workflow reads the allowed Industry Group options directly from HubSpot, so the AI can only choose values that exist. Each company is handled one at a time. Gemini returns a single group, a confidence score and a reason in JSON, and a code node checks that the answer matches a real HubSpot option and clears a confidence threshold before anything is written. Anything that fails that check is labelled Needs R&D. A dry-run switch lets the team test the whole flow without changing any record.'
      },
      {
        type: 'subheading',
        text: 'Project snapshot'
      },
      {
        type: 'table',
        headers: [
          'Item',
          'Detail'
        ],
        rows: [
          [
            'Platform',
            'n8n'
          ],
          [
            'Trigger',
            'Schedule, every hour'
          ],
          [
            'CRM',
            'HubSpot (companies, a list of companies to process, the hs_industry_group property)'
          ],
          [
            'AI model',
            'Google Gemini Flash, temperature 0.2, no web search'
          ],
          [
            'Batch size',
            'Up to 100 companies per run, one at a time'
          ],
          [
            'Confidence threshold',
            '0.6'
          ],
          [
            'Safety switch',
            'dryRun setting, off by default'
          ],
          [
            'Workflow size',
            '22 nodes'
          ],
          [
            'Status',
            'Active'
          ]
        ]
      },
      {
        type: 'eyebrow',
        text: 'How the System Works'
      },
      {
        type: 'p',
        text: 'Each run follows the same six stages, from the schedule firing to a company updated in HubSpot.'
      },
      {
        type: 'table',
        headers: [
          'Step',
          'Process'
        ],
        rows: [
          [
            '1. Schedule and setup',
            'The Schedule Trigger starts the run every hour. Two things happen in parallel: the workflow loads the allowed Industry Group options from HubSpot, and sets its configuration (companies per run, confidence threshold, dry-run flag and the HubSpot list id).'
          ],
          [
            '2. Collect the backlog',
            'The workflow pages through the HubSpot list, 250 members at a time, until it has the configured maximum of 100 companies, then splits them into single items.'
          ],
          [
            '3. One company at a time',
            'A loop takes each company and fetches its name, domain, website, additional domains and current industry group. Companies that already have an industry group are skipped.'
          ],
          [
            '4. Prepare and check',
            'A code node cleans the domains. If a company has neither a domain nor a name, it is skipped because there is nothing to classify.'
          ],
          [
            '5. Gemini classification',
            'Gemini receives the name and domain with the list of allowed groups and the classification rules, and returns JSON with the industry, a confidence score and a reason.'
          ],
          [
            '6. Validate and write',
            'A code node matches the answer to a real HubSpot option and applies the confidence gate. Unless dry run is on, the result is written to HubSpot, followed by a Wait node before the next company.'
          ]
        ]
      },
      {
        type: 'label',
        text: 'The workflow in n8n'
      },
      {
        type: 'img',
        file: 'case-content/hubspot-industry-classifier/image1.jpg',
        caption: 'The two chains on the left prepare the run: the top one loads the valid industries, and the bottom one pages through the HubSpot list. The loop in the middle processes one company at a time through the Gemini step.'
      },
      {
        type: 'label',
        text: 'Supporting integrations'
      },
      {
        type: 'list',
        items: [
          'HubSpot: the list of companies to process, the company records, the allowed Industry Group options and the update call.',
          'Google Gemini: the classification model, with web search switched off so it answers from its own knowledge.',
          'n8n workflow static data: holds the pages of list members while they are being collected.'
        ]
      },
      {
        type: 'eyebrow',
        text: 'Core Workflow Configuration'
      },
      {
        type: 'p',
        text: 'The workflow is built from a handful of node groups. Settings that a person may want to change are kept together in one Init Search Config node.'
      },
      {
        type: 'table',
        headers: [
          'Node group',
          'Configuration'
        ],
        rows: [
          [
            'Schedule Trigger',
            'Runs every hour.'
          ],
          [
            'Get Industry Group Options / Extract Valid Industries',
            'Reads the hs_industry_group property definition from HubSpot. Builds the list of allowed labels, leaving out hidden options and Needs R&D (which is added back in the prompt), and keeps the raw options for matching later. Retries up to 3 times, 5 seconds apart.'
          ],
          [
            'Init Search Config',
            'Sets maxCompanies 100, confidenceThreshold 0.6, dryRun false and listId 638.'
          ],
          [
            'Get List Memberships / Accumulate List Members / Has More List Pages?',
            'Pages through the HubSpot list 250 members at a time, stores them in workflow static data and stops at the company limit.'
          ],
          [
            'Collect List Members / Split Company IDs',
            'Trims the collected members to the limit, clears the stored data and splits them into one item per company.'
          ],
          [
            'Loop Companies (1 at a time)',
            'Processes one company per round. Its finished output goes to Backlog Run Complete, which records the completion time.'
          ],
          [
            'Get Company',
            'Fetches name, domain, website, additional domains and current industry group from HubSpot. Retries up to 3 times.'
          ],
          [
            'IF Industry Group Missing',
            'Continues only when the industry group is empty, so companies already classified are never touched again.'
          ],
          [
            'Clean Domain (code)',
            'Strips protocol, www, paths and ports from the domain, website and additional domains, removes duplicates and builds a clean domain list.'
          ],
          [
            'IF Searchable',
            'Continues only if the company has at least one domain or a name.'
          ],
          [
            'Gemini Classify Industry',
            'Gemini Flash at temperature 0.2 with a detailed prompt: allowed groups, group definitions, classification rules and a JSON output format. Web search is off. Retries up to 5 times.'
          ],
          [
            'Match Industry Value (code)',
            'Reads the JSON from the model, caps the confidence at 0.65 when there is no domain, and matches the chosen group to a real HubSpot option by label, value or a normalized form.'
          ],
          [
            'Prepare Company Update (code)',
            'Applies the confidence gate and builds the HubSpot properties: the group (or Needs R&D), confidence, a reasoning text cleaned of stray characters and limited to 500 characters, a status and the check date.'
          ],
          [
            'IF Dry Run? / Dry Run - Skip Update',
            'In dry run mode the update is skipped and the loop continues.'
          ],
          [
            'Update Company Industry Group',
            'PATCH request to the HubSpot company record. Retries up to 3 times.'
          ],
          [
            'Wait1',
            'Pauses before the next company to stay within HubSpot rate limits.'
          ]
        ]
      },
      {
        type: 'eyebrow',
        text: 'Classification Rules and Scenarios'
      },
      {
        type: 'label',
        text: 'What the model is told'
      },
      {
        type: 'p',
        text: 'Gemini must choose exactly one group from the list HubSpot provides. The prompt defines each group (for example Manufacturing, eCommerce, Retail, Wholesale Distribution, SaaS, Development shop, IT / MSP, Low Voltage, Consulting, Finance, 3PL, Transportation, Energy Rebates and Self Storage) and sets rules for the edge cases:'
      },
      {
        type: 'list',
        items: [
          'Businesses that sell physical products to consumers are never excluded. They go to Retail (walk-in stores) or eCommerce (online-first and direct-to-consumer brands).',
          'Local consumer services, restaurants, medical and dental practices, schools, religious organizations and home services are marked Needs R&D with full confidence and an excluded flag.',
          'A company that cannot be identified, or fits none of the groups (such as a law firm or nonprofit), is marked Needs R&D instead of being forced into a group.',
          'Confidence is 0.80 to 1.0 when the company is clearly known, 0.40 to 0.65 for partial evidence or a name with no domain, and 0.0 when nothing can be verified.',
          'The answer must be a single JSON object with industry, confidence, excluded and reasoning.'
        ]
      },
      {
        type: 'label',
        text: 'Scenarios'
      },
      {
        type: 'p',
        text: 'These scenarios show how the workflow treats the main kinds of company. They are illustrative, derived from the prompt and code, and are not recordings of real HubSpot records.'
      },
      {
        type: 'table',
        headers: [
          'Scenario',
          'What arrives',
          'What the workflow does',
          'Result in HubSpot'
        ],
        rows: [
          [
            '1. Clearly known business',
            'A company with a domain whose business model the model recognizes, for example a software platform.',
            'Gemini returns the matching group with confidence 0.80 or higher. The code matches it to a HubSpot option and it passes the 0.6 gate.',
            'Industry group set, status updated, confidence and reason saved.'
          ],
          [
            '2. Consumer brand',
            'A clothing or electronics brand selling to the public.',
            'Rule 3 sends it to Retail or eCommerce, never to Needs R&D.',
            'Retail or eCommerce group set.'
          ],
          [
            '3. Local consumer service',
            'A pizzeria, dental practice or salon.',
            'Excluded under rule 4 with confidence 1.0.',
            'Group set to Needs R&D for a human to see.'
          ],
          [
            '4. Unknown company',
            'A company the model cannot identify.',
            'Returns Needs R&D with low confidence, so the gate fails.',
            'Group set to Needs R&D, status low_confidence or unmatched.'
          ],
          [
            '5. Name only',
            'A company with a name but no domain.',
            'Confidence is capped at 0.65 in code, so the model cannot be fully sure.',
            'Written only if it still clears 0.6, otherwise Needs R&D with status no_domain.'
          ],
          [
            '6. Already classified',
            'A company that already has an industry group.',
            'Stopped by IF Industry Group Missing, no model call.',
            'Unchanged.'
          ],
          [
            '7. Dry run',
            'Any company, with dryRun set to true.',
            'Everything runs except the HubSpot update.',
            'Nothing written.'
          ]
        ]
      },
      {
        type: 'eyebrow',
        text: 'Results & Metrics'
      },
      {
        type: 'p',
        text: 'The workflow is built and marked active. No run results were provided, so classification accuracy, the share of companies sent to Needs R&D and the time saved have not been measured.'
      },
      {
        type: 'table',
        headers: [
          'Metric',
          'Result'
        ],
        rows: [
          [
            'Production workflows',
            '1'
          ],
          [
            'n8n nodes',
            '22'
          ],
          [
            'Trigger',
            'Schedule, every hour'
          ],
          [
            'Companies per run',
            'Up to 100, processed one at a time'
          ],
          [
            'Industry groups',
            'Read live from HubSpot, so the model cannot pick a value that does not exist'
          ],
          [
            'Confidence gate',
            '0.6, with a 0.65 cap when a company has no domain'
          ],
          [
            'Fields written per company',
            'Industry group, confidence, reasoning, status and check date'
          ],
          [
            'Safety features',
            'Dry-run switch, skip of already classified companies, Needs R&D fallback, retries on every network and model call'
          ],
          [
            'Accuracy, volume, time saved',
            'Not measured yet'
          ]
        ]
      },
      {
        type: 'eyebrow',
        text: 'Technical Challenges & Solutions'
      },
      {
        type: 'subheading',
        text: 'The model could invent a category'
      },
      {
        type: 'label',
        text: 'Challenge'
      },
      {
        type: 'p',
        text: 'A free-text answer such as “Software” or “Tech services” does not match any HubSpot option and would break the update or pollute the field.'
      },
      {
        type: 'label',
        text: 'Solution'
      },
      {
        type: 'p',
        text: 'The allowed groups are loaded from HubSpot on every run and given to the model to copy exactly. The answer is then matched to a real option by label, value or a normalized form that ignores case, punctuation and “&” versus “and”.'
      },
      {
        type: 'label',
        text: 'Outcome'
      },
      {
        type: 'p',
        text: 'Only values that exist in HubSpot can be written.'
      },
      {
        type: 'subheading',
        text: 'A weak guess recorded as fact'
      },
      {
        type: 'label',
        text: 'Challenge'
      },
      {
        type: 'p',
        text: 'A model will always give an answer, even when it knows nothing about the company.'
      },
      {
        type: 'label',
        text: 'Solution'
      },
      {
        type: 'p',
        text: 'The model must return a confidence score, name-only companies are capped at 0.65, and a code node only writes a group when the answer matches an option and reaches 0.6. Everything else becomes Needs R&D, and the confidence, reason, status and check date are saved on the record.'
      },
      {
        type: 'label',
        text: 'Outcome'
      },
      {
        type: 'p',
        text: 'Doubtful cases are visible to a person instead of hidden among correct ones.'
      },
      {
        type: 'subheading',
        text: 'Processing the same companies again'
      },
      {
        type: 'label',
        text: 'Challenge'
      },
      {
        type: 'p',
        text: 'An hourly schedule over the same list would classify the same companies on every run and waste model calls.'
      },
      {
        type: 'label',
        text: 'Solution'
      },
      {
        type: 'p',
        text: 'The workflow only continues when the industry group is empty, so each company is processed once.'
      },
      {
        type: 'label',
        text: 'Outcome'
      },
      {
        type: 'p',
        text: 'Each run moves on to the next unclassified companies.'
      },
      {
        type: 'subheading',
        text: 'Reading a long list from HubSpot'
      },
      {
        type: 'label',
        text: 'Challenge'
      },
      {
        type: 'p',
        text: 'The HubSpot list API returns 250 members per page, and the run must stop at a fixed number of companies.'
      },
      {
        type: 'label',
        text: 'Solution'
      },
      {
        type: 'p',
        text: 'A loop collects pages in workflow static data until the next page is missing or the limit is reached, then clears the data and splits the members into single items.'
      },
      {
        type: 'label',
        text: 'Outcome'
      },
      {
        type: 'p',
        text: 'Runs are bounded and predictable.'
      },
      {
        type: 'subheading',
        text: 'Testing without touching real data'
      },
      {
        type: 'label',
        text: 'Challenge'
      },
      {
        type: 'p',
        text: 'Changing the prompt or rules on live CRM records is risky.'
      },
      {
        type: 'label',
        text: 'Solution'
      },
      {
        type: 'p',
        text: 'A dryRun setting runs the whole flow, including the model call, but skips the HubSpot update.'
      },
      {
        type: 'label',
        text: 'Outcome'
      },
      {
        type: 'p',
        text: 'The prompt can be tuned and checked before records are changed.'
      },
      {
        type: 'subheading',
        text: 'Open items found in the export'
      },
      {
        type: 'label',
        text: 'Challenge'
      },
      {
        type: 'p',
        text: 'Three details in the workflow need checking. The Wait node after each update has an amount of 10 but no unit stored, and n8n’s default unit for that node is hours. The prompt refers to a Seamless Data field that no earlier node fills, so it is always “N/A”. The collected list members sit in static data, so a run that fails halfway through paging could leave old members behind for the next run.'
      },
      {
        type: 'label',
        text: 'Solution'
      },
      {
        type: 'p',
        text: 'Open the Wait node and set the unit to seconds. Either feed the Seamless description into the prompt or remove the line. Clear the stored list at the start of each run.'
      },
      {
        type: 'label',
        text: 'Outcome'
      },
      {
        type: 'p',
        text: 'Not done yet. These are the first improvements to make.'
      },
      {
        type: 'eyebrow',
        text: 'Key Takeaways & Future Development'
      },
      {
        type: 'subheading',
        text: 'Key takeaways'
      },
      {
        type: 'list',
        items: [
          'Let the CRM define the answers: loading the allowed groups from HubSpot keeps the model inside the structure the team already uses.',
          'Check the model’s output in code: a confidence gate and a strict match to real options decide what is written, not the model alone.',
          'Send doubt to a person: Needs R&D with a stored reason turns uncertain cases into a review list.',
          'Make it safe to test: the dry-run switch, retries and the skip of classified companies make the workflow safe to leave running.'
        ]
      },
      {
        type: 'subheading',
        text: 'Future development'
      },
      {
        type: 'list',
        items: [
          'Set the Wait node unit to seconds and check that the Gemini model id is available in your account.',
          'Fill the Seamless Data line in the prompt or remove it.',
          'Clear the stored list members at the start of every run.',
          'Create a HubSpot view of companies marked Needs R&D, sorted by confidence, so reviewers can work through them.',
          'Send a short summary after each run (companies processed, written, flagged) using the Backlog Run Complete step.',
          'Run a measured pilot, compare a sample of results with a person’s choices, and use it to complete the results section.'
        ]
      }
    ]
  },
  {
    id: 'zapier-integrating-gohighlevel-with-beehiv-using-zapier',
    title: 'Integrating GoHighLevel with Beehiv Using Zapier',
    description: 'A Zap is being built to connect GoHighLevel with Beehiv.',
    source: 'Portfolio',
    url: 'https://bit.ly/4w5l2AE',
    tags: [
      'zapier'
    ],
    content: [
      {
        type: 'list',
        items: [
          'A Zap is being built to connect GoHighLevel with Beehiv.',
          'Whenever a user submits a form on GoHighLevel, the details are sent to Beehiv.',
          'A workflow is created in GoHighLevel to send the information to a Zapier webhook.',
          'Zapier receives the information and then adds it to Beehiv.'
        ]
      },
      {
        type: 'img',
        file: 'case-content/zapier-portfolio/image1.png'
      }
    ]
  },
  {
    id: 'zapier-automating-ig-rss-feed-to-pinterest',
    title: 'Automating IG RSS Feed to Pinterest Pin Creation',
    description: 'This automation is implemented to create a Pinterest pin whenever RSS data is received.',
    source: 'Portfolio',
    url: 'https://bit.ly/4w5l2AE',
    tags: [
      'zapier'
    ],
    content: [
      {
        type: 'list',
        items: [
          'This automation is implemented to create a Pinterest pin whenever RSS data is received.',
          'The automation ensures that all necessary information from the RSS feed is accurately extracted.',
          'This setup streamlines the process of keeping Pinterest updated with content from the RSS feed.',
          'The automation reduces manual effort and ensures timely pin creation based on new RSS data.'
        ]
      },
      {
        type: 'img',
        file: 'case-content/zapier-portfolio/image2.png'
      }
    ]
  },
  {
    id: 'zapier-automating-lemlist-and-lead-connector',
    title: 'Automating Lemlist and Lead connector',
    description: 'A Zapier automation: Automating Lemlist and Lead connector.',
    source: 'Portfolio',
    url: 'https://bit.ly/4w5l2AE',
    tags: [
      'zapier'
    ],
    content: [
      {
        type: 'img',
        file: 'case-content/zapier-portfolio/image3.png'
      }
    ]
  },
  {
    id: 'zapier-integration-of-rb2b-with-go-high',
    title: 'Integration of RB2B with Go High Level and Beehiv',
    description: 'RB2B is a platform that collects website visitor profiles.',
    source: 'Portfolio',
    url: 'https://bit.ly/4w5l2AE',
    tags: [
      'zapier'
    ],
    content: [
      {
        type: 'list',
        items: [
          'RB2B is a platform that collects website visitor profiles.',
          'When a profile is created in RB2B, that profile is added to lemlist'
        ]
      },
      {
        type: 'img',
        file: 'case-content/zapier-portfolio/image4.png'
      }
    ]
  },
  {
    id: 'zapier-automating-calendly-bookings-to-beehiiv',
    title: 'Automating Calendly bookings to Beehiiv',
    description: 'A Zapier automation: Automating Calendly bookings to Beehiiv.',
    source: 'Portfolio',
    url: 'https://bit.ly/4w5l2AE',
    tags: [
      'zapier'
    ],
    content: [
      {
        type: 'img',
        file: 'case-content/zapier-portfolio/image5.png'
      }
    ]
  },
  {
    id: 'zapier-automating-typeform-to-monday-com',
    title: 'Automating typeform to Monday.com',
    description: 'A Zapier automation: Automating typeform to Monday.com.',
    source: 'Portfolio',
    url: 'https://bit.ly/4w5l2AE',
    tags: [
      'zapier'
    ],
    content: [
      {
        type: 'img',
        file: 'case-content/zapier-portfolio/image6.png'
      }
    ]
  },
  {
    id: 'zapier-automating-trainerize-to-active-campaign',
    title: 'Automating Trainerize to Active campaign',
    description: 'A Zapier automation: Automating Trainerize to Active campaign.',
    source: 'Portfolio',
    url: 'https://bit.ly/4w5l2AE',
    tags: [
      'zapier'
    ],
    content: [
      {
        type: 'img',
        file: 'case-content/zapier-portfolio/image7.png'
      }
    ]
  },
  {
    id: 'zapier-gmail-to-clickup-zap',
    title: 'Gmail to ClickUp Zap',
    description: 'This Zap automates the process of task creation in ClickUp based on incoming emails from a specified sender in Gmail. Whenever an email is received from the designated…',
    source: 'Portfolio',
    url: 'https://bit.ly/4w5l2AE',
    tags: [
      'zapier'
    ],
    content: [
      {
        type: 'p',
        text: 'This Zap automates the process of task creation in ClickUp based on incoming emails from a specified sender in Gmail. Whenever an email is received from the designated sender, the Zap automatically creates a new task in ClickUp. Additionally, any attachments included in the email are uploaded and attached to the newly created ClickUp task, ensuring all pertinent information and documents are consolidated and accessible directly within the task.'
      },
      {
        type: 'img',
        file: 'case-content/zapier-portfolio/image8.png'
      },
      {
        type: 'img',
        file: 'case-content/zapier-portfolio/image9.png'
      }
    ]
  },
  {
    id: 'zapier-google-calendar-to-clickup-zap',
    title: 'Google Calendar to ClickUp Zap',
    description: 'This Zap facilitates seamless integration between Google Calendar and ClickUp, enhancing task management and operational efficiency. Whenever a new event is created in…',
    source: 'Portfolio',
    url: 'https://bit.ly/4w5l2AE',
    tags: [
      'zapier'
    ],
    content: [
      {
        type: 'p',
        text: 'This Zap facilitates seamless integration between Google Calendar and ClickUp, enhancing task management and operational efficiency. Whenever a new event is created in Google Calendar, the Zap automatically generates a corresponding task in ClickUp. It transfers relevant details from the calendar event, such as the date, time, and event description, to the ClickUp task. Furthermore, the Zap is configured to assign these tasks to specific individuals, optimizing task allocation and ensuring the right team members are engaged with relevant events and responsibilities.'
      },
      {
        type: 'img',
        file: 'case-content/zapier-portfolio/image10.png'
      }
    ]
  },
  {
    id: 'zapier-cancel-calendly-bookings-zap',
    title: 'Cancel Calendly Bookings Zap',
    description: 'This Zap streamlines the process of appointment cancellations by integrating ClickUp with Calendly. When a cancellation is initiated from within ClickUp—by pressing the…',
    source: 'Portfolio',
    url: 'https://bit.ly/4w5l2AE',
    tags: [
      'zapier'
    ],
    content: [
      {
        type: 'p',
        text: 'This Zap streamlines the process of appointment cancellations by integrating ClickUp with Calendly. When a cancellation is initiated from within ClickUp—by pressing the cancel button on a specific task—the relevant appointment is automatically cancelled in Calendly. This automation ensures that appointment slots are efficiently managed and updated in real time, reducing manual oversight and the potential for scheduling conflicts.'
      },
      {
        type: 'img',
        file: 'case-content/zapier-portfolio/image11.png'
      },
      {
        type: 'img',
        file: 'case-content/zapier-portfolio/image12.png'
      }
    ]
  },
  {
    id: 'make-automation-of-shopify-orders-to-google',
    title: 'Automation of Shopify Orders to Google Sheets for Dropshipping E-commerce Store',
    description: 'The primary goal of this automation is to streamline the process of managing Shopify orders by automatically distributing them to the appropriate fulfillment sheets.…',
    source: 'Portfolio',
    url: 'https://bit.ly/4w5l2AE',
    tags: [
      'make'
    ],
    content: [
      {
        type: 'p',
        text: 'The primary goal of this automation is to streamline the process of managing Shopify orders by automatically distributing them to the appropriate fulfillment sheets. This is particularly useful for a dropshipping e-commerce store that sources products from multiple suppliers, such as AliExpress.'
      },
      {
        type: 'list',
        items: [
          'Order Creation: Whenever a new order is created in Shopify, the automation system adds it to a data store built within Make, making sure all orders are logged and tracked efficiently.',
          'Product Identification: The automation includes a scenario that checks the product IDs in a Google Sheets database. By matching these product IDs, the system determines which specific fulfillment sheet each order should be directed to, based on the supplier.',
          'Master Sheet Integration: A master sheet is maintained where all order data is consolidated. This master sheet serves as the central point for tracking and managing all orders. Whenever any changes are made to the master sheet, the automation ensures that these updates are reflected in the respective Google Sheets, maintaining consistency and accuracy across all fulfillment sheets.',
          'Supplier Coordination: By automating the distribution of orders to the correct fulfillment sheets, the system ensures that each supplier receives the correct order information, facilitating efficient and accurate order fulfillment.'
        ]
      },
      {
        type: 'img',
        file: 'case-content/make-portfolio/image1.png'
      },
      {
        type: 'img',
        file: 'case-content/make-portfolio/image2.png'
      },
      {
        type: 'img',
        file: 'case-content/make-portfolio/image3.png'
      }
    ]
  },
  {
    id: 'make-daily-slack-updates-make-scenario',
    title: 'Daily Slack Updates Make Scenario',
    description: 'The automation is designed to send daily updates to Slack. The data in Google Sheets is updated daily, and the KPI data is sent to Slack every day using a Make scenario.',
    source: 'Portfolio',
    url: 'https://bit.ly/4w5l2AE',
    tags: [
      'make'
    ],
    content: [
      {
        type: 'p',
        text: 'The automation is designed to send daily updates to Slack. The data in Google Sheets is updated daily, and the KPI data is sent to Slack every day using a Make scenario.'
      },
      {
        type: 'img',
        file: 'case-content/make-portfolio/image4.png'
      }
    ]
  },
  {
    id: 'make-automation-of-clickup-and-google-sheets',
    title: 'Automation of ClickUp and Google Sheets',
    description: 'This Make scenario is implemented whenever a task gets completed in ClickUp.',
    source: 'Portfolio',
    url: 'https://bit.ly/4w5l2AE',
    tags: [
      'make'
    ],
    content: [
      {
        type: 'list',
        items: [
          'This Make scenario is implemented whenever a task gets completed in ClickUp.',
          'The task details are then sent to Google Sheets.',
          'Based on custom fields, the data is being sent to respective google sheet file'
        ]
      },
      {
        type: 'img',
        file: 'case-content/make-portfolio/image5.png'
      }
    ]
  },
  {
    id: 'make-integration-of-shopify-and-clickup-for',
    title: 'Integration of Shopify and ClickUp for Managing Refunded Orders',
    description: 'This scenario is built so that whenever there is a refunded order in Shopify, the order details are added to ClickUp as tasks.',
    source: 'Portfolio',
    url: 'https://bit.ly/4w5l2AE',
    tags: [
      'make'
    ],
    content: [
      {
        type: 'list',
        items: [
          'This scenario is built so that whenever there is a refunded order in Shopify, the order details are added to ClickUp as tasks.',
          'This integration is implemented to streamline the management of refunded orders.'
        ]
      },
      {
        type: 'img',
        file: 'case-content/make-portfolio/image6.png'
      }
    ]
  },
  {
    id: 'make-fulfilled-order-integration-with-clickup',
    title: 'Fulfilled Order Integration with ClickUp',
    description: 'This Make scenario is implemented so that whenever an order is fulfilled in Shopify, the order details are added to ClickUp.',
    source: 'Portfolio',
    url: 'https://bit.ly/4w5l2AE',
    tags: [
      'make'
    ],
    content: [
      {
        type: 'p',
        text: 'This Make scenario is implemented so that whenever an order is fulfilled in Shopify, the order details are added to ClickUp.'
      },
      {
        type: 'img',
        file: 'case-content/make-portfolio/image7.png'
      }
    ]
  },
  {
    id: 'make-automating-ig-rss-feed-to-pinterest',
    title: 'Automating IG RSS Feed to Pinterest Pin Creation',
    description: 'This automation is implemented to create a Pinterest pin whenever RSS data is received.',
    source: 'Portfolio',
    url: 'https://bit.ly/4w5l2AE',
    tags: [
      'make'
    ],
    content: [
      {
        type: 'list',
        items: [
          'This automation is implemented to create a Pinterest pin whenever RSS data is received.',
          'In this Make scenario, multiple text parsers are used to ensure the data is in the relevant form when creating the pin.',
          'The automation ensures that all necessary information from the RSS feed is accurately extracted.',
          'Data parsing helps in formatting the content appropriately for Pinterest.',
          'This setup streamlines the process of keeping Pinterest updated with content from the RSS feed.',
          'The automation reduces manual effort and ensures timely pin creation based on new RSS data.'
        ]
      },
      {
        type: 'img',
        file: 'case-content/make-portfolio/image8.png'
      }
    ]
  },
  {
    id: 'make-integration-of-rb2b-with-go-high',
    title: 'Integration of RB2B with Go High Level and Beehiv',
    description: 'RB2B is a platform that collects website visitor profiles.',
    source: 'Portfolio',
    url: 'https://bit.ly/4w5l2AE',
    tags: [
      'make'
    ],
    content: [
      {
        type: 'list',
        items: [
          'RB2B is a platform that collects website visitor profiles.',
          'When a profile is created in RB2B, that profile is added to Go High Level as a contact.',
          'A deal is also created in Go High Level for the new contact.',
          'Additionally, the email is added to Beehiv as a subscriber.'
        ]
      },
      {
        type: 'img',
        file: 'case-content/make-portfolio/image9.png'
      }
    ]
  },
  {
    id: 'make-integration-of-go-high-level-with',
    title: 'Integration of Go High Level with Beehiv',
    description: 'This scenario is implemented so that whenever the status of an opportunity is changed in Go High Level, the associated email is added to Beehiv as a subscriber.',
    source: 'Portfolio',
    url: 'https://bit.ly/4w5l2AE',
    tags: [
      'make'
    ],
    content: [
      {
        type: 'p',
        text: 'This scenario is implemented so that whenever the status of an opportunity is changed in Go High Level, the associated email is added to Beehiv as a subscriber.'
      },
      {
        type: 'img',
        file: 'case-content/make-portfolio/image10.png'
      }
    ]
  },
  {
    id: 'ai-agent-ai-driven-instagram-video-breakdown-decode',
    title: 'AI-Driven Instagram Video Breakdown: Decode What Makes Viral Content Tick',
    description: 'Automatically fetch and analyze top-performing Instagram videos from popular creators to uncover what makes them stand out.',
    source: 'Portfolio',
    url: 'https://bit.ly/4ePg6cL',
    tags: [
      'ai-agents'
    ],
    content: [
      {
        type: 'label',
        text: 'Objective:'
      },
      {
        type: 'p',
        text: 'Automatically fetch and analyze top-performing Instagram videos from popular creators to uncover what makes them stand out.'
      },
      {
        type: 'label',
        text: 'Implementation:'
      },
      {
        type: 'p',
        text: 'The workflow starts by pulling Instagram usernames from your list, finds the creator’s most viewed video, and uses AI to break it down—frame by frame, word by word—to reveal the hidden ingredients of viral success.'
      },
      {
        type: 'label',
        text: 'Outcome'
      },
      {
        type: 'list',
        items: [
          'Schedule it to run: .Schedule it to run daily, weekly or monthly.',
          'Fetches Creators: It pulls Instagram usernames from your Airtable.',
          'Finds the Top Video: From each creator, it picks the reel with the highest views—because we only care about what’s working 📈',
          'Stores the Essentials: Saves the video link, caption, creator name, and view count.',
          'Downloads the Video: Preps the reel so we can take a closer look under the hood.',
          'Uses AI to Analyze the Magic: Here’s where it gets spicy 🔍',
          'What’s the hook? How does it grab attention in the first 3 seconds?',
          'What’s the vibe? What’s happening in the video—background, setting, energy?',
          'Visual style: What kind of text, clothes, or framing makes it pop?',
          'Game-changer moments: What moment makes viewers stop scrolling and watch till the end?',
          'Saves the Analysis: The insights are written down and saved back in your Airtable. Boom—structured, searchable, gold-standard content breakdown.'
        ]
      },
      {
        type: 'img',
        file: 'case-content/ai-agents-general/image1.png'
      }
    ]
  },
  {
    id: 'ai-agent-smart-amazon-product-tracker-for-price',
    title: 'Smart Amazon Product Tracker for Price Drop Alerts',
    description: 'To fetch product details from Amazon and alert you if the price drops—because who doesn’t love a good deal? 💸',
    source: 'Portfolio',
    url: 'https://bit.ly/4ePg6cL',
    tags: [
      'ai-agents'
    ],
    content: [
      {
        type: 'label',
        text: 'Objective:'
      },
      {
        type: 'p',
        text: 'To fetch product details from Amazon and alert you if the price drops—because who doesn’t love a good deal? 💸'
      },
      {
        type: 'label',
        text: 'Implementation:'
      },
      {
        type: 'p',
        text: 'The workflow grabs product links from a database,, scrapes product info, compares old vs new prices, updates the records, and—if there\'s a discount—sends you an email so you can grab it before it’s gone.'
      },
      {
        type: 'label',
        text: 'Outcome:'
      },
      {
        type: 'list',
        items: [
          'Kick-off Daily: Schedule to run daily.',
          'Grabs Products from Airtable: It checks your list to see which items are being tracked.',
          'Launches the Scraper: The link is sent to Apify, which fetches the product’s name, price, and more.',
          'Pulls the Results: Once scraping is done, it collects all the fresh details.',
          'Updates the Product Info: It neatly saves everything back into your Airtable list (because organized data is happy data).',
          'Checks for Price Drops: If today’s price is lower than the last one, the flow gets excited 🤑',
          'Sends You an Email Alert: You get an email telling you “Hey, the price just dropped!” with a link to check it out.',
          'Keeps Things Updated: Whether the price dropped or not, it always saves the latest price for next time.'
        ]
      },
      {
        type: 'img',
        file: 'case-content/ai-agents-general/image2.png'
      }
    ]
  },
  {
    id: 'ai-agent-youtube-video-details-scraper-using-automation',
    title: 'YouTube Video Details Scraper using Automation',
    description: 'Automatically collect detailed info from YouTube videos of popular creators for content analysis.',
    source: 'Portfolio',
    url: 'https://bit.ly/4ePg6cL',
    tags: [
      'ai-agents'
    ],
    content: [
      {
        type: 'label',
        text: 'Objective:'
      },
      {
        type: 'p',
        text: 'Automatically collect detailed info from YouTube videos of popular creators for content analysis.'
      },
      {
        type: 'label',
        text: 'Implementation:'
      },
      {
        type: 'p',
        text: 'The workflow pulls the url from your database, scrapes their details using a scraping tool, waits for results, and then saves everything back to the database.'
      },
      {
        type: 'label',
        text: 'Outcome:'
      },
      {
        type: 'list',
        items: [
          'Triggered by a Click: You hit “Start” to run the process.',
          'Grabs Video Links: It picks up YouTube links marked as “ready” in your Airtable.',
          'Runs the Scraper: Sends each link to an automation tool that fetches all available video details—title, channel name, views, likes, subtitles, description, and thumbnail.',
          'Waits for Results: Gives the scraper time to finish collecting the info.',
          'Saves Everything Back: Once done, all the data is pushed back into Airtable, organized and ready for your analysis.'
        ]
      },
      {
        type: 'img',
        file: 'case-content/ai-agents-general/image3.png'
      }
    ]
  },
  {
    id: 'ai-agent-smart-ai-podcast-audio-script-generator',
    title: 'Smart AI Podcast Audio Script Generator from BBC News',
    description: 'To turn positive and interesting news stories into podcast-style audio scripts using AI.',
    source: 'Portfolio',
    url: 'https://bit.ly/4ePg6cL',
    tags: [
      'ai-agents'
    ],
    content: [
      {
        type: 'label',
        text: 'Objective:'
      },
      {
        type: 'p',
        text: 'To turn positive and interesting news stories into podcast-style audio scripts using AI.'
      },
      {
        type: 'label',
        text: 'Implementation:'
      },
      {
        type: 'p',
        text: 'The system collects news stories from the BBC website, checks if they are podcast-friendly, rewrites them into an engaging script, and finally prepares them for audio conversion.'
      },
      {
        type: 'label',
        text: 'Outcome:'
      },
      {
        type: 'list',
        items: [
          'Starts Manually: The process begins with a button click to start the flow.',
          'Fetches the News: It visits the BBC homepage and grabs all the latest news headlines and descriptions.'
        ]
      },
      {
        type: 'img',
        file: 'case-content/ai-agents-general/image4.png'
      },
      {
        type: 'list',
        items: [
          'Filters the Content: It goes through the list and picks out only 10 headlines.',
          'Checks Suitability: Each headline is checked to see if it’s interesting, positive, and fit for a podcast.',
          'Gets Full Articles: For the suitable headlines, it goes to the full news page and pulls in the main content.',
          'Creates the Script: The stories are then rewritten into a warm, friendly, and engaging podcast script.',
          'Checks Script Output: It makes sure the script is properly prepared.',
          'Sends for Audio: If everything looks good, the script is sent to a tool that can convert the text into voice.'
        ]
      },
      {
        type: 'img',
        file: 'case-content/ai-agents-general/image5.png'
      },
      {
        type: 'img',
        file: 'case-content/ai-agents-general/image6.png'
      }
    ]
  },
  {
    id: 'ai-agent-tiktok-video-downloader-without-watermark-save',
    title: 'TikTok Video Downloader without watermark: Save Any Reel Directly to Google Drive',
    description: 'To automatically download a TikTok video and store it in Google Drive with a public share link.',
    source: 'Portfolio',
    url: 'https://bit.ly/4ePg6cL',
    tags: [
      'ai-agents'
    ],
    content: [
      {
        type: 'label',
        text: 'Objective:'
      },
      {
        type: 'p',
        text: 'To automatically download a TikTok video and store it in Google Drive with a public share link.'
      },
      {
        type: 'label',
        text: 'Implementation:'
      },
      {
        type: 'p',
        text: 'This workflow fetches a TikTok video, extracts its direct video link, downloads it without watermark, and saves the file to your Google Drive, for content reposting.'
      },
      {
        type: 'label',
        text: 'Outcome:'
      },
      {
        type: 'list',
        items: [
          'One Click to Start: The flow begins with a simple tap to kick things off.',
          'Fetches the Page: It opens the TikTok video page and grabs all the HTML data.'
        ]
      },
      {
        type: 'img',
        file: 'case-content/ai-agents-general/image7.png'
      },
      {
        type: 'list',
        items: [
          'Extracts the Video URL: A smart code block digs into that HTML and pulls out the real video link.',
          'Downloads the Video: The video file is then downloaded using that clean URL.',
          'Uploads to Google Drive: The downloaded video is saved directly to your Drive.',
          'Creates Shareable Link: The file is made public so you can share it with just one link.'
        ]
      },
      {
        type: 'img',
        file: 'case-content/ai-agents-general/image8.png'
      }
    ]
  },
  {
    id: 'ai-agent-ai-powered-social-post-generator-from',
    title: 'AI-Powered Social Post Generator: From Spreadsheet to Socials in Seconds!',
    description: 'Automatically create short, engaging, and fact-based posts (with emojis!) based on your content ideas—and publish them to the right platform.',
    source: 'Portfolio',
    url: 'https://bit.ly/4ePg6cL',
    tags: [
      'ai-agents'
    ],
    content: [
      {
        type: 'label',
        text: 'Objective:'
      },
      {
        type: 'p',
        text: 'Automatically create short, engaging, and fact-based posts (with emojis!) based on your content ideas—and publish them to the right platform.'
      },
      {
        type: 'label',
        text: 'Implementation:'
      },
      {
        type: 'p',
        text: 'This workflow grabs an idea from your Google Sheet, uses AI to turn it into a social-ready post, and then posts it to either LinkedIn or X (Twitter), depending on your selection.'
      },
      {
        type: 'label',
        text: 'Outcome:'
      },
      {
        type: 'list',
        items: [
          'Kickstarts with a Click: You run the workflow manually to process new ideas.',
          'Reads the Sheet: It pulls content ideas and target platforms from your Google Sheet.',
          'Checks Status: Only picks ideas that haven’t been published yet (marked as 0).',
          'Uses AI to Write the Post: Google Gemini crafts a short, fact-based, emoji-filled post tailored to the selected platform.'
        ]
      },
      {
        type: 'label',
        text: 'Posts It Where It Belongs'
      },
      {
        type: 'list',
        items: [
          'If the platform is LinkedIn, it publishes there.',
          'If it’s X (Twitter), it posts accordingly.'
        ]
      },
      {
        type: 'img',
        file: 'case-content/ai-agents-general/image9.png'
      },
      {
        type: 'p',
        text: 'Done. One idea, one click, and you’ve got content live on the right platform—no copy-pasting needed.'
      },
      {
        type: 'img',
        file: 'case-content/ai-agents-general/image10.png'
      }
    ]
  },
  {
    id: 'ai-agent-ai-powered-rag-chatbot-for-the',
    title: 'AI-Powered RAG Chatbot for The Fast Bite: Seamless Ordering and Query Handling',
    description: 'Create an AI-powered chatbot that helps The Fast Bite( a fast food restaurant) customers with menu queries, placing orders, and providing restaurant details in a fast…',
    source: 'Portfolio',
    url: 'https://bit.ly/4ePg6cL',
    tags: [
      'ai-agents'
    ],
    content: [
      {
        type: 'label',
        text: 'Objective:'
      },
      {
        type: 'p',
        text: 'Create an AI-powered chatbot that helps The Fast Bite( a fast food restaurant) customers with menu queries, placing orders, and providing restaurant details in a fast and friendly manner.'
      },
      {
        type: 'label',
        text: 'Implementation:'
      },
      {
        type: 'p',
        text: 'The RAG Chatbot for The Fast Bite automatically updates itself with the latest menu and restaurant info from Google Drive and quickly uses that to help customers with orders or questions. It provides fast and accurate responses to make the customer experience smoother.'
      },
      {
        type: 'label',
        text: 'Outcome:'
      },
      {
        type: 'label',
        text: 'Triggered by New Files'
      },
      {
        type: 'p',
        text: 'The chatbot starts working whenever a new file is added to The Fast Bite’s Google Drive folder. This could include updates to the menu or any other important information.'
      },
      {
        type: 'img',
        file: 'case-content/ai-agents-general/image11.png'
      },
      {
        type: 'label',
        text: 'Downloading the Information'
      },
      {
        type: 'p',
        text: 'The chatbot downloads the new file automatically from Google Drive for processing.'
      },
      {
        type: 'label',
        text: 'Understanding the Data'
      },
      {
        type: 'p',
        text: 'It uses Google Gemini (AI) to turn the downloaded content into a format that the chatbot can understand.'
      },
      {
        type: 'label',
        text: 'Storing the Info'
      },
      {
        type: 'p',
        text: 'The processed data is stored in a system called Pinecone. This helps the chatbot quickly find the answers when customers ask questions.'
      },
      {
        type: 'label',
        text: 'Handling Customer Queries'
      },
      {
        type: 'p',
        text: 'When customers ask questions, the chatbot uses this stored information to provide relevant and helpful responses instantly.'
      },
      {
        type: 'img',
        file: 'case-content/ai-agents-general/image12.png'
      },
      {
        type: 'label',
        text: 'Key Features'
      },
      {
        type: 'list',
        items: [
          'Fast Updates: The chatbot is always up-to-date with the latest menu or restaurant information.',
          'AI-Powered Answers: It uses advanced AI to provide accurate, friendly responses.',
          'Seamless Experience: The chatbot helps customers with ordering, customizing their meals, and answering common questions (like store hours, promotions, etc.).'
        ]
      },
      {
        type: 'img',
        file: 'case-content/ai-agents-general/image13.png'
      },
      {
        type: 'img',
        file: 'case-content/ai-agents-general/image14.png'
      }
    ]
  },
  {
    id: 'gas-automated-pdf-data-extraction-from-gmail',
    title: 'Automated PDF Data Extraction from Gmail and Google Sheets Integration',
    description: 'Developed an automated solution for a client who received daily PDFs via email. Created a Google Apps Script that scans Gmail for specific emails containing PDF…',
    source: 'Portfolio',
    tags: [
      'google-apps-script'
    ],
    content: [
      {
        type: 'p',
        text: 'Developed an automated solution for a client who received daily PDFs via email. Created a Google Apps Script that scans Gmail for specific emails containing PDF attachments, downloads and parses these PDFs to extract vital information, and transfers this extracted data into a designated Google Sheet. The script is scheduled to run automatically at a pre-defined time each day, ensuring timely data processing and minimal manual intervention.'
      },
      {
        type: 'label',
        text: 'Features'
      },
      {
        type: 'list',
        items: [
          'User Authentication: Secure login mechanism to authenticate users.',
          'PDF Upload: Interface to upload PDF files manually.',
          'Data Extraction: Extract specific fields like order code, shipping address, product details, etc., from the uploaded PDF.',
          'Google Sheets Integration: Populate the extracted data into a Google Sheet.',
          'Scheduled Email Fetching: Automated function to fetch PDF attachments from a user’s email at scheduled intervals.',
          'Data Validation: Validation checks to ensure data consistency and accuracy.'
        ]
      },
      {
        type: 'img',
        file: 'case-content/google-apps-script-portfolio/image1.png',
        caption: 'Feature list and the two-workflow design: a scheduled main flow (PDF parsing → validation → sheet integration) alongside a manual upload flow (login → upload).'
      },
      {
        type: 'img',
        file: 'case-content/google-apps-script-portfolio/image2.png',
        caption: 'The FastAPI backend that handles the upload, invoice parsing, and Sheets integration.'
      }
    ]
  },
  {
    id: 'gas-growth-model-development-with-defined-kpis',
    title: 'Growth Model Development with Defined KPIs',
    description: 'Designed a dynamic growth model in Google Sheets, complete with Key Performance Indicators (KPIs) to enhance visibility and guide decision-making.',
    source: 'Portfolio',
    tags: [
      'google-apps-script'
    ],
    content: [
      {
        type: 'p',
        text: 'Designed a dynamic growth model in Google Sheets, complete with Key Performance Indicators (KPIs) to enhance visibility and guide decision-making.'
      },
      {
        type: 'img',
        file: 'case-content/google-apps-script-portfolio/image3.png',
        caption: 'The growth funnel model — awareness, engagement, and retention KPIs tracked month over month.'
      }
    ]
  },
  {
    id: 'gas-bigquery-to-google-sheets-data-pipeline',
    title: 'BigQuery to Google Sheets Data Pipeline',
    description: 'Implemented a robust data pipeline using SyncWith and SQL to extract and sync data from BigQuery to Google Sheets for real-time analytics and reporting.',
    source: 'Portfolio',
    tags: [
      'google-apps-script'
    ],
    content: [
      {
        type: 'p',
        text: 'Implemented a robust data pipeline using SyncWith and SQL to extract and sync data from BigQuery to Google Sheets for real-time analytics and reporting.'
      },
      {
        type: 'img',
        file: 'case-content/google-apps-script-portfolio/image4.png',
        caption: 'A scheduled BigQuery SQL query joining employer and sign-up data by month for the KPI sheet.'
      }
    ]
  },
  {
    id: 'gas-google-sheets-data-visualization-dashboard',
    title: 'Google Sheets Data Visualization Dashboard',
    description: 'Created an interactive dashboard within Google Sheets for effective data visualization and tracking, serving as a quick reference tool for stakeholders.',
    source: 'Portfolio',
    tags: [
      'google-apps-script'
    ],
    content: [
      {
        type: 'p',
        text: 'Created an interactive dashboard within Google Sheets for effective data visualization and tracking, serving as a quick reference tool for stakeholders.'
      },
      {
        type: 'img',
        file: 'case-content/google-apps-script-portfolio/image5.png',
        caption: 'A CRM dashboard inside Google Sheets tracking hiring totals, job closures, and feedback scores.'
      }
    ]
  },
  {
    id: 'gas-batch-creation-of-folders-and-files',
    title: 'Batch Creation of Folders and Files',
    description: 'The script initiates by creating a structured main folder in Google Drive.',
    source: 'Portfolio',
    tags: [
      'google-apps-script'
    ],
    content: [
      {
        type: 'list',
        items: [
          'The script initiates by creating a structured main folder in Google Drive.',
          'Within this main folder, it systematically generates a set of predefined subfolders.',
          'For each subfolder, the script creates specific spreadsheet files from templates designed for various purposes.',
          'Google Docs templates are duplicated and placed into their respective folders, ready for use.',
          'A master spreadsheet is updated with the names, IDs, and direct links to all created folders and files, facilitating easy navigation and organization.'
        ]
      },
      {
        type: 'img',
        file: 'case-content/google-apps-script-portfolio/image6.png',
        caption: 'The batch-creation script that generates each client’s folder structure, contract, and accounting files from templates.'
      }
    ]
  },
  {
    id: 'gas-batch-management-of-access',
    title: 'Batch Management of Access',
    description: 'The script reads from a spreadsheet cell that lists email addresses authorized for file access.',
    source: 'Portfolio',
    tags: [
      'google-apps-script'
    ],
    content: [
      {
        type: 'list',
        items: [
          'The script reads from a spreadsheet cell that lists email addresses authorized for file access.',
          'It programmatically adjusts the sharing settings of designated Google Drive files and folders, granting access to the emails provided.',
          'Concurrently, it ensures that access is removed from email addresses not currently listed in the spreadsheet.',
          'This process is tailored to manage differing access levels needed for team members versus clients.',
          'The script offers an efficient mechanism to control document access, reducing the risk of unauthorized viewing or editing.'
        ]
      }
    ]
  },
  {
    id: 'gas-email-reminder-system',
    title: 'Email Reminder System',
    description: 'The script is scheduled to run daily to ensure real-time relevancy of its functions.',
    source: 'Portfolio',
    tags: [
      'google-apps-script'
    ],
    content: [
      {
        type: 'list',
        items: [
          'The script is scheduled to run daily to ensure real-time relevancy of its functions.',
          'It begins by accessing specific files through provided links within a master file.',
          'Once the file is opened, the script navigates to a particular sub-tab where date-specific data is stored.',
          'It compares the stored dates against the current date to identify matches.',
          'When a match is found, indicating a task or event due that day, it triggers the sending of customized email reminders to designated recipients.',
          'This automation ensures that reminders are sent out without fail, improving the consistency of communications and task management.'
        ]
      },
      {
        type: 'img',
        file: 'case-content/google-apps-script-portfolio/image7.png',
        caption: 'Extracting a hyperlink from a spreadsheet cell to locate the right file before checking its dates.'
      },
      {
        type: 'img',
        file: 'case-content/google-apps-script-portfolio/image8.png',
        caption: 'A due-diligence checkup variant: comparing today’s date against the sheet before sending a scheduled compliance email.'
      },
      {
        type: 'img',
        file: 'case-content/google-apps-script-portfolio/image9.png',
        caption: 'The companion screening script that walks each row and extracts the linked spreadsheet before processing it.'
      }
    ]
  },
  {
    id: 'gas-google-apps-script-for-chart-automation',
    title: 'Google Apps Script for Chart Automation',
    description: 'Utilized Google Apps Script to automate the generation and saving of chart images to Google Drive, streamlining the reporting process.',
    source: 'Portfolio',
    tags: [
      'google-apps-script'
    ],
    content: [
      {
        type: 'p',
        text: 'Utilized Google Apps Script to automate the generation and saving of chart images to Google Drive, streamlining the reporting process.'
      }
    ]
  },
  {
    id: 'gas-automated-pdf-invoicing-via-email',
    title: 'Automated PDF Invoicing via Email',
    description: 'Created Google Apps Script to automatically format data into PDF invoices and send them via email, saving manual effort and enhancing operational efficiency.',
    source: 'Portfolio',
    tags: [
      'google-apps-script'
    ],
    content: [
      {
        type: 'p',
        text: 'Created Google Apps Script to automatically format data into PDF invoices and send them via email, saving manual effort and enhancing operational efficiency.'
      }
    ]
  },
  {
    id: 'gas-automated-column-management-in-inventory-sheet',
    title: 'Automated Column Management in Inventory Sheet',
    description: 'Developed an app script to automatically update columns in an inventory sheet based on values in another sheet, enabling seamless data synchronization within Google…',
    source: 'Portfolio',
    tags: [
      'google-apps-script'
    ],
    content: [
      {
        type: 'p',
        text: 'Developed an app script to automatically update columns in an inventory sheet based on values in another sheet, enabling seamless data synchronization within Google Sheets.'
      },
      {
        type: 'img',
        file: 'case-content/google-apps-script-portfolio/image10.png',
        caption: 'Syncing active/inactive status between a main sheet and a linked inventory spreadsheet.'
      },
      {
        type: 'img',
        file: 'case-content/google-apps-script-portfolio/image11.png',
        caption: 'A custom menu for updating inventory values and normalizing leading zeros on demand.'
      }
    ]
  },
  {
    id: 'gas-csv-based-inventory-data-entry-automation',
    title: 'CSV-Based Inventory Data Entry Automation',
    description: 'Created a script to automate data entry in an inventory sheet from CSV files. The script also includes a data cleaning function to ensure accuracy and integrity of the…',
    source: 'Portfolio',
    tags: [
      'google-apps-script'
    ],
    content: [
      {
        type: 'p',
        text: 'Created a script to automate data entry in an inventory sheet from CSV files. The script also includes a data cleaning function to ensure accuracy and integrity of the imported data.'
      },
      {
        type: 'img',
        file: 'case-content/google-apps-script-portfolio/image12.png',
        caption: 'Multi-warehouse inventory data with flagged data-quality issues the cleaning step catches — mismatched locations and unidentified SKUs.'
      }
    ]
  },
  {
    id: 'gas-project-tracker-management',
    title: 'Project Tracker Management',
    description: 'Worked on developing a Project Tracker in Google Sheets to allocate tasks, track project milestones, and monitor team performance, complete with real-time updates and…',
    source: 'Portfolio',
    tags: [
      'google-apps-script'
    ],
    content: [
      {
        type: 'p',
        text: 'Worked on developing a Project Tracker in Google Sheets to allocate tasks, track project milestones, and monitor team performance, complete with real-time updates and visual dashboards for easy interpretation.'
      },
      {
        type: 'img',
        file: 'case-content/google-apps-script-portfolio/image13.png',
        caption: 'A Gantt-style project schedule generated directly in Google Sheets.'
      }
    ]
  },
  {
    id: 'gas-shopify-to-google-sheets-data-transfer',
    title: 'Shopify to Google Sheets Data Transfer with Task Allocation',
    description: 'Leveraged expertise in API integration and Google Sheets to create an automated system that transfers data from Shopify to Google Sheets using the ‘Sync With’ extension.…',
    source: 'Portfolio',
    tags: [
      'google-apps-script'
    ],
    content: [
      {
        type: 'p',
        text: 'Leveraged expertise in API integration and Google Sheets to create an automated system that transfers data from Shopify to Google Sheets using the ‘Sync With’ extension. Utilized Google Apps Script and various functions to allocate customer-specific tasks to agents, and integrated this data into Aircall for seamless customer outreach. The system is set to update daily.'
      },
      {
        type: 'img',
        file: 'case-content/google-apps-script-portfolio/image14.png',
        caption: 'The task-distribution function that splits unattended calls evenly across the agent roster.'
      }
    ]
  },
  {
    id: 'gas-habit-tracker',
    title: 'Habit Tracker',
    description: 'Developed a Habit Tracker that empowers users to monitor habits, visualize progress, and compute monthly streaks, all within an easy-to-use Google Sheets interface.',
    source: 'Portfolio',
    tags: [
      'google-apps-script'
    ],
    content: [
      {
        type: 'p',
        text: 'Developed a Habit Tracker that empowers users to monitor habits, visualize progress, and compute monthly streaks, all within an easy-to-use Google Sheets interface.'
      },
      {
        type: 'img',
        file: 'case-content/google-apps-script-portfolio/image15.png',
        caption: 'The dark-mode Habit Tracker — daily checkboxes rolled up into weekly and monthly totals.'
      }
    ]
  },
  {
    id: 'gas-fitness-tracker',
    title: 'Fitness Tracker',
    description: 'Crafted a Fitness Tracker in Google Sheets allowing users to log activities, monitor habits, and assess the achievement of their fitness goals over time.',
    source: 'Portfolio',
    tags: [
      'google-apps-script'
    ],
    content: [
      {
        type: 'p',
        text: 'Crafted a Fitness Tracker in Google Sheets allowing users to log activities, monitor habits, and assess the achievement of their fitness goals over time.'
      },
      {
        type: 'img',
        file: 'case-content/google-apps-script-portfolio/image16.png',
        caption: 'Weekly activity logging with a goal-achievement percentage calculated per exercise.'
      }
    ]
  },
  {
    id: 'gas-sleep-tracker',
    title: 'Sleep Tracker',
    description: 'Developed a Sleep Tracker in Google Sheets to enable users to input and visualize their daily sleep duration, helping them understand and improve their sleep patterns.',
    source: 'Portfolio',
    tags: [
      'google-apps-script'
    ],
    content: [
      {
        type: 'p',
        text: 'Developed a Sleep Tracker in Google Sheets to enable users to input and visualize their daily sleep duration, helping them understand and improve their sleep patterns.'
      },
      {
        type: 'img',
        file: 'case-content/google-apps-script-portfolio/image17.png',
        caption: 'Daily sleep duration charted alongside longest/shortest sleep insights.'
      }
    ]
  },
  {
    id: 'gas-finance-tracker',
    title: 'Finance Tracker',
    description: 'Crafted a comprehensive Finance Tracker in Google Sheets that allows users to set financial goals, input transactions, and gain insights through visual dashboards for…',
    source: 'Portfolio',
    tags: [
      'google-apps-script'
    ],
    content: [
      {
        type: 'p',
        text: 'Crafted a comprehensive Finance Tracker in Google Sheets that allows users to set financial goals, input transactions, and gain insights through visual dashboards for monthly and yearly financial planning.'
      },
      {
        type: 'img',
        file: 'case-content/google-apps-script-portfolio/image18.png',
        caption: 'Budget setup across income, expenses, savings & investments, and debt categories.'
      }
    ]
  },
];
