import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "./helpers/supabaseClient.ts";
import { SnackbarProvider } from "notistack";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <SessionContextProvider supabaseClient={supabase}>
        <SnackbarProvider
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          autoHideDuration={1000}
          maxSnack={3}
        >
          <App />
        </SnackbarProvider>
      </SessionContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
