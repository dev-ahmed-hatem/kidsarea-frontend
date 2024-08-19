import Section from "../components/sections/Section";
import Subsection from "../components/sections/Subsection";
import NotFound from "../NotFound";
// import Main from "../components/main";
import routes from "./Index.jsx";
import Login from "../components/login/Login";

export const browserRoutes = [
    {
        path: "/",
        element: <div className="font-bold text-2xl text-center">Home</div>,
        errorElement: <NotFound />,
        children: [],
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
];

// routes.map((route) => {
//     browserRoutes[0]["children"].push({
//         path: route.url,
//         element: <Section item={route} />,
//         errorElement: <NotFound />,
//         children: route.children.map((child) => {
//             return {
//                 path: child.url,
//                 element: child.element? child.element : <Subsection />,
//             };
//         }),
//     });
// });
