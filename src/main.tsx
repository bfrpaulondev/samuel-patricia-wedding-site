import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import App from "./App";
import { theme } from "./theme";
import "./styles/global.css";

const el = document.getElementById("root");
if (!el) throw new Error("Missing #root in index.html");

ReactDOM.createRoot(el).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
