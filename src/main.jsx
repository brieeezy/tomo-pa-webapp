import React from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "./styles.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider
      defaultColorScheme="light"
      theme={{ primaryColor: "indigo", fontFamily: "DM Sans, sans-serif" }}
    >
      <App />
    </MantineProvider>
  </React.StrictMode>,
);
