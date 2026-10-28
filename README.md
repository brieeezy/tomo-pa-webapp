# TomoPA-webapp — React + Tailwind + Mantine

A clean ledger/invoice workspace with a soft gradient UI, split into reusable components and page modules.

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

Data is currently held in React state and resets on refresh. Connect a backend/API for persistence.

## Tomo job service

The Jobs page reads listings from Tomo Desktop's Spring controller at `GET /jobs`.
In development, Vite proxies `/api/*` to `http://localhost:8080` by default. Set
`TOMO_API_ORIGIN` to change the backend origin, or set `VITE_JOBS_API_URL` to
the complete jobs endpoint URL. The service currently uses hard-coded Basic
authentication credentials in `src/services/jobsApi.js` for development.
Vite embeds frontend credentials in the browser bundle; use a backend proxy
with server-side credentials before deploying this configuration.
