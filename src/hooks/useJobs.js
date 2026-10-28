import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { getJobs } from "../services/jobsApi";

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadJobs = useCallback(async () => {
    setLoading(true);
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
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  return { jobs, loading, error };
}
