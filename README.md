# AI Text Summarizer (Chrome Extension + Serverless Backend)

## Folder structure

- `extension/`
  - `manifest.json` (Manifest V3)
  - `content.js` (selection detection + inline UI)
  - `background.js` (service worker: LLM calls, key decrypt)
  - `options.html` / `options.js` / `options.css` (settings + encrypted key storage)
- `backend/`
  - `api/` (Vercel serverless functions)
  - `lib/` (shared helpers)
  - `schema.sql` (Postgres schema)

## Extension (MVP) usage

### Load unpacked

1. Open Chrome
2. Go to `chrome://extensions`
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select the `extension/` folder

### Use it

1. Highlight any text on a webpage
2. A small button appears near the selection
3. Click it to generate a summary
4. Use **Read aloud / Pause / Resume / Stop**

### Configure (Options)

- Right-click the extension icon
- Click **Options**

**Own API mode**

- Choose provider (`groq`, `openai`, or `gemini`)
- Set model
- Paste API key
- Click **Save**

Gemini example:

- Provider: `gemini`
- Model: `gemini-2.5-flash`

Note: Subscription mode is currently disabled in the extension UI.

## Backend (Vercel Serverless Functions) (optional for later)

### What the backend does

- Auth (`/api/auth/register`, `/api/auth/login`, `/api/auth/me`)
- Summarize proxy (`/api/summarize`) using **managed** Groq/OpenAI/Gemini key
- Usage tracking/limits in Postgres
- Stripe subscription scaffolding (`/api/subscription/*`, `/api/webhook/stripe`)

### Environment variables

Copy and fill:

- `backend/.env.example`

Required for local/dev:

- `DATABASE_URL`
- `JWT_SECRET`
- `MANAGED_PROVIDER` and corresponding key (`GROQ_API_KEY` / `OPENAI_API_KEY` / `GEMINI_API_KEY`)

For subscriptions:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_MONTHLY_ID`
- `STRIPE_PRICE_YEARLY_ID`
- `APP_URL`

### Database setup

Run the SQL in `backend/schema.sql` on your Postgres instance.

### Deploy on Vercel

1. Create a new Vercel project
2. Set the project root to `backend/`
3. Add environment variables from `.env.example`
4. Deploy

Your API base URL becomes:

- `https://<project>.vercel.app`

## Manual testing checklist

- Select text on a random website and ensure the button appears
- Summary popup opens and closes correctly
- Own-key mode:
  - encrypted key is saved
  - Groq/Gemini/OpenAI request succeeds

## Notes

- The extension does **not** store summarized content or browsing history.
- API keys are stored encrypted in `chrome.storage.sync`.
