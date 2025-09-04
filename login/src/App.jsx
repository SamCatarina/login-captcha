import React from "react";
import "./App.css";
import SignInSide from "./components/login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SignInSide />
      <ToastContainer position="top-center" autoClose={3000} />
    </ThemeProvider>
  );
}

export default App;
