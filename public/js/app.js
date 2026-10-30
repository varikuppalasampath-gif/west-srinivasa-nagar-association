/* ==========================================================================
   West Srinivasa Nagar Association - Frontend Application
   ========================================================================== */

/* ===== SAMPLE DATA (fictional; replaced automatically when API_URL is set) ===== */
let DATA = {
  announcements: [
    { id: "A1", title: "Annual General Body Meeting (AGM 2026)", category: "Meeting", description: "The Annual General Meeting will be held at the Community Hall. All registered residents are requested to attend and participate in association development discussions.", published_at: "2026-10-20", expires_at: "2026-12-31" },
    { id: "A2", title: "Overhead Water Tank Cleaning Schedule", category: "Notice", description: "Periodic overhead tank maintenance and disinfection will take place this weekend. Please store water in advance as supply will be paused between 10:00 AM and 3:00 PM.", published_at: "2026-10-18", expires_at: "2026-11-30" },
    { id: "A3", title: "Wet & Dry Waste Segregation Initiative", category: "Community", description: "GHMC-mandated source segregation of wet, dry, and sanitary waste is in effect. Let us keep our colony clean and sustainable.", published_at: "2026-10-10", expires_at: "" },
    { id: "A4", title: "Security Upgrade: Enhanced Night Patrol", category: "Urgent", description: "Night watchman deployment and gate visitor logs are now active from 10:00 PM to 6:00 AM. Please ensure entry gates are properly closed after hours.", published_at: "2026-10-05", expires_at: "" }
  ],
  events: [
    { id: "E1", title: "Deepavali Community Celebration & Rangoli", description: "Grand festive gathering with lighting of lamps, rangoli competition, cultural music by colony children, and distribution of sweets for all families.", event_date: "2026-11-08", start_time: "17:30", venue: "Community Park", status: "published" },
    { id: "E2", title: "Free Health & Diagnostic Check-up Camp", description: "Comprehensive health check-up in association with local healthcare centre. General physician consultation, BP, sugar screening, and eye tests.", event_date: "2026-11-22", start_time: "09:00", venue: "Colony Association Hall", status: "published" },
    { id: "E3", title: "Independence Day Flag Hoisting & Parade", description: "Annual flag hoisting ceremony followed by national anthem, sports events for children, and breakfast.", event_date: "2026-08-15", start_time: "08:00", venue: "Community Park", status: "published" },
    { id: "E4", title: "Monsoon Tree Plantation Drive", description: "Sapling plantation across colony avenues. Postponed due to forecast rain; to be rescheduled.", event_date: "2026-09-05", start_time: "07:30", venue: "1st Cross Road", status: "cancelled" }
  ],
  gallery: [
    { id: "G1", title: "Deepavali Festivities", category: "Festivals", alt: "Residents lighting diyas" },
    { id: "G2", title: "Annual Cultural Evening", category: "Events", alt: "Children stage performance" },
    { id: "G3", title: "Colony Cleanliness Drive", category: "Community", alt: "Volunteers cleaning the avenue" },
    { id: "G4", title: "Children Sports Day", category: "Events", alt: "Children participating in races" },
    { id: "G5", title: "Green Plantation Drive", category: "Community", alt: "Planting saplings along the roadside" },
    { id: "G6", title: "Ganesha Chaturthi Celebration", category: "Festivals", alt: "Colony pandal and celebration" },
    { id: "G7", title: "Bathukamma Floral Arrangement", category: "Bathukamma Celebrations", alt: "Traditional floral decoration", image_url: "https://drive.google.com/thumbnail?id=1gUfD2rx6C06drLcvHq-Y4Ha0ZjXwJ4mT&sz=w1400" },
    { id: "G8", title: "Women Celebrating Bathukamma", category: "Bathukamma Celebrations", alt: "Colony women dancing around Bathukamma", image_url: "https://drive.google.com/thumbnail?id=1krjksVMxMTeZc80xxwzIji3dqIhe_pKy&sz=w1400" }
  ],
  committee: [
    { id: "C1", name: "R. Narayana Murthy", designation: "President", term: "2025–2027", public_contact: "president.wsn@gmail.com" },
    { id: "C2", name: "S. Venkateshwarlu", designation: "General Secretary", term: "2025–2027", public_contact: "sec.wsn@gmail.com" },
    { id: "C3", name: "K. Ramesh Chandra", designation: "Treasurer", term: "2025–2027", public_contact: "" },
    { id: "C4", name: "M. Anuradha", designation: "Joint Secretary", term: "2025–2027", public_contact: "" },
    { id: "C5", name: "P. Rajesh", designation: "Executive Member (Infra)", term: "2025–2027", public_contact: "" },
    { id: "C6", name: "V. Lakshmi", designation: "Executive Member (Security)", term: "2025–2027", public_contact: "" }
  ],
  houses: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => ({
    house_id: "WSN-" + String(n).padStart(3, "0"),
    house_number: String(n),
    owner_display_name: [
      "R. K. Sharma", "S. Venkat Rao", "K. Rama Rao", "M. Srinivasulu",
      "T. Anjaiah", "A. Prabhakar", "P. Sitaram", "V. Balakrishna",
      "N. Jagadish", "L. Mallikarjun", "D. Subba Rao", "G. Chandrashekhar"
    ][n - 1],
    block: n <= 6 ? "Block A" : "Block B",
    street_or_lane: n <= 6 ? "1st Cross Road" : "2nd Cross Road",
    property_type: "Residential",
    x: 0,
    y: 0,
    status: "active"
  })),
  isSample: true
};

const PAGES = [
  ["home", "Home"],
  ["about", "About"],
  ["announcements", "Notices"],
  ["events", "Events"],
  ["map", "Colony Map"],
  ["gallery", "Gallery"],
  ["committee", "Committee"],
  ["bylaws", "Bylaws"],
  ["faq", "FAQ"],
  ["contact", "Contact"]
];

/* ===== UTILITIES & SVG ICONS ===== */
const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
const main = $("#main");

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[c]));

const fmt = d => {
  const t = new Date(d);
  return isNaN(t) ? "" : t.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const today = () => new Date().toISOString().slice(0, 10);
const live = a => (a || []).filter(x => !x.expires_at || x.expires_at >= today());
const url = u => /^https:\/\//.test(u || "") ? esc(u) : "";
const cleanEmail = e => e ? (e.includes("@") ? e : e + "@gmail.com") : "";

// SVG Icon set
const icons = {
  calendar: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
  clock: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  mapPin: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  arrowRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  download: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
  search: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  shield: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  tree: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m8 19 4-14 4 14"/><path d="M12 19v3"/><path d="M6 14h12"/><path d="M8 9h8"/></svg>`,
  users: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  home: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
};

const sampleBanner = () => DATA.isSample
  ? `<div class="note"><b>Sample Demonstration Data:</b> Connect your Google Apps Script URL in <code>config.js</code> to link live association spreadsheets and photos.</div>`
  : "";

/* ===== MODEL CONSTITUTION & BYLAWS DATA ===== */
const BYLAWS = [
  [
    "Preamble",
    [
      ["Purpose", "Defines the core intent of the association."],
      ["Legal Status", "Outlines the registration and legal standing."],
      ["Welfare Objectives", "Focuses on community-wide welfare goals."]
    ]
  ],
  [
    "Vision",
    [
      ["Safe Community", "Ensuring a secure environment."],
      ["Clean & Green", "Prioritizing hygiene and environmental health."],
      ["Inclusive & Transparent", "Fostering openness and fairness for all residents."]
    ]
  ],
  [
    "Mission",
    [
      ["Core Drivers", "Promoting infrastructure development and security."],
      ["Environmental Focus", "Protecting the local ecosystem."],
      ["Engagement", "Ensuring absolute financial transparency and resident participation."]
    ]
  ],
  [
    "Objectives",
    [
      ["Infrastructure Support", "Roads, drainage, water, and parks."],
      ["Daily Utilities", "Security and civic waste management."],
      ["Community Wellness", "Health, education, culture, and sports."],
      ["Government Liaison", "Interfacing directly with MMC (Malkajgiri Municipal Corporation) and other agencies."]
    ]
  ],
  [
    "Membership",
    [
      ["Entry Rules", "Criteria for eligibility, admission, and applicable fees."],
      ["Member Status", "Outlines individual rights and civic responsibilities."],
      ["Exit Rules", "Directives regarding membership resignation and removal."]
    ]
  ],
  [
    "General Body",
    [
      ["Supreme Authority", "Recognized as the highest decision-making power of the association."],
      ["Meetings", "Mandates the Annual General Meeting (AGM) and provisions for special meetings."],
      ["Voting Rules", "Clear guidelines defining quorum and voting thresholds."]
    ]
  ],
  [
    "Executive Committee",
    [
      ["Core Leaders", "Consists of 1 President, 2 Vice Presidents, 1 General Secretary, 1 Joint Secretary, and 1 Treasurer."],
      ["General Board", "Formed by 8–12 Executive Members."],
      ["Diversity Representation", "Dedicated seats for women, youth, and senior representatives."]
    ]
  ],
  [
    "Roles",
    [
      ["President", "Provides overall leadership."],
      ["Vice President (VP)", "Provides necessary operational support."],
      ["Secretary", "Manages daily administrative work."],
      ["Treasurer", "Oversees and manages financial accounts."],
      ["Executive Members", "Drives the practical implementation of projects."]
    ]
  ],
  [
    "Elections",
    [
      ["Fair Process", "Managed by an independent election officer using a secret ballot."],
      ["Candidate Check", "Fixed rules for nominations and strict scrutiny."],
      ["Tenure Limits", "Establishes a 2-year tenure with a recommended maximum of two consecutive terms for the President."]
    ]
  ],
  [
    "Finance",
    [
      ["Inflow Sources", "Funded through membership fees, donations, grants, and CSR (Corporate Social Responsibility)."],
      ["Checks & Balances", "Guided by annual budgets, regular audits, and absolute transparency."],
      ["Operations", "Enforces dual-signature bank operations for security."]
    ]
  ],
  [
    "Standing Committees",
    [
      ["Operational Teams", "Dedicated panels for Finance, Infrastructure, Security, and Environment."],
      ["Social Teams", "Focused wings for Women, Youth, and Culture."],
      ["Legal Shield", "Includes a specialized Legal & Grievance cell."]
    ]
  ],
  [
    "Annual Activities",
    [
      ["Social Days", "Celebration of National days and cultural events."],
      ["Green & Clean Initiatives", "Organizing plantation drives and cleanliness drives."],
      ["Wellness & Recreation", "Hosting health camps and sports tournaments."]
    ]
  ],
  [
    "Code of Ethics",
    [
      ["Core Values", "Demands integrity, transparency, and high accountability."],
      ["Equity", "Complete non-discrimination across the colony."],
      ["Clarity", "Compulsory conflict-of-interest disclosure for all leaders."]
    ]
  ],
  [
    "Dispute Resolution",
    [
      ["Filing Grievances", "Initial assessment through a dedicated Complaint Committee."],
      ["Resolution Path", "Emphasizes mediation to settle issues smoothly."],
      ["Final Check", "Clear structure for filing an internal appeal."]
    ]
  ],
  [
    "Amendment & Dissolution",
    [
      ["Rule Updates", "Requires a strict 2/3 majority vote for any bylaw amendments."],
      ["Closure Protocol", "Society dissolution handled strictly as per applicable local laws."]
    ]
  ]
];

/* ===== UI CARD GENERATORS ===== */
function list(a, fn) {
  return a.length
    ? `<div class="grid">${a.map(fn).join("")}</div>`
    : `<div class="empty">No entries found matching this view.</div>`;
}

function getTagClass(cat) {
  const c = String(cat || "").toLowerCase();
  if (c.includes("urgent")) return "tag tag-urgent";
  if (c.includes("meet")) return "tag tag-meeting";
  if (c.includes("notice")) return "tag tag-notice";
  return "tag";
}

const annCard = a => `
<article class="card lift">
  ${a.image_url ? `<img class="cimg" src="${url(a.image_url)}" alt="${esc(a.title)}" loading="lazy">` : ""}
  <div class="card-top">
    <span class="${getTagClass(a.category)}">${esc(a.category || "Notice")}</span>
    <span style="font-size:12.5px;color:var(--text-muted);display:inline-flex;align-items:center;gap:4px">
      ${icons.calendar} ${fmt(a.published_at)}
    </span>
  </div>
  <h3 style="margin-bottom:8px">${esc(a.title)}</h3>
  <p style="color:var(--text-muted);font-size:14.5px;margin-bottom:14px;flex:1">${esc(a.description)}</p>
  ${a.attachment_url ? `
    <div style="margin-top:auto;padding-bottom:12px">
      <a class="btn btn-sm btn-outline" href="${url(a.attachment_url)}" target="_blank" rel="noopener">
        ${icons.download} Download Document
      </a>
    </div>
  ` : ""}
  <div class="meta">
    <span>Reference ID: <b>${esc(a.id)}</b></span>
    ${a.expires_at ? `<span style="margin-left:auto">Valid till: ${fmt(a.expires_at)}</span>` : ""}
  </div>
</article>`;

const evCard = e => {
  const d = new Date(e.event_date);
  const ok = !isNaN(d);
  const month = ok ? d.toLocaleString("en-IN", { month: "short" }) : "DATE";
  const day = ok ? d.getDate() : "--";
  const isCancelled = e.status === "cancelled";

  // Google Calendar pre-filled URL
  const calTitle = encodeURIComponent(e.title);
  const calDesc = encodeURIComponent(e.description || "");
  const calLoc = encodeURIComponent(e.venue || "West Srinivasa Nagar");
  const calDateStr = ok ? e.event_date.replace(/-/g, "") : "";
  const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calTitle}&details=${calDesc}&location=${calLoc}&dates=${calDateStr}/${calDateStr}`;

  return `
<article class="card lift">
  ${e.image_url ? `<img class="cimg" src="${url(e.image_url)}" alt="${esc(e.title)}" loading="lazy">` : ""}
  <div style="display:flex;gap:16px;align-items:flex-start;margin-bottom:12px">
    <div class="date-badge" aria-hidden="true">
      <span class="month">${month}</span>
      <span class="day">${day}</span>
    </div>
    <div style="flex:1">
      <div style="margin-bottom:4px">
        ${isCancelled ? `<span class="tag tag-urgent">Cancelled</span>` : `<span class="tag" style="background:var(--ok-bg);color:var(--ok)">Upcoming Event</span>`}
      </div>
      <h3 style="margin:0">${esc(e.title)}</h3>
    </div>
  </div>
  <p style="color:var(--text-muted);font-size:14.5px;margin-bottom:16px;flex:1">${esc(e.description)}</p>
  <div style="margin-bottom:16px">
    ${e.start_time ? `<div class="event-info-pill">${icons.clock} <span>${esc(e.start_time)}</span></div>` : ""}
    ${e.venue ? `<div class="event-info-pill">${icons.mapPin} <span>${esc(e.venue)}</span></div>` : ""}
  </div>
  ${!isCancelled ? `
    <div style="margin-top:auto">
      <a class="btn btn-sm btn-outline" href="${calUrl}" target="_blank" rel="noopener" title="Add to Google Calendar">
        ${icons.calendar} Add to Calendar
      </a>
    </div>
  ` : ""}
</article>`;
};

/* ===== PAGE VIEWS ===== */
const views = {
  home() {
    const up = DATA.events
      .filter(e => e.event_date >= today() && e.status !== "cancelled")
      .sort((a, b) => a.event_date.localeCompare(b.event_date))
      .slice(0, 3);
    const recentNotices = live(DATA.announcements).slice(0, 3);
    const activeHouses = DATA.houses.filter(h => h.status !== "inactive").length;

    return `
<section class="hero">
  <div class="hero-pill">✨ Official Residents' Welfare Association Portal · Hyderabad</div>
  <h1>Welcome to West Srinivasa Nagar</h1>
  <p>Connecting our colony residents, providing timely official notices, civic updates, community event calendars, and resident directories.</p>
  
  <div class="hero-actions">
    <a class="btn btn-primary" href="#announcements">
      View Latest Notices ${icons.arrowRight}
    </a>
    <a class="btn btn-glass" href="#map">
      ${icons.mapPin} House Directory Map
    </a>
    <a class="btn btn-glass" href="#contact">
      Contact Committee
    </a>
  </div>

  <div class="stats">
    <div class="stat">
      <b>${activeHouses}</b>
      <span>Registered Houses</span>
    </div>
    <div class="stat">
      <b>${up.length}</b>
      <span>Upcoming Events</span>
    </div>
    <div class="stat">
      <b>${DATA.announcements.length}</b>
      <span>Active Notices</span>
    </div>
    <div class="stat">
      <b>${DATA.committee.length}</b>
      <span>Committee Members</span>
    </div>
  </div>
</section>

${sampleBanner()}

<!-- Latest Announcements Section -->
<section class="sec">
  <div class="sec-head">
    <div>
      <h2>Latest Announcements & Notices</h2>
      <p style="color:var(--text-muted);font-size:14.5px;margin:2px 0 0">Important announcements from the Executive Committee</p>
    </div>
    <a class="view-all-link" href="#announcements">View all notices ${icons.arrowRight}</a>
  </div>
  ${list(recentNotices, annCard)}
</section>

<!-- Upcoming Events Section -->
<section class="sec">
  <div class="sec-head">
    <div>
      <h2>Upcoming Community Events</h2>
      <p style="color:var(--text-muted);font-size:14.5px;margin:2px 0 0">Gatherings, celebrations, and welfare camps in the colony</p>
    </div>
    <a class="view-all-link" href="#events">View full calendar ${icons.arrowRight}</a>
  </div>
  ${list(up, evCard)}
</section>

<!-- Quick Exploration Grid -->
<section class="sec">
  <div class="sec-head">
    <h2>Community Services & Resources</h2>
  </div>
  <div class="grid">
    <a class="card lift" href="#map">
      <div style="font-size:24px;margin-bottom:12px;color:var(--secondary)">${icons.mapPin}</div>
      <h3>Interactive Colony Map →</h3>
      <p style="color:var(--text-muted);font-size:14px;margin:0">Search and locate house numbers, lanes, and registered plots across Block A & Block B.</p>
    </a>
    <a class="card lift" href="#gallery">
      <div style="font-size:24px;margin-bottom:12px;color:var(--amber)">${icons.tree}</div>
      <h3>Photo Gallery →</h3>
      <p style="color:var(--text-muted);font-size:14px;margin:0">View pictures from colony festivals, national day celebrations, and tree plantation drives.</p>
    </a>
    <a class="card lift" href="#committee">
      <div style="font-size:24px;margin-bottom:12px;color:var(--primary)">${icons.users}</div>
      <h3>Executive Committee →</h3>
      <p style="color:var(--text-muted);font-size:14px;margin:0">Meet the elected governing body members managing colony welfare and administrative liaisons.</p>
    </a>
    <a class="card lift" href="#bylaws">
      <div style="font-size:24px;margin-bottom:12px;color:var(--secondary)">${icons.shield}</div>
      <h3>Bylaws & Governance →</h3>
      <p style="color:var(--text-muted);font-size:14px;margin:0">Read the colony constitution, membership guidelines, election rules, and ethics framework.</p>
    </a>
  </div>
</section>`;
  },

  about() {
    return `
<div class="page-header">
  <h1>About the Association</h1>
  <p>Dedicated to fostering a secure, sustainable, and cohesive residential community at West Srinivasa Nagar, Ismailkhanguda.</p>
</div>

<div class="card" style="margin-bottom:28px">
  <div style="max-width:800px">
    <h2 style="font-size:22px">Our Mandate & Civic Purpose</h2>
    <p>West Srinivasa Nagar Residents' Welfare Association (WSNA) is an autonomous, non-profit society representing homeowners and residents of the colony. We serve as the democratic bridge between our residents and civic governing bodies including GHMC, HMWSSB, and Telangana State Southern Power Distribution Company.</p>
    <p>Through proactive resident engagement, we drive infrastructure development, maintain safety systems, celebrate cultural milestones, and resolve community matters transparently.</p>
  </div>
</div>

<div class="sec">
  <h2>Key Objectives & Focus Areas</h2>
  <div class="grid">
    <div class="card">
      <div style="color:var(--secondary);margin-bottom:12px">${icons.shield}</div>
      <h3>Safety & 24/7 Security</h3>
      <p style="color:var(--text-muted);font-size:14.5px;margin:0">Comprehensive CCTV colony surveillance, synchronized perimeter gate management, and verified security patrols for peace of mind.</p>
    </div>
    <div class="card">
      <div style="color:var(--secondary);margin-bottom:12px">${icons.home}</div>
      <h3>Civil Infrastructure</h3>
      <p style="color:var(--text-muted);font-size:14.5px;margin:0">Continuous upkeep of cement concrete roads, underground stormwater drains, LED streetlamps, and overhead water storage distribution.</p>
    </div>
    <div class="card">
      <div style="color:var(--secondary);margin-bottom:12px">${icons.tree}</div>
      <h3>Greenery & Cleanliness</h3>
      <p style="color:var(--text-muted);font-size:14.5px;margin:0">Colony park development, tree plantation avenues, weekly sweeping, and GHMC door-to-door waste segregation campaigns.</p>
    </div>
    <div class="card">
      <div style="color:var(--secondary);margin-bottom:12px">${icons.users}</div>
      <h3>Social Harmony & Events</h3>
      <p style="color:var(--text-muted);font-size:14.5px;margin:0">Organizing community celebrations, festive get-togethers, sports activities for children, and preventive health screening camps.</p>
    </div>
  </div>
</div>`;
  },

  announcements() {
    const cats = ["All", "Notice", "Meeting", "Community", "Urgent"];
    const activeNotices = live(DATA.announcements).sort((a, b) => b.published_at.localeCompare(a.published_at));

    return `
<div class="page-header">
  <h1>Announcements & Official Notices</h1>
  <p>Official circulars, meeting notices, maintenance schedules, and emergency advisories from the Executive Committee.</p>
</div>

${sampleBanner()}

<div class="search-bar">
  <input id="ann-search" type="search" placeholder="Search notices by keyword, title, or category..." autocomplete="off">
</div>

<div class="tabs" id="ann-tabs">
  ${cats.map((c, i) => `<button data-cat="${esc(c)}" aria-pressed="${i === 0 ? "true" : "false"}">${esc(c)}</button>`).join("")}
</div>

<div id="ann-list">
  ${list(activeNotices, annCard)}
</div>`;
  },

  events() {
    const t = today();
    const s = (a, b) => a.event_date.localeCompare(b.event_date);
    const upcoming = DATA.events.filter(e => e.event_date >= t).sort(s);
    const past = DATA.events.filter(e => e.event_date < t).sort((a, b) => -s(a, b));

    return `
<div class="page-header">
  <h1>Community Events & Activities</h1>
  <p>Festivals, welfare camps, cultural gatherings, and sports events across West Srinivasa Nagar.</p>
</div>

${sampleBanner()}

<h2>Upcoming Events</h2>
<div style="margin-bottom:40px">
  ${list(upcoming, evCard)}
</div>

<h2 class="sec">Past Events & Archives</h2>
<div>
  ${list(past, evCard)}
</div>`;
  },

  gallery() {
    // Collect valid categories that have images (or all unique categories)
    const validGallery = DATA.gallery.filter(g => g.image_url);
    const pool = validGallery.length ? validGallery : DATA.gallery;
    const cats = ["All", ...new Set(pool.map(g => g.category).filter(Boolean))];
    
    // Support category hash format #gallery-CategoryName
    const hashPart = location.hash.includes("-") ? location.hash.substring(location.hash.indexOf("-") + 1) : "All";
    const f = decodeURIComponent(hashPart);
    const filtered = pool.filter(g => f === "All" || g.category === f);

    return `
<div class="page-header">
  <h1>Community Photo Gallery</h1>
  <p>Memories and moments from our colony festivals, community celebrations, and welfare drives.</p>
</div>

${sampleBanner()}

<div class="tabs" style="margin-bottom:28px">
  ${cats.map(c => `
    <a href="#gallery-${encodeURIComponent(c)}" class="${c === f ? "active" : ""}">
      ${esc(c)}
    </a>
  `).join("")}
</div>

<div class="grid">
  ${filtered.length ? filtered.map(g => {
    const isVid = (g.image_url && g.image_url.includes("#video")) || (g.alt && g.alt.includes("(Video)"));
    const vidIdMatch = g.image_url ? g.image_url.match(/\/d\/([^\/]+)/) : null;
    const thumbSrc = isVid && vidIdMatch 
      ? `https://drive.google.com/thumbnail?id=${vidIdMatch[1]}&sz=w800`
      : url(g.image_url);

    return g.image_url ? `
    <div class="gal-card ${isVid ? 'gal-video' : ''}" data-lb="${url(g.image_url)}" data-type="${isVid ? 'video' : 'image'}" role="button" tabindex="0" aria-label="Open ${isVid ? 'video' : 'photo'}: ${esc(g.title)}">
      <img src="${thumbSrc}" alt="${esc(g.alt || g.title)}" loading="lazy">
      ${isVid ? `
        <div class="video-play-badge" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>
        </div>
        <span class="tag tag-video">Video</span>
      ` : ''}
      <div class="gal-info">
        <h4 class="gal-title">${esc(g.title)}</h4>
        <span class="gal-cat">${esc(g.category)}</span>
      </div>
    </div>
  ` : `
    <div class="gal-card" role="button" tabindex="0">
      <div class="gal-placeholder">
        <div style="margin-bottom:8px">${icons.tree}</div>
        <h4 class="gal-title">${esc(g.title)}</h4>
        <span class="gal-cat">${esc(g.category)}</span>
      </div>
    </div>
  `;
  }).join("") : `<div class="empty">No photos or videos found in this category yet.</div>`}
</div>`;
  },

  committee() {
    return `
<div class="page-header">
  <h1>Executive Committee</h1>
  <p>Elected representatives dedicated to managing colony operations, welfare projects, and civic coordination.</p>
</div>

${sampleBanner()}

<div class="grid">
  ${DATA.committee.map(m => {
    const initials = m.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    return `
    <div class="card committee-card">
      <div class="avatar-wrap">
        ${m.photo_url
          ? `<img src="${url(m.photo_url)}" alt="Photo of ${esc(m.name)}" loading="lazy">`
          : `<span>${initials}</span>`}
      </div>
      <h3 class="committee-name">${esc(m.name)}</h3>
      <span class="tag tag-notice">${esc(m.designation)}</span>
      <p class="committee-term">Tenure: ${esc(m.term || "2025–2027")}</p>
      ${m.public_contact ? `
        <div style="margin-top:10px">
          <a class="btn btn-sm btn-outline" href="mailto:${esc(m.public_contact)}">
            Email Officer
          </a>
        </div>
      ` : ""}
    </div>`;
  }).join("")}
</div>`;
  },

  map() {
    const activeCount = DATA.houses.filter(h => h.status !== "inactive").length;
    return `
<div class="page-header">
  <h1>Colony Map &amp; House Directory</h1>
  <p>Interactive GPS boundary map, satellite imagery, and verified plot directory for West Srinivasa Nagar (${activeCount} registered houses).</p>
</div>

<div class="note">
  <b>Privacy &amp; Security Note:</b> This portal displays official boundaries and house identifiers approved by the association. Personal phone numbers and private resident details are never disclosed publicly.
</div>

<!-- ===== INTERACTIVE GPS BOUNDARY MAP ===== -->
<div class="card" style="margin-bottom:28px;padding:0;overflow:hidden;border-radius:14px;box-shadow:0 4px 20px rgba(15,61,104,0.12)">
  <div style="padding:14px 20px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;background:linear-gradient(135deg,#071b30 0%,#0f3d68 50%,#0d9488 100%);color:#fff">
    <div style="display:flex;align-items:center;gap:10px">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      <div>
        <div style="font-weight:800;font-size:15px;letter-spacing:-0.2px">West Srinivasa Nagar — Official Boundary Map</div>
        <div style="font-size:12px;opacity:0.85">Ismailkhanguda, Hyderabad · 4 GPS Survey Points</div>
      </div>
    </div>
    <div style="display:flex;gap:8px;align-items:center">
      <button id="btn-fit-map" class="btn btn-sm" style="background:rgba(255,255,255,0.18);color:#fff;border:1px solid rgba(255,255,255,0.35);padding:6px 12px;border-radius:6px;cursor:pointer;font-size:12px">
        🔍 Fit Boundary
      </button>
      <button id="btn-view-aerial" class="btn btn-sm" style="background:#ffffff;color:#0f3d68;border:none;padding:6px 12px;border-radius:6px;cursor:pointer;font-weight:700;font-size:12px">
        📷 Aerial Photo
      </button>
    </div>
  </div>

  <div id="leaflet-map" style="height:440px;width:100%;position:relative;z-index:1"></div>

  <!-- GPS Survey Boundary Coordinates Panel -->
  <div style="background:var(--bg-subtle);padding:14px 20px;border-top:1px solid var(--border)">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">
      <span style="font-weight:700;font-size:13px;color:var(--text)">📐 Registered Colony GPS Survey Coordinates:</span>
      <span style="font-size:11.5px;color:var(--text-muted)">Click any corner to pinpoint on map</span>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px;font-size:12px">
      <div class="corner-coord-card" data-idx="0" style="background:var(--card);padding:10px 12px;border-radius:8px;border:1px solid var(--border);cursor:pointer;transition:transform 0.15s ease,box-shadow 0.15s ease" title="Click to pinpoint Corner 1 on map">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
          <span style="display:inline-block;width:18px;height:18px;line-height:18px;text-align:center;background:#0d9488;color:#fff;border-radius:50%;font-size:10px;font-weight:700">1</span>
          <b>Corner 1 (SW):</b>
          <span style="margin-left:auto;font-size:11px;color:#0d9488">Pinpoint ↗</span>
        </div>
        <span style="font-family:monospace;color:var(--text-muted);font-weight:600">17°27'32.22"N 78°38'28.23"E</span>
      </div>
      <div class="corner-coord-card" data-idx="1" style="background:var(--card);padding:10px 12px;border-radius:8px;border:1px solid var(--border);cursor:pointer;transition:transform 0.15s ease,box-shadow 0.15s ease" title="Click to pinpoint Corner 2 on map">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
          <span style="display:inline-block;width:18px;height:18px;line-height:18px;text-align:center;background:#0d9488;color:#fff;border-radius:50%;font-size:10px;font-weight:700">2</span>
          <b>Corner 2 (NW):</b>
          <span style="margin-left:auto;font-size:11px;color:#0d9488">Pinpoint ↗</span>
        </div>
        <span style="font-family:monospace;color:var(--text-muted);font-weight:600">17°27'39.43"N 78°38'32.03"E</span>
      </div>
      <div class="corner-coord-card" data-idx="2" style="background:var(--card);padding:10px 12px;border-radius:8px;border:1px solid var(--border);cursor:pointer;transition:transform 0.15s ease,box-shadow 0.15s ease" title="Click to pinpoint Corner 3 on map">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
          <span style="display:inline-block;width:18px;height:18px;line-height:18px;text-align:center;background:#0d9488;color:#fff;border-radius:50%;font-size:10px;font-weight:700">3</span>
          <b>Corner 3 (NE):</b>
          <span style="margin-left:auto;font-size:11px;color:#0d9488">Pinpoint ↗</span>
        </div>
        <span style="font-family:monospace;color:var(--text-muted);font-weight:600">17°27'35.78"N 78°38'40.19"E</span>
      </div>
      <div class="corner-coord-card" data-idx="3" style="background:var(--card);padding:10px 12px;border-radius:8px;border:1px solid var(--border);cursor:pointer;transition:transform 0.15s ease,box-shadow 0.15s ease" title="Click to pinpoint Corner 4 on map">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">
          <span style="display:inline-block;width:18px;height:18px;line-height:18px;text-align:center;background:#0d9488;color:#fff;border-radius:50%;font-size:10px;font-weight:700">4</span>
          <b>Corner 4 (SE):</b>
          <span style="margin-left:auto;font-size:11px;color:#0d9488">Pinpoint ↗</span>
        </div>
        <span style="font-family:monospace;color:var(--text-muted);font-weight:600">17°27'28.14"N 78°38'35.82"E</span>
      </div>
    </div>
  </div>
</div>

<!-- Modal for Aerial Survey Photo -->
<div id="aerial-modal" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.85);z-index:9999;align-items:center;justify-content:center;padding:16px">
  <div style="position:relative;max-width:700px;width:100%;background:var(--card);border-radius:12px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.5)">
    <div style="padding:12px 18px;display:flex;align-items:center;justify-content:space-between;background:linear-gradient(90deg,#0f3d68,#0d9488);color:#fff">
      <span style="font-weight:700;font-size:14px">📷 West Srinivasa Nagar — Official Aerial Survey Map</span>
      <button id="close-aerial-modal" style="background:transparent;border:none;color:#fff;font-size:22px;cursor:pointer;line-height:1">×</button>
    </div>
    <div style="padding:16px;text-align:center">
      <img src="images/colony-aerial-boundary.jpg" alt="West Srinivasa Nagar Aerial Survey Map" style="max-width:100%;max-height:75vh;border-radius:8px;object-fit:contain">
      <p style="margin:10px 0 0;font-size:12px;color:var(--text-muted)">High-resolution aerial satellite capture matching the 4 registered boundary coordinates.</p>
    </div>
  </div>
</div>

<!-- ===== HOUSE DIRECTORY SEARCH & SCHEMATIC ===== -->
<div style="margin-top:32px;margin-bottom:16px">
  <h2 style="font-size:1.35rem;margin:0 0 6px">Colony Plots &amp; House Directory</h2>
  <p style="color:var(--text-muted);font-size:14px;margin:0">Search and inspect verified residential plots across Block A and Block B.</p>
</div>

<form id="hs" class="search-bar" role="search">
  <input id="q" type="search" placeholder="Search by House No. (e.g. 5) or Owner Name..." autocomplete="off">
  <button class="btn btn-primary" type="submit">${icons.search} Search</button>
  <button class="btn alt" type="button" id="rs">Reset</button>
</form>

<div class="tabs" id="block-tabs">
  <button data-b="all" aria-pressed="true">All Plots</button>
  <button data-b="Block A" aria-pressed="false">Block A (1st Cross)</button>
  <button data-b="Block B" aria-pressed="false">Block B (2nd Cross)</button>
</div>

<div id="msg" class="err" role="status" aria-live="polite"></div>

<div class="mapwrap">
  <div class="map-card">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;font-size:13px;color:var(--text-muted)">
      <span>📍 Interactive Colony Schematic (Click house for details)</span>
      <span>Green = Registered | Amber = Selected</span>
    </div>
    <svg class="map" viewBox="0 0 620 380" role="group" aria-label="Schematic colony house layout">
      ${mapSvg()}
    </svg>
  </div>

  <div class="card house-panel" id="panel" aria-live="polite">
    <h3>House Inspector</h3>
    <p style="color:var(--text-muted);font-size:14px;margin-bottom:16px">Click or hover over any house plot on the map to inspect verified details.</p>
    <div class="panel-row">
      <span>Status:</span>
      <span>Select a plot</span>
    </div>
  </div>
</div>`;
  },

  bylaws() {
    const n = +(location.hash.split("-")[1] || 0);
    return `
<div class="page-header">
  <h1>Constitution & Association Bylaws</h1>
  <p>West Srinivasa Nagar Colony Welfare Association — Governance Framework & Rules.</p>
</div>

<div class="note">
  This constitutional framework outlines the core vision, objectives, governance structure, election regulations, and dispute mechanisms adopted by the General Body of West Srinivasa Nagar.
</div>

<div class="search-bar">
  <input id="bl-search" type="search" placeholder="Filter bylaws by keyword (e.g. elections, tenure, finance, MMC, grievance)..." autocomplete="off">
</div>

<div style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap">
  <button class="btn alt btn-sm" type="button" id="bl-expand">Expand All Clauses</button>
  <button class="btn alt btn-sm" type="button" id="bl-collapse">Collapse All</button>
  <button class="btn btn-primary btn-sm" type="button" id="bl-print">${icons.download} Print / Save PDF</button>
</div>

<div id="bl">
  ${BYLAWS.map((b, i) => {
    const title = b[0];
    const points = b[1];
    return `
    <details id="b${i + 1}"${n === i + 1 ? " open" : ""}>
      <summary><span style="color:var(--secondary);margin-right:8px;font-weight:800">${i + 1}.</span> ${esc(title)}</summary>
      <div style="padding:12px 16px 8px;display:flex;flex-direction:column;gap:10px">
        ${points.map(pt => `
          <div style="display:flex;align-items:baseline;gap:8px;font-size:14.5px;line-height:1.5">
            <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--secondary);margin-top:7px;flex-shrink:0"></span>
            <span><strong style="color:var(--text);font-weight:700">${esc(pt[0])}:</strong> <span style="color:var(--text-muted)">${esc(pt[1])}</span></span>
          </div>
        `).join("")}
      </div>
    </details>`;
  }).join("")}
</div>`;
  },

  contact() {
    return `
<div class="page-header">
  <h1>Contact Us & Resident Support</h1>
  <p>Reach out to the Executive Committee for enquiries, maintenance requests, or community feedback.</p>
</div>

<div class="contact-layout">
  <div class="contact-info-card">
    <div class="card">
      <h3 style="margin-bottom:16px">Association Office</h3>
      
      <div class="contact-method" style="margin-bottom:12px">
        <div class="contact-icon">${icons.mapPin}</div>
        <div>
          <h4>Address</h4>
          <p>${esc(CONFIG.ADDRESS || "West Srinivasa Nagar, Ismailkhanguda, Hyderabad")}</p>
        </div>
      </div>

      <div class="contact-method" style="margin-bottom:12px">
        <div class="contact-icon">${icons.home}</div>
        <div>
          <h4>Official Email</h4>
          <p><a href="mailto:${esc(cleanEmail(CONFIG.EMAIL))}">${esc(cleanEmail(CONFIG.EMAIL))}</a></p>
        </div>
      </div>

      ${CONFIG.PHONE ? `
      <div class="contact-method">
        <div class="contact-icon">${icons.clock}</div>
        <div>
          <h4>Phone</h4>
          <p><a href="tel:${esc(CONFIG.PHONE)}">${esc(CONFIG.PHONE)}</a></p>
        </div>
      </div>` : ""}

      <div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--divider)">
        <h4 style="font-size:14.5px;margin-bottom:8px">Civic Emergency Helplines</h4>
        <div class="civic-grid">
          <div class="civic-pill"><b>GHMC</b> 040-21111111</div>
          <div class="civic-pill"><b>Police</b> 100 / 112</div>
          <div class="civic-pill"><b>Ambulance</b> 108</div>
          <div class="civic-pill"><b>Electricity</b> 1912</div>
        </div>
      </div>
    </div>
  </div>

  <form class="card" id="cf" novalidate>
    <h3>Submit Resident Enquiry / Request</h3>
    <p style="color:var(--text-muted);font-size:14px;margin-bottom:16px">Submissions are delivered directly to the Executive Committee register.</p>

    <label for="n">Your Full Name *</label>
    <input id="n" maxlength="80" placeholder="e.g. S. Sharma" autocomplete="name" required>
    <div class="err" id="en"></div>

    <label for="e">Email Address *</label>
    <input id="e" type="email" maxlength="120" placeholder="name@example.com" autocomplete="email" required>
    <div class="err" id="ee"></div>

    <label for="p">Mobile Number (Optional)</label>
    <input id="p" type="tel" maxlength="15" placeholder="+91 98765 43210" autocomplete="tel">
    <div class="err" id="ep"></div>

    <label for="c">Category</label>
    <select id="c">
      <option value="General">General Inquiry</option>
      <option value="Maintenance">Maintenance & Infrastructure</option>
      <option value="Event">Event / Community Hall Booking</option>
      <option value="Feedback">Feedback & Suggestions</option>
    </select>

    <label for="m">Message / Grievance Details *</label>
    <textarea id="m" rows="5" maxlength="1000" placeholder="Please describe your enquiry in detail (min 10 characters)..." required></textarea>
    <div class="err" id="em"></div>

    <!-- Honeypot -->
    <input id="hp" tabindex="-1" autocomplete="off" style="position:absolute;left:-9999px" aria-hidden="true">

    <button class="btn btn-primary" id="sb" type="submit" style="margin-top:12px;width:100%">
      Submit Message
    </button>
    <p id="res" role="status" aria-live="polite" style="margin-top:12px;font-size:14.5px"></p>
  </form>
</div>`;
  },

  faq() {
    const items = [
      ["How do I receive official association notices?", "All verified notices and circulars are posted on this portal's Notices section. Major announcements are also circulated via the colony WhatsApp announcement channel."],
      ["How can I verify or update my house plot details?", "Submit an enquiry via our Contact page under the 'General' category. After verification by the General Secretary, directory records are updated."],
      ["Is resident phone number or contact info displayed publicly?", "No. In accordance with digital privacy policies, personal phone numbers and private details are never published on the public portal."],
      ["How do I book the community space for a family celebration?", "Submit an enquiry with your requested date and duration under the 'Event / Community Hall Booking' category at least two weeks in advance."],
      ["What should I do during water supply disruptions?", "Check the Notices tab for scheduled tank cleaning or pipe repair updates. For emergency water needs, contact the Infrastructure Sub-Committee."],
      ["How are association elections conducted?", "Elections take place every 3 years under the supervision of an independent Election Officer appointed by the General Body, strictly following our Bylaws."]
    ];

    return `
<div class="page-header">
  <h1>Frequently Asked Questions</h1>
  <p>Answers to common resident questions regarding colony management, amenities, and governance.</p>
</div>

<div class="search-bar">
  <input id="faq-search" type="search" placeholder="Search FAQ questions..." autocomplete="off">
</div>

<div id="faq-list">
  ${items.map(f => `
    <details>
      <summary>${esc(f[0])}</summary>
      <p>${esc(f[1])}</p>
    </details>
  `).join("")}
</div>`;
  }
};

/* ===== MAP SVG GENERATION ===== */
function pos(h, i) {
  if (h.x && h.y) return [+h.x, +h.y];
  const inB = h.block === "Block A" ? 0 : 1;
  const k = DATA.houses.filter(z => z.block === h.block).indexOf(h);
  return [45 + inB * 310 + (k % 3) * 85, 90 + Math.floor(k / 3) * 120];
}

function mapSvg() {
  let s = `
  <!-- Background & Schematic Boundary -->
  <rect x="0" y="0" width="620" height="380" fill="var(--bg-subtle)" rx="12"/>
  
  <!-- Roads -->
  <rect x="30" y="45" width="250" height="28" rx="6" fill="var(--border)" opacity="0.6"/>
  <text x="155" y="63" fill="var(--text-muted)" font-size="11" font-weight="700" text-anchor="middle">1st Cross Road</text>

  <rect x="340" y="45" width="250" height="28" rx="6" fill="var(--border)" opacity="0.6"/>
  <text x="465" y="63" fill="var(--text-muted)" font-size="11" font-weight="700" text-anchor="middle">2nd Cross Road</text>

  <!-- Central Avenue / Divider -->
  <line x1="310" y1="20" x2="310" y2="360" stroke="var(--border)" stroke-width="3" stroke-dasharray="6,6"/>
  <rect x="290" y="340" width="40" height="24" rx="4" fill="var(--secondary)" opacity="0.9"/>
  <text x="310" y="356" fill="#ffffff" font-size="9" font-weight="800" text-anchor="middle">GATE</text>

  <!-- Community Park / Green Area -->
  <rect x="40" y="335" width="130" height="32" rx="8" fill="#10b981" opacity="0.2"/>
  <text x="105" y="355" fill="#059669" font-size="11" font-weight="700" text-anchor="middle">🌿 Community Park</text>

  <!-- Block Headers -->
  <text x="45" y="32" fill="var(--primary)" font-size="15" font-weight="800">Block A (West)</text>
  <text x="345" y="32" fill="var(--primary)" font-size="15" font-weight="800">Block B (East)</text>
  `;

  DATA.houses.forEach((h, i) => {
    const [x, y] = pos(h, i);
    s += `
    <g class="house" tabindex="0" role="button" data-i="${i}" aria-label="House ${esc(h.house_number)}, ${esc(h.block)}">
      <rect x="${x}" y="${y}" width="72" height="64" rx="10"/>
      <text x="${x + 36}" y="${y + 37}" text-anchor="middle">${esc(h.house_number)}</text>
    </g>`;
  });

  return s;
}

function showHouse(i) {
  const h = DATA.houses[i];
  if (!h) return;
  document.querySelectorAll(".house").forEach(g => g.classList.toggle("sel", +g.dataset.i === i));

  $("#panel").innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
      <h3 style="margin:0">House No. ${esc(h.house_number)}</h3>
      <span class="tag tag-notice">${esc(h.status || "active")}</span>
    </div>
    <div class="panel-row">
      <span>Plot ID:</span>
      <span>${esc(h.house_id)}</span>
    </div>
    <div class="panel-row">
      <span>Registered Owner:</span>
      <span>${esc(h.owner_display_name || "Verified Resident")}</span>
    </div>
    <div class="panel-row">
      <span>Block / Sector:</span>
      <span>${esc(h.block)}</span>
    </div>
    <div class="panel-row">
      <span>Lane / Avenue:</span>
      <span>${esc(h.street_or_lane)}</span>
    </div>
    <div class="panel-row">
      <span>Property Type:</span>
      <span>${esc(h.property_type || "Residential")}</span>
    </div>
    <div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--divider)">
      <p style="font-size:12.5px;color:var(--text-muted);margin:0">
        To request corrections or ownership updates, please contact the Committee Secretary.
      </p>
    </div>`;
}

function initLeafletColonyMap() {
  const mapEl = document.getElementById("leaflet-map");
  if (!mapEl) return;

  // If Leaflet library is still loading, wait and retry
  if (typeof L === "undefined") {
    setTimeout(initLeafletColonyMap, 80);
    return;
  }

  // Clean up previous Leaflet instance if navigating between views
  if (window._colonyMap) {
    try {
      window._colonyMap.remove();
    } catch (e) {
      console.warn("Leaflet map cleanup:", e);
    }
    window._colonyMap = null;
  }
  if (mapEl._leaflet_id) {
    mapEl._leaflet_id = null;
  }

  // 4 Official GPS Boundary Survey Coordinates for West Srinivasa Nagar:
  // Corner 1: 17°27'32.22"N 78°38'28.23"E -> 17.458950, 78.641175
  // Corner 2: 17°27'39.43"N 78°38'32.03"E -> 17.460953, 78.642231
  // Corner 3: 17°27'35.78"N 78°38'40.19"E -> 17.459939, 78.644497
  // Corner 4: 17°27'28.14"N 78°38'35.82"E -> 17.457817, 78.643283
  const BOUNDARY_POINTS = [
    { name: "Corner 1 (SW)", lat: 17.458950, lng: 78.641175, dms: "17°27'32.22\"N 78°38'28.23\"E", color: "#0d9488" },
    { name: "Corner 2 (NW)", lat: 17.460953, lng: 78.642231, dms: "17°27'39.43\"N 78°38'32.03\"E", color: "#0d9488" },
    { name: "Corner 3 (NE)", lat: 17.459939, lng: 78.644497, dms: "17°27'35.78\"N 78°38'40.19\"E", color: "#0d9488" },
    { name: "Corner 4 (SE)", lat: 17.457817, lng: 78.643283, dms: "17°27'28.14\"N 78°38'35.82\"E", color: "#0d9488" }
  ];

  const polygonLatLngs = BOUNDARY_POINTS.map(p => [p.lat, p.lng]);
  const centerLat = 17.459415;
  const centerLng = 78.642797;

  // Initialize Map
  const map = L.map("leaflet-map", {
    center: [centerLat, centerLng],
    zoom: 17,
    maxZoom: 19,
    minZoom: 13,
    scrollWheelZoom: true
  });
  window._colonyMap = map;

  // Base Layer 1: Esri Satellite World Imagery (Default)
  const satelliteLayer = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution: "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics",
      maxZoom: 19
    }
  );

  // Base Layer 2: OpenStreetMap Standard
  const streetLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\" target=\"_blank\">OpenStreetMap</a>",
      maxZoom: 19
    }
  );

  satelliteLayer.addTo(map);

  // Layer Switcher
  L.control.layers(
    { "🛰️ Satellite View": satelliteLayer, "🗺️ Street Map": streetLayer },
    null,
    { position: "topright", collapsed: false }
  ).addTo(map);

  // Colony Boundary Polygon connecting the 4 corners
  const boundaryPolygon = L.polygon(polygonLatLngs, {
    color: "#0d9488",
    weight: 4,
    opacity: 0.95,
    fillColor: "#0f3d68",
    fillOpacity: 0.22,
    dashArray: "8, 6"
  }).addTo(map);

  boundaryPolygon.bindPopup(`
    <div style="font-family:'Plus Jakarta Sans',sans-serif;padding:6px 2px">
      <div style="font-size:15px;font-weight:800;color:#0f3d68;margin-bottom:4px">West Srinivasa Nagar</div>
      <div style="font-size:12px;color:#64748b;margin-bottom:8px">Ismailkhanguda, Hyderabad · PIN 500062</div>
      <div style="background:#f0fdfa;border:1px solid #ccfbf1;padding:8px 10px;border-radius:6px;font-size:12px;color:#0f766e;line-height:1.5">
        <b>Surveyed Boundary:</b> 4 Verified Coordinates<br>
        <b>Layout:</b> Block A (1st Cross) &amp; Block B (2nd Cross)
      </div>
    </div>
  `);

  // Render 4 Bold Numbered Corner Badges
  const cornerMarkers = [];
  BOUNDARY_POINTS.forEach((pt, idx) => {
    // Numbered Badge Icon
    const cornerIcon = L.divIcon({
      className: "colony-corner-badge",
      html: `<div style="
        background: #0f3d68;
        color: #ffffff;
        border: 2px solid #ffffff;
        box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        border-radius: 20px;
        padding: 4px 10px;
        font-size: 11px;
        font-weight: 800;
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transform: translate(-50%, -50%);
        cursor: pointer;
      ">
        <span style="background:#0d9488;color:#fff;border-radius:50%;width:18px;height:18px;line-height:18px;text-align:center;font-size:10px;font-weight:900">${idx + 1}</span>
        <span>Corner ${idx + 1}</span>
      </div>`,
      iconSize: [0, 0]
    });

    const marker = L.marker([pt.lat, pt.lng], { icon: cornerIcon }).addTo(map);

    marker.bindPopup(`
      <div style="font-family:'Plus Jakarta Sans',sans-serif;padding:6px">
        <div style="font-weight:800;font-size:15px;color:#0f3d68;margin-bottom:4px">📍 ${pt.name}</div>
        <div style="font-size:12px;color:#475569;margin-bottom:8px">Official Colony Survey Boundary Point #${idx + 1}</div>
        <div style="background:#f0fdfa;border:1px solid #ccfbf1;padding:8px 10px;border-radius:6px;font-family:monospace;font-size:12px;font-weight:700;color:#0f766e">
          ${pt.dms}
        </div>
        <div style="font-size:11.5px;color:#64748b;margin-top:6px">
          Decimal: <b>${pt.lat.toFixed(6)}, ${pt.lng.toFixed(6)}</b>
        </div>
      </div>
    `);

    // Circular marker base
    L.circleMarker([pt.lat, pt.lng], {
      radius: 7,
      color: "#0d9488",
      weight: 3,
      fillColor: "#ffffff",
      fillOpacity: 1
    }).addTo(map);

    cornerMarkers.push(marker);
  });

  // Colony Center Marker
  const centerIcon = L.divIcon({
    className: "colony-center-pin",
    html: `<div style="background:#0f3d68;color:#fff;padding:5px 10px;border-radius:14px;font-size:11px;font-weight:700;white-space:nowrap;box-shadow:0 3px 10px rgba(0,0,0,0.35);border:2px solid #fff;display:inline-flex;align-items:center;gap:6px">
      <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#10b981"></span>
      West Srinivasa Nagar
    </div>`,
    iconSize: [165, 28],
    iconAnchor: [82, 14]
  });
  L.marker([centerLat, centerLng], { icon: centerIcon })
    .addTo(map)
    .bindPopup("<b>West Srinivasa Nagar Colony Center</b><br>Ismailkhanguda, Hyderabad");

  // Initial bounds fit
  map.fitBounds(boundaryPolygon.getBounds(), { padding: [40, 40] });

  // Fit Boundary button listener
  const fitBtn = document.getElementById("btn-fit-map");
  if (fitBtn) {
    fitBtn.onclick = () => {
      map.fitBounds(boundaryPolygon.getBounds(), { padding: [40, 40] });
    };
  }

  // Interactive Coordinate Cards Click Handlers
  document.querySelectorAll(".corner-coord-card").forEach(card => {
    card.onclick = () => {
      const idx = +card.dataset.idx;
      if (BOUNDARY_POINTS[idx]) {
        const pt = BOUNDARY_POINTS[idx];
        map.flyTo([pt.lat, pt.lng], 18, { animate: true, duration: 0.8 });
        if (cornerMarkers[idx]) {
          setTimeout(() => cornerMarkers[idx].openPopup(), 850);
        }
      }
    };
  });

  // Ensure map recalculates tile layout in dynamic SPA views
  setTimeout(() => { map.invalidateSize(); }, 150);
  setTimeout(() => { map.invalidateSize(); }, 500);
}

function bindMap() {
  // Initialize Real Leaflet Interactive GPS Map
  initLeafletColonyMap();

  // Aerial Survey Photo Modal Handlers
  const aerialBtn = $("#btn-view-aerial");
  const aerialModal = $("#aerial-modal");
  const closeAerial = $("#close-aerial-modal");
  if (aerialBtn && aerialModal) {
    aerialBtn.onclick = () => { aerialModal.style.display = "flex"; };
  }
  if (closeAerial && aerialModal) {
    closeAerial.onclick = () => { aerialModal.style.display = "none"; };
    aerialModal.onclick = (e) => {
      if (e.target === aerialModal) aerialModal.style.display = "none";
    };
  }

  const g = document.querySelectorAll(".house");
  g.forEach(e => {
    const i = +e.dataset.i;
    e.onmouseenter = e.onfocus = () => showHouse(i);
    e.onclick = () => showHouse(i);
    e.onkeydown = k => {
      if (k.key === "Enter" || k.key === " ") {
        k.preventDefault();
        showHouse(i);
      }
    };
  });

  // Block Filter Tabs
  const blockBtns = $$("#block-tabs button");
  blockBtns.forEach(b => {
    b.onclick = () => {
      blockBtns.forEach(btn => btn.setAttribute("aria-pressed", "false"));
      b.setAttribute("aria-pressed", "true");
      const block = b.dataset.b;
      g.forEach(e => {
        const h = DATA.houses[+e.dataset.i];
        const match = block === "all" || h.block === block;
        e.classList.toggle("dim", !match);
      });
    };
  });

  // Search Input Handler
  $("#hs").onsubmit = ev => {
    ev.preventDefault();
    const q = $("#q").value.trim().toLowerCase();
    let first = -1;

    g.forEach(e => {
      const h = DATA.houses[+e.dataset.i];
      const match = !q ||
        h.house_number.toLowerCase() === q ||
        h.house_id.toLowerCase() === q ||
        (h.owner_display_name || "").toLowerCase().includes(q) ||
        (h.block || "").toLowerCase().includes(q);

      e.classList.toggle("dim", !match);
      if (match && first < 0 && q) first = +e.dataset.i;
    });

    $("#msg").textContent = q && first < 0 ? "No matching plot found for this search." : "";
    if (first >= 0) showHouse(first);
  };

  $("#rs").onclick = () => {
    $("#q").value = "";
    g.forEach(e => e.classList.remove("dim", "sel"));
    $("#msg").textContent = "";
    blockBtns.forEach((btn, idx) => btn.setAttribute("aria-pressed", idx === 0 ? "true" : "false"));
    $("#panel").innerHTML = `
      <h3>House Inspector</h3>
      <p style="color:var(--text-muted);font-size:14px;margin-bottom:16px">Click or hover over any house plot on the map to inspect verified details.</p>
      <div class="panel-row">
        <span>Status:</span>
        <span>Select a plot</span>
      </div>`;
  };
}

/* ===== CONTACT FORM BINDING ===== */
function bindContact() {
  let busy = false;
  const cf = $("#cf");
  if (!cf) return;

  cf.onsubmit = async ev => {
    ev.preventDefault();
    if (busy) return;

    const v = {
      name: $("#n").value.trim(),
      email: $("#e").value.trim(),
      phone: $("#p").value.trim(),
      category: $("#c").value,
      message: $("#m").value.trim()
    };

    const E = {
      n: v.name.length < 2 ? "Please provide your full name." : "",
      e: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email) ? "" : "Please enter a valid email address.",
      p: v.phone && !/^[0-9+\-\s]{7,15}$/.test(v.phone) ? "Please enter a valid phone number." : "",
      m: v.message.length < 10 ? "Message must contain at least 10 characters." : ""
    };

    for (const k in E) {
      const el = $("#e" + k);
      if (el) el.textContent = E[k];
    }

    if (Object.values(E).some(Boolean) || $("#hp").value) return;

    const r = $("#res");
    if (!CONFIG.API_URL) {
      r.className = "err";
      r.textContent = "The online submission endpoint is in demonstration mode. Please contact the committee directly via email.";
      return;
    }

    busy = true;
    const sb = $("#sb");
    sb.disabled = true;
    sb.textContent = "Transmitting enquiry...";
    r.className = "";
    r.textContent = "Connecting to association servers...";

    try {
      const x = await fetch(CONFIG.API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ action: "contact", ...v })
      });
      const j = await x.json();
      if (!j.success) throw 0;
      r.className = "ok";
      r.textContent = "✓ Thank you! Your enquiry has been recorded. The committee will review it shortly.";
      cf.reset();
    } catch {
      r.className = "err";
      r.textContent = "Unable to deliver enquiry. Please verify network or reach us directly via email.";
    } finally {
      busy = false;
      sb.disabled = false;
      sb.textContent = "Submit Message";
    }
  };
}

/* ===== ANNOUNCEMENTS SEARCH & TABS BINDING ===== */
function bindAnnouncements() {
  const tabs = $$("#ann-tabs button");
  const search = $("#ann-search");
  let activeCat = "All";

  function filterNotices() {
    const q = (search ? search.value : "").trim().toLowerCase();
    const filtered = live(DATA.announcements).filter(a => {
      const matchCat = activeCat === "All" || (a.category || "").toLowerCase() === activeCat.toLowerCase();
      const matchQ = !q ||
        a.title.toLowerCase().includes(q) ||
        (a.description || "").toLowerCase().includes(q) ||
        (a.category || "").toLowerCase().includes(q);
      return matchCat && matchQ;
    });
    $("#ann-list").innerHTML = list(filtered, annCard);
  }

  tabs.forEach(btn => {
    btn.onclick = () => {
      tabs.forEach(b => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      activeCat = btn.dataset.cat;
      filterNotices();
    };
  });

  if (search) {
    search.oninput = filterNotices;
  }
}

/* ===== BYLAWS SEARCH & EXPAND BINDING ===== */
function bindBylaws() {
  const search = $("#bl-search");
  if (search) {
    search.oninput = () => {
      const q = search.value.trim().toLowerCase();
      $$("#bl details").forEach(d => {
        const text = d.textContent.toLowerCase();
        const match = !q || text.includes(q);
        d.style.display = match ? "block" : "none";
        if (q && match) d.open = true;
      });
    };
  }

  const exp = $("#bl-expand");
  if (exp) exp.onclick = () => $$("#bl details").forEach(d => (d.open = true));

  const col = $("#bl-collapse");
  if (col) col.onclick = () => $$("#bl details").forEach(d => (d.open = false));

  const prn = $("#bl-print");
  if (prn) prn.onclick = () => {
    $$("#bl details").forEach(d => (d.open = true));
    window.print();
  };
}

/* ===== FAQ SEARCH BINDING ===== */
function bindFaq() {
  const search = $("#faq-search");
  if (search) {
    search.oninput = () => {
      const q = search.value.trim().toLowerCase();
      $$("#faq-list details").forEach(d => {
        const text = d.textContent.toLowerCase();
        const match = !q || text.includes(q);
        d.style.display = match ? "block" : "none";
        if (q && match) d.open = true;
      });
    };
  }
}

/* ===== ROUTING & VIEW NAVIGATION ===== */
function route() {
  const id = location.hash.slice(1).split("-")[0] || "home";
  const v = views[id] ? id : "home";

  main.innerHTML = views[v]();

  const matchedPage = PAGES.find(p => p[0] === v);
  const pageTitle = matchedPage ? matchedPage[1] : (v === "admin" ? "Admin Portal" : "Home");
  document.title = `${pageTitle} · West Srinivasa Nagar Association`;

  // Update navigation aria-current states
  $$("#navlist a").forEach(a => {
    const isCurrent = a.getAttribute("href") === "#" + v;
    a.toggleAttribute("aria-current", isCurrent);
    if (isCurrent) a.setAttribute("aria-current", "page");
  });

  // Close mobile nav if open
  $("#nav").classList.remove("open");
  $("#menu").setAttribute("aria-expanded", "false");

  // View-specific bindings
  if (v === "map") bindMap();
  if (v === "contact") bindContact();
  if (v === "announcements") bindAnnouncements();
  if (v === "bylaws") bindBylaws();
  if (v === "faq") bindFaq();
  if (v === "admin") bindAdmin();

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ===== APP INITIALIZATION & THEME ===== */
function updateThemeIcon() {
  const isDark = document.documentElement.dataset.theme === "dark" ||
    (!document.documentElement.dataset.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const iconWrap = $("#theme");
  if (iconWrap) {
    iconWrap.innerHTML = isDark ? icons.sun : icons.moon;
  }
}

async function init() {
  // Populate Navigation Links
  $("#navlist").innerHTML = PAGES.map(p => `<li><a href="#${p[0]}">${p[1]}</a></li>`).join("");
  $("#yr").textContent = new Date().getFullYear();

  if (CONFIG.EMAIL) {
    const pubMail = cleanEmail(CONFIG.EMAIL);
    $("#fcontact").innerHTML = `<a href="mailto:${esc(pubMail)}">${esc(pubMail)}</a>`;
  }
  if (CONFIG.ADDRESS) {
    const faddr = $("#faddress");
    if (faddr) faddr.textContent = CONFIG.ADDRESS;
  }

  // Back to Top Button
  const btt = $("#back-to-top");
  if (btt) {
    window.addEventListener("scroll", () => {
      btt.classList.toggle("visible", window.scrollY > 300);
    });
    btt.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Hamburger Menu
  $("#menu").onclick = () => {
    const isOpen = $("#nav").classList.toggle("open");
    $("#menu").setAttribute("aria-expanded", String(isOpen));
  };

  // Theme Toggle
  $("#theme").onclick = () => {
    const d = document.documentElement;
    const isCurrentlyDark = d.dataset.theme === "dark" ||
      (!d.dataset.theme && window.matchMedia("(prefers-color-scheme: dark)").matches);
    d.dataset.theme = isCurrentlyDark ? "light" : "dark";
    try {
      localStorage.setItem("wsn-theme", d.dataset.theme);
    } catch {}
    updateThemeIcon();
  };

  try {
    const savedTheme = localStorage.getItem("wsn-theme");
    if (savedTheme) document.documentElement.dataset.theme = savedTheme;
  } catch {}
  updateThemeIcon();

  // Fetch live Google Apps Script data if API_URL configured
  if (CONFIG.API_URL) {
    main.innerHTML = `
      <div class="page-header"><div class="sk" style="height:36px;width:300px;margin-bottom:12px"></div><div class="sk" style="height:18px;width:500px"></div></div>
      <div class="grid"><div class="sk"></div><div class="sk"></div><div class="sk"></div></div>`;
    try {
      const r = await fetch(CONFIG.API_URL + "?action=all");
      const j = await r.json();
      if (j.success) {
        DATA = { ...j.data, isSample: false };
      }
    } catch {
      main.innerHTML = `<div class="empty err">Unable to connect to live association database. Please refresh or try again later.</div>`;
    }
  }

  window.addEventListener("hashchange", route);
  route();
}

/* ===== ADMIN PORTAL (AUTHENTICATED) ===== */
const ADM = { tok: "", email: "", role: "", tab: "announcements" };
const FIELDS = {
  announcements: [
    ["title", "Title", "text", 1],
    ["category", "Category", "select:Notice,Meeting,Community,Urgent"],
    ["description", "Description", "area", 1],
    ["image_url", "Image (optional)", "up:image"],
    ["attachment_url", "PDF attachment (optional)", "up:pdf"],
    ["published_at", "Publish date", "date"],
    ["expires_at", "Expiry date (optional)", "date"]
  ],
  events: [
    ["title", "Title", "text", 1],
    ["description", "Description", "area"],
    ["event_date", "Date", "date", 1],
    ["start_time", "Start time", "time"],
    ["venue", "Venue", "text"],
    ["image_url", "Poster (optional)", "up:image"]
  ],
  gallery: [
    ["title", "Title", "text", 1],
    ["category", "Category", "select:Bathukamma Celebrations,Festivals,Events,Community,Other"],
    ["alt", "Short photo description", "text"],
    ["image_url", "Photos (multiple allowed)", "up:image", 1]
  ],
  committee: [
    ["name", "Name", "text", 1],
    ["designation", "Designation", "text", 1],
    ["term", "Term", "text"],
    ["public_contact", "Public contact (only if approved)", "text"],
    ["photo_url", "Photo (optional)", "up:image"]
  ],
  houses: [
    ["house_number", "House number", "text", 1],
    ["owner_display_name", "Owner name (only if approved)", "text"],
    ["block", "Block", "text", 1],
    ["street_or_lane", "Street / lane", "text"],
    ["property_type", "Type", "text"]
  ]
};

async function api(b) {
  const r = await fetch(CONFIG.API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "admin", token: ADM.tok, ...b })
  });
  const j = await r.json();
  if (!j.success) throw new Error(j.message);
  return j.data;
}

function toast(m) {
  const t = $("#toast");
  if (!t) return;
  t.textContent = m;
  t.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove("show"), 3500);
}

function shrink(f) {
  return new Promise((ok, no) => {
    if (f.type === "application/pdf") {
      const r = new FileReader();
      r.onload = () => ok({ mime: f.type, data: r.result.split(",")[1], name: f.name });
      r.onerror = no;
      r.readAsDataURL(f);
      return;
    }
    const i = new Image();
    i.onload = () => {
      const k = Math.min(1, 1600 / Math.max(i.width, i.height));
      const c = document.createElement("canvas");
      c.width = Math.round(i.width * k);
      c.height = Math.round(i.height * k);
      c.getContext("2d").drawImage(i, 0, 0, c.width, c.height);
      ok({
        mime: "image/jpeg",
        data: c.toDataURL("image/jpeg", 0.82).split(",")[1],
        name: f.name.replace(/\.\w+$/, "") + ".jpg"
      });
    };
    i.onerror = no;
    i.src = URL.createObjectURL(f);
  });
}

views.admin = () => `
  <div class="page-header">
    <h1>Executive Committee Portal</h1>
    <p>Administrative console for publishing notices, events, gallery pictures, and managing house records.</p>
  </div>
  <div id="adm"></div>`;

function bindAdmin() {
  const a = $("#adm");
  if (!CONFIG.API_URL || !CONFIG.GOOGLE_CLIENT_ID) {
    a.innerHTML = `
      <div class="note">
        <b>Admin Console Configuration Required:</b> Please set <code>API_URL</code> and <code>GOOGLE_CLIENT_ID</code> in <code>js/config.js</code> to enable Google Single Sign-On for authorized committee members.
      </div>`;
    return;
  }
  if (ADM.tok) return panel();

  a.innerHTML = `
    <div class="card" style="max-width:540px">
      <h3>Committee Sign-In</h3>
      <p style="color:var(--text-muted);margin-bottom:20px">Sign in with an authorized Google account configured in the association sheet.</p>
      <div id="gbtn"></div>
      <p class="err" id="aerr" role="alert" style="margin-top:12px"></p>
    </div>`;

  const go = () => {
    if (!window.google) {
      setTimeout(go, 300);
      return;
    }
    google.accounts.id.initialize({
      client_id: CONFIG.GOOGLE_CLIENT_ID,
      callback: async r => {
        ADM.tok = r.credential;
        try {
          const d = await api({ op: "whoami" });
          ADM.email = d.email;
          ADM.role = d.role;
          panel();
        } catch (e) {
          console.error("Sign-in verification error:", e);
          ADM.tok = "";
          const msg = e && e.message ? e.message : "";
          if (msg === "Forbidden") {
            $("#aerr").textContent = "This Google account is not on the authorized committee list (Admins sheet).";
          } else {
            $("#aerr").textContent = "Sign-in failed: " + (msg || "Network / Web App configuration error") + ". Check console for details.";
          }
        }
      }
    });
    google.accounts.id.renderButton($("#gbtn"), { theme: "outline", size: "large" });
  };
  go();
}

async function panel() {
  const a = $("#adm");
  const tabs = ADM.role === "admin"
    ? ["announcements", "events", "gallery", "committee", "houses", "enquiries"]
    : ["announcements", "events", "gallery"];

  if (!tabs.includes(ADM.tab)) ADM.tab = tabs[0];
  const t = ADM.tab;

  a.innerHTML = `
    <div class="card" style="margin-bottom:24px">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px">
        <div>
          <b>Authorized Session:</b> ${esc(ADM.email)} <span class="tag tag-notice">${esc(ADM.role)}</span>
        </div>
        <a href="#admin" id="so" class="btn btn-sm btn-outline">Sign Out</a>
      </div>
    </div>
    <div class="tabs">${tabs.map(x => `<button data-t="${x}" aria-pressed="${x === t}">${x[0].toUpperCase() + x.slice(1)}</button>`).join("")}</div>
    <div id="ab"><div class="sk"></div></div>`;

  a.querySelectorAll("[data-t]").forEach(b => (b.onclick = () => {
    ADM.tab = b.dataset.t;
    panel();
  }));

  $("#so").onclick = e => {
    e.preventDefault();
    ADM.tok = "";
    bindAdmin();
  };

  let rows = [];
  try {
    rows = await api({ op: "list", sheet: t });
  } catch {
    ADM.tok = "";
    bindAdmin();
    toast("Session expired. Please sign in again.");
    return;
  }

  const ab = $("#ab");
  if (t === "enquiries") {
    ab.innerHTML = rows.map(r => `
      <div class="card" style="margin:12px 0">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">
          <b>${esc(r.name)}</b>
          <span class="tag">${esc(r.category)}</span>
        </div>
        <p style="font-size:13.5px;color:var(--text-muted);margin-bottom:8px">
          ${esc(r.email)} · ${esc(r.phone || "No phone")} · Submitted: ${esc(r.submitted_at)}
        </p>
        <p style="margin:0">${esc(r.message)}</p>
      </div>
    `).join("") || `<div class="empty">No resident enquiries submitted yet.</div>`;
    return;
  }

  const idk = t === "houses" ? "house_id" : "id";
  const fld = f => {
    const [n, l, ty, rq] = f;
    const id = "f_" + n;
    const r = rq ? " required" : "";
    const L = `<label for="${id}">${l}${rq ? " *" : ""}</label>`;
    if (ty === "area") return L + `<textarea id="${id}" rows="3" maxlength="1000"${r}></textarea>`;
    if (ty.startsWith("select")) {
      return L + `<select id="${id}">${ty.slice(7).split(",").map(o => `<option>${o}</option>`).join("")}</select>`;
    }
    if (ty.startsWith("up")) {
      return L + `<div class="drop"><input type="file" id="${id}" accept="${ty === "up:pdf" ? "application/pdf" : "image/*"}" ${t === "gallery" ? "multiple" : ""}${r}><img class="pv" id="pv_${n}" alt="Preview" hidden></div>`;
    }
    return L + `<input id="${id}" type="${ty}" maxlength="200"${r}>`;
  };

  const listItems = rows.map(r => {
    const off = ["draft", "inactive"].includes(r.status);
    return `
      <div class="row">
        <span>
          ${r.image_url || r.photo_url ? `<img src="${url(r.image_url || r.photo_url)}" alt=""> ` : ""}
          <b>${esc(r.title || r.name || "House " + r.house_number)}</b>
          <span class="tag${off ? " x" : ""}">${esc(r.status)}</span>
        </span>
        <button class="btn btn-sm btn-outline" data-s="${esc(r[idk])}" data-on="${off ? 1 : 0}">
          ${off ? "Publish" : "Hide"}
        </button>
      </div>`;
  }).join("") || `<div class="empty">No entries found in this sheet.</div>`;

  ab.innerHTML = `
    <form class="card" id="af" style="margin-bottom:32px">
      <h3>Add New ${t[0].toUpperCase() + t.slice(1, -1)} Record</h3>
      ${FIELDS[t].map(fld).join("")}
      <label style="display:flex;align-items:center;gap:8px;margin-top:16px;cursor:pointer">
        <input type="checkbox" id="f_pub" checked style="width:auto"> Publish immediately to website
      </label>
      <button class="btn btn-primary" id="asb" style="margin-top:16px">Save Record</button>
    </form>
    <h2>Existing Entries (${rows.length})</h2>
    ${listItems}`;

  $("#af").addEventListener("change", e => {
    const i = e.target;
    if (i.type === "file" && i.files[0] && i.files[0].type.startsWith("image/")) {
      const p = $("#pv_" + i.id.slice(2));
      p.src = URL.createObjectURL(i.files[0]);
      p.hidden = false;
    }
  });

  ab.querySelectorAll("[data-s]").forEach(b => (b.onclick = async () => {
    const on = b.dataset.on === "1";
    try {
      await api({
        op: "status",
        sheet: t,
        id: b.dataset.s,
        status: t === "houses" ? (on ? "active" : "inactive") : (on ? "published" : "draft")
      });
      toast("Status updated successfully.");
      panel();
    } catch {
      toast("Could not update status.");
    }
  }));

  $("#af").onsubmit = async e => {
    e.preventDefault();
    const b = $("#asb");
    b.disabled = true;
    b.textContent = "Saving...";

    try {
      const base = {}, up = {};
      for (const [n, , ty] of FIELDS[t]) {
        const el = $("#f_" + n);
        if (ty.startsWith("up")) {
          if (el.files.length) {
            up[n] = [];
            for (const f of el.files) {
              const s = await shrink(f);
              b.textContent = "Uploading " + (up[n].length + 1) + "...";
              up[n].push((await api({ op: "upload", sheet: t, name: s.name, mime: s.mime, data: s.data })).url);
            }
          }
        } else {
          base[n] = el.value.trim();
        }
      }

      const out = t === "gallery"
        ? (up.image_url || []).map(u => ({ ...base, image_url: u }))
        : [{ ...base, ...Object.fromEntries(Object.entries(up).map(([k, v]) => [k, v[0]])) }];

      for (const r of out) {
        await api({ op: "save", sheet: t, row: r, publish: $("#f_pub").checked });
      }
      toast("Saved! Public portal updates within 5 minutes.");
      panel();
    } catch (er) {
      toast("Could not save: " + er.message);
      b.disabled = false;
      b.textContent = "Save Record";
    }
  };
}

/* ===== LIGHTBOX & TOAST SETUP (Images & Videos) ===== */
document.body.insertAdjacentHTML(
  "beforeend",
  `
  <div id="toast" role="status"></div>
  <div id="lb" role="dialog" aria-label="Media viewer modal">
    <button class="btn" id="lbx" aria-label="Close media preview">✕</button>
    <div id="lb-content">
      <img id="lb-img" alt="Expanded photo preview">
      <iframe id="lb-vid" allow="autoplay; encrypted-media" allowfullscreen style="display:none;width:85vw;max-width:900px;height:70vh;border:none;border-radius:12px;background:#000;"></iframe>
    </div>
  </div>`
);

function closeLightbox() {
  const lb = $("#lb");
  if (!lb) return;
  lb.classList.remove("on");
  const vid = $("#lb-vid");
  if (vid) {
    vid.src = "";
    vid.style.display = "none";
  }
  const img = $("#lb-img");
  if (img) {
    img.src = "";
    img.style.display = "none";
  }
}

window.addEventListener("click", e => {
  const b = e.target.closest("[data-lb]");
  if (b) {
    const rawUrl = b.dataset.lb;
    const isVid = b.dataset.type === "video" || rawUrl.includes("#video");
    const img = $("#lb-img");
    const vid = $("#lb-vid");

    if (isVid) {
      if (img) img.style.display = "none";
      if (vid) {
        vid.src = rawUrl.replace("#video", "");
        vid.style.display = "block";
      }
    } else {
      if (vid) {
        vid.src = "";
        vid.style.display = "none";
      }
      if (img) {
        img.src = rawUrl;
        img.style.display = "block";
      }
    }
    $("#lb").classList.add("on");
    return;
  }
  if (e.target.id === "lb" || e.target.id === "lbx") {
    closeLightbox();
  }
});

window.addEventListener("keydown", e => {
  if (e.key === "Escape") closeLightbox();
});

/* Start the application */
init();
