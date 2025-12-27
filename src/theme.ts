import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#7c5ba6" },
    secondary: { main: "#8faa96" },
    background: { default: "#f5f1ed", paper: "#ffffff" },
    text: { primary: "#2d2d3d", secondary: "#6b6b7f" },
  },
  typography: {
    fontFamily: "Montserrat, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
  },
  shape: {
    borderRadius: 16,
  },
});
