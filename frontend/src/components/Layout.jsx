import { useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useThemeStore } from "../store/useThemeStore";

const Layout = ({ children, showSidebar = false }) => {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <div className="flex">
        {showSidebar && <Sidebar />}

        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
