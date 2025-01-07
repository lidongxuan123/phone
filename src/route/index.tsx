import {createBrowserRouter,RouterProvider} from "react-router-dom"
import Multi from "../pages/multi";
import Landscape from "../pages/landscape";

import Single from "../pages/single"
import Home from "../pages/home";
export const routerFirst = createBrowserRouter([
    {
        path:'/',
        element: <Home></Home>
    },
    {
        path:'/single',
        element: <Single></Single>
    },
    {
        path:'/multi',
        element: <Multi></Multi>
    },
    {
        path:'/landscape',
        element: <Landscape></Landscape>
    }
])

 