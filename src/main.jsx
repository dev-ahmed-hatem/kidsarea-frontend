import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Flowbite } from "flowbite-react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
// import { browserRoutes } from "./constants/Routing.jsx";
import theme from "./assets/FlowbiteTheme";
import "./css/index.css";
import Login from "./components/login/Login.jsx";
import NotFound from "./NotFound.jsx";

export const browserRoutes = createBrowserRouter([
    {
        path: "/home",
        element: <div className="font-bold text-2xl text-center">Home</div>,
        errorElement: <NotFound />,
        // children: [],
    },
    {
        path: "/login",
        element: <Login />,
        errorElement: <NotFound />,
    },
    {
        path: "/logout",
        element: <div className="font-bold text-2xl text-center">logout</div>,
        errorElement: <NotFound />,
    },
]);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Flowbite theme={{ theme: theme }}>
            <RouterProvider router={browserRoutes}></RouterProvider>
        </Flowbite>
    </StrictMode>
);
