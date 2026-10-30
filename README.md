# TomoPA-webapp — React + Tailwind + Mantine

A consultancy marketing site and authenticated Tomo personal-assistant workspace, built with reusable React components and page modules.

## Stack

- React + Vite
- Tailwind CSS for layout, spacing, colors, gradients, and responsive styling
- Mantine 7 for AppShell, Container, Drawer, Modal, Table, form inputs, and controls
- Mantine Form for validation
- Tabler icons

## Run locally

```bash
npm install
npm run dev
```

## Structure

```text
src/
├── components/   # Brand, Sidebar, Topbar, badges, stat cards, modals
├── data/         # Seed data
├── pages/        # Overview, Invoices, Employers
├── utils/        # Formatting and invoice calculations
├── App.jsx       # App state and page composition
├── main.jsx      # Providers and app entry
└── styles.css    # Mantine overrides + Tailwind directives
```

The public marketing page is served at `/`. The sign-in dialog stays hidden
until opened from the marketing page; `/login` opens that dialog over the page.
A successful sign-in opens the workspace at `/app`. The dialog verifies the
entered credentials against the Jobs API using HTTP Basic
authentication. Credentials remain in memory for the current browser session;
refreshing the page requires signing in again. The workspace has a sign-out
button in the top bar.

Jobs, employer records, and invoices load from the Tomo backend. Other app state
is held in React and resets on refresh.

## Tomo job service

The Jobs page reads listings from Tomo Desktop's Spring controller at `GET /jobs`.
The Employers page uses the `/employments` controller to list, create, and
delete employer records. The Invoices page uses `/invoices` for listing,
creating, updating, and deleting invoices linked to an employment record.
In development, Vite proxies `/api/*` to `http://localhost:8080` by default. Set
`TOMO_API_ORIGIN` to change the backend origin, or set `VITE_JOBS_API_URL`,
`VITE_EMPLOYMENTS_API_URL`, or `VITE_INVOICES_API_URL` to override an endpoint.
All API requests use the credentials entered at sign-in. The browser sends
HTTP Basic authentication to the API, so production must use HTTPS and a
backend that supports this authentication flow. For production deployments,
prefer a server-managed session or short-lived token instead of Basic auth.

## RAG chat

The always-visible assistant sidebar sits to the right of the app content and
sends messages to `POST /api/rag/messages`. The Vite development proxy removes
the `/api` prefix, forwarding the request to the Tomo backend's
`POST /rag/messages` controller. Each request contains `conversationId`,
`message`, and `knowledgeBaseIds`; the backend returns `conversationId` and
`answer`, and stores conversation history itself. Set `VITE_RAG_CHAT_API_URL`
to override the endpoint and `VITE_RAG_KNOWLEDGE_BASE_IDS` to a comma-separated
list of knowledge-base IDs. The default ID `1` follows the backend RAG guide's
example. Chat authentication uses the same credentials entered on the login
page as the other API clients.
