import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-themed text-heading transition-colors duration-300">
      <Navbar />

      {/* CONTENT */}
      <main className="pt-28 px-6 max-w-7xl mx-auto">
        <Outlet />
      </main>

      {/* FOOTER */}
      <div className="mt-24">
        <Footer />
      </div>
    </div>
  );
}