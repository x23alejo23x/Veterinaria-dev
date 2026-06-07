import { Bell, Command } from "lucide-react";
import { Button } from "../../ui/Button";
import { SearchInput } from "../../ui/SearchInput";
import { userProfile } from "../../../constants";

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex min-h-[76px] items-center justify-between gap-4 border-b border-slate-200/80 bg-slate-50/75 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-7">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-blue-600">
          Centro clinico
        </p>
        <strong className="text-slate-950">{userProfile.clinic}</strong>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden md:block">
          <SearchInput placeholder="Buscar paciente, propietario o cita" />
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 text-sm font-black text-white">
          {userProfile.initials}
        </div>
      </div>
    </header>
  );
}
