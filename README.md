# TomoPA-webapp — React + Tailwind + Mantine

An authenticated Tomo personal-assistant workspace with a dedicated sign-in page, built with reusable React components and page modules.

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
├── pages/        # Workspace sign-in, Overview, Invoices, Employers, Jobs
├── utils/        # Formatting and invoice calculations
├── App.jsx       # App state and page composition
├── main.jsx      # Providers and app entry
└── styles.css    # Mantine overrides + Tailwind directives
```

The same Tomo sign-in screen is served at `/`, `/login`, and `/workspace`. A
successful sign-in opens the workspace at `/app`. Sign-in verifies the entered
credentials against the Jobs API using HTTP Basic authentication. Credentials
remain in memory for the current browser session; refreshing the page requires
signing in again. The workspace has a sign-out button in the top bar.

Jobs, employer records, and invoices load from the Tomo backend. Other app state
is held in React and resets on refresh.

## Tomo job service

The Jobs page reads listings from Tomo Desktop's Spring controller at `GET /jobs`.
The Employers page uses the `/employments` controller to list, create, and
delete employer records. The Invoices page uses `/invoices` for listing,
creating, updating, and deleting invoices linked to an employment record.
In development, Vite proxies `/api/*` to `http://192.168.50.111:8080` by
default. Set `TOMO_API_ORIGIN` to change the backend origin, or set `VITE_JOBS_API_URL`,
`VITE_EMPLOYMENTS_API_URL`, or `VITE_INVOICES_API_URL` to override an endpoint.
All API requests use the credentials entered at sign-in. The browser sends
HTTP Basic authentication to the API, so production must use HTTPS and a
backend that supports this authentication flow. For production deployments,
prefer a server-managed session or short-lived token instead of Basic auth.

## RAG chat

The always-visible assistant sidebar sits to the right of the app content and
sends messages to `POST /api/rag/messages`. The Vite development proxy removes
the `/api` prefix, forwarding the request to the Tomo backend's
`POST /rag/messages` controller. Each request contains `conversationId` and
`message`; the backend returns `conversationId`, message IDs, `answer`, and
optional `sources`, and stores conversation history itself. The assistant
sidebar lists conversations from `GET /api/conversations` and loads a selected
conversation from `GET /api/conversations/{conversationId}/messages`. Starting
a new conversation resets the visible chat but does not delete records from the
backend. Set `VITE_RAG_CHAT_API_URL` or `VITE_CONVERSATIONS_API_URL` to override
the respective endpoints. Chat authentication uses the same credentials
entered on the login page as the other API clients.
The development proxy removes the `/api` prefix, forwarding conversation
requests to the backend's `/conversations` controller.
