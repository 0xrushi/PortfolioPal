export const DEFAULT_PORTFOLIO_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lorem Ipsum - Portfolio</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0f0f0f;
      --fg: #fafafa;
      --card: #1a1a1a;
      --card-fg: #fafafa;
      --muted: #262626;
      --muted-fg: #a3a3a3;
      --border: rgba(255,255,255,0.1);
      --purple: #a855f7;
      --pink: #ec4899;
      --amber: #f59e0b;
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg);
      color: var(--fg);
      line-height: 1.6;
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
    }

    body::before {
      content: '';
      position: fixed;
      inset: 0;
      z-index: -1;
      background: radial-gradient(ellipse 80% 80% at 50% -20%, rgba(120,119,198,0.3), transparent);
    }

    ::selection { background: rgba(168,85,247,0.2); color: #a855f7; }

    .container { max-width: 56rem; margin: 0 auto; padding: 0 1.5rem; }

    /* Header */
    .header {
      position: sticky;
      top: 0;
      z-index: 50;
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      background: rgba(15,15,15,0.4);
      border-bottom: 1px solid rgba(255,255,255,0.06);
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

    /* Glass Card */
    .glass-card {
      background: rgba(255,255,255,0.03);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(168,85,247,0.1);
      border-radius: 0.75rem;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .glass-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(168,85,247,0.08);
    }

    /* Hero */
    .hero { padding: 4rem 0 3rem; }
    .hero-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      gap: 2rem;
    }
    .hero h1 { font-size: 2.25rem; font-weight: 700; margin-bottom: 0.5rem; }
    .hero .subtitle { font-size: 1.25rem; color: var(--muted-fg); margin-bottom: 1.5rem; }
    .hero-links { display: flex; flex-direction: column; gap: 0.5rem; }
    .hero-links a, .hero-links span {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: var(--muted-fg);
      text-decoration: none;
      transition: color 0.2s;
    }
    .hero-links a:hover { color: var(--fg); }
    .hero-avatar {
      position: relative;
      flex-shrink: 0;
    }
    .hero-avatar::before {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      background: linear-gradient(to right, var(--pink), var(--purple));
      filter: blur(8px);
      opacity: 0.3;
    }
    .hero-avatar img {
      width: 15rem;
      height: 15rem;
      border-radius: 50%;
      object-fit: cover;
      position: relative;
      border: 2px solid rgba(168,85,247,0.5);
    }
    .hero-desc {
      background: linear-gradient(to right, rgba(168,85,247,0.1), rgba(236,72,153,0.1));
      backdrop-filter: blur(4px);
      padding: 1rem 1rem 1rem 1.5rem;
      border-radius: 0.5rem;
      border: 1px solid rgba(168,85,247,0.2);
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
      background: linear-gradient(to bottom, var(--purple), var(--pink));
    }
    .hero-desc p { color: var(--muted-fg); padding-left: 0.5rem; }

    /* Sections */
    section { padding: 3rem 0; }
    section h2 { font-size: 1.5rem; font-weight: 700; margin-bottom: 2rem; }

    /* Timeline */
    .timeline-item {
      position: relative;
      padding-left: 2rem;
      padding-bottom: 2rem;
      border-left: 2px solid rgba(168,85,247,0.2);
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
      background: linear-gradient(to bottom right, var(--purple), var(--pink));
    }
    .timeline-title { font-weight: 600; margin-bottom: 0.25rem; }
    .timeline-subtitle { font-size: 0.875rem; color: var(--muted-fg); }
    .timeline-date { font-size: 0.75rem; color: var(--muted-fg); margin-bottom: 0.75rem; }
    .timeline-achievements {
      margin-top: 0.75rem;
      padding: 1rem;
      background: rgba(15,15,15,0.8);
      backdrop-filter: blur(4px);
      border-radius: 0.5rem;
      border: 1px solid rgba(168,85,247,0.2);
    }
    .timeline-achievements h4 {
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .timeline-achievements ul {
      list-style: none;
      padding-left: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .timeline-achievements li {
      font-size: 0.875rem;
      color: var(--muted-fg);
      padding-left: 0.5rem;
    }

    /* Skills */
    .skill-grid { display: flex; flex-direction: column; gap: 1.5rem; }
    .skill-card { padding: 1rem; }
    .skill-card h3 {
      font-size: 1.125rem;
      font-weight: 500;
      margin-bottom: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .skill-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .skill-tag {
      padding: 0.25rem 0.75rem;
      background: var(--muted);
      backdrop-filter: blur(4px);
      border-radius: 0.375rem;
      font-size: 0.875rem;
      border: 1px solid rgba(168,85,247,0.1);
      transition: transform 0.2s;
    }
    .skill-tag:hover { transform: translateY(-2px); }

    /* Projects */
    .projects-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
    .project-card { display: flex; flex-direction: column; }
    .project-header {
      padding: 1.25rem;
      background: linear-gradient(to right, rgba(168,85,247,0.05), rgba(236,72,153,0.05));
      border-bottom: 1px solid var(--border);
      border-radius: 0.75rem 0.75rem 0 0;
    }
    .project-header h3 {
      font-size: 1.125rem;
      font-weight: 600;
      transition: color 0.3s;
    }
    .project-card:hover .project-header h3 { color: var(--purple); }
    .project-content {
      padding: 1.25rem;
      flex-grow: 1;
    }
    .project-content ul {
      list-style: disc;
      padding-left: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .project-content li { font-size: 0.875rem; color: var(--muted-fg); }
    .project-footer {
      padding: 1rem 1.25rem;
      border-top: 1px solid rgba(255,255,255,0.05);
      background: linear-gradient(to right, rgba(168,85,247,0.05), rgba(236,72,153,0.05));
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
    .project-footer a:hover { color: var(--purple); }

    /* Awards */
    .awards-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }
    .award-card { padding: 1rem; }
    .award-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .award-icon {
      width: 1.75rem;
      height: 1.75rem;
      border-radius: 50%;
      background: linear-gradient(to right, var(--amber), #eab308);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      flex-shrink: 0;
    }
    .award-header h3 { font-weight: 500; font-size: 0.9375rem; }
    .award-issuer { font-size: 0.75rem; color: var(--muted-fg); padding-left: 2.25rem; margin-bottom: 0.5rem; }
    .award-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
    }
    .award-date {
      font-size: 0.75rem;
      color: var(--muted-fg);
      background: rgba(255,255,255,0.03);
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
    }
    .award-position {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      background: rgba(168,85,247,0.1);
      border-radius: 9999px;
    }
    .award-type {
      font-size: 0.75rem;
      color: var(--muted-fg);
      background: rgba(255,255,255,0.03);
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      margin-top: 0.5rem;
      display: inline-block;
    }

    /* Footer */
    .footer {
      border-top: 1px solid rgba(168,85,247,0.1);
      padding: 1.5rem 0;
      background: linear-gradient(to bottom, var(--bg), rgba(38,38,38,0.2));
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

    /* SVG icons inline */
    .icon { width: 1rem; height: 1rem; display: inline-block; vertical-align: middle; }

    @media (max-width: 768px) {
      .hero-flex { flex-direction: column; text-align: center; }
      .hero-links { align-items: center; }
      .hero-avatar img { width: 12rem; height: 12rem; }
      .projects-grid { grid-template-columns: 1fr; }
      .awards-grid { grid-template-columns: 1fr 1fr; }
      .header-nav { display: none; }
      .footer-flex { flex-direction: column; gap: 0.5rem; text-align: center; }
    }
    @media (max-width: 480px) {
      .awards-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>

  <header class="header">
    <div class="container">
      <a href="/" class="header-logo">&#10024; Lorem Ipsum</a>
      <nav class="header-nav">
        <a href="#experience">&#128188; Experience</a>
        <a href="#skills">&#128736;&#65039; Skills</a>
        <a href="#projects">&#128640; Projects</a>
        <a href="#awards">&#127942; Awards</a>
        <a href="#education">&#127891; Education</a>
      </nav>
    </div>
  </header>

  <section class="hero">
    <div class="container">
      <div class="hero-flex">
        <div>
          <h1>Lorem Ipsum &#10024;</h1>
          <p class="subtitle">Software Engineer &#128104;&#8205;&#128187;</p>
          <div class="hero-links">
            <span>&#128205; Dolor Sit Amet</span>
            <a href="mailto:lorem@ipsum.com">&#9993;&#65039; lorem@ipsum.com</a>
            <a href="https://github.com/loremipsum" target="_blank">&#127775; GitHub</a>
            <a href="https://linkedin.com/in/loremipsum" target="_blank">&#128279; LinkedIn</a>
          </div>
        </div>
        <div class="hero-avatar">
          <img src="https://placehold.co/240x240/1a1a1a/a855f7?text=LI" alt="Profile" />
        </div>
      </div>
      <div class="hero-desc">
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      </div>
    </div>
  </section>

  <section id="experience" style="background: linear-gradient(to bottom, rgba(38,38,38,0.08), transparent);">
    <div class="container">
      <h2>&#128188; Work Experience</h2>
      <div>
        <div class="timeline-item">
          <div class="timeline-title">&#128104;&#8205;&#128187; Lorem Engineer | Lorem Ipsum Corp</div>
          <div class="timeline-subtitle">&#127757; Lorem City</div>
          <div class="timeline-date">&#128197; Jan 2020 - Present</div>
          <div class="timeline-achievements">
            <h4>Key Achievements</h4>
            <ul>
              <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
              <li>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
              <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco.</li>
              <li>Duis aute irure dolor in reprehenderit in voluptate velit esse.</li>
              <li>Excepteur sint occaecat cupidatat non proident.</li>
              <li>Sunt in culpa qui officia deserunt mollit anim id est laborum.</li>
              <li>Curabitur pretium tincidunt lacus. Nulla gravida orci a odio.</li>
            </ul>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-title">&#128104;&#8205;&#128187; Software Developer | Dolor Sit Amet</div>
          <div class="timeline-subtitle">&#127757; Ipsumville</div>
          <div class="timeline-date">&#128197; Feb 2019 - Jan 2020</div>
          <div class="timeline-achievements">
            <h4>Key Achievements</h4>
            <ul>
              <li>Morbi in sem quis dui placerat ornare.</li>
              <li>Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam.</li>
            </ul>
          </div>
        </div>
        <div class="timeline-item">
          <div class="timeline-title">&#128104;&#8205;&#128187; Intern | Consectetur Inc.</div>
          <div class="timeline-subtitle">&#127757; Adipiscing, Ipsum</div>
          <div class="timeline-date">&#128197; Jun 2018 - Feb 2019</div>
          <div class="timeline-achievements">
            <h4>Key Achievements</h4>
            <ul>
              <li>Praesent dapibus, neque id cursus faucibus.</li>
              <li>Fusce feugiat malesuada odio.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="skills" style="background: linear-gradient(to bottom, transparent, rgba(38,38,38,0.08));">
    <div class="container">
      <h2>&#128736;&#65039; Skills</h2>
      <div class="skill-grid">
        <div class="glass-card skill-card">
          <h3>&#128187; Programming Languages</h3>
          <div class="skill-tags">
            <span class="skill-tag">LoremLang</span>
            <span class="skill-tag">IpsumScript</span>
            <span class="skill-tag">DolorLang</span>
            <span class="skill-tag">SitLang</span>
            <span class="skill-tag">AmetLang</span>
            <span class="skill-tag">ConsecteturLang</span>
          </div>
        </div>
        <div class="glass-card skill-card">
          <h3>&#127912; Frontend Development</h3>
          <div class="skill-tags">
            <span class="skill-tag">LoremJS</span>
            <span class="skill-tag">IpsumJS</span>
            <span class="skill-tag">Dolor Native</span>
            <span class="skill-tag">Sit UI</span>
            <span class="skill-tag">Amet CSS</span>
            <span class="skill-tag">HTML</span>
            <span class="skill-tag">CSS</span>
          </div>
        </div>
        <div class="glass-card skill-card">
          <h3>&#9881;&#65039; Backend Development</h3>
          <div class="skill-tags">
            <span class="skill-tag">LoremNode</span>
            <span class="skill-tag">IpsumExpress</span>
          </div>
        </div>
        <div class="glass-card skill-card">
          <h3>&#128451;&#65039; Database &amp; Storage</h3>
          <div class="skill-tags">
            <span class="skill-tag">LoremDB</span>
            <span class="skill-tag">IpsumORM</span>
          </div>
        </div>
        <div class="glass-card skill-card">
          <h3>&#9729;&#65039; Cloud &amp; DevOps</h3>
          <div class="skill-tags">
            <span class="skill-tag">LoremCloud</span>
          </div>
        </div>
        <div class="glass-card skill-card">
          <h3>&#129520; Tools &amp; Services</h3>
          <div class="skill-tags">
            <span class="skill-tag">LoremAuth</span>
            <span class="skill-tag">IpsumCMS</span>
            <span class="skill-tag">DolorAnalytics</span>
            <span class="skill-tag">SitValidator</span>
            <span class="skill-tag">AmetMonitor</span>
            <span class="skill-tag">ConsecteturPanel</span>
            <span class="skill-tag">AdipiscingTrigger</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="projects">
    <div class="container">
      <h2>&#128640; Projects</h2>
      <div class="projects-grid">
        <div class="glass-card project-card">
          <div class="project-header">
            <h3>Lorem Ipsum Project</h3>
          </div>
          <div class="project-content">
            <ul>
              <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</li>
              <li>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</li>
              <li>Ut enim ad minim veniam, quis nostrud exercitation ullamco.</li>
              <li>Duis aute irure dolor in reprehenderit in voluptate velit esse.</li>
              <li>Excepteur sint occaecat cupidatat non proident.</li>
            </ul>
          </div>
          <div class="project-footer">
            <a href="https://github.com/loremipsum/project" target="_blank">&#128187; View on GitHub &#128279;</a>
          </div>
        </div>
        <div class="glass-card project-card">
          <div class="project-header">
            <h3>Dolor Sit Amet App</h3>
          </div>
          <div class="project-content">
            <ul>
              <li>Morbi in sem quis dui placerat ornare.</li>
              <li>Pellentesque odio nisi, euismod in, pharetra a, ultricies in, diam.</li>
              <li>Praesent dapibus, neque id cursus faucibus.</li>
              <li>Fusce feugiat malesuada odio.</li>
              <li>Vestibulum ante ipsum primis in faucibus orci luctus et ultrices.</li>
            </ul>
          </div>
          <div class="project-footer">
            <a href="https://github.com/loremipsum/dolorapp" target="_blank">&#128187; View on GitHub &#128279;</a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="awards" style="background: linear-gradient(to bottom, transparent, rgba(38,38,38,0.04));">
    <div class="container">
      <h2>&#127942; Awards</h2>
      <div class="awards-grid">
        <div class="glass-card award-card">
          <div class="award-header">
            <span class="award-icon">&#127942;</span>
            <h3>Lorem Ipsum Award</h3>
          </div>
          <p class="award-issuer">&#127970; Lorem Organization</p>
          <div class="award-meta">
            <span class="award-date">&#128197; Jan 2020</span>
            <span class="award-position">First Place</span>
          </div>
          <span class="award-type">&#127758; International</span>
        </div>
        <div class="glass-card award-card">
          <div class="award-header">
            <span class="award-icon">&#127942;</span>
            <h3>Dolor Sit Amet Prize</h3>
          </div>
          <p class="award-issuer">&#127970; Ipsum Foundation</p>
          <div class="award-meta">
            <span class="award-date">&#128197; Feb 2021</span>
            <span class="award-position">Runner-up</span>
          </div>
          <span class="award-type">&#127470;&#127475; National</span>
        </div>
        <div class="glass-card award-card">
          <div class="award-header">
            <span class="award-icon">&#127942;</span>
            <h3>Consectetur Hackathon</h3>
          </div>
          <p class="award-issuer">&#127970; Adipiscing Org</p>
          <div class="award-meta">
            <span class="award-date">&#128197; Mar 2022</span>
            <span class="award-position">Winner</span>
          </div>
          <span class="award-type">&#127470;&#127475; National</span>
        </div>
        <div class="glass-card award-card">
          <div class="award-header">
            <span class="award-icon">&#127942;</span>
            <h3>Vestibulum Event</h3>
          </div>
          <p class="award-issuer">&#127970; Vestibulum College</p>
          <div class="award-meta">
            <span class="award-date">&#128197; Apr 2022</span>
            <span class="award-position">First Prize</span>
          </div>
          <span class="award-type">&#127470;&#127475; National</span>
        </div>
        <div class="glass-card award-card">
          <div class="award-header">
            <span class="award-icon">&#127942;</span>
            <h3>Curabitur Hackfest</h3>
          </div>
          <p class="award-issuer">&#127970; Curabitur Institute</p>
          <div class="award-meta">
            <span class="award-date">&#128197; May 2022</span>
            <span class="award-position">Second Prize</span>
          </div>
          <span class="award-type">&#127470;&#127475; National</span>
        </div>
        <div class="glass-card award-card">
          <div class="award-header">
            <span class="award-icon">&#127942;</span>
            <h3>Praesent Hacks</h3>
          </div>
          <p class="award-issuer">&#127970; Praesent Group</p>
          <div class="award-meta">
            <span class="award-date">&#128197; Jun 2022</span>
            <span class="award-position">Second Runner-up</span>
          </div>
          <span class="award-type">&#127470;&#127475; National</span>
        </div>
        <div class="glass-card award-card">
          <div class="award-header">
            <span class="award-icon">&#127942;</span>
            <h3>Fusce Hack</h3>
          </div>
          <p class="award-issuer">&#127970; Fusce Club</p>
          <div class="award-meta">
            <span class="award-date">&#128197; Jul 2022</span>
            <span class="award-position">Most Impactful Hack</span>
          </div>
          <span class="award-type">&#127470;&#127475; National</span>
        </div>
      </div>
    </div>
  </section>

  <section id="education" style="background: linear-gradient(to bottom, rgba(38,38,38,0.04), transparent);">
    <div class="container">
      <h2>&#127891; Education</h2>
      <div>
        <div class="timeline-item" style="border-left-color: transparent;">
          <div class="timeline-title">&#127891; BSc Lorem Ipsum</div>
          <div class="timeline-subtitle">&#127963;&#65039; Lorem Ipsum University</div>
          <div class="timeline-date">&#128197; 2015 - 2019</div>
          <p style="font-size:0.875rem;color:var(--muted-fg);margin-bottom:0.75rem;">&#128205; Lorem City</p>
          <div class="timeline-achievements">
            <h4>&#10024; Achievements &amp; Activities</h4>
            <ul>
              <li>President of Lorem Ipsum Club</li>
              <li>Organized multiple lorem events</li>
              <li>Represented university in national competitions.</li>
              <li>Graduated with honors.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="container">
      <div class="footer-flex">
        <p>&copy; 2026 Lorem Ipsum. All rights reserved. &#10024;</p>
        <p>Built with &#128187; and &#10084;&#65039;</p>
      </div>
    </div>
  </footer>

</body>
</html>`;
