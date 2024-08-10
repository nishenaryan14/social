import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfilePage from "scenes/profilePage";
import { useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider, LinearProgress } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Start loading when the location changes
    setLoading(true);

    // Simulate a delay to demonstrate the loader (this could be an actual network request)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Adjust this timeout as needed

    // Cleanup timer on unmount
    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div className="app">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {loading && <LinearProgress />} {/* Display the loader if loading */}
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/home"
            element={isAuth ? <HomePage /> : <Navigate to="/" />}
          />
          <Route
            path="/profile/:userId"
            element={isAuth ? <ProfilePage /> : <Navigate to="/" />}
          />
        </Routes>
      </ThemeProvider>
      <ToastContainer
        position="top-center" // Position toast in the top center
        autoClose={5000} // Duration to show the toast
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
