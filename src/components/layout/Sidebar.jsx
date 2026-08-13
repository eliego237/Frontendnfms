import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    ClipboardList,
    Boxes,
    CreditCard,
    Wallet,
    FileBarChart2,
    Settings,
    SlidersHorizontal,
} from "lucide-react";

export default function Sidebar() {

    const linkClass = ({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 ${
            isActive
                ? "bg-blue-600 text-white shadow-lg"
                : "text-slate-300 hover:bg-slate-800 hover:text-white"
        }`;

    return (
        <aside className="flex min-h-screen w-64 flex-col bg-slate-900 text-white">

            {/* Logo */}
            <div className="border-b border-slate-800 px-6 py-8">

                <h1 className="text-3xl font-extrabold tracking-wide">
                    NFMS
                </h1>

                <p className="mt-1 text-sm text-slate-400">
                    Gestion du centre
                </p>

            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-8 overflow-y-auto px-4 py-6">

                {/* Général */}
                <div className="space-y-2">

                    <p className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Général
                    </p>

                    <NavLink
                        to="/"
                        end
                        className={linkClass}
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </NavLink>

                </div>

                {/* Académique */}
                <div className="space-y-2">

                    <p className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Académique
                    </p>

                    <NavLink
                        to="/students"
                        className={linkClass}
                    >
                        <Users size={20} />
                        Étudiants
                    </NavLink>

                    <NavLink
                        to="/trainings"
                        className={linkClass}
                    >
                        <GraduationCap size={20} />
                        Formations
                    </NavLink>

                    <NavLink
                        to="/enrollments"
                        className={linkClass}
                    >
                        <ClipboardList size={20} />
                        Inscriptions
                    </NavLink>

                    <NavLink
                        to="/training-modules"
                        className={linkClass}
                    >
                        <Boxes size={20} />
                        Modules
                    </NavLink>

                </div>

                {/* Finances */}
                <div className="space-y-2">

                    <p className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Finances
                    </p>

                    <NavLink
                        to="/payments"
                        className={linkClass}
                    >
                        <CreditCard size={20} />
                        Paiements
                    </NavLink>

                    <NavLink
                        to="/expenses"
                        className={linkClass}
                    >
                        <Wallet size={20} />
                        Dépenses
                    </NavLink>

                </div>

                {/* Rapports */}
                <div className="space-y-2">

                    <p className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                        Rapports
                    </p>

                    <NavLink
                        to="/reports"
                        className={linkClass}
                    >
                        <FileBarChart2 size={20} />
                        Rapports
                    </NavLink>

                </div>

                {/* Paramètres */}

<div className="space-y-2">

    <p className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Paramètres
    </p>

    <NavLink
        to="/settings/general"
        className={linkClass}
    >
        <SlidersHorizontal size={20} />

        Paramètres généraux
    </NavLink>

    <NavLink
        to="/settings/connection"
        className={linkClass}
    >
        <Settings size={20} />

        Connexion
    </NavLink>

</div>

            </nav>

            {/* Pied */}
            <div className="border-t border-slate-800 p-5">

                <p className="text-center text-xs text-slate-500">
                    NFMS ERP elie go • v1.0
                </p>

            </div>

        </aside>
    );
}