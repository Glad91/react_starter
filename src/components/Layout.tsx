import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { Toaster } from "@/components/ui/toaster.tsx";

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto flex-grow p-4">
        <Outlet />
      </main>
      <Toaster />
      <Footer />
    </div>
  );
}

export default Layout;
