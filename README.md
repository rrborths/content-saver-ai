# Content Saver AI

Content Saver AI is a full‑stack web application designed to help you save, analyze and organize content from around the web. Paste a URL from nearly any platform—Reddit, LinkedIn, Twitter/X, YouTube, Medium, Substack, blogs and news articles—and the app will fetch the content server‑side, run an AI‑powered analysis using OpenAI, and present the results in a structured, searchable library.

## Features

- **URL Input & Auto Detection** – Paste any URL and the server will attempt to fetch the page via the Jina Reader API or a simple HTML fallback. The scraping logic lives in a serverless API route so secrets never reach the client.
- **AI‑Powered Analysis** – Extracts key information with GPT‑4o/GPT‑4o‑mini: content type, TL;DR summary, key takeaways, recommendations (tools, books, courses, etc.), step‑by‑step instructions, comment highlights, links mentioned and tags for quick search.
- **Structured Display** – The UI organizes the analysis into sections: header, summary, key takeaways, recommendations table, instructions, comments, links, tags and a link back to the original source.
- **Saved Library** – All processed posts are stored in the browser using IndexedDB via Dexie.js. Browse, search, filter, edit or delete saved posts. Export the entire library as JSON.
- **Client‑Side Only Storage** – There is no external database; everything is persisted in your browser. This makes deployment simple and keeps your data private.
- **Responsive UI with Dark Mode** – Built with Next.js (App Router) and Tailwind CSS. The default theme is dark, with a toggle in the top bar.

## Getting Started

### Prerequisites

This project uses Next.js 14 with TypeScript and Tailwind CSS. To run it locally you’ll need Node.js ≥ 18 installed. You will also need access to the internet to install the npm dependencies.

### Installation

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/rrborths/content-saver-ai.git
   cd content-saver-ai
   npm install
   ```

2. Create a `.env.local` file to configure environment variables if needed. The app does not currently require any server‑side environment variables, but you can set `NEXT_PUBLIC_BASE_URL` to override the base URL used in the `/api/process` endpoint.

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the Content Saver AI interface.

### Configuring the OpenAI API Key

Content Saver AI relies on the OpenAI API for analysis. The API key is **not** hard‑coded anywhere in the codebase. Instead, the app expects you to configure it via the Settings panel:

1. Start the app locally or deploy it.
2. Click the gear icon in the top bar to open the Settings modal.
3. Paste your OpenAI API key into the field and click **Save**. The key is stored in `localStorage` on the client.

On each request to `/api/analyze` or `/api/process` the client sends the API key in a custom `x-openai-key` header. The serverless functions then forward the key to OpenAI. Without a key the analysis endpoints return `401`.

### Deployment to Vercel

This repository is configured to deploy seamlessly to [Vercel](https://vercel.com). After you push the code to your own repository:

1. [Import](https://vercel.com/new) the repository into Vercel.
2. Choose **Next.js** when prompted for the framework.
3. Set any environment variables as needed (e.g. `NEXT_PUBLIC_BASE_URL` if your deployment uses a custom domain).
4. Deploy. Because the database uses IndexedDB in the browser, there is no need to provision a separate database service.

## API Routes

### `POST /api/scrape`

Accepts `{ url: string }` in the request body. Scrapes the given URL server‑side using the [Jina Reader API](https://r.jina.ai/) or falls back to a naive HTML fetch and tag stripping. Returns `{ content: string }`.

### `POST /api/analyze`

Accepts `{ content: string }` in the request body and requires an `x-openai-key` header. Sends the content to the OpenAI Chat API with a structured extraction prompt and returns `{ result: ParsedObject }`. If a field is not applicable the model returns empty arrays or strings.

### `POST /api/process`

Accepts `{ url: string }` and chains the scrape and analyze steps in one call. Requires `x-openai-key` in the header. Returns `{ content: string, result: ParsedObject }`.

## Environment Variables

The following environment variables can be configured in Vercel or `.env.local`:

- `NEXT_PUBLIC_BASE_URL` – Optional. Overrides the base URL used by the `/api/process` route when chaining internal requests.

No OpenAI API key is stored in environment variables—keys are supplied from the client via the Settings panel.

## Limitations & Future Improvements

- **Platform‑Specific Extraction** – The current scraper uses Jina Reader and a simple fallback. For the most accurate extraction from Reddit, LinkedIn, Twitter/X and other platforms you may wish to integrate platform‑specific APIs or third‑party services.
- **Rich Editing** – While you can delete posts, there is no in‑app editing interface yet. Adding a full edit modal would improve flexibility.
- **Better Error Handling** – The UI displays basic error messages. In a production deployment you may want more granular feedback and retry options.
- **Pagination & Search** – Filtering and full‑text search across saved posts would enhance the library. Dexie.js supports indexed queries that can be leveraged here.

## License

This project is provided for educational purposes and does not include any proprietary data. You are free to use and modify it in accordance with the repository’s license.
