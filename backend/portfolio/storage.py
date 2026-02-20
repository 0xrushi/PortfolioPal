import json
from pathlib import Path

from portfolio.schema import PortfolioData

DATA_DIR = Path(__file__).resolve().parent.parent / "data"
PORTFOLIO_FILE = DATA_DIR / "portfolio.json"
PORTFOLIO_EXAMPLE_FILE = DATA_DIR / "portfolio.json.example"


def get_default_portfolio() -> PortfolioData:
    return PortfolioData(
        personal={
            "name": "Jane Doe",
            "title": "Full-Stack Developer & Designer",
            "bio": "I build beautiful, performant web experiences. Passionate about design systems, accessibility, and open source.",
            "location": "Portland, OR",
            "avatar_url": "https://placehold.co/200x200?text=JD",
            "social": {
                "github": "https://github.com/janedoe",
                "linkedin": "https://linkedin.com/in/janedoe",
                "twitter": "https://twitter.com/janedoe",
                "email": "jane@example.com",
            },
        },
        projects=[
            {
                "title": "DevFlow",
                "description": "A developer productivity dashboard with real-time metrics, CI/CD pipeline visualization, and team collaboration features.",
                "url": "https://github.com/janedoe/devflow",
                "image_url": "https://placehold.co/600x400?text=DevFlow",
                "tags": ["React", "TypeScript", "Node.js", "PostgreSQL"],
                "featured": True,
            },
            {
                "title": "PixelPerfect",
                "description": "Design-to-code tool that converts Figma designs into production-ready components with accessibility baked in.",
                "url": "https://github.com/janedoe/pixelperfect",
                "image_url": "https://placehold.co/600x400?text=PixelPerfect",
                "tags": ["Astro", "Tailwind", "Figma API"],
                "featured": True,
            },
            {
                "title": "CloudNotes",
                "description": "Minimal note-taking app with markdown support, real-time sync, and end-to-end encryption.",
                "url": "https://github.com/janedoe/cloudnotes",
                "image_url": "https://placehold.co/600x400?text=CloudNotes",
                "tags": ["Vue", "Firebase", "Markdown"],
                "featured": False,
            },
        ],
        education=[
            {
                "institution": "Oregon State University",
                "degree": "B.S.",
                "field": "Computer Science",
                "start_year": 2015,
                "end_year": 2019,
            }
        ],
        journey=[
            {
                "year": 2024,
                "title": "Senior Engineer at Acme Corp",
                "description": "Leading the frontend platform team, building design systems and developer tooling.",
                "type": "work",
            },
            {
                "year": 2022,
                "title": "Engineer at StartupXYZ",
                "description": "Built the core product from 0 to 1, shipping features to 50k+ users.",
                "type": "work",
            },
            {
                "year": 2019,
                "title": "Graduated from Oregon State",
                "description": "Completed B.S. in Computer Science with honors.",
                "type": "education",
            },
        ],
        writing=[
            {
                "title": "Building Accessible Design Systems",
                "description": "A deep dive into creating component libraries that work for everyone.",
                "url": "https://example.com/blog/accessible-design-systems",
                "date": "2024-06-15",
                "tags": ["Accessibility", "Design Systems"],
            },
            {
                "title": "Modern CSS Techniques for 2024",
                "description": "Exploring container queries, cascade layers, and other new CSS features.",
                "url": "https://example.com/blog/modern-css",
                "date": "2024-03-10",
                "tags": ["CSS", "Frontend"],
            },
        ],
        speaking=[
            {
                "title": "The Future of Web Components",
                "event": "JSConf 2024",
                "date": "2024-09-20",
                "url": "https://example.com/talks/web-components",
                "description": "Exploring how web components are evolving and their role in modern frameworks.",
            }
        ],
        testimonials=[
            {
                "author": "Alex Chen",
                "role": "CTO at StartupXYZ",
                "content": "Jane is an exceptional engineer who consistently delivers high-quality work. Her attention to detail and design sense are unmatched.",
                "avatar_url": "https://placehold.co/100x100?text=AC",
            }
        ],
        uses=[
            {
                "category": "Development",
                "items": [
                    {
                        "name": "VS Code",
                        "description": "Primary code editor",
                        "url": "https://code.visualstudio.com",
                    },
                    {
                        "name": "Warp",
                        "description": "Modern terminal",
                        "url": "https://warp.dev",
                    },
                    {
                        "name": "Arc",
                        "description": "Browser for development",
                        "url": "https://arc.net",
                    },
                ],
            },
            {
                "category": "Design",
                "items": [
                    {
                        "name": "Figma",
                        "description": "UI/UX design",
                        "url": "https://figma.com",
                    },
                    {
                        "name": "Excalidraw",
                        "description": "Whiteboarding and diagrams",
                        "url": "https://excalidraw.com",
                    },
                ],
            },
        ],
    )


def load_portfolio() -> PortfolioData:
    for file_path in (PORTFOLIO_FILE, PORTFOLIO_EXAMPLE_FILE):
        if file_path.exists():
            raw = json.loads(file_path.read_text())
            return PortfolioData(**raw)
    return get_default_portfolio()


def save_portfolio(data: PortfolioData) -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    PORTFOLIO_FILE.write_text(json.dumps(data.model_dump(), indent=2))
