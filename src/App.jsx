import { useEffect, useState } from "react";
import { AppShell, Container, Drawer } from "@mantine/core";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Loadable from "./components/Loadable";
import InvoiceModal from "./components/InvoiceModal";
import EmployerModal from "./components/EmployerModal";
import ChatWidget from "./components/ChatWidget";

import Overview from "./pages/Overview";
import Invoices from "./pages/Invoices";
import Employers from "./pages/Employers";
import Jobs from "./pages/Jobs";
import WorkspaceLandingPage from "./pages/WorkspaceLandingPage";

import { useJobs } from "./hooks/useJobs";
import { useEmployments } from "./hooks/useEmployments";
import { useInvoices } from "./hooks/useInvoices";
import { useNotifications } from "./hooks/useNotifications";
import {
  clearApiCredentials,
  setApiCredentials,
  verifyCredentials,
} from "./services/auth";

const pageTitles = {
  overview: "Overview",
  invoices: "Invoices",
  employers: "Employers",
  jobs: "Jobs",
};

export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [authenticated, setAuthenticated] = useState(false);
  useEffect(() => {
    const syncPath = () => {
      const currentPath = window.location.pathname;
      setPath(currentPath);
    };
    window.addEventListener("popstate", syncPath);
    return () => window.removeEventListener("popstate", syncPath);
  }, []);

  const navigate = (nextPath) => {
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
  };

  const login = async (username, password) => {
    const credentials = await verifyCredentials(username, password);
    setApiCredentials(credentials);
    setAuthenticated(true);
    navigate("/app");
  };

  const logout = () => {
    clearApiCredentials();
    setAuthenticated(false);
    navigate("/login");
  };

  const closeLogin = () => {
    window.history.pushState({}, "", "/");
    setPath("/");
  };

  if (path === "/app" && authenticated) return <WorkspaceApp onLogout={logout} />;
  if (path === "/app") return <WorkspaceLandingPage onLogin={login} onBack={closeLogin} />;
  if (path === "/login") return <WorkspaceLandingPage onLogin={login} onBack={closeLogin} />;
  if (path === "/workspace") return <WorkspaceLandingPage onLogin={login} onBack={closeLogin} />;
  return <WorkspaceLandingPage onLogin={login} onBack={closeLogin} />;
}

function WorkspaceApp({ onLogout }) {
  const [active, setActive] = useState("overview");
  const { jobs, loading, error } = useJobs();
  const [viewedJobIds, setViewedJobIds] = useState(() => {
    try {
      return new Set(JSON.parse(window.localStorage.getItem("tomo-viewed-job-ids") || "[]").map(String));
    } catch {
      return new Set();
    }
  });
  const {
    invoices,
    loading: invoicesLoading,
    error: invoicesError,
    create: createInvoice,
    update: updateInvoice,
    remove: deleteInvoice,
  } = useInvoices();
  const {
    employers,
    loading: employersLoading,
    error: employersError,
    create: createEmployer,
    update: updateEmployer,
    remove: deleteEmployer,
  } = useEmployments();
  const {
    notifications,
    unreadNotifications,
    unreadCount,
    loading: notificationsLoading,
    error: notificationsError,
    markAsRead,
    markAllAsRead,
    reload: reloadNotifications,
    deleteNotification,
  } = useNotifications();

  const [invoiceModal, setInvoiceModal] = useState(false);
  const [employerModal, setEmployerModal] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [highlightedJobIds, setHighlightedJobIds] = useState([]);

  // Replace these defaults with the loading/error values from your API hooks.
  const pageLoading = loading;
  const pageError = error;

  const navigate = (page) => {
    setActive(page);
    setMobileNav(false);
  };

  const markJobViewed = (job) => {
    const id = String(job.id);
    setViewedJobIds((current) => {
      const next = new Set(current);
      next.add(id);
      window.localStorage.setItem("tomo-viewed-job-ids", JSON.stringify([...next]));
      return next;
    });
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      const ids = jobs.map((job) => String(job.id));
      setViewedJobIds(new Set(ids));
      window.localStorage.setItem(
        "tomo-viewed-job-ids",
        JSON.stringify(ids)
      );
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handleMarkJobAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

    const handleDeleteNotification = async (notificationId) => {
      try {
        await deleteNotification(notificationId);
      } catch (error) {
        console.error("Failed to delete notification:", error);
      }
    };
  
  

  const page =
    active === "invoices" ? (
      <Invoices
        invoices={invoices}
        employers={employers}
        onCreate={() => setInvoiceModal(true)}
        onUpdate={updateInvoice}
        onDelete={deleteInvoice}
        error={invoicesError}
      />
    ) : active === "employers" ? (
      <Employers
        employers={employers}
        onCreate={() => setEmployerModal(true)}
        onDelete={deleteEmployer}
        onUpdate={updateEmployer}
        error={employersError}
      />
    ) : active === "jobs" ? (
      <Jobs
        jobs={jobs}
        highlightedJobIds={highlightedJobIds}
        onViewJob={markJobViewed}
        onCreateEmployment={createEmployer}
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
      <div className="flex h-screen overflow-hidden bg-[radial-gradient(ellipse_at_top_left,_#9dd9d244_0%,_transparent_38%),radial-gradient(ellipse_at_top_right,_#f4d06f33_0%,_transparent_32%),#fff8f0]">
        <Sidebar active={active} onNavigate={navigate} />

        <main className="app-main min-h-0 min-w-0 flex-1 overflow-y-auto">
          <Topbar
            title={pageTitles[active]}
            onMenu={() => setMobileNav(true)}
            onLogout={onLogout}
            notifications={unreadNotifications}
            onMarkAsRead={handleMarkJobAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onOpenJobs={relatedJobIds => {
              setHighlightedJobIds(relatedJobIds.map(String));
              navigate("jobs")
            }}
            onDelete={handleDeleteNotification}
          />

          <Container size="xl" className="px-5 py-7 md:px-8 md:py-9">
            <Loadable
              loading={
                active === "jobs"
                  ? pageLoading
                  : active === "employers"
                    ? employersLoading
                    : active === "invoices"
                      ? invoicesLoading || employersLoading
                    : false
              }
              error={active === "jobs" ? pageError : ""}
            >
              {page}
            </Loadable>
          </Container>
        </main>
        <ChatWidget />
      </div>

      <Drawer
        opened={mobileNav}
        onClose={() => setMobileNav(false)}
        title={<span className="font-display font-extrabold">Tomo menu</span>}
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
                  ? "bg-space text-white"
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
        onSave={createInvoice}
      />

      <EmployerModal
        opened={employerModal}
        onClose={() => setEmployerModal(false)}
        onSave={createEmployer}
      />

    </AppShell>
  );
}
