import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
    ArrowLeft,
    RefreshCcw,
    Search,
    ClipboardList,
    Clock3,
    CircleDollarSign,
    CheckCircle2,
} from "lucide-react";

import api from "../../services/api";

export default function EnrollmentsReportPage() {

    const [enrollments, setEnrollments] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("all");

    const [trainingFilter, setTrainingFilter] = useState("all");

    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        partial: 0,
        paid: 0,
        totalAmount: 0,
        totalPaid: 0,
        totalBalance: 0,
    });

    /*
    |--------------------------------------------------------------------------
    | Chargement du rapport
    |--------------------------------------------------------------------------
    */

    const loadEnrollments = useCallback(async () => {

        try {

            setLoading(true);

            const response = await api.get("/reports/enrollments");

            console.log("========== RAPPORT INSCRIPTIONS ==========");
            console.log("1️⃣ response :", response);
            console.log("2️⃣ response.data :", response?.data);
            console.log(
                "3️⃣ response.data.data :",
                response?.data?.data
            );

            const report = response?.data?.data ?? {};

            const paginator = report?.enrollments;

            const list = Array.isArray(paginator?.data)
                ? paginator.data
                : [];

            console.log(
                "4️⃣ enrollments.data :",
                paginator?.data
            );

            console.log(
                "5️⃣ TABLEAU FINAL :",
                list
            );

            console.log(
                "6️⃣ NOMBRE FINAL :",
                list.length
            );

            setEnrollments(list);

            setStats({
                total: Number(report?.total_enrollments ?? 0),
                pending: Number(report?.pending ?? 0),
                partial: Number(report?.partial ?? 0),
                paid: Number(report?.paid ?? 0),
                totalAmount: Number(report?.total_amount ?? 0),
                totalPaid: Number(report?.total_paid ?? 0),
                totalBalance: Number(report?.total_balance ?? 0),
            });

        } catch (error) {

            console.error(
                "Erreur chargement rapport inscriptions :",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Impossible de charger le rapport des inscriptions."
            );

            setEnrollments([]);

        } finally {

            setLoading(false);

        }

    }, []);

    useEffect(() => {

        loadEnrollments();

    }, [loadEnrollments]);

    /*
    |--------------------------------------------------------------------------
    | Formations disponibles
    |--------------------------------------------------------------------------
    */

    const trainings = useMemo(() => {

        const map = new Map();

        enrollments.forEach((enrollment) => {

            const training = enrollment?.training;

            if (training?.id) {

                map.set(
                    training.id,
                    training.title || "Formation sans nom"
                );

            }

        });

        return Array.from(map.entries());

    }, [enrollments]);

    /*
    |--------------------------------------------------------------------------
    | Recherche + filtres
    |--------------------------------------------------------------------------
    */

    const filteredEnrollments = useMemo(() => {

        const keyword = search.trim().toLowerCase();

        return enrollments.filter((enrollment) => {

            const student = enrollment?.student;

            const training = enrollment?.training;

            const studentName = [
                student?.first_name,
                student?.last_name,
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const enrollmentNumber =
                enrollment?.enrollment_number
                    ?.toLowerCase() || "";

            const matricule =
                student?.matricule
                    ?.toLowerCase() || "";

            const trainingTitle =
                training?.title
                    ?.toLowerCase() || "";

            const matchesSearch =
                !keyword ||
                enrollmentNumber.includes(keyword) ||
                studentName.includes(keyword) ||
                matricule.includes(keyword) ||
                trainingTitle.includes(keyword);

            const matchesStatus =
                statusFilter === "all" ||
                enrollment?.status === statusFilter;

            const matchesTraining =
                trainingFilter === "all" ||
                String(training?.id) === String(trainingFilter);

            return (
                matchesSearch &&
                matchesStatus &&
                matchesTraining
            );

        });

    }, [
        enrollments,
        search,
        statusFilter,
        trainingFilter,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Format monétaire
    |--------------------------------------------------------------------------
    */

    function formatMoney(value) {

        const amount = Number(value ?? 0);

        return new Intl.NumberFormat("fr-FR", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount) + " FCFA";

    }

    /*
    |--------------------------------------------------------------------------
    | Format date
    |--------------------------------------------------------------------------
    */

    function formatDate(value) {

        if (!value) {
            return "—";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "—";
        }

        return date.toLocaleDateString("fr-FR");

    }

    /*
    |--------------------------------------------------------------------------
    | Nom étudiant
    |--------------------------------------------------------------------------
    */

    function getStudentName(enrollment) {

        const student = enrollment?.student;

        if (!student) {
            return "Étudiant inconnu";
        }

        if (student.full_name) {
            return student.full_name;
        }

        if (student.name) {
            return student.name;
        }

        return [
            student.first_name,
            student.last_name,
        ]
            .filter(Boolean)
            .join(" ") || "Étudiant sans nom";

    }

    /*
    |--------------------------------------------------------------------------
    | Statut
    |--------------------------------------------------------------------------
    */

    function getStatusLabel(status) {

        switch (status) {

            case "pending":
                return "En attente";

            case "partial":
                return "Partiel";

            case "paid":
                return "Payé";

            case "cancelled":
                return "Annulé";

            default:
                return status || "—";

        }

    }

    function getStatusClasses(status) {

        switch (status) {

            case "pending":
                return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";

            case "partial":
                return "bg-blue-50 text-blue-700 ring-1 ring-blue-200";

            case "paid":
                return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";

            case "cancelled":
                return "bg-red-50 text-red-700 ring-1 ring-red-200";

            default:
                return "bg-slate-50 text-slate-600 ring-1 ring-slate-200";

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Chargement
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="flex min-h-[60vh] items-center justify-center">

                <div className="text-center">

                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                    <p className="font-medium text-slate-600">
                        Chargement du rapport des inscriptions...
                    </p>

                </div>

            </div>

        );

    }

    return (

        <div className="space-y-8">

            {/* =====================================================
                HEADER
            ====================================================== */}

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 p-8 text-white shadow-xl">

                <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

                <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-purple-300/10 blur-3xl" />

                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                    <div className="flex items-start gap-5">

                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">

                            <ClipboardList size={32} />

                        </div>

                        <div>

                            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-blue-100">

                                <span>
                                    Analyse & statistiques
                                </span>

                                <span>•</span>

                                <span>
                                    Rapports
                                </span>

                            </div>

                            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">

                                Rapport des inscriptions

                            </h1>

                            <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-50 sm:text-base">

                                Analysez l'historique des inscriptions,
                                leur situation financière et leur statut.

                            </p>

                        </div>

                    </div>

                    <div className="flex flex-wrap gap-3">

                        <Link
                            to="/reports"
                            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20"
                        >

                            <ArrowLeft size={18} />

                            Retour

                        </Link>

                        <button
                            type="button"
                            onClick={loadEnrollments}
                            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-slate-900 shadow-lg transition hover:bg-slate-50"
                        >

                            <RefreshCcw size={18} />

                            Actualiser

                        </button>

                    </div>

                </div>

            </div>

            {/* =====================================================
                STATISTIQUES
            ====================================================== */}

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">

                    <div className="flex items-start justify-between">

                        <div>

                            <p className="text-sm font-semibold text-blue-600">
                                Total inscriptions
                            </p>

                            <p className="mt-3 text-3xl font-extrabold text-blue-700">
                                {stats.total}
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                                Inscriptions enregistrées
                            </p>

                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">

                            <ClipboardList size={22} />

                        </div>

                    </div>

                </div>

                <div className="rounded-3xl border border-amber-100 bg-white p-6 shadow-sm">

                    <div className="flex items-start justify-between">

                        <div>

                            <p className="text-sm font-semibold text-amber-600">
                                En attente
                            </p>

                            <p className="mt-3 text-3xl font-extrabold text-amber-700">
                                {stats.pending}
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                                Paiements non commencés
                            </p>

                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">

                            <Clock3 size={22} />

                        </div>

                    </div>

                </div>

                <div className="rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">

                    <div className="flex items-start justify-between">

                        <div>

                            <p className="text-sm font-semibold text-blue-600">
                                Paiements partiels
                            </p>

                            <p className="mt-3 text-3xl font-extrabold text-blue-700">
                                {stats.partial}
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                                Soldes encore ouverts
                            </p>

                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">

                            <CircleDollarSign size={22} />

                        </div>

                    </div>

                </div>

                <div className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm">

                    <div className="flex items-start justify-between">

                        <div>

                            <p className="text-sm font-semibold text-emerald-600">
                                Entièrement payées
                            </p>

                            <p className="mt-3 text-3xl font-extrabold text-emerald-700">
                                {stats.paid}
                            </p>

                            <p className="mt-2 text-sm text-slate-500">
                                Inscriptions soldées
                            </p>

                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">

                            <CheckCircle2 size={22} />

                        </div>

                    </div>

                </div>

            </div>

            {/* =====================================================
                FINANCES
            ====================================================== */}

            <div className="grid gap-5 md:grid-cols-3">

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                    <p className="text-sm font-semibold text-slate-500">
                        Montant total
                    </p>

                    <p className="mt-2 text-2xl font-extrabold text-slate-900">
                        {formatMoney(stats.totalAmount)}
                    </p>

                </div>

                <div className="rounded-3xl border border-emerald-100 bg-emerald-50/40 p-6 shadow-sm">

                    <p className="text-sm font-semibold text-emerald-600">
                        Total encaissé
                    </p>

                    <p className="mt-2 text-2xl font-extrabold text-emerald-700">
                        {formatMoney(stats.totalPaid)}
                    </p>

                </div>

                <div className="rounded-3xl border border-orange-100 bg-orange-50/40 p-6 shadow-sm">

                    <p className="text-sm font-semibold text-orange-600">
                        Solde restant
                    </p>

                    <p className="mt-2 text-2xl font-extrabold text-orange-700">
                        {formatMoney(stats.totalBalance)}
                    </p>

                </div>

            </div>

            {/* =====================================================
                RECHERCHE & FILTRES
            ====================================================== */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-5 flex items-center gap-4">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">

                        <Search size={21} />

                    </div>

                    <div>

                        <h2 className="font-bold text-slate-900">
                            Recherche & filtres
                        </h2>

                        <p className="text-sm text-slate-500">
                            Retrouvez rapidement une inscription.
                        </p>

                    </div>

                </div>

                <div className="grid gap-4 lg:grid-cols-3">

                    <div className="relative lg:col-span-1">

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
                            placeholder="N° inscription, étudiant, matricule..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />

                    </div>

                    <select
                        value={statusFilter}
                        onChange={(event) =>
                            setStatusFilter(event.target.value)
                        }
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    >

                        <option value="all">
                            Tous les statuts
                        </option>

                        <option value="pending">
                            En attente
                        </option>

                        <option value="partial">
                            Partiel
                        </option>

                        <option value="paid">
                            Payé
                        </option>

                        <option value="cancelled">
                            Annulé
                        </option>

                    </select>

                    <select
                        value={trainingFilter}
                        onChange={(event) =>
                            setTrainingFilter(event.target.value)
                        }
                        className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    >

                        <option value="all">
                            Toutes les formations
                        </option>

                        {trainings.map(([id, title]) => (

                            <option
                                key={id}
                                value={id}
                            >
                                {title}
                            </option>

                        ))}

                    </select>

                </div>

            </div>

            {/* =====================================================
                TABLEAU
            ====================================================== */}

            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

                    <div>

                        <h2 className="font-bold text-slate-900">
                            Liste des inscriptions
                        </h2>

                        <p className="text-sm text-slate-500">
                            Inscriptions correspondant aux critères sélectionnés.
                        </p>

                    </div>

                    <div className="rounded-xl bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">

                        {filteredEnrollments.length} inscription
                        {filteredEnrollments.length > 1 ? "s" : ""}

                    </div>

                </div>

                {filteredEnrollments.length === 0 ? (

                    <div className="flex min-h-[250px] items-center justify-center px-6">

                        <div className="text-center">

                            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">

                                <ClipboardList size={28} />

                            </div>

                            <p className="font-semibold text-slate-700">
                                Aucune inscription trouvée
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                Aucune inscription ne correspond aux critères sélectionnés.
                            </p>

                        </div>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="min-w-[1100px] w-full">

                            <thead className="bg-slate-50">

                                <tr className="border-b border-slate-200 text-left text-xs font-bold uppercase tracking-wide text-slate-500">

                                    <th className="px-6 py-4">
                                        Inscription
                                    </th>

                                    <th className="px-6 py-4">
                                        Étudiant
                                    </th>

                                    <th className="px-6 py-4">
                                        Formation
                                    </th>

                                    <th className="px-6 py-4">
                                        Date
                                    </th>

                                    <th className="px-6 py-4 text-right">
                                        Total
                                    </th>

                                    <th className="px-6 py-4 text-right">
                                        Payé
                                    </th>

                                    <th className="px-6 py-4 text-right">
                                        Solde
                                    </th>

                                    <th className="px-6 py-4">
                                        Statut
                                    </th>

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-slate-100">

                                {filteredEnrollments.map((enrollment) => (

                                    <tr
                                        key={enrollment.id}
                                        className="transition hover:bg-slate-50"
                                    >

                                        <td className="px-6 py-5">

                                            <p className="font-bold text-slate-900">
                                                {enrollment.enrollment_number || "—"}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-500">
                                                {enrollment.academic_year || "—"}
                                            </p>

                                        </td>

                                        <td className="px-6 py-5">

                                            <p className="font-semibold text-slate-900">
                                                {getStudentName(enrollment)}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-500">
                                                {enrollment?.student?.matricule || "—"}
                                            </p>

                                        </td>

                                        <td className="px-6 py-5">

                                            <p className="font-semibold text-slate-900">
                                                {enrollment?.training?.title || "—"}
                                            </p>

                                            <p className="mt-1 text-xs text-slate-500">
                                                {enrollment?.training?.code || "—"}
                                            </p>

                                        </td>

                                        <td className="whitespace-nowrap px-6 py-5 text-sm text-slate-600">

                                            {formatDate(enrollment.enrolled_at)}

                                        </td>

                                        <td className="whitespace-nowrap px-6 py-5 text-right font-semibold text-slate-900">

                                            {formatMoney(enrollment.total_amount)}

                                        </td>

                                        <td className="whitespace-nowrap px-6 py-5 text-right font-semibold text-emerald-600">

                                            {formatMoney(enrollment.amount_paid)}

                                        </td>

                                        <td className="whitespace-nowrap px-6 py-5 text-right font-semibold text-orange-600">

                                            {formatMoney(enrollment.balance)}

                                        </td>

                                        <td className="px-6 py-5">

                                            <span
                                                className={`inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ${getStatusClasses(enrollment.status)}`}
                                            >

                                                {getStatusLabel(enrollment.status)}

                                            </span>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

}