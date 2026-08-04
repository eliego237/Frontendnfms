import { useEffect, useMemo, useState, useCallback } from "react";
import { Link } from "react-router-dom";

import api from "../../services/api";

import Swal from "sweetalert2";
import toast from "react-hot-toast";
import {
    money,
    formatDate,
    isToday,
    isThisWeek,
    isThisMonth,
    badgeColor,
} from "./utils/paymentHelpers";

import {
    Plus,
    Search,
    Wallet,
    CalendarDays,
    Receipt,
    TrendingUp,
    Eye,
    Pencil,
    Printer,
    Trash2,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    RefreshCcw,
    Filter,
} from "lucide-react";

export default function PaymentsPage() {

    /* ============================================================
       ETATS
    ============================================================ */

    const [payments, setPayments] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [methodFilter, setMethodFilter] = useState("all");

    const [periodFilter, setPeriodFilter] = useState("all");

    const [currentPage, setCurrentPage] = useState(1);

    const ITEMS_PER_PAGE = 10;

    /* ============================================================
       CHARGEMENT
    ============================================================ */

    const loadPayments = useCallback(async () => {

        try {

            setLoading(true);

            const response = await api.get("/payments");

            setPayments(response?.data?.data ?? []);
             
            console.log(response.data.data);

        } catch (error) {

            console.error(error);

            toast.error(

                error?.response?.data?.message ||

                "Impossible de charger les paiements."

            );

        } finally {

            setLoading(false);

        }

    }, []);

    useEffect(() => {

        loadPayments();

    }, [loadPayments]);

    /* ============================================================
       SUPPRESSION
    ============================================================ */

    async function handleDelete(id) {

        const result = await Swal.fire({

            title: "Supprimer ce paiement ?",

            text: "Cette action est irréversible.",

            icon: "warning",

            showCancelButton: true,

            confirmButtonText: "Supprimer",

            cancelButtonText: "Annuler",

            confirmButtonColor: "#dc2626",

            cancelButtonColor: "#64748b",

        });

        if (!result.isConfirmed) return;

        try {

            await api.delete(`/payments/${id}`);

            setPayments((previous) =>

                previous.filter((payment) => payment.id !== id)

            );

            toast.success("Paiement supprimé avec succès.");

        } catch (error) {

            console.error(error);

            toast.error(

                error?.response?.data?.message ||

                "Impossible de supprimer ce paiement."

            );

        }

    }

        /* ============================================================
       FILTRES
    ============================================================ */
    console.log(payments); 

    const filteredPayments = useMemo(() => {

        const keyword = search.trim().toLowerCase();

        return payments.filter((payment) => {

            const student =
                payment.enrollment?.student?.full_name?.toLowerCase() || "";

            const matricule =
                payment.enrollment?.student?.matricule?.toLowerCase() || "";

            const receipt =
                payment.receipt_number?.toLowerCase() || "";

            const reference =
                payment.reference?.toLowerCase() || "";

            const method =
                payment.payment_method?.name || "";

            const matchesSearch =

                student.includes(keyword) ||

                matricule.includes(keyword) ||

                receipt.includes(keyword) ||

                reference.includes(keyword);

            const matchesMethod =

                methodFilter === "all" ||

                method === methodFilter;

            let matchesPeriod = true;

            switch (periodFilter) {

                case "today":
                    matchesPeriod = isToday(payment.payment_date);
                    break;

                case "week":
                    matchesPeriod = isThisWeek(payment.payment_date);
                    break;

                case "month":
                    matchesPeriod = isThisMonth(payment.payment_date);
                    break;

                default:
                    matchesPeriod = true;
            }

            return (

                matchesSearch &&

                matchesMethod &&

                matchesPeriod

            );

        });

    }, [

        payments,

        search,

        methodFilter,

        periodFilter,

    ]);

    /* ============================================================
       STATISTIQUES
    ============================================================ */

    const totalAmount = useMemo(() => {

        return filteredPayments.reduce(

            (sum, payment) =>

                sum + Number(payment.amount || 0),

            0

        );

    }, [filteredPayments]);

    const todayAmount = useMemo(() => {

        return payments

            .filter((payment) => isToday(payment.payment_date))

            .reduce(

                (sum, payment) =>

                    sum + Number(payment.amount || 0),

                0

            );

    }, [payments]);

    const monthAmount = useMemo(() => {

        return payments

            .filter((payment) => isThisMonth(payment.payment_date))

            .reduce(

                (sum, payment) =>

                    sum + Number(payment.amount || 0),

                0

            );

    }, [payments]);

    const averagePayment = useMemo(() => {

        if (!filteredPayments.length) return 0;

        return totalAmount / filteredPayments.length;

    }, [

        filteredPayments,

        totalAmount,

    ]);

    const uniqueMethods = useMemo(() => {

        return [

            ...new Set(

                payments

                    .map(

                        (payment) =>

                            payment.payment_method?.name

                    )

                    .filter(Boolean)

            ),

        ];

    }, [payments]);

    /* ============================================================
       PAGINATION
    ============================================================ */

    useEffect(() => {

        setCurrentPage(1);

    }, [

        search,

        methodFilter,

        periodFilter,

    ]);

    const totalPages = Math.max(

        1,

        Math.ceil(

            filteredPayments.length /

            ITEMS_PER_PAGE

        )

    );

    const startIndex =

        (currentPage - 1) *

        ITEMS_PER_PAGE;

    const endIndex =

        startIndex +

        ITEMS_PER_PAGE;

    const paginatedPayments =

        filteredPayments.slice(

            startIndex,

            endIndex

        );

    /* ============================================================
       LOADING
    ============================================================ */

    if (loading) {

        return (

            <div className="flex h-[75vh] items-center justify-center">

                <div className="rounded-3xl bg-white p-10 shadow-xl">

                    <div className="flex items-center gap-5">

                        <CreditCard

                            size={42}

                            className="animate-pulse text-blue-600"

                        />

                        <div>

                            <h2 className="text-xl font-bold text-slate-800">

                                Chargement des paiements...

                            </h2>

                            <p className="mt-1 text-slate-500">

                                Veuillez patienter quelques instants.

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        );

    }

    /* ============================================================
       RENDER
    ============================================================ */

    return (

        <div className="space-y-8">

                    {/* ============================================================
                HEADER
            ============================================================ */}

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                <div>

                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">

                        Gestion des paiements

                    </h1>

                    <p className="mt-2 max-w-2xl text-slate-500">

                        Consultez, recherchez, filtrez et gérez tous les
                        paiements enregistrés dans votre établissement.

                    </p>

                </div>

                <div className="flex flex-wrap gap-3">

                    <button
                        onClick={loadPayments}
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                    >

                        <RefreshCcw size={18} />

                        Actualiser

                    </button>

                    <Link
                        to="/payments/create"
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700"
                    >

                        <Plus size={20} />

                        Nouveau paiement

                    </Link>

                </div>

            </div>

            {/* ============================================================
                TABLEAU DE BORD
            ============================================================ */}

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

                <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm font-medium text-blue-600">

                                Total encaissé

                            </p>

                            <h2 className="mt-3 text-3xl font-bold text-blue-700">

                                {money(totalAmount)}

                            </h2>

                        </div>

                        <div className="rounded-2xl bg-blue-100 p-4">

                            <Wallet
                                size={32}
                                className="text-blue-700"
                            />

                        </div>

                    </div>

                </div>

                <div className="rounded-3xl border border-green-100 bg-gradient-to-br from-green-50 to-white p-6 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm font-medium text-green-600">

                                Aujourd'hui

                            </p>

                            <h2 className="mt-3 text-3xl font-bold text-green-700">

                                {money(todayAmount)}

                            </h2>

                        </div>

                        <div className="rounded-2xl bg-green-100 p-4">

                            <CalendarDays
                                size={32}
                                className="text-green-700"
                            />

                        </div>

                    </div>

                </div>

                <div className="rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-6 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm font-medium text-purple-600">

                                Ce mois

                            </p>

                            <h2 className="mt-3 text-3xl font-bold text-purple-700">

                                {money(monthAmount)}

                            </h2>

                        </div>

                        <div className="rounded-2xl bg-purple-100 p-4">

                            <TrendingUp
                                size={32}
                                className="text-purple-700"
                            />

                        </div>

                    </div>

                </div>

                <div className="rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 to-white p-6 shadow-sm">

                    <div className="flex items-center justify-between">

                        <div>

                            <p className="text-sm font-medium text-orange-600">

                                Paiement moyen

                            </p>

                            <h2 className="mt-3 text-3xl font-bold text-orange-700">

                                {money(averagePayment)}

                            </h2>

                        </div>

                        <div className="rounded-2xl bg-orange-100 p-4">

                            <Receipt
                                size={32}
                                className="text-orange-700"
                            />

                        </div>

                    </div>

                </div>

            </div>

            {/* ============================================================
                FILTRES
            ============================================================ */}

            <div className="rounded-3xl bg-white p-6 shadow-sm">

                <div className="mb-5 flex items-center gap-2">

                    <Filter
                        size={18}
                        className="text-blue-600"
                    />

                    <h2 className="font-bold text-slate-700">

                        Recherche & filtres

                    </h2>

                </div>

                <div className="grid gap-4 lg:grid-cols-3">

                    <div className="relative">

                        <Search
                            size={18}
                            className="absolute left-4 top-4 text-gray-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Étudiant, matricule, reçu ou référence..."
                            className="w-full rounded-xl border border-gray-300 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                        />

                    </div>

                    <select
                        value={methodFilter}
                        onChange={(e) => setMethodFilter(e.target.value)}
                        className="rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >

                        <option value="all">

                            Toutes les méthodes

                        </option>

                        {uniqueMethods.map((method) => (

                            <option
                                key={method}
                                value={method}
                            >

                                {method}

                            </option>

                        ))}

                    </select>

                    <select
                        value={periodFilter}
                        onChange={(e) => setPeriodFilter(e.target.value)}
                        className="rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    >

                        <option value="all">

                            Toutes les périodes

                        </option>

                        <option value="today">

                            Aujourd'hui

                        </option>

                        <option value="week">

                            Cette semaine

                        </option>

                        <option value="month">

                            Ce mois

                        </option>

                    </select>

                </div>

            </div>

                        {/* ============================================================
                TABLEAU DES PAIEMENTS
            ============================================================ */}

            <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-200">

                <div className="overflow-x-auto">

                    <table className="min-w-full">

                        <thead className="bg-slate-100">

                            <tr className="text-left text-sm font-semibold uppercase tracking-wide text-slate-600">

                                <th className="px-6 py-4">
                                    Reçu
                                </th>

                                <th className="px-6 py-4">
                                    Étudiant
                                </th>

                                <th className="px-6 py-4">
                                    Formation
                                </th>

                                <th className="px-6 py-4 text-right">
                                    Montant
                                </th>

                                <th className="px-6 py-4">
                                    Méthode
                                </th>

                                <th className="px-6 py-4">
                                    Date
                                </th>

                                <th className="px-6 py-4 text-center">
                                    Actions
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {paginatedPayments.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={7}
                                        className="py-20 text-center"
                                    >

                                        <CreditCard
                                            size={42}
                                            className="mx-auto mb-4 text-slate-300"
                                        />

                                        <p className="text-lg font-semibold text-slate-600">

                                            Aucun paiement trouvé

                                        </p>

                                        <p className="mt-2 text-sm text-slate-400">

                                            Essayez de modifier les filtres ou créez un nouveau paiement.

                                        </p>

                                    </td>

                                </tr>

                            ) : (

                                paginatedPayments.map((payment) => (

                                    <tr
                                        key={payment.id}
                                        className="border-b transition hover:bg-blue-50/40"
                                    >

                                        {/* RECU */}

                                        <td className="px-6 py-5">

                                            <span className="font-bold text-blue-600">

                                                {payment.receipt_number}

                                            </span>

                                        </td>

                                        {/* ETUDIANT */}

                                        <td className="px-6 py-5">

                                            <div className="font-semibold text-slate-800">

                                                {payment.enrollment?.student?.full_name}

                                            </div>

                                            <div className="mt-1 text-sm text-slate-500">

                                                {payment.enrollment?.student?.matricule}

                                            </div>

                                        </td>

                                        {/* FORMATION */}

                                        <td className="px-6 py-5">

                                            <div className="font-medium text-slate-700">

                                                {payment.enrollment?.training?.title || "-"}

                                            </div>

                                        </td>

                                        {/* MONTANT */}

                                        <td className="px-6 py-5 text-right">

                                            <span className="text-lg font-bold text-green-600">

                                                {money(payment.amount)}

                                            </span>

                                        </td>

                                        {/* METHODE */}

                                        <td className="px-6 py-5">

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeColor(
                                                    payment.payment_method?.name
                                                )}`}
                                            >

                                                {payment.payment_method?.name || "-"}

                                            </span>

                                        </td>

                                        {/* DATE */}

                                        <td className="px-6 py-5">

                                            <span className="text-slate-600">

                                                <>
                                             <div>{payment.payment_date}</div>
    
                                                </>

                                            </span>

                                        </td>

                                        {/* ACTIONS */}

                                        <td className="px-6 py-5">

                                            <div className="flex justify-center gap-2">

                                                <Link
                                                    to={`/payments/${payment.id}`}
                                                    className="rounded-xl bg-blue-100 p-2 text-blue-600 transition hover:bg-blue-200 hover:scale-105"
                                                    title="Voir"
                                                >

                                                    <Eye size={18} />

                                                </Link>

                                                <Link
                                                    to={`/payments/${payment.id}/edit`}
                                                    className="rounded-xl bg-amber-100 p-2 text-amber-600 transition hover:bg-amber-200 hover:scale-105"
                                                    title="Modifier"
                                                >

                                                    <Pencil size={18} />

                                                </Link>

                                                <a
                                                    href={`${api.defaults.baseURL}/payments/${payment.id}/receipt`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="rounded-xl bg-green-100 p-2 text-green-600 transition hover:bg-green-200 hover:scale-105"
                                                    title="Imprimer le reçu"
                                                >

                                                    <Printer size={18} />

                                                </a>

                                                <button
                                                    onClick={() => handleDelete(payment.id)}
                                                    className="rounded-xl bg-red-100 p-2 text-red-600 transition hover:bg-red-200 hover:scale-105"
                                                    title="Supprimer"
                                                >

                                                    <Trash2 size={18} />

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

                                {/* ============================================================
                    PAGINATION
                ============================================================ */}

                <div className="flex flex-col gap-4 border-t bg-slate-50 px-6 py-5 md:flex-row md:items-center md:justify-between">

                    <div className="text-sm text-slate-600">

                        Affichage de

                        <span className="mx-1 font-semibold">

                            {filteredPayments.length === 0
                                ? 0
                                : startIndex + 1}

                        </span>

                        à

                        <span className="mx-1 font-semibold">

                            {Math.min(
                                endIndex,
                                filteredPayments.length
                            )}

                        </span>

                        sur

                        <span className="mx-1 font-semibold">

                            {filteredPayments.length}

                        </span>

                        paiement(s)

                    </div>

                    <div className="flex items-center gap-3">

                        <button
                            onClick={() =>
                                setCurrentPage((page) =>
                                    Math.max(page - 1, 1)
                                )
                            }
                            disabled={currentPage === 1}
                            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >

                            <ChevronLeft size={18} />

                            Précédent

                        </button>

                        <div className="rounded-xl bg-blue-600 px-5 py-2 font-bold text-white shadow">

                            {currentPage} / {totalPages}

                        </div>

                        <button
                            onClick={() =>
                                setCurrentPage((page) =>
                                    Math.min(page + 1, totalPages)
                                )
                            }
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                        >

                            Suivant

                            <ChevronRight size={18} />

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}