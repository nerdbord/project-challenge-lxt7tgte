import "./App.css";
import { useEffect, useState } from "react";
import { supabase } from "./helpers/supabaseClient";
import UploadItems from "./components/UploadItems/UploadItems.tsx";
import Footer from "./components/Footer/Footer";
import Landing from "./components/Landing/Landing";
import Header from "./components/Header/Header";
import Loader from "./components/Loader/Loader";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setLoggedIn(true);
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
    setLoggedIn(false);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container">
      <Header onLogout={handleLogout} />
      {loggedIn ? <UploadItems /> : <Landing />}
      <Footer />
    </div>
  );
}

export default App;
