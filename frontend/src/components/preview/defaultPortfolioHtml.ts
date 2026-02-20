interface Social {
  github?: string;
  linkedin?: string;
  devto?: string;
  twitter?: string;
  email?: string;
}

interface Personal {
  name: string;
  title: string;
  bio: string;
  location?: string;
  avatar_url?: string;
  social?: Social;
}

interface Project {
  title: string;
  description: string;
  url?: string;
  tags?: string[];
}

interface JourneyEntry {
  year: number;
  title: string;
  description: string;
  type?: string;
}

interface WritingEntry {
  title: string;
  description: string;
  url?: string;
  date?: string;
  tags?: string[];
}

export interface PortfolioInput {
  personal: Personal;
  projects?: Project[];
  journey?: JourneyEntry[];
  writing?: WritingEntry[];
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildNavLinks(data: PortfolioInput): string {
  const links: string[] = [];
  if (data.journey && data.journey.length > 0)
    links.push(
      '<a href="#journey">Plot Twists I Actually Pulled Off</a>'
    );
  if (data.projects && data.projects.length > 0)
    links.push('<a href="#projects">Projects</a>');
  if (data.writing && data.writing.length > 0)
    links.push('<a href="#writing">Writing</a>');
  return links.join("\n        ");
}

function buildHeroLinks(social: Social | undefined, location: string | undefined): string {
  const parts: string[] = [];

  const iconLocation =
    '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z"/><circle cx="12" cy="11" r="2.5"/></svg>';
  const iconMail =
    '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/></svg>';
  const iconGitHub =
    '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.24c0 4.53 2.87 8.38 6.84 9.74.5.1.68-.22.68-.48 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.46-1.19-1.12-1.5-1.12-1.5-.91-.64.07-.63.07-.63 1.01.07 1.54 1.06 1.54 1.06.9 1.58 2.36 1.12 2.94.86.09-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.29.1-2.69 0 0 .84-.27 2.75 1.05A9.3 9.3 0 0 1 12 6.84c.83 0 1.67.12 2.45.35 1.91-1.32 2.75-1.05 2.75-1.05.55 1.4.2 2.43.1 2.69.64.71 1.03 1.62 1.03 2.74 0 3.94-2.34 4.81-4.57 5.07.36.32.69.95.69 1.92 0 1.38-.01 2.49-.01 2.83 0 .26.18.58.69.48A10.2 10.2 0 0 0 22 12.24C22 6.58 17.52 2 12 2Z"/></svg>';
  const iconLinkedIn =
    '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.56c0-1.33-.03-3.03-1.85-3.03-1.85 0-2.13 1.45-2.13 2.94v5.65H9.37V9h3.41v1.56h.05c.47-.9 1.62-1.85 3.33-1.85 3.56 0 4.21 2.34 4.21 5.38v6.36ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z"/></svg>';
  const iconDevTo =
    '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="M7.5 7.25H5.25v9.5H7.5c2.9 0 4.75-1.8 4.75-4.75S10.4 7.25 7.5 7.25Zm0 7.5H7v-5.5h.5c1.82 0 2.75 1.05 2.75 2.75s-.93 2.75-2.75 2.75ZM13.6 16.75h-1.8l-2.05-9.5h1.9l1.05 6.15 1.05-6.15h1.9l-2.05 9.5ZM18.75 16.75h-1.9v-9.5h1.9v9.5Z"/></svg>';

  if (location)
    parts.push(
      `<span class="meta"><span class="icon-wrap">${iconLocation}</span>${esc(location)}</span>`
    );
  if (social?.email)
    parts.push(
      `<a class="social-link" href="mailto:${esc(social.email)}"><span class="icon-wrap">${iconMail}</span><span class="label">${esc(social.email)}</span></a>`
    );
  if (social?.github)
    parts.push(
      `<a class="social-link" href="${esc(social.github)}" target="_blank" rel="noreferrer"><span class="icon-wrap">${iconGitHub}</span><span class="label">GitHub</span></a>`
    );
  if (social?.linkedin)
    parts.push(
      `<a class="social-link" href="${esc(social.linkedin)}" target="_blank" rel="noreferrer"><span class="icon-wrap">${iconLinkedIn}</span><span class="label">LinkedIn</span></a>`
    );
  if (social?.devto)
    parts.push(
      `<a class="social-link" href="${esc(social.devto)}" target="_blank" rel="noreferrer"><span class="icon-wrap">${iconDevTo}</span><span class="label">dev.to</span></a>`
    );
  if (social?.twitter)
    parts.push(
      `<a class="social-link" href="${esc(social.twitter)}" target="_blank" rel="noreferrer"><span class="label">Twitter</span></a>`
    );
  return parts.join("\n            ");
}

function buildJourneySection(journey: JourneyEntry[]): string {
  if (journey.length === 0) return "";
  const items = journey
    .sort((a, b) => b.year - a.year)
    .map(
      (j) => `
        <div class="timeline-item">
          <div class="timeline-title">${esc(j.title)}</div>
          <div class="timeline-date">${j.year}</div>
          <div class="timeline-achievements">
            <p>${esc(j.description)}</p>
          </div>
        </div>`
    )
    .join("\n");
  return `
  <section id="journey" style="background: linear-gradient(to bottom, rgba(38,38,38,0.08), transparent);">
    <div class="container">
      <h2>Plot Twists I Actually Pulled Off</h2>
      <div>${items}
      </div>
    </div>
  </section>`;
}

function buildProjectsSection(projects: Project[]): string {
  if (projects.length === 0) return "";
  const cards = projects
    .map(
      (p) => `
        <div class="glass-card project-card">
          <div class="project-header">
            <h3>${esc(p.title)}</h3>
          </div>
          <div class="project-content">
            <p>${esc(p.description)}</p>
            ${
              p.tags && p.tags.length > 0
                ? `<div class="skill-tags" style="margin-top:0.75rem;">${p.tags.map((t) => `<span class="skill-tag">${esc(t)}</span>`).join("")}</div>`
                : ""
            }
          </div>
          ${
            p.url
              ? `<div class="project-footer"><a href="${esc(p.url)}" target="_blank">View Project &rarr;</a></div>`
              : ""
          }
        </div>`
    )
    .join("\n");
  return `
  <section id="projects">
    <div class="container">
      <h2>Projects</h2>
      <div class="projects-grid">${cards}
      </div>
    </div>
  </section>`;
}

function buildWritingSection(writing: WritingEntry[]): string {
  if (writing.length === 0) return "";
  const items = writing
    .map(
      (w) => `
        <div class="glass-card" style="padding:1.25rem;">
          <h3 style="font-size:1.125rem;font-weight:600;margin-bottom:0.5rem;">
            ${w.url ? `<a href="${esc(w.url)}" target="_blank" style="color:var(--fg);text-decoration:none;">${esc(w.title)}</a>` : esc(w.title)}
          </h3>
          <p style="font-size:0.875rem;color:var(--muted-fg);margin-bottom:0.5rem;">${esc(w.description)}</p>
          ${w.date ? `<span style="font-size:0.75rem;color:var(--muted-fg);">${esc(w.date)}</span>` : ""}
          ${
            w.tags && w.tags.length > 0
              ? `<div class="skill-tags" style="margin-top:0.5rem;">${w.tags.map((t) => `<span class="skill-tag">${esc(t)}</span>`).join("")}</div>`
              : ""
          }
        </div>`
    )
    .join("\n");
  return `
  <section id="writing" style="background: linear-gradient(to bottom, transparent, rgba(38,38,38,0.08));">
    <div class="container">
      <h2>Writing</h2>
      <div style="display:flex;flex-direction:column;gap:1rem;">${items}
      </div>
    </div>
  </section>`;
}

export function buildDefaultPortfolioHtml(data: PortfolioInput): string {
  const p = data.personal;
  const initials = p.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const avatarUrl =
    p.avatar_url || `https://placehold.co/240x240/0b0f14/00d4ff?text=${initials}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(p.name)} - Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0b0f14;
      --fg: #eaf0ff;
      --card: rgba(255,255,255,0.04);
      --card-solid: #111826;
      --muted: rgba(255,255,255,0.07);
      --muted-fg: rgba(234,240,255,0.72);
      --border: rgba(255,255,255,0.10);
      --shadow: rgba(0,0,0,0.45);

      --accent: #00d4ff;
      --accent-2: #ff6a3d;
      --accent-3: #a8ff60;
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: 'DM Sans', ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;
      background: var(--bg);
      color: var(--fg);
      line-height: 1.65;
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
    }

    body::before {
      content: '';
      position: fixed;
      inset: 0;
      z-index: -1;
      background:
        radial-gradient(1000px 600px at 15% -10%, rgba(0,212,255,0.22), transparent 60%),
        radial-gradient(900px 520px at 90% 10%, rgba(255,106,61,0.18), transparent 55%),
        radial-gradient(800px 500px at 50% 110%, rgba(168,255,96,0.10), transparent 55%),
        repeating-linear-gradient(135deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 10px);
    }

    ::selection { background: rgba(0,212,255,0.18); color: var(--fg); }

    .container { max-width: 56rem; margin: 0 auto; padding: 0 1.5rem; }

    .header {
      position: sticky;
      top: 0;
      z-index: 50;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      background: rgba(11,15,20,0.52);
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .header .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1rem;
      padding-bottom: 1rem;
    }
    .header-logo {
      font-size: 1.125rem;
      font-weight: 500;
      text-decoration: none;
      color: var(--fg);
    }
    .header-nav { display: flex; gap: 1.5rem; }
    .header-nav a {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--muted-fg);
      text-decoration: none;
      transition: color 0.2s;
    }
    .header-nav a:hover { color: var(--fg); }

    .icon-wrap { display: inline-flex; align-items: center; justify-content: center; width: 1.125rem; height: 1.125rem; color: rgba(234,240,255,0.7); }
    .icon { width: 1.125rem; height: 1.125rem; }
    .social-link, .meta {
      display: inline-flex;
      align-items: center;
      gap: 0.55rem;
      color: var(--muted-fg);
    }
    .social-link { text-decoration: none; }
    .social-link:hover { color: var(--fg); }
    .social-link:hover .icon-wrap { color: var(--accent); }

    .glass-card {
      background: var(--card);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.10);
      border-radius: 0.75rem;
      box-shadow: 0 10px 40px var(--shadow);
      transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
    }
    .glass-card:hover {
      transform: translateY(-2px);
      border-color: rgba(0,212,255,0.22);
      box-shadow: 0 18px 55px rgba(0,0,0,0.55);
    }

    .hero { padding: 4rem 0 3rem; }
    .hero-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      gap: 2rem;
    }
    .hero h1 {
      font-family: 'Space Grotesk', ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;
      font-size: 2.4rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 0.5rem;
    }
    .hero .subtitle { font-size: 1.15rem; color: var(--muted-fg); margin-bottom: 1.25rem; }
    .hero-links { display: flex; flex-direction: column; gap: 0.5rem; }
    .hero-links a, .hero-links span { font-size: 0.95rem; }
    .hero-avatar { position: relative; flex-shrink: 0; }
    .hero-avatar::before {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(0,212,255,0.75), rgba(255,106,61,0.55));
      filter: blur(8px);
      opacity: 0.3;
    }
    .hero-avatar img {
      width: 15rem;
      height: 15rem;
      border-radius: 50%;
      object-fit: cover;
      position: relative;
      border: 2px solid rgba(0,212,255,0.35);
    }
    .hero-desc {
      background: linear-gradient(90deg, rgba(0,212,255,0.10), rgba(255,106,61,0.08));
      backdrop-filter: blur(4px);
      padding: 1rem 1rem 1rem 1.5rem;
      border-radius: 0.5rem;
      border: 1px solid rgba(255,255,255,0.10);
      position: relative;
    }
    .hero-desc::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      border-radius: 2px;
      background: linear-gradient(to bottom, var(--accent), var(--accent-2));
    }
    .hero-desc p { color: var(--muted-fg); padding-left: 0.5rem; }

    section { padding: 3rem 0; }
    section h2 {
      font-family: 'Space Grotesk', ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;
      font-size: 1.6rem;
      font-weight: 700;
      margin-bottom: 2rem;
      letter-spacing: -0.01em;
    }

    .timeline-item {
      position: relative;
      padding-left: 2rem;
      padding-bottom: 2rem;
      border-left: 2px solid rgba(255,255,255,0.12);
    }
    .timeline-item:last-child { border-left: 2px solid transparent; }
    .timeline-item::before {
      content: '';
      position: absolute;
      left: -6px;
      top: 4px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: linear-gradient(to bottom right, var(--accent), var(--accent-2));
    }
    .timeline-title { font-weight: 600; margin-bottom: 0.25rem; }
    .timeline-date { font-size: 0.75rem; color: var(--muted-fg); margin-bottom: 0.75rem; }
    .timeline-achievements {
      margin-top: 0.75rem;
      padding: 1rem;
      background: rgba(17,24,38,0.72);
      backdrop-filter: blur(4px);
      border-radius: 0.5rem;
      border: 1px solid rgba(255,255,255,0.10);
    }
    .timeline-achievements p { font-size: 0.875rem; color: var(--muted-fg); }

    .skill-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .skill-tag {
      padding: 0.25rem 0.75rem;
      background: var(--muted);
      backdrop-filter: blur(4px);
      border-radius: 0.375rem;
      font-size: 0.875rem;
      border: 1px solid rgba(255,255,255,0.10);
      transition: transform 0.2s;
    }
    .skill-tag:hover { transform: translateY(-2px); }

    .projects-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
    .project-card { display: flex; flex-direction: column; }
    .project-header {
      padding: 1.25rem;
      background: linear-gradient(90deg, rgba(0,212,255,0.08), rgba(255,106,61,0.06));
      border-bottom: 1px solid var(--border);
      border-radius: 0.75rem 0.75rem 0 0;
    }
    .project-header h3 {
      font-size: 1.125rem;
      font-weight: 600;
      transition: color 0.3s;
    }
    .project-card:hover .project-header h3 { color: var(--accent); }
    .project-content {
      padding: 1.25rem;
      flex-grow: 1;
    }
    .project-content p { font-size: 0.875rem; color: var(--muted-fg); }
    .project-footer {
      padding: 1rem 1.25rem;
      border-top: 1px solid rgba(255,255,255,0.05);
      background: linear-gradient(90deg, rgba(0,212,255,0.06), rgba(255,106,61,0.05));
      border-radius: 0 0 0.75rem 0.75rem;
    }
    .project-footer a {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: var(--muted-fg);
      text-decoration: none;
      transition: color 0.2s;
    }
    .project-footer a:hover { color: var(--accent); }

    .footer {
      border-top: 1px solid rgba(255,255,255,0.10);
      padding: 1.5rem 0;
      background: linear-gradient(to bottom, rgba(11,15,20,0.2), rgba(17,24,38,0.5));
    }
    .footer-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .footer p {
      font-size: 0.875rem;
      color: var(--muted-fg);
    }

    @media (max-width: 768px) {
      .hero-flex { flex-direction: column; text-align: center; }
      .hero-links { align-items: center; }
      .hero-avatar img { width: 12rem; height: 12rem; }
      .projects-grid { grid-template-columns: 1fr; }
      .header .container { gap: 0.75rem; }
      .header-nav {
        display: flex;
        gap: 0.9rem;
        overflow-x: auto;
        white-space: nowrap;
        scrollbar-width: none;
      }
      .header-nav::-webkit-scrollbar { display: none; }
      .footer-flex { flex-direction: column; gap: 0.5rem; text-align: center; }
    }

    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      .glass-card, .glass-card:hover { transition: none; transform: none; }
    }
  </style>
</head>
<body>

  <header class="header">
    <div class="container">
      <a href="#" class="header-logo">${esc(p.name)}</a>
      <nav class="header-nav">
        ${buildNavLinks(data)}
      </nav>
    </div>
  </header>

  <section class="hero">
    <div class="container">
      <div class="hero-flex">
        <div>
          <h1>${esc(p.name)}</h1>
          <p class="subtitle">${esc(p.title)}</p>
          <div class="hero-links">
            ${buildHeroLinks(p.social, p.location)}
          </div>
        </div>
        <div class="hero-avatar">
          <img src="${esc(avatarUrl)}" alt="${esc(p.name)}" />
        </div>
      </div>
      <div class="hero-desc">
        <p>${esc(p.bio)}</p>
      </div>
    </div>
  </section>

  ${buildJourneySection(data.journey || [])}
  ${buildProjectsSection(data.projects || [])}
  ${buildWritingSection(data.writing || [])}

  <footer class="footer">
    <div class="container">
      <div class="footer-flex">
        <p>&copy; ${new Date().getFullYear()} ${esc(p.name)}. All rights reserved.</p>
        <p>Built with PortfolioPal</p>
      </div>
    </div>
  </footer>

</body>
</html>`;
}
