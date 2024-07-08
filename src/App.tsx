import "./App.css";
import { useEffect, useState } from "react";
import { supabase } from "./helpers/supabaseClient";
import UploadedItems from "./components/UploadedItems/UploadedItems";
import Footer from "./components/Footer/Footer";
import Landing from "./components/Landing/Landing";
import Header from "./components/Header/Header";
import Loader from "./components/Loader/Loader";
import { Routes, Route, Navigate } from "react-router-dom";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
      setLoading(false);
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (event, _) => {
        if (event === "SIGNED_IN") {
          setLoggedIn(true);
        } else if (event === "SIGNED_OUT") {
          setLoggedIn(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    supabase.auth.signOut();
    setLoggedIn(false);
  };

  if (!loading) {
    return <Loader />;
  }

  return (
    <div className="container">
      <Header onLogout={handleLogout} />

      <Routes>
        <Route
          path="/"
          element={loggedIn ? <Navigate to="/upload" /> : <Landing />}
        />
        <Route
          path="/upload"
          element={loggedIn ? <UploadedItems /> : <Navigate to="/" />}
        />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
