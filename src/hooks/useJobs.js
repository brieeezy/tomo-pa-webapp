import { useEffect, useState } from "react";
import { getJobs } from "../services/jobsApi";

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getJobs()
      .then((data) => {
        if (active) setJobs(data);
      })
      .catch(() => {
        if (active) setError("Could not load jobs.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return { jobs, loading, error };
}
