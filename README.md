# PortfolioPal

PortfolioPal is a dynamic portfolio generator. Drop in a reference screenshot, generate a theme, then zoom out (top-right button or Clippy) to tweak and iterate until your portfolio feels right.

This repo started as a fork of `abi/screenshot-to-code` and has been refocused for portfolios.

## Getting Started

The app has a React/Vite frontend and a FastAPI backend.

Keys needed (at least one):

- `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` or `GEMINI_API_KEY`

### Run Locally

Backend:

```bash
cd backend
echo "OPENAI_API_KEY=sk-your-key" > .env
poetry install
poetry run uvicorn main:app --reload --port 7001
```

Frontend:

```bash
cd frontend
yarn
yarn dev --host 0.0.0.0 --port 5173
```

Open `http://localhost:5173`.

### Docker

```bash
echo "OPENAI_API_KEY=sk-your-key" > .env
docker compose up -d --build
```

Open `http://localhost:5173`.

## License

MIT. See `LICENSE`.
