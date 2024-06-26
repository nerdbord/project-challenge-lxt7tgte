import "./App.css";
import LogInScreen from "./components/LogInScreen/LogInScreen";
// import SignInScreen from "./components/SignInScreen/SignInScreen";
// import UploadFile from "./components/UploadFile/UploadFile";
import MyUploads from "./components/MyUploads/MyUploads";
import { useEffect, useState } from "react";
import { supabase } from "./helpers/supabaseClient";

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

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
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

  return (
    <div className="container">
      {loggedIn ? <MyUploads onLogout={handleLogout} /> : <LogInScreen />}
    </div>
  );
}

export default App;
