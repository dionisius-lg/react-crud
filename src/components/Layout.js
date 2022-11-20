import { Outlet } from "react-router-dom";

import React from "react";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export const MainLayout = () => {
    return (
        <div className="container-navbar" id="wrapper">
            <Topbar />
            <div id="layoutSidenav">
                <Sidebar />
                <div id="layoutSidenav_content">
                    <Outlet />
                    <Footer />
                </div>
            </div>
        </div>
    )
}

export const AuthLayout = () => {
    return (
        <div className="container">
            <Outlet />
        </div>
    )
}
