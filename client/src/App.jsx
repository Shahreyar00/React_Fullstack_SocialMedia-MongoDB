import React, { useMemo } from "react";
import { createBrowserRouter, RouterProvider, Navigate, createRoutesFromElements, Route } from "react-router-dom";
import { LoginPage, HomePage, ProfilePage } from "./pages";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";

const App = () => {
    const mode = useSelector((state) => state.mode);
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
    const isAuth = Boolean(useSelector((state) => state.token));
    // const user = useSelector((state) => state.user);
    // console.log(isAuth);
    // console.log(user);

    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                {/* <Route path="/" element={isAuth ? <Navigate to="/home" /> : <LoginPage />} /> */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/home" element={isAuth ? <HomePage /> : <Navigate to="/"/>} />
                <Route path="/profile/:userId" element={isAuth ? <ProfilePage /> : <Navigate to="/"/>} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </>
        )
    )

    return (
        <div className="app">
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <RouterProvider router={router} />
            </ThemeProvider>
        </div>
    )
}

export default App