import { Outlet } from "react-router-dom";
import { Header } from "../Header";
import { Navbar } from "../Navbar";
import { Sidebar } from "../Sidebar";

export function AppShell() {
  return (
    <div className="flex h-svh overflow-hidden">
      <Sidebar />
      {/* ml-14 = 56px = ancho del sidebar colapsado */}
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden lg:ml-14">
        <Header />
        <Navbar />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
