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
    source: 'Portfolio',
    url: 'https://bit.ly/4ePg6cL',
    tags: ['ai-agents'],
    content: [
      { type: 'heading', text: "📲 AI-Driven Instagram Video Breakdown – Decode What Makes Viral Content Tick" },
      { type: 'label', text: "Objective:" },
      { type: 'p', text: "Automatically fetch and analyze top-performing Instagram videos from popular creators to uncover what makes them stand out." },
      { type: 'label', text: "Implementation:" },
      { type: 'p', text: "The workflow starts by pulling Instagram usernames from your list, finds the creator’s most viewed video, and uses AI to break it down—frame by frame, word by word—to reveal the hidden ingredients of viral success." },
      { type: 'label', text: "Outcome" },
      { type: 'p', text: "Schedule it to run: .Schedule it to run daily, weekly or monthly." },
      { type: 'p', text: "Fetches Creators: It pulls Instagram usernames from your Airtable." },
      { type: 'p', text: "Finds the Top Video: From each creator, it picks the reel with the highest views—because we only care about what’s working 📈" },
      { type: 'p', text: "Stores the Essentials: Saves the video link, caption, creator name, and view count." },
      { type: 'p', text: "Downloads the Video: Preps the reel so we can take a closer look under the hood." },
      { type: 'p', text: "Uses AI to Analyze the Magic: Here’s where it gets spicy 🔍" },
      { type: 'p', text: "What’s the hook? How does it grab attention in the first 3 seconds?" },
      { type: 'p', text: "What’s the vibe? What’s happening in the video—background, setting, energy?" },
      { type: 'p', text: "Visual style: What kind of text, clothes, or framing makes it pop?" },
      { type: 'p', text: "Game-changer moments: What moment makes viewers stop scrolling and watch till the end?" },
      { type: 'p', text: "Saves the Analysis: The insights are written down and saved back in your Airtable. Boom—structured, searchable, gold-standard content breakdown." },
      { type: 'img', file: 'case-content/ai-agents-general/image1.png' },
      { type: 'heading', text: "🛒 Smart Amazon Product Tracker for Price Drop Alerts" },
      { type: 'label', text: "Objective:" },
      { type: 'p', text: "To fetch product details from Amazon and alert you if the price drops—because who doesn’t love a good deal? 💸" },
      { type: 'label', text: "Implementation:" },
      { type: 'p', text: "The workflow grabs product links from a database,, scrapes product info, compares old vs new prices, updates the records, and—if there's a discount—sends you an email so you can grab it before it’s gone." },
      { type: 'label', text: "Outcome:" },
      { type: 'p', text: "Kick-off Daily: Schedule to run daily." },
      { type: 'p', text: "Grabs Products from Airtable: It checks your list to see which items are being tracked." },
      { type: 'p', text: "Launches the Scraper: The link is sent to Apify, which fetches the product’s name, price, and more." },
      { type: 'p', text: "Pulls the Results: Once scraping is done, it collects all the fresh details." },
      { type: 'p', text: "Updates the Product Info: It neatly saves everything back into your Airtable list (because organized data is happy data)." },
      { type: 'p', text: "Checks for Price Drops: If today’s price is lower than the last one, the flow gets excited 🤑" },
      { type: 'p', text: "Sends You an Email Alert: You get an email telling you “Hey, the price just dropped!” with a link to check it out." },
      { type: 'p', text: "Keeps Things Updated: Whether the price dropped or not, it always saves the latest price for next time." },
      { type: 'img', file: 'case-content/ai-agents-general/image2.png' },
      { type: 'heading', text: "🎥 YouTube Video Details Scraper using Automation" },
      { type: 'label', text: "Objective:" },
      { type: 'p', text: "Automatically collect detailed info from YouTube videos of popular creators for content analysis." },
      { type: 'label', text: "Implementation:" },
      { type: 'p', text: "The workflow pulls the url  from your database, scrapes their details using a scraping tool, waits for results, and then saves everything back to the database." },
      { type: 'label', text: "Outcome:" },
      { type: 'p', text: "Triggered by a Click: You hit “Start” to run the process." },
      { type: 'p', text: "Grabs Video Links: It picks up YouTube links marked as “ready” in your Airtable." },
      { type: 'p', text: "Runs the Scraper: Sends each link to an automation tool that fetches all available video details—title, channel name, views, likes, subtitles, description, and thumbnail." },
      { type: 'p', text: "Waits for Results: Gives the scraper time to finish collecting the info." },
      { type: 'p', text: "Saves Everything Back: Once done, all the data is pushed back into Airtable, organized and ready for your analysis." },
      { type: 'img', file: 'case-content/ai-agents-general/image3.png' },
      { type: 'heading', text: "Smart AI Podcast Audio Script Generator from BBC News" },
      { type: 'label', text: "Objective:" },
      { type: 'p', text: "To turn positive and interesting news stories into podcast-style audio scripts using AI." },
      { type: 'label', text: "Implementation:" },
      { type: 'p', text: "The system collects news stories from the BBC website, checks if they are podcast-friendly, rewrites them into an engaging script, and finally prepares them for audio conversion." },
      { type: 'label', text: "Outcome:" },
      { type: 'p', text: "Starts Manually: The process begins with a button click to start the flow." },
      { type: 'p', text: "Fetches the News: It visits the BBC homepage and grabs all the latest news headlines and descriptions." },
      { type: 'img', file: 'case-content/ai-agents-general/image4.png' },
      { type: 'p', text: "Filters the Content: It goes through the list and picks out only 10 headlines." },
      { type: 'p', text: "Checks Suitability: Each headline is checked to see if it’s interesting, positive, and fit for a podcast." },
      { type: 'p', text: "Gets Full Articles: For the suitable headlines, it goes to the full news page and pulls in the main content." },
      { type: 'p', text: "Creates the Script: The stories are then rewritten into a warm, friendly, and engaging podcast script." },
      { type: 'p', text: "Checks Script Output: It makes sure the script is properly prepared." },
      { type: 'p', text: "Sends for Audio: If everything looks good, the script is sent to a tool that can convert the text into voice." },
      { type: 'img', file: 'case-content/ai-agents-general/image5.png' },
      { type: 'img', file: 'case-content/ai-agents-general/image6.png' },
      { type: 'heading', text: "📥 TikTok Video Downloader without watermark – Save Any Reel Directly to Google Drive" },
      { type: 'label', text: "Objective:" },
      { type: 'p', text: "To automatically download a TikTok video and store it in Google Drive with a public share link." },
      { type: 'label', text: "Implementation:" },
      { type: 'p', text: "This workflow fetches a TikTok video, extracts its direct video link, downloads it without watermark, and saves the file to your Google Drive, for content reposting." },
      { type: 'label', text: "Outcome:" },
      { type: 'p', text: "One Click to Start: The flow begins with a simple tap to kick things off." },
      { type: 'p', text: "Fetches the Page: It opens the TikTok video page and grabs all the HTML data." },
      { type: 'img', file: 'case-content/ai-agents-general/image7.png' },
      { type: 'p', text: "Extracts the Video URL: A smart code block digs into that HTML and pulls out the real video link." },
      { type: 'p', text: "Downloads the Video: The video file is then downloaded using that clean URL." },
      { type: 'p', text: "Uploads to Google Drive: The downloaded video is saved directly to your Drive." },
      { type: 'p', text: "Creates Shareable Link: The file is made public so you can share it with just one link." },
      { type: 'img', file: 'case-content/ai-agents-general/image8.png' },
      { type: 'heading', text: "🧠 AI-Powered Social Post Generator – From Spreadsheet to Socials in Seconds!" },
      { type: 'label', text: "Objective:" },
      { type: 'p', text: "Automatically create short, engaging, and fact-based posts (with emojis!) based on your content ideas—and publish them to the right platform." },
      { type: 'label', text: "Implementation:" },
      { type: 'p', text: "This workflow grabs an idea from your Google Sheet, uses AI to turn it into a social-ready post, and then posts it to either LinkedIn or X (Twitter), depending on your selection." },
      { type: 'label', text: "Outcome:" },
      { type: 'p', text: "Kickstarts with a Click: You run the workflow manually to process new ideas." },
      { type: 'p', text: "Reads the Sheet: It pulls content ideas and target platforms from your Google Sheet." },
      { type: 'p', text: "Checks Status: Only picks ideas that haven’t been published yet (marked as 0)." },
      { type: 'p', text: "Uses AI to Write the Post: Google Gemini crafts a short, fact-based, emoji-filled post tailored to the selected platform." },
      { type: 'p', text: "Posts It Where It Belongs:" },
      { type: 'p', text: "If the platform is LinkedIn, it publishes there." },
      { type: 'p', text: "If it’s X (Twitter), it posts accordingly." },
      { type: 'img', file: 'case-content/ai-agents-general/image9.png' },
      { type: 'p', text: "Done. One idea, one click, and you’ve got content live on the right platform—no copy-pasting needed." },
      { type: 'img', file: 'case-content/ai-agents-general/image10.png' },
      { type: 'heading', text: "🗨️ AI-Powered RAG Chatbot for The Fast Bite – Seamless Ordering and Query Handling" },
      { type: 'label', text: "Objective:" },
      { type: 'p', text: "Create an AI-powered chatbot that helps The Fast Bite( a fast food restaurant) customers with menu queries, placing orders, and providing restaurant details in a fast and friendly manner." },
      { type: 'label', text: "Implementation:" },
      { type: 'p', text: "The RAG Chatbot for The Fast Bite automatically updates itself with the latest menu and restaurant info from Google Drive and quickly uses that to help customers with orders or questions. It provides fast and accurate responses to make the customer experience smoother." },
      { type: 'label', text: "Outcome:" },
      { type: 'p', text: "Triggered by New Files:" },
      { type: 'p', text: "The chatbot starts working whenever a new file is added to The Fast Bite’s Google Drive folder. This could include updates to the menu or any other important information." },
      { type: 'img', file: 'case-content/ai-agents-general/image11.png' },
      { type: 'heading', text: "Downloading the Information:" },
      { type: 'p', text: "The chatbot downloads the new file automatically from Google Drive for processing." },
      { type: 'p', text: "Understanding the Data:" },
      { type: 'p', text: "It uses Google Gemini (AI) to turn the downloaded content into a format that the chatbot can understand." },
      { type: 'p', text: "Storing the Info:" },
      { type: 'p', text: "The processed data is stored in a system called Pinecone. This helps the chatbot quickly find the answers when customers ask questions." },
      { type: 'p', text: "Handling Customer Queries:" },
      { type: 'p', text: "When customers ask questions, the chatbot uses this stored information to provide relevant and helpful responses instantly." },
      { type: 'img', file: 'case-content/ai-agents-general/image12.png' },
      { type: 'heading', text: "Key Features:" },
      { type: 'p', text: "Fast Updates: The chatbot is always up-to-date with the latest menu or restaurant information." },
      { type: 'p', text: "AI-Powered Answers: It uses advanced AI to provide accurate, friendly responses." },
      { type: 'p', text: "Seamless Experience: The chatbot helps customers with ordering, customizing their meals, and answering common questions (like store hours, promotions, etc.)." },
      { type: 'img', file: 'case-content/ai-agents-general/image13.png' },
      { type: 'img', file: 'case-content/ai-agents-general/image14.png' }
    ]
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
    id: 'make-portfolio',
    title: 'Make Portfolio',
    description: 'A portfolio of no-code automation workflows built using Make.com.',
    source: 'Portfolio',
    url: 'https://bit.ly/4w5l2AE',
    tags: ['make'],
    content: [
      { type: 'heading', text: "Automation of Shopify Orders to Google Sheets for Dropshipping E-commerce Store" },
      { type: 'p', text: "The primary goal of this automation is to streamline the process of managing Shopify orders by automatically distributing them to the appropriate fulfillment sheets. This is particularly useful for a dropshipping e-commerce store that sources products from multiple suppliers, such as AliExpress." },
      { type: 'p', text: "Order Creation: Whenever a new order is created in Shopify, the automation system adds it to a data store built within Make, making sure all orders are logged and tracked efficiently." },
      { type: 'p', text: "Product Identification: The automation includes a scenario that checks the product IDs in a Google Sheets database. By matching these product IDs, the system determines which specific fulfillment sheet each order should be directed to, based on the supplier." },
      { type: 'p', text: "Master Sheet Integration: A master sheet is maintained where all order data is consolidated. This master sheet serves as the central point for tracking and managing all orders. Whenever any changes are made to the master sheet, the automation ensures that these updates are reflected in the respective Google Sheets, maintaining consistency and accuracy across all fulfillment sheets." },
      { type: 'p', text: "Supplier Coordination: By automating the distribution of orders to the correct fulfillment sheets, the system ensures that each supplier receives the correct order information, facilitating efficient and accurate order fulfillment." },
      { type: 'img', file: 'case-content/make-portfolio/image1.png' },
      { type: 'img', file: 'case-content/make-portfolio/image2.png' },
      { type: 'img', file: 'case-content/make-portfolio/image3.png' },
      { type: 'heading', text: "Daily Slack Updates Make Scenario" },
      { type: 'p', text: "The automation is designed to send daily updates to Slack. The data in Google Sheets is updated daily, and the KPI data is sent to Slack every day using a Make scenario." },
      { type: 'img', file: 'case-content/make-portfolio/image4.png' },
      { type: 'heading', text: "Automation of ClickUp and Google Sheets" },
      { type: 'p', text: "This Make scenario is implemented whenever a task gets completed in ClickUp." },
      { type: 'p', text: "The task details are then sent to Google Sheets." },
      { type: 'p', text: "Based on custom fields, the data is being sent to respective google sheet file" },
      { type: 'img', file: 'case-content/make-portfolio/image5.png' },
      { type: 'heading', text: "Integration of Shopify and ClickUp for Managing Refunded Orders" },
      { type: 'p', text: "This scenario is built so that whenever there is a refunded order in Shopify, the order details are added to ClickUp as tasks." },
      { type: 'p', text: "This integration is implemented to streamline the management of refunded orders." },
      { type: 'img', file: 'case-content/make-portfolio/image6.png' },
      { type: 'heading', text: "Fulfilled Order Integration with ClickUp" },
      { type: 'p', text: "This Make scenario is implemented so that whenever an order is fulfilled in Shopify, the order details are added to ClickUp." },
      { type: 'img', file: 'case-content/make-portfolio/image7.png' },
      { type: 'heading', text: "Automating IG RSS Feed to Pinterest Pin Creation" },
      { type: 'p', text: "This automation is implemented to create a Pinterest pin whenever RSS data is received." },
      { type: 'p', text: "In this Make scenario, multiple text parsers are used to ensure the data is in the relevant form when creating the pin." },
      { type: 'p', text: "The automation ensures that all necessary information from the RSS feed is accurately extracted." },
      { type: 'p', text: "Data parsing helps in formatting the content appropriately for Pinterest." },
      { type: 'p', text: "This setup streamlines the process of keeping Pinterest updated with content from the RSS feed." },
      { type: 'p', text: "The automation reduces manual effort and ensures timely pin creation based on new RSS data." },
      { type: 'img', file: 'case-content/make-portfolio/image8.png' },
      { type: 'heading', text: "Integration of RB2B with Go High Level and Beehiv" },
      { type: 'p', text: "RB2B is a platform that collects website visitor profiles." },
      { type: 'p', text: "When a profile is created in RB2B, that profile is added to Go High Level as a contact." },
      { type: 'p', text: "A deal is also created in Go High Level for the new contact." },
      { type: 'p', text: "Additionally, the email is added to Beehiv as a subscriber." },
      { type: 'img', file: 'case-content/make-portfolio/image9.png' },
      { type: 'heading', text: "Integration of Go High Level with Beehiv" },
      { type: 'p', text: "This scenario is implemented so that whenever the status of an opportunity is changed in Go High Level, the associated email is added to Beehiv as a subscriber." },
      { type: 'img', file: 'case-content/make-portfolio/image10.png' }
    ]
  },
  {
    id: 'zapier-portfolio',
    title: 'Zapier Portfolio',
    description: 'A portfolio of no-code automation workflows built using Zapier.',
    source: 'Portfolio',
    url: 'https://bit.ly/4w5l2AE',
    tags: ['zapier'],
    content: [
      { type: 'heading', text: "Integrating GoHighLevel with Beehiv Using Zapier" },
      { type: 'p', text: "A Zap is being built to connect GoHighLevel with Beehiv." },
      { type: 'p', text: "Whenever a user submits a form on GoHighLevel, the details are sent to Beehiv." },
      { type: 'p', text: "A workflow is created in GoHighLevel to send the information to a Zapier webhook." },
      { type: 'p', text: "Zapier receives the information and then adds it to Beehiv." },
      { type: 'img', file: 'case-content/zapier-portfolio/image1.png' },
      { type: 'heading', text: "Automating IG RSS Feed to Pinterest Pin Creation" },
      { type: 'p', text: "This automation is implemented to create a Pinterest pin whenever RSS data is received." },
      { type: 'p', text: "The automation ensures that all necessary information from the RSS feed is accurately extracted." },
      { type: 'p', text: "This setup streamlines the process of keeping Pinterest updated with content from the RSS feed." },
      { type: 'p', text: "The automation reduces manual effort and ensures timely pin creation based on new RSS data." },
      { type: 'img', file: 'case-content/zapier-portfolio/image2.png' },
      { type: 'heading', text: "Automating Lemlist and Lead connector" },
      { type: 'img', file: 'case-content/zapier-portfolio/image3.png' },
      { type: 'heading', text: "Integration of RB2B with Go High Level and Beehiv" },
      { type: 'p', text: "RB2B is a platform that collects website visitor profiles." },
      { type: 'p', text: "When a profile is created in RB2B, that profile is added to lemlist" },
      { type: 'img', file: 'case-content/zapier-portfolio/image4.png' },
      { type: 'heading', text: "Automating Calendly bookings to Beehiiv" },
      { type: 'img', file: 'case-content/zapier-portfolio/image5.png' },
      { type: 'heading', text: "Automating typeform to Monday.com" },
      { type: 'img', file: 'case-content/zapier-portfolio/image6.png' },
      { type: 'heading', text: "Automating Trainerize to Active campaign" },
      { type: 'img', file: 'case-content/zapier-portfolio/image7.png' },
      { type: 'heading', text: "Gmail to ClickUp Zap" },
      { type: 'p', text: "This Zap automates the process of task creation in ClickUp based on incoming emails from a specified sender in Gmail. Whenever an email is received from the designated sender, the Zap automatically creates a new task in ClickUp. Additionally, any attachments included in the email" },
      { type: 'p', text: "are uploaded and attached to the newly created ClickUp task, ensuring all pertinent information and documents are consolidated and accessible directly within the task." },
      { type: 'img', file: 'case-content/zapier-portfolio/image8.png' },
      { type: 'img', file: 'case-content/zapier-portfolio/image9.png' },
      { type: 'heading', text: "Google Calendar to ClickUp Zap" },
      { type: 'p', text: "This Zap facilitates seamless integration between Google Calendar and ClickUp, enhancing task management and operational efficiency. Whenever a new event is created in Google Calendar, the Zap automatically generates a corresponding task in ClickUp. It transfers relevant details from the calendar event, such as the date, time, and event description, to the ClickUp task. Furthermore, the Zap is configured to assign these tasks to specific individuals, optimizing task allocation and ensuring the right team members are engaged with relevant events and responsibilities." },
      { type: 'img', file: 'case-content/zapier-portfolio/image10.png' },
      { type: 'heading', text: "Cancel Calendly Bookings Zap" },
      { type: 'p', text: "This Zap streamlines the process of appointment cancellations by integrating ClickUp with Calendly. When a cancellation is initiated from within ClickUp—by pressing the cancel button on a specific task—the relevant appointment is automatically cancelled in Calendly. This automation ensures that appointment slots are efficiently managed and updated in real time, reducing manual oversight and the potential for scheduling conflicts." },
      { type: 'img', file: 'case-content/zapier-portfolio/image11.png' },
      { type: 'img', file: 'case-content/zapier-portfolio/image12.png' }
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
      'power-bi',
      'dashboards'
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
      'power-bi',
      'dashboards'
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
      'looker-studio',
      'dashboards'
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
];
