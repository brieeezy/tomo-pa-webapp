import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { getJobs } from "../services/jobsApi";

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadJobs = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setError("");
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (requestError) {
      if (axios.isAxiosError(requestError) && requestError.response?.status === 401) {
        setError("Tomo job service rejected the configured credentials.");
      } else {
        setError("Could not load jobs. Check that the Tomo service is running and reachable.");
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
    const interval = window.setInterval(() => loadJobs(true), 60_000);
    return () => window.clearInterval(interval);
  }, [loadJobs]);

  return { jobs, loading, error };
}
