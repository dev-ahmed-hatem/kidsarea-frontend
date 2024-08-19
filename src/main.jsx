import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Flowbite } from "flowbite-react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { browserRoutes } from "./constants/Routing";
import theme from "./assets/FlowbiteTheme";
import "./css/index.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Flowbite theme={{ theme: theme }}>
            <RouterProvider
                router={createBrowserRouter(browserRoutes)}
            ></RouterProvider>
        </Flowbite>
    </StrictMode>
);
