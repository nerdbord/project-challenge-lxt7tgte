import "./App.css";
import LogInScreen from "./components/LogInScreen/LogInScreen";
import SignInScreen from "./components/SignInScreen/SignInScreen";
import UploadFile from "./components/UploadFile/UploadFile";
import MyUploads from "./components/MyUploads/MyUploads";

function App() {
  return (
    <div className="container">
      {/* <MyUploads /> */}
      <LogInScreen />
    </div>
  );
}

export default App;
