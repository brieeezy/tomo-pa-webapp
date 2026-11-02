import axios from "axios";
import { getApiCredentials } from "./auth";

export async function getJobs() {
  const api = axios.create({
    baseURL: import.meta.env.VITE_TOMO_API_ORIGIN + "/jobs",
    auth: getApiCredentials() || undefined,
  });
  const response = await api.get("");
  return response.data.map((job) => ({
    ...job,
    clientName: job.employerName,
    jobDescription: job.jobDesc,
    shift: job.shiftSchedule,
    postedDate: job.postedOn,
    tags: job.progLang
      ? job.progLang.split(/[,;|]/).map((tag) => tag.trim()).filter(Boolean)
      : [],
    isImportant: false,
  }));
}


