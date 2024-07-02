import "./App.css";
// import SignInScreen from "./components/SignInScreen/SignInScreen";
import UploadFile from "./components/UploadFile/UploadFile";
// import MyUploads from "./components/MyUploads/MyUploads";
import { useEffect, useState } from "react";
import { supabase } from "./helpers/supabaseClient";
import LogInScreen from "./components/Trash/LogInScreen/LogInScreen";
import UploadItem from "./components/UploadItems/UploadItems.tsx";
import Footer from "./components/Footer/Footer";
import MyUploads from "./components/MyUploads/MyUploads";
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
      <Header onLogout={handleLogout} />

      {loggedIn ? <MyUploads onLogout={handleLogout} /> : <Landing />}
      {/* {loggedIn ? <UploadFile onLogout={handleLogout} /> : <LogInScreen />} */}
      {/* <UploadFile /> */}

      <Footer />
    </div>
  );
}

export default App;
