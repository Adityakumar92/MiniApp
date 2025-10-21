import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </header>

      <main className="flex-grow pt-20 pb-16 bg-gray-50">
        {/* pt-20 offsets the fixed navbar height */}
        <Outlet />
      </main>

      <footer className="bg-white border-t shadow-sm">
        <Footer />
      </footer>
    </div>
  );
}

export default Layout;
