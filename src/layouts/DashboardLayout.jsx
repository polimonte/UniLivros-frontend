import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";
import Sidebar from "../components/Sidebar";
import "./DashboardLayout.css";

export default function DashboardLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => setSidebarOpen(true);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="layout-container">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
      {isSidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}

      <DashboardHeader onMenuClick={openSidebar} />

      <div className="layout-content">
        <Outlet />
      </div>
    </div>
  );
}
