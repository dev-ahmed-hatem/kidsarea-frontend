import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Flowbite } from "flowbite-react";
import theme from "./assets/FlowbiteTheme";
import "./css/index.css";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Flowbite theme={{ theme: theme }}>
            <div className="font-bold text-center text-3xl">Main Content</div>
        </Flowbite>
    </StrictMode>
);

{
    /* <RouterProvider
    router={createBrowserRouter(browserRoutes)}
></RouterProvider> */
}
