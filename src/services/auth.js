import axios from "axios";

let apiCredentials = null;

export function setApiCredentials(credentials) {
  apiCredentials = { username: credentials.username, password: credentials.password };
}

export function clearApiCredentials() {
  apiCredentials = null;
}

export function getApiCredentials() {
  return apiCredentials;
}

export async function verifyCredentials(username, password) {
  if (!username.trim() || !password) {
    throw new Error("Enter your username and password.");
  }

  await axios.get(import.meta.env.VITE_JOBS_API_URL || "/api/jobs", {
    auth: { username: username.trim(), password },
  });
  return { username: username.trim(), password };
}
