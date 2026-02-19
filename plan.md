# Plan: Blog Theme Generator via Screenshot-to-Code

## Overview

Transform the existing screenshot-to-code app into a **blog theme generator**. The user uploads a screenshot of a blog/portfolio theme they like, the AI generates Astro-compatible theme code, and the app updates their blog (based on the [erlandv/case](https://github.com/erlandv/case) Astro template) with that new theme. A universal `portfolio.json` holds all personal data (name, projects, education, etc.) and gets injected into whatever theme is generated.

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Frontend (React + Tailwind)                        │
│  ┌──────────────┐  ┌────────────────────────────┐   │
│  │ Collapsible   │  │  Main Area                 │   │
│  │ Sidebar       │  │  - Screenshot upload       │   │
│  │ - Features    │  │  - Live preview            │   │
│  │ - Portfolio   │  │  - Code editor             │   │
│  │   JSON editor │  │  - Save to blog button     │   │
│  │ - Theme       │  │                            │   │
│  │   history     │  │                            │   │
│  └──────────────┘  └────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                          │ WebSocket
                          ▼
┌─────────────────────────────────────────────────────┐
│  Backend (FastAPI)                                   │
│  - /generate-code (existing WS, modified prompts)   │
│  - POST /api/save-theme (new — writes to blog dir)  │
│  - GET/PUT /api/portfolio (new — manage JSON)        │
│  - POST /api/auth (new — admin login)                │
└─────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────┐
│  Blog Directory (Astro — cloned erlandv/case)        │
│  - src/styles/global.css    (theme CSS vars)         │
│  - src/components/*.astro   (overwritten by AI)      │
│  - src/layouts/*.astro      (overwritten by AI)      │
│  - src/pages/*.astro        (overwritten by AI)      │
│  - portfolio.json           (universal data source)  │
└─────────────────────────────────────────────────────┘
```

---

## Step-by-Step Implementation

### Phase 1: Universal Portfolio JSON

**File**: `backend/portfolio.json`

Create a single JSON file that holds all personal/professional data. This acts as the data source for any generated theme.

```json
{
  "name": "Your Name",
  "title": "Software Engineer",
  "bio": "A short professional summary...",
  "email": "you@example.com",
  "location": "City, Country",
  "avatar": "/assets/avatar.jpg",
  "social": {
    "github": "https://github.com/...",
    "linkedin": "https://linkedin.com/in/...",
    "twitter": "https://x.com/..."
  },
  "skills": ["Python", "TypeScript", "React", "Astro"],
  "experience": [
    {
      "company": "Acme Inc",
      "role": "Senior Engineer",
      "period": "2022 - Present",
      "description": "Led frontend architecture..."
    }
  ],
  "education": [
    {
      "institution": "University of XYZ",
      "degree": "B.S. Computer Science",
      "year": "2020"
    }
  ],
  "projects": [
    {
      "title": "Project Alpha",
      "description": "A cool project...",
      "techStack": ["React", "Node.js"],
      "url": "https://...",
      "image": "/assets/project-alpha.png"
    }
  ],
  "certifications": [
    { "name": "AWS Solutions Architect", "year": "2023" }
  ],
  "timeline": [
    {
      "date": "2022-06",
      "title": "Joined Acme",
      "type": "milestone",
      "description": "Started as Senior Engineer"
    }
  ],
  "testimonials": [
    {
      "name": "Jane Doe",
      "role": "CTO at Acme",
      "quote": "Excellent engineer..."
    }
  ],
  "uses": {
    "tools": [
      { "name": "VS Code", "description": "Primary editor" }
    ],
    "stack": [
      { "name": "Astro", "description": "Static site framework" }
    ]
  }
}
```

**API endpoints**:
- `GET /api/portfolio` — returns the JSON
- `PUT /api/portfolio` — updates the JSON (requires auth)

**Files to create/modify**:
- `backend/portfolio.json` (new)
- `backend/routes/portfolio.py` (new)
- `backend/main.py` (register new routes)

---

### Phase 2: Authentication (Simple Admin)

Simple hardcoded admin auth for save operations.

- `POST /api/auth/login` — body `{ username, password }`, returns `{ token }`
- Default credentials: `admin` / `admin`
- Token stored in localStorage on frontend
- Protected endpoints (`PUT /api/portfolio`, `POST /api/save-theme`) require `Authorization: Bearer <token>` header

**Files to create/modify**:
- `backend/routes/auth.py` (new)
- `backend/main.py` (register auth routes)

---

### Phase 3: Modified Prompts for Astro Blog Themes

Modify the **system prompts** to output Astro-compatible blog theme code instead of generic HTML.

**New prompt** (`backend/prompts/blog_theme_prompts.py`):

The system prompt will instruct the LLM to:
1. Analyze the screenshot as a blog/portfolio theme
2. Generate Astro components matching the visual style
3. Use CSS custom properties (matching `erlandv/case` patterns)
4. Reference portfolio data via imported JSON
5. Output a structured response with multiple files (global.css, layout, components, pages)

**Output format**: A single response containing file markers:
```
<!-- FILE: src/styles/global.css -->
:root { ... }

<!-- FILE: src/layouts/BaseLayout.astro -->
---
import portfolio from '../../portfolio.json';
---
<html>...</html>

<!-- FILE: src/pages/index.astro -->
...

<!-- FILE: src/components/Navigation.astro -->
...
```

The backend parser extracts each file section and returns them as a structured bundle.

**Files to create/modify**:
- `backend/prompts/blog_theme_prompts.py` (new)
- `backend/prompts/__init__.py` (add blog theme prompt assembly)
- `backend/codegen/utils.py` (add multi-file extraction logic)

---

### Phase 4: New Stack Type — "Astro Blog"

Add a new stack option in both frontend and backend.

**Frontend** (`frontend/src/lib/stacks.ts`):
- Add `astro_blog` stack with label "Astro Blog Theme"

**Backend**:
- Add `ASTRO_BLOG` to the `Stack` enum
- Route to blog-specific prompts when this stack is selected

**Files to modify**:
- `frontend/src/lib/stacks.ts`
- `backend/llm.py` (Stack enum)
- `backend/prompts/__init__.py` (route to blog prompts)
- `backend/routes/generate_code.py` (handle multi-file output for astro_blog)

---

### Phase 5: Collapsible Sidebar

Modify the existing sidebar to be collapsible and add blog-specific features.

**Sidebar sections** (when Astro Blog stack is selected):
1. **Features of Screenshot-to-Code** — Brief feature list (collapsible accordion)
2. **Portfolio Data** — JSON editor to view/edit `portfolio.json` inline
3. **Theme Preview History** — Previous generated themes
4. **Save to Blog** — Button to push theme to blog directory (triggers auth if not logged in)

**Implementation**:
- Use existing Radix UI Accordion for collapsible sections
- Portfolio JSON editor: `<textarea>` with JSON validation
- Save button triggers `POST /api/save-theme`
- Login dialog pops up if user isn't authenticated

**Files to create/modify**:
- `frontend/src/components/sidebar/BlogSidebar.tsx` (new)
- `frontend/src/components/sidebar/PortfolioEditor.tsx` (new)
- `frontend/src/components/sidebar/SaveThemeButton.tsx` (new)
- `frontend/src/components/auth/LoginDialog.tsx` (new)
- `frontend/src/components/sidebar/Sidebar.tsx` (integrate BlogSidebar)

---

### Phase 6: Save Theme Endpoint

Backend endpoint that writes generated Astro files to the blog directory.

`POST /api/save-theme`:
- **Auth required** (admin token)
- **Request body**: `{ files: [{ path: "src/styles/global.css", content: "..." }, ...] }`
- **Action**: Writes each file to the configured blog directory (env var `BLOG_DIR`)
- **Validation**: Only allows writes under `src/` to prevent arbitrary file writes
- **Response**: `{ success: true, filesWritten: [...] }`

**Files to create/modify**:
- `backend/routes/save_theme.py` (new)
- `backend/main.py` (register route)
- `backend/config.py` (add `BLOG_DIR` env var)

---

### Phase 7: Multi-File Preview

For the Astro Blog stack, the preview pane needs to show multiple files.

**Approach**:
- When stack is `astro_blog`, the preview pane shows:
  - **Tabs for each generated file** (global.css, BaseLayout.astro, index.astro, etc.)
  - Each tab has a CodeMirror editor
  - A **combined preview** tab that renders an HTML approximation (the LLM also generates a standalone HTML preview with portfolio data baked in alongside the Astro files)
- Parse the multi-file output from the LLM into individual file objects in the frontend store

**Files to modify**:
- `frontend/src/components/preview/PreviewPane.tsx` (add multi-file tab support)
- `frontend/src/store/project-store.ts` (store multi-file data per variant)
- `backend/routes/generate_code.py` (include HTML preview in output)

---

### Phase 8: Frontend Integration & Wiring

Wire everything together in the main app.

**Changes**:
1. Show BlogSidebar when Astro Blog stack is active, regular sidebar otherwise
2. Add auth state + portfolio state to app store
3. Show "Save to Blog" flow: click -> login dialog if not authed -> confirm -> save
4. Portfolio JSON loads on app init via `GET /api/portfolio`
5. Pass portfolio data alongside images when generating code (so the LLM knows what data to inject)

**Files to modify**:
- `frontend/src/App.tsx` (conditional sidebar rendering)
- `frontend/src/store/app-store.ts` (add auth state, portfolio state)
- `frontend/src/generateCode.ts` (pass portfolio data with generation request)
- `frontend/src/lib/blog-api.ts` (new — API client for blog endpoints)

---

## File Summary

### New Files (11)
| File | Purpose |
|------|---------|
| `backend/portfolio.json` | Universal portfolio data |
| `backend/routes/portfolio.py` | Portfolio CRUD API |
| `backend/routes/auth.py` | Simple admin auth |
| `backend/routes/save_theme.py` | Write theme files to blog dir |
| `backend/prompts/blog_theme_prompts.py` | Astro blog-specific LLM prompts |
| `frontend/src/components/sidebar/BlogSidebar.tsx` | Collapsible sidebar for blog features |
| `frontend/src/components/sidebar/PortfolioEditor.tsx` | Portfolio JSON editor |
| `frontend/src/components/sidebar/SaveThemeButton.tsx` | Save theme to blog button |
| `frontend/src/components/auth/LoginDialog.tsx` | Admin login dialog |
| `frontend/src/lib/blog-api.ts` | API client for blog endpoints |
| `backend/.env.example` | Updated with BLOG_DIR |

### Modified Files (10)
| File | Change |
|------|--------|
| `backend/main.py` | Register new routes (auth, portfolio, save-theme) |
| `backend/config.py` | Add `BLOG_DIR` env var |
| `backend/llm.py` | Add `ASTRO_BLOG` stack enum |
| `backend/prompts/__init__.py` | Route to blog prompts for astro_blog stack |
| `backend/codegen/utils.py` | Multi-file extraction from `<!-- FILE: -->` markers |
| `backend/routes/generate_code.py` | Handle astro_blog multi-file output |
| `frontend/src/lib/stacks.ts` | Add `astro_blog` stack |
| `frontend/src/store/app-store.ts` | Auth + portfolio state |
| `frontend/src/components/sidebar/Sidebar.tsx` | Integrate BlogSidebar |
| `frontend/src/components/preview/PreviewPane.tsx` | Multi-file tab support |

---

## Implementation Order

```
Phase 1 (Portfolio JSON + API) ──┐
                                 ├──> Phase 3 (Blog Prompts) ──> Phase 4 (Stack Type) ──┐
Phase 2 (Auth) ──────────────────┘                                                      │
                                                                                        ├──> Phase 8 (Integration)
Phase 5 (Collapsible Sidebar) ──> Phase 6 (Save Endpoint) ──> Phase 7 (Multi-file) ────┘
```

Phases 1+2 are independent and can be done in parallel.
Phases 5-7 can start once Phase 4 is done.
Phase 8 ties everything together.

---

## Key Design Decisions

1. **Portfolio JSON over database**: Simple file-based storage. No need for SQLite/Postgres for a single-user blog tool.
2. **Modify existing pipeline, don't fork**: The WebSocket code generation flow already works. We add a new stack type and prompts, not a separate pipeline.
3. **Multi-file output via markers**: LLM outputs all files in one response with `<!-- FILE: path -->` separators. Backend parses these into a file list. Simpler than multiple LLM calls.
4. **Simplified preview**: For Astro files, we can't truly SSR in-browser. The LLM also generates an HTML preview that approximates the final result with portfolio data baked in.
5. **Admin auth is intentionally simple**: Hardcoded admin/admin with a simple token. This is a personal tool, not a multi-tenant SaaS.
6. **Blog directory via env var**: `BLOG_DIR` points to wherever the user has cloned `erlandv/case`. The save endpoint writes files there directly.
7. **Path validation on save**: Only allow writes under `src/` in the blog directory to prevent arbitrary file writes.
