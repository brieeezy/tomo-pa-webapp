import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/jobs",
  auth: {
    username: "superadmin",
    password: "password",
  },
});
export async function getJobs() {
  const response = await api.get("");
  return response.data;
}


