import { Outlet } from "react-router-dom";
import { Header } from "../Header";
import { Navbar } from "../Navbar";
import { Sidebar } from "../Sidebar";

export function AppShell() {
  return (
    <div className="grid min-h-svh lg:grid-cols-[88px_1fr]">
      <Sidebar />
      <main className="min-w-0">
        <Header />
        <Navbar />
        <Outlet />
      </main>
    </div>
  );
}
