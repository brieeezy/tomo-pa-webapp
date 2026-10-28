import { useState } from "react";
import {
  AppShell,
  Container,
  Drawer,
} from "@mantine/core";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Loadable from "./components/Loadable";
import InvoiceModal from "./components/InvoiceModal";
import EmployerModal from "./components/EmployerModal";

import Overview from "./pages/Overview";
import Invoices from "./pages/Invoices";
import Employers from "./pages/Employers";
import Jobs from "./pages/Jobs";

import { seedEmployers, seedInvoices, seedJobs } from "./data/seed";
import { useJobs } from "./hooks/useJobs";

const pageTitles = {
  overview: "Overview",
  invoices: "Invoices",
  employers: "Employers",
  jobs: "Jobs",
};

export default function App() {
  const [active, setActive] = useState("overview");
  const [employers, setEmployers] = useState(seedEmployers);
  const [invoices, setInvoices] = useState(seedInvoices);
  const { jobs, loading, error } = useJobs();
  const [selectedJob, setSelectedJob] = useState(null);

  const [invoiceModal, setInvoiceModal] = useState(false);
  const [employerModal, setEmployerModal] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  // Replace these defaults with the loading/error values from your API hooks.
  const pageLoading = loading;
  const pageError = error;

  const navigate = (page) => {
    setActive(page);
    setMobileNav(false);
  };

  const page =
    active === "invoices" ? (
      <Invoices
        invoices={invoices}
        employers={employers}
        onCreate={() => setInvoiceModal(true)}
      />
    ) : active === "employers" ? (
      <Employers
        employers={employers}
        onCreate={() => setEmployerModal(true)}
      />
    ) : active === "jobs" ? (
      <Jobs
        jobs={jobs}
        onCreateEmployment={(job) => {
          setSelectedJob(job);
          setEmployerModal(true);
        }}
        onToggleImportant={(job) => {
          console.log("Toggled important:", job.id);
        }}
      />
    ) : (
      <Overview
        invoices={invoices}
        employers={employers}
        onNavigate={navigate}
      />
    );

  return (
    <AppShell
      navbar={{
        width: 250,
        breakpoint: "lg",
        collapsed: {
          mobile: true,
          desktop: true,
        },
      }}
      padding={0}
    >
      <div className="flex min-h-screen bg-[radial-gradient(ellipse_at_top_left,_#e5eaff_0%,_transparent_38%),radial-gradient(ellipse_at_top_right,_#eee8ff_0%,_transparent_32%),#f4f7ff]">
        <Sidebar active={active} onNavigate={navigate} />

        <main className="min-w-0 flex-1">
          <Topbar
            title={pageTitles[active]}
            onMenu={() => setMobileNav(true)}
          />

          <Container size="xl" className="px-5 py-7 md:px-8 md:py-9">
            <Loadable loading={active === "jobs" ? pageLoading : false} error={active === "jobs" ? pageError : ""}>
              {page}
            </Loadable>
          </Container>
        </main>
      </div>

      <Drawer
        opened={mobileNav}
        onClose={() => setMobileNav(false)}
        title={<span className="font-display font-extrabold">Ledger menu</span>}
        padding="md"
        size="xs"
      >
        <div className="space-y-2">
          {[
            ["overview", "Overview"],
            ["invoices", "Invoices"],
            ["employers", "Employers"],
            ["jobs", "Job Recommendations"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => navigate(id)}
              className={`block w-full rounded-xl px-4 py-3 text-left font-semibold ${
                active === id
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </Drawer>

      <InvoiceModal
        opened={invoiceModal}
        onClose={() => setInvoiceModal(false)}
        employers={employers}
        onSave={(invoice) => setInvoices((current) => [invoice, ...current])}
      />

      <EmployerModal
        opened={employerModal}
        onClose={() => setEmployerModal(false)}
        onSave={(employer) => setEmployers((current) => [employer, ...current])}
      />
    </AppShell>
  );
}
