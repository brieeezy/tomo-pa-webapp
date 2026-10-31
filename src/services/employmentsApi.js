import axios from "axios";
import { getApiCredentials } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_EMPLOYMENTS_API_URL || "/api/employments",
});
api.interceptors.request.use((config) => {
  config.auth = getApiCredentials() || undefined;
  return config;
});

export async function getEmployments() {
  const response = await api.get("");
  return response.data;
}

export async function createEmployment(employment) {
  const response = await api.post("", employment);
  return response.data;
}

export async function updateEmployment(id, employment) {
  const response = await api.put(`/${id}`, employment);
  return response.data;
}

export async function deleteEmployment(id) {
  await api.delete(`/${id}`);
}
