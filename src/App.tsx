import "./App.css";
import { useEffect, useState } from "react";
import { supabase } from "./helpers/supabaseClient";
import UploadItems from "./components/UploadItems/UploadItems.tsx";
import Footer from "./components/Footer/Footer";
import Landing from "./components/Landing/Landing";
import Header from "./components/Header/Header";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setLoggedIn(true);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        setLoggedIn(true);
      } else if (event === "SIGNED_OUT") {
        setLoggedIn(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = () => {
    setLoggedIn(false);
  };

  return (
    <>
      <div className="container">
        <Header onLogout={handleLogout} />
        {loggedIn ? <UploadItems /> : <Landing />}
        <Footer />
      </div>
    </>
  );
}

export default App;
