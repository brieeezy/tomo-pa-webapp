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
      theme={{
        primaryColor: "orange",
        colors: {
          orange: ["#fff4e8", "#ffe5cc", "#ffd2a3", "#ffbc75", "#ffa64c", "#ff8811", "#e97600", "#c96300", "#a95000", "#873f00"],
        },
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      <App />
    </MantineProvider>
  </React.StrictMode>,
);
