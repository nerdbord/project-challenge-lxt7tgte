import "./App.css";
// import SignInScreen from "./components/SignInScreen/SignInScreen";
import UploadFile from "./components/UploadFile/UploadFile";
// import MyUploads from "./components/MyUploads/MyUploads";
import { useEffect, useState } from "react";
import { supabase } from "./helpers/supabaseClient";
import LogInScreen from "./components/LogInScreen/LogInScreen";
import UploadItem from "./components/UploadItem/UploadItem";
import Footer from "./components/Footer/Footer";

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
      {/* {loggedIn ? <MyUploads onLogout={handleLogout} /> : <LogInScreen />} */}
      {/* {loggedIn ? <UploadFile onLogout={handleLogout} /> : <LogInScreen />} */}
      {/* <UploadItem /> */}
      <UploadFile onLogout={handleLogout} />
      <Footer />
    </div>
  );
}

export default App;
