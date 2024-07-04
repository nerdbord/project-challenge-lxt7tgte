import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "./helpers/supabaseClient.ts";
import { SnackbarProvider, useSnackbar } from "notistack";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <SnackbarProvider>
        {" "}
        <App />
      </SnackbarProvider>
    </SessionContextProvider>
  </React.StrictMode>
);
