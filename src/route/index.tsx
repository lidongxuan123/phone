import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Multi from "../pages/multi";
import Landscape from "../pages/landscape";
import Dividend from "../pages/dividend"

import Single from "../pages/single"
import Home from "../pages/home";
import DividendMoney from "../pages/dividendMoney"
import Animation from "../pages/animation"
export const routerFirst = createBrowserRouter([
    {
        path: '/',
        element: <Home></Home>
    },
    {
        path: '/single',
        element: <Single></Single>
    },
    {
        path: '/multi',
        element: <Multi></Multi>
    },
    {
        path: '/landscape',
        element: <Landscape></Landscape>
    },
    {
        path: '/dividend',
        element: <Dividend></Dividend>
    },
    {
        path: '/dividendMoney',
        element: <DividendMoney></DividendMoney>
    },
    {
        path: '/animation',
        element: <Animation></Animation>
    }
])

