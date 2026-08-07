import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
    Users,
    ClipboardList,
    CreditCard,
    WalletCards,
    BarChart3,
    BookOpen,
    RefreshCcw,
    ArrowRight,
    FileText,
} from "lucide-react";

export default function ReportsPage() {

    const [students, setStudents] = useState([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("all");

const loadStudents = async () => {
    try {

        setLoading(true);

        const response = await api.get("/students");

        const payload = response?.data?.data;

        if (Array.isArray(payload)) {

            setStudents(payload);

        } else if (Array.isArray(payload?.data)) {

            // Cas Laravel pagination
            setStudents(payload.data);

        } else {

            setStudents([]);

            console.warn(
                "Format inattendu de la réponse étudiants :",
                response?.data
            );

        }

    } catch (error) {

        console.error(
            "Erreur chargement étudiants :",
            error
        );

        toast.error(
            error?.response?.data?.message ||
            "Impossible de charger les étudiants."
        );

        setStudents([]);

    } finally {

        setLoading(false);

    }
};

    function handleRefresh() {

        setLoading(true);

        setTimeout(() => {

            setLoading(false);

            toast.success(
                "Rapports actualisés."
            );

        }, 500);

    }

    const reports = [

        {
            title: "Rapport des étudiants",
            description:
                "Consultez la liste complète et les informations des étudiants.",
            icon: Users,
            color: "blue",
            path: "/reports/students",
        },

        {
            title: "Rapport des inscriptions",
            description:
                "Analysez l'historique des inscriptions et leur situation.",
            icon: ClipboardList,
            color: "purple",
            path: "/reports/enrollments",
        },

        {
            title: "Rapport des paiements",
            description:
                "Consultez l'historique des paiements enregistrés.",
            icon: CreditCard,
            color: "green",
            path: "/reports/payments",
        },

        {
            title: "Rapport des dépenses",
            description:
                "Suivez les sorties de caisse et les dépenses du centre.",
            icon: WalletCards,
            color: "red",
            path: "/reports/expenses",
        },

        {
            title: "Rapport financier",
            description:
                "Visualisez la situation financière globale du centre.",
            icon: BarChart3,
            color: "orange",
            path: "/reports/financial-summary",
        },

        {
            title: "Livre de caisse",
            description:
                "Consultez toutes les opérations d'entrée et de sortie.",
            icon: BookOpen,
            color: "indigo",
            path: "/reports/cash-book",
        },

    ];

    return (

        <div className="space-y-8">

            {/* =====================================================
                HEADER
            ====================================================== */}

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 p-8 text-white shadow-xl">

                <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

                <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-fuchsia-300/20 blur-3xl" />

                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                    <div className="flex items-start gap-5">

                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur">

                            <FileText size={32} />

                        </div>

                        <div>

                            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-100">

                                <span>
                                    Analyse & statistiques
                                </span>

                                <span className="h-1 w-1 rounded-full bg-white/70" />

                                <span>
                                    Rapports
                                </span>

                            </div>

                            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">

                                Gestion des rapports

                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-50 sm:text-base">

                                Consultez, analysez et exploitez les données
                                administratives et financières de votre centre.

                            </p>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={handleRefresh}
                        disabled={loading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        <RefreshCcw
                            size={18}
                            className={
                                loading
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        {loading
                            ? "Actualisation..."
                            : "Actualiser"
                        }

                    </button>

                </div>

            </div>

            {/* =====================================================
                TITRE
            ====================================================== */}

            <div>

                <h2 className="text-2xl font-bold tracking-tight text-slate-900">

                    Rapports disponibles

                </h2>

                <p className="mt-1 text-sm text-slate-500">

                    Sélectionnez le rapport que vous souhaitez consulter.

                </p>

            </div>

            {/* =====================================================
                CARTES
            ====================================================== */}

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                {reports.map((report) => {

                    const Icon = report.icon;

                    return (

                        <Link
                            key={report.path}
                            to={report.path}
                            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
                        >

                            <div className="flex items-start justify-between">

                                <div
                                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${getColorClasses(report.color)}`}
                                >

                                    <Icon size={27} />

                                </div>

                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition group-hover:bg-blue-50 group-hover:text-blue-600">

                                    <ArrowRight
                                        size={19}
                                        className="transition group-hover:translate-x-0.5"
                                    />

                                </div>

                            </div>

                            <h3 className="mt-6 text-xl font-bold text-slate-900">

                                {report.title}

                            </h3>

                            <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">

                                {report.description}

                            </p>

                            <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-blue-600">

                                Consulter le rapport

                                <ArrowRight
                                    size={16}
                                    className="transition group-hover:translate-x-1"
                                />

                            </div>

                        </Link>

                    );

                })}

            </div>

        </div>

    );

}


/**
 * Couleurs des cartes
 */
function getColorClasses(color) {

    const colors = {

        blue:
            "bg-blue-50 text-blue-600 group-hover:bg-blue-100",

        purple:
            "bg-purple-50 text-purple-600 group-hover:bg-purple-100",

        green:
            "bg-green-50 text-green-600 group-hover:bg-green-100",

        red:
            "bg-red-50 text-red-600 group-hover:bg-red-100",

        orange:
            "bg-orange-50 text-orange-600 group-hover:bg-orange-100",

        indigo:
            "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100",

    };

    return colors[color] || colors.blue;

}