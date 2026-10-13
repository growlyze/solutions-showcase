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
//   below). `custom-saas` has no group — it's shown as a standalone featured banner instead.
// If a logo fails to load, app.js falls back to `icon` (emoji) so the UI never breaks.
const CATEGORIES = [
  { slug: 'custom-saas', icon: '☁️', tint: 'indigo', name: 'Custom SaaS Platforms', description: 'Full, ready-to-run software products built from scratch around one business’s exact workflow — not just an automation, a whole system.' },
  { slug: 'n8n', icon: '🔗', logoFile: 'logos/n8n.png', fill: true, group: 'automation', name: 'n8n Automations', description: 'Behind-the-scenes workflows that connect your apps and AI models so work moves on its own, no manual steps.' },
  { slug: 'zapier', icon: '⚡', logoFile: 'logos/zapier.png', fill: true, group: 'automation', name: 'Zapier Automations', description: 'Quick, no-code automations that connect your everyday apps so one action triggers the next automatically.' },
  { slug: 'make', icon: '⚡', logoFile: 'logos/make.jpg', fill: true, group: 'automation', name: 'Make Automations', description: 'Visual, no-code workflows in Make.com that move data between your apps without writing any code.' },
  { slug: 'ai-agents', icon: '🤖', tint: 'violet', group: 'ai', name: 'AI Agents', description: 'General-purpose AI agents you can point at almost any repetitive task to take it off your plate.' },
  { slug: 'ai-marketing', icon: '📣', tint: 'pink', group: 'ai', name: 'AI Agents for Marketing', description: 'AI that writes, posts, and tracks content so your marketing keeps running without daily upkeep.' },
  { slug: 'ai-sales', icon: '💰', tint: 'amber', group: 'ai', name: 'AI Agents for Sales', description: 'AI that finds leads, reaches out, and follows up automatically — so your pipeline never goes cold.' },
  { slug: 'ai-support', icon: '🎧', tint: 'teal', group: 'ai', name: 'AI Agents for Customer Support', description: 'AI that answers customer questions and qualifies leads around the clock, even outside business hours.' },
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
    tags: ['custom-saas'],
  },
  {
    id: 'ai-agents-general',
    title: 'AI Agents',
    description: 'A portfolio of AI agent builds.',
    source: 'Link',
    url: 'https://bit.ly/4ePg6cL',
    tags: ['ai-agents'],
  },
  {
    id: 'ai-agents-ecommerce',
    title: 'AI Agents for Ecommerce Brands',
    description: 'AI agents built for ecommerce brands to automate customer interactions and operations.',
    source: 'Notion',
    url: 'https://bit.ly/42E2n1a',
    tags: ['ecommerce-agents', 'ai-agents'],
  },
  {
    id: 'make-zapier-portfolio',
    title: 'Make & Zapier Portfolio',
    description: 'A portfolio of no-code automation workflows built using Make.com and Zapier.',
    source: 'Notion',
    url: 'https://bit.ly/4w5l2AE',
    tags: ['make', 'zapier'],
  },
  {
    id: 'n8n-automations',
    title: 'N8N Automations',
    description: 'A portfolio of n8n automation workflows — including an AI-driven Instagram video breakdown that decodes what makes viral content tick.',
    source: 'Notion',
    url: 'https://bit.ly/4df6UNB',
    tags: ['n8n', 'ai-marketing'],
  },
  {
    id: 'clickup-boots-bags',
    title: 'ClickUp Structure — Boots & Bags (Ecommerce Dropshipping)',
    description: 'Detailed ClickUp workspace structure for an ecommerce dropshipping store’s operations.',
    source: 'Notion',
    url: 'https://glass-suit-7f2.notion.site/Detailed-ClickUp-Structure-for-an-E-commerce-Store-Boots-and-Bags-Dropshipping-2260fcd1ff4649178ed0e6209ada5423?pvs=4',
    tags: ['clickup'],
  },
  {
    id: 'clickup-taraki',
    title: 'ClickUp Structure — Taraki Staffing Company',
    description: 'Detailed ClickUp workspace structure for a staffing company’s operations.',
    source: 'Notion',
    url: 'https://glass-suit-7f2.notion.site/Detailed-ClickUp-Structure-for-Taraki-Staffing-Company-6b1a78de474d4db8ac8ab56047edde64?pvs=4',
    tags: ['clickup'],
  },
  {
    id: 'clickup-vsp',
    title: 'ClickUp — Automating Operations for Veterinary Specialist Partners',
    description: 'ClickUp setup used to automate operations for a veterinary specialist partnership.',
    source: 'Notion',
    url: 'https://glass-suit-7f2.notion.site/Case-Study-Automating-Operations-for-Veterinary-Specialist-Partners-105616625a2a80bc910cfb4d07ff6aea?pvs=74',
    tags: ['clickup'],
  },
  {
    id: 'monday-vsp',
    title: 'Monday.com Setup — Veterinary Specialist Partners',
    description: 'Monday.com board setup built for Veterinary Specialist Partners’ operations.',
    source: 'Notion',
    url: 'https://glass-suit-7f2.notion.site/Setup-of-VSP-with-Monday-com-114616625a2a8028a61ce5cc2cb1f31d?pvs=4',
    tags: ['monday'],
  },
  {
    id: 'airtable-1',
    title: 'Airtable Case Studies — Folder 1',
    description: 'A collection of Airtable base setups.',
    source: 'Google Drive',
    url: 'https://drive.google.com/drive/folders/1Ku1T4BYR7BkVeUZQIqJEb0VSw6hlP-xo?usp=sharing',
    tags: ['airtable'],
  },
  {
    id: 'airtable-2',
    title: 'Airtable Case Studies — Folder 2',
    description: 'A collection of Airtable base setups.',
    source: 'Google Drive',
    url: 'https://drive.google.com/drive/folders/1z6ZKYIqTAjliOcBoBNgtkmTC5idkdo4o?usp=sharing',
    tags: ['airtable'],
  },
  {
    id: 'dashboards-folder',
    title: 'Dashboards',
    description: 'A collection of automated reporting dashboards.',
    source: 'Google Drive',
    url: 'https://drive.google.com/drive/folders/1h9qaw0VEmbVhVoCcCQF6WL0ZmhxebWN-?usp=sharing',
    tags: ['dashboards'],
  },
];
