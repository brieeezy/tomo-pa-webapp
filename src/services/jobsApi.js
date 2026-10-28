import axios from "axios";

export async function getJobs() {
  const api = axios.create({
    baseURL: import.meta.env.VITE_JOBS_API_URL || "/api/jobs",
    auth: {
      username: "superadmin",
      password: "password",
    },
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


