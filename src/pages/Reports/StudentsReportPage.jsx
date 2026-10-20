
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
    ArrowLeft,
    RefreshCcw,
    Search,
    Users,
    UserCheck,
    UserX,
    GraduationCap,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import api from "../../services/api";

const PER_PAGE = 20;

export default function StudentsReportPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: PER_PAGE,
        from: 0,
        to: 0,
    });

    const [globalStats, setGlobalStats] = useState({
        total: 0,
        active: 0,
        inactive: 0,
    });

    const loadStudents = useCallback(async (page = 1) => {
        try {
            setLoading(true);

            const response = await api.get("/reports/students", {
                params: {
                    page,
                    per_page: PER_PAGE,
                },
            });

            // Le contrôleur peut envelopper les données dans "data".
            const report =
                response?.data?.data ??
                response?.data ??
                {};

            const paginator = report?.students ?? {};

            // Le paginator Laravel contient les étudiants dans "data".
            const studentsList = Array.isArray(paginator?.data)
                ? paginator.data
                : Array.isArray(paginator)
                    ? paginator
                    : [];

            const total = Number(
                paginator?.total ??
                report?.total_students ??
                studentsList.length
            );

            const lastPage = Number(
                paginator?.last_page ??
                Math.max(1, Math.ceil(total / PER_PAGE))
            );

            const active = Number(
                report?.active_students ?? 0
            );

            const inactive = Number(
                report?.inactive_students ?? 0
            );

            setStudents(studentsList);

            setPagination({
                currentPage: Number(
                    paginator?.current_page ?? page
                ),
                lastPage: Math.max(1, lastPage),
                total,
                perPage: Number(
                    paginator?.per_page ?? PER_PAGE
                ),
                from: Number(paginator?.from ?? (
                    total > 0 ? (page - 1) * PER_PAGE + 1 : 0
                )),
                to: Number(paginator?.to ?? (
                    total > 0
                        ? Math.min(page * PER_PAGE, total)
                        : 0
                )),
            });

            setGlobalStats({
                total,
                active,
                inactive,
            });

            setCurrentPage(Number(
                paginator?.current_page ?? page
            ));
        } catch (error) {
            console.error(
                "Erreur chargement rapport étudiants :",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Impossible de charger le rapport des étudiants."
            );

            setStudents([]);

            setPagination({
                currentPage: 1,
                lastPage: 1,
                total: 0,
                perPage: PER_PAGE,
                from: 0,
                to: 0,
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadStudents(currentPage);
    }, [loadStudents, currentPage]);

    // Si une recherche est saisie, revenir à la première page.
    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter]);

    const filteredStudents = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return students.filter((student) => {
            const studentName = [
                student.first_name,
                student.last_name,
                student.full_name,
                student.name,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const matricule = String(
                student.matricule ?? ""
            ).toLowerCase();

            const phone = String(
                student.phone ?? ""
            ).toLowerCase();

            const email = String(
                student.email ?? ""
            ).toLowerCase();

            const matchesSearch =
                !keyword ||
                studentName.includes(keyword) ||
                matricule.includes(keyword) ||
                phone.includes(keyword) ||
                email.includes(keyword);

            const active = isStudentActive(student);

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && active) ||
                (statusFilter === "inactive" && !active);

            return matchesSearch && matchesStatus;
        });
    }, [students, search, statusFilter]);

    function formatDate(value) {
        if (!value) return "—";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "—";
        }

        return date.toLocaleDateString("fr-FR");
    }

    function getStudentName(student) {
        if (student.full_name) return student.full_name;
        if (student.name) return student.name;

        return [
            student.first_name,
            student.last_name,
        ]
            .filter(Boolean)
            .join(" ") || "Étudiant sans nom";
    }

    function isStudentActive(student) {
        return (
            student.status === true ||
            student.status === 1 ||
            student.status === "1" ||
            student.status === "active" ||
            student.status === "Actif"
        );
    }

    function goToPage(page) {
        if (
            page < 1 ||
            page > pagination.lastPage ||
            page === currentPage
        ) {
            return;
        }

        setCurrentPage(page);
    }

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
                    <p className="font-medium text-slate-600">
                        Chargement du rapport des étudiants...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* EN-TÊTE */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 p-8 text-white shadow-xl">
                <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-purple-300/10 blur-3xl" />

                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-5">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
                            <Users size={32} />
                        </div>

                        <div>
                            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-100">
                                <span>Analyse & statistiques</span>
                                <span>•</span>
                                <span>Rapports</span>
                            </div>

                            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                                Rapport des étudiants
                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-50 sm:text-base">
                                Consultez la liste et les informations administratives des étudiants du centre.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <Link
                            to="/reports"
                            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-semibold text-white transition hover:bg-white/20"
                        >
                            <ArrowLeft size={18} />
                            Retour
                        </Link>

                        <button
                            type="button"
                            onClick={() => loadStudents(currentPage)}
                            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100"
                        >
                            <RefreshCcw size={18} />
                            Actualiser
                        </button>
                    </div>
                </div>
            </div>

            {/* STATISTIQUES GLOBALES */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <ReportStatCard
                    title="Total étudiants"
                    value={globalStats.total}
                    icon={<Users size={22} />}
                    color="blue"
                    description="Total des étudiants enregistrés"
                />

                <ReportStatCard
                    title="Étudiants actifs"
                    value={globalStats.active}
                    icon={<UserCheck size={22} />}
                    color="green"
                    description="Étudiants actuellement actifs"
                />

                <ReportStatCard
                    title="Étudiants inactifs"
                    value={globalStats.inactive}
                    icon={<UserX size={22} />}
                    color="orange"
                    description="Étudiants inactifs"
                />
            </div>

            {/* RECHERCHE ET FILTRES */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Search size={20} />
                    </div>

                    <div>
                        <h2 className="font-bold text-slate-900">
                            Recherche & filtres
                        </h2>
                        <p className="text-sm text-slate-500">
                            Retrouvez rapidement un étudiant sur la page chargée.
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
                    <div className="relative">
                        <Search
                            size={19}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Nom, matricule, téléphone ou email..."
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value)
                        }
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    >
                        <option value="all">Tous les statuts</option>
                        <option value="active">Actifs</option>
                        <option value="inactive">Inactifs</option>
                    </select>
                </div>
            </div>

            {/* TABLEAU */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <GraduationCap size={20} />
                        </div>

                        <div>
                            <h2 className="font-bold text-slate-900">
                                Liste des étudiants
                            </h2>
                            <p className="text-sm text-slate-500">
                                Consultez les étudiants page par page.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                        {filteredStudents.length} affiché(s) sur cette page
                    </div>
                </div>

                {filteredStudents.length === 0 ? (
                    <div className="flex min-h-[240px] flex-col items-center justify-center px-6 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                            <Users size={27} />
                        </div>

                        <h3 className="font-bold text-slate-800">
                            Aucun étudiant trouvé
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Aucun étudiant de cette page ne correspond à la recherche.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/80">
                                    {[
                                        "Étudiant",
                                        "Matricule",
                                        "Téléphone",
                                        "Email",
                                        "Date naissance",
                                        "Statut",
                                        "Action",
                                    ].map((heading) => (
                                        <th
                                            key={heading}
                                            className={`px-6 py-4 text-xs font-bold uppercase tracking-wide text-slate-500 ${
                                                heading === "Action"
                                                    ? "text-right"
                                                    : "text-left"
                                            }`}
                                        >
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {filteredStudents.map((student) => {
                                    const active = isStudentActive(student);

                                    return (
                                        <tr
                                            key={student.id}
                                            className="group transition hover:bg-slate-50"
                                        >
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
                                                        {(
                                                            student.first_name?.[0] ||
                                                            student.last_name?.[0] ||
                                                            getStudentName(student)[0] ||
                                                            "E"
                                                        ).toUpperCase()}
                                                    </div>

                                                    <div>
                                                        <p className="font-semibold text-slate-900">
                                                            {getStudentName(student)}
                                                        </p>

                                                        {student.gender && (
                                                            <p className="mt-0.5 text-xs text-slate-400">
                                                                {student.gender === "M"
                                                                    ? "Masculin"
                                                                    : student.gender === "F"
                                                                        ? "Féminin"
                                                                        : student.gender}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-5">
                                                <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
                                                    {student.matricule || "—"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5 text-sm text-slate-600">
                                                {student.phone || "—"}
                                            </td>

                                            <td className="px-6 py-5 text-sm text-slate-600">
                                                {student.email || "—"}
                                            </td>

                                            <td className="px-6 py-5 text-sm text-slate-600">
                                                {formatDate(student.birth_date)}
                                            </td>

                                            <td className="px-6 py-5">
                                                <span
                                                    className={
                                                        active
                                                            ? "inline-flex rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700"
                                                            : "inline-flex rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-700"
                                                    }
                                                >
                                                    {active ? "Actif" : "Inactif"}
                                                </span>
                                            </td>

                                            <td className="px-6 py-5 text-right">
                                                <Link
                                                    to={`/students/${student.id}`}
                                                    className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
                                                >
                                                    Voir <span>→</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* PAGINATION */}
                <div className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/70 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-600">
                        Affichage de{" "}
                        <span className="font-bold text-slate-900">
                            {pagination.from}
                        </span>{" "}
                        à{" "}
                        <span className="font-bold text-slate-900">
                            {pagination.to}
                        </span>{" "}
                        sur{" "}
                        <span className="font-bold text-slate-900">
                            {pagination.total}
                        </span>{" "}
                        étudiant(s)
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft size={17} />
                            Précédent
                        </button>

                        <span className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white">
                            {currentPage} / {pagination.lastPage}
                        </span>

                        <button
                            type="button"
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage >= pagination.lastPage}
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Suivant
                            <ChevronRight size={17} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function isStudentActive(student) {
    return (
        student.status === true ||
        student.status === 1 ||
        student.status === "1" ||
        student.status === "active" ||
        student.status === "Actif"
    );
}

function ReportStatCard({
    title,
    value,
    icon,
    color,
    description,
}) {
    const colors = {
        blue: {
            wrapper: "border-blue-100 bg-gradient-to-br from-blue-50 to-white",
            icon: "bg-blue-100 text-blue-600",
            title: "text-blue-600",
            value: "text-blue-700",
        },
        green: {
            wrapper: "border-green-100 bg-gradient-to-br from-green-50 to-white",
            icon: "bg-green-100 text-green-600",
            title: "text-green-600",
            value: "text-green-700",
        },
        orange: {
            wrapper: "border-orange-100 bg-gradient-to-br from-orange-50 to-white",
            icon: "bg-orange-100 text-orange-600",
            title: "text-orange-600",
            value: "text-orange-700",
        },
    };

    const theme = colors[color] || colors.blue;

    return (
        <div className={`rounded-3xl border p-6 shadow-sm ${theme.wrapper}`}>
            <div className="flex items-start justify-between">
                <div>
                    <p className={`text-sm font-semibold ${theme.title}`}>
                        {title}
                    </p>

                    <p className={`mt-3 text-3xl font-extrabold tracking-tight ${theme.value}`}>
                        {value}
                    </p>
                </div>

                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${theme.icon}`}>
                    {icon}
                </div>
            </div>

            <p className="mt-4 text-xs font-medium text-slate-500">
                {description}
            </p>
        </div>
    );
}
