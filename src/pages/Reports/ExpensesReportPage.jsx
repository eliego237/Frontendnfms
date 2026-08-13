import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../services/api";

import {
    Receipt,
    Wallet,
    TrendingDown,
    Banknote,
    Search,
    CalendarDays,
    RefreshCw,
} from "lucide-react";

export default function ExpensesReportPage() {

    /*
    |--------------------------------------------------------------------------
    | States
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] = useState(true);

    const [expenses, setExpenses] = useState([]);

    const [paymentMethods, setPaymentMethods] = useState([]);

    const [stats, setStats] = useState({
        totalExpenses: 0,
        totalAmount: 0,
        averageExpense: 0,
        largestExpense: 0,
    });

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("all");

    const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");

    const [dateFrom, setDateFrom] = useState("");

    const [dateTo, setDateTo] = useState("");

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    function formatMoney(value) {

        return new Intl.NumberFormat(
            "fr-FR",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }
        ).format(Number(value ?? 0)) + " FCFA";

    }

    function formatDate(date) {

        if (!date) return "—";

        const parsed = new Date(date);

        if (Number.isNaN(parsed.getTime())) {
            return "—";
        }

        return parsed.toLocaleDateString("fr-FR");

    }

    function getPaymentMethod(expense) {

        return (
            expense?.paymentMethod?.name ??
            expense?.payment_method?.name ??
            expense?.payment_method_name ??
            "—"
        );

    }

    function getReference(expense) {

    return (
        expense?.expense_number ??
        expense?.reference ??
        `DEP-${expense?.id ?? "—"}`
    );

}

    function getCategory(expense) {

        return (
            expense?.category ??
            "Non définie"
        );

    }

        /*
    |--------------------------------------------------------------------------
    | Chargement des modes de paiement
    |--------------------------------------------------------------------------
    */

    const loadPaymentMethods = useCallback(async () => {

        try {

            const response = await api.get("/payment-methods");

            setPaymentMethods(
                response.data.data ?? []
            );

        } catch (error) {

            console.error(error);

        }

    }, []);

    /*
    |--------------------------------------------------------------------------
    | Chargement du rapport
    |--------------------------------------------------------------------------
    */

const loadExpenses = useCallback(async () => {
    try {
        setLoading(true);

        const params = {};

        if (dateFrom) {
            params.date_from = dateFrom;
        }

        if (dateTo) {
            params.date_to = dateTo;
        }

        if (category && category !== "all") {
            params.category = category;
        }

        if (
            paymentMethodFilter &&
            paymentMethodFilter !== "all"
        ) {
            params.payment_method_id = paymentMethodFilter;
        }

        /*
        |--------------------------------------------------------------------------
        | 1. Rapport : statistiques
        |--------------------------------------------------------------------------
        */

        const reportResponse = await api.get(
            "/reports/expenses",
            {
                params,
            }
        );

        console.log(
            "🔥 RAPPORT DEPENSES :",
            reportResponse.data
        );

        const report =
            reportResponse?.data?.data ?? {};

        /*
        |--------------------------------------------------------------------------
        | 2. Dépenses : liste réelle
        |--------------------------------------------------------------------------
        */

        const expensesResponse = await api.get(
            "/expenses"
        );

        console.log(
            "🔥 LISTE DEPENSES :",
            expensesResponse.data
        );

        const expensesResult =
            expensesResponse?.data?.data ?? [];

        /*
        |--------------------------------------------------------------------------
        | Récupération robuste
        |--------------------------------------------------------------------------
        */

        let expensesData = [];

        if (Array.isArray(expensesResult)) {

            expensesData = expensesResult;

        } else if (
            Array.isArray(expensesResult?.data)
        ) {

            expensesData = expensesResult.data;

        }

        /*
        |--------------------------------------------------------------------------
        | Application des filtres côté frontend
        |--------------------------------------------------------------------------
        */

        expensesData = expensesData.filter((expense) => {

            // Catégorie
            if (
                category &&
                category !== "all" &&
                String(expense?.category ?? "")
                    .toLowerCase() !==
                String(category).toLowerCase()
            ) {
                return false;
            }

            // Mode de paiement
            if (
                paymentMethodFilter &&
                paymentMethodFilter !== "all" &&
                String(expense?.payment_method_id ?? "") !==
                String(paymentMethodFilter)
            ) {
                return false;
            }

            // Date début
            if (dateFrom && expense?.expense_date) {

                const expenseDate =
                    expense.expense_date.substring(0, 10);

                if (expenseDate < dateFrom) {
                    return false;
                }
            }

            // Date fin
            if (dateTo && expense?.expense_date) {

                const expenseDate =
                    expense.expense_date.substring(0, 10);

                if (expenseDate > dateTo) {
                    return false;
                }
            }

            return true;
        });

        console.log(
            "🔥🔥 DÉPENSES FINALES :",
            expensesData
        );

        setExpenses(expensesData);

        /*
        |--------------------------------------------------------------------------
        | Statistiques
        |--------------------------------------------------------------------------
        */

        setStats({

            totalExpenses: Number(
                report?.total_expenses ?? 0
            ),

            totalAmount: Number(
                report?.total_amount ?? 0
            ),

            averageExpense: Number(
                report?.average_expense ?? 0
            ),

            largestExpense: Number(
                report?.largest_expense ?? 0
            ),

        });

    } catch (error) {

        console.error(
            "❌ ERREUR DEPENSES :",
            error
        );

        console.error(
            "❌ RESPONSE :",
            error?.response?.data
        );

        setExpenses([]);

    } finally {

        setLoading(false);

    }

}, [
    category,
    paymentMethodFilter,
    dateFrom,
    dateTo,
]);

    /*
    |--------------------------------------------------------------------------
    | useEffect
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadPaymentMethods();

    }, [loadPaymentMethods]);

    useEffect(() => {

        loadExpenses();

    }, [loadExpenses]);

        /*
    |--------------------------------------------------------------------------
    | Filtrage local
    |--------------------------------------------------------------------------
    */

const filteredExpenses = useMemo(() => {

    if (!search.trim()) {
        return expenses;
    }

    const term = search.toLowerCase().trim();

    return expenses.filter((expense) => {

        const searchable = [

            getReference(expense),

            getCategory(expense),

            getPaymentMethod(expense),

            expense?.title,

            expense?.description,

            expense?.amount,

        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return searchable.includes(term);

    });

}, [expenses, search]);

    const filteredTotal = useMemo(() => {

    return filteredExpenses.reduce(
        (total, expense) => {
            return total + Number(expense?.amount ?? 0);
        },
        0
    );

}, [filteredExpenses]);

    /*
    |--------------------------------------------------------------------------
    | Chargement
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="flex min-h-[60vh] items-center justify-center">

                <div className="text-center">

                    <div
                        className="
                            mx-auto
                            h-12
                            w-12
                            animate-spin
                            rounded-full
                            border-4
                            border-slate-200
                            border-t-blue-600
                        "
                    />

                    <p className="mt-4 text-slate-600">

                        Chargement du rapport des dépenses...

                    </p>

                </div>

            </div>

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (

        <div className="space-y-6">

            {/* HEADER */}

            <div
                className="
                    rounded-3xl
                    bg-gradient-to-r
                    from-blue-600
                    via-indigo-600
                    to-purple-600
                    p-8
                    text-white
                    shadow-xl
                "
            >

                <div className="flex items-center justify-between gap-6">

                    <div className="flex items-center gap-5">

                        <div
                            className="
                                flex
                                h-16
                                w-16
                                items-center
                                justify-center
                                rounded-2xl
                                bg-white/15
                                backdrop-blur
                            "
                        >

                            <TrendingDown size={32} />

                        </div>

                        <div>

                            <p className="mb-1 text-sm font-medium text-blue-100">

                                Analyse & statistiques • Rapports

                            </p>

                            <h1 className="text-3xl font-bold">

                                Rapport des dépenses

                            </h1>

                            <p className="mt-2 text-blue-100">

                                Consultez et analysez toutes les dépenses enregistrées.

                            </p>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={loadExpenses}
                        className="
                            flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-white/15
                            px-5
                            py-3
                            font-medium
                            backdrop-blur
                            transition
                            hover:bg-white/25
                        "
                    >

                        <RefreshCw size={18} />

                        Actualiser

                    </button>

                </div>

            </div>

            {/* STATISTIQUES */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    title="Total dépenses"
                    value={stats.totalExpenses}
                    icon={Receipt}
                />

                <StatCard
                    title="Montant dépensé"
                    value={formatMoney(stats.totalAmount)}
                    icon={Wallet}
                />

                <StatCard
                    title="Dépense moyenne"
                    value={formatMoney(stats.averageExpense)}
                    icon={Banknote}
                />

                <StatCard
                    title="Plus grosse dépense"
                    value={formatMoney(stats.largestExpense)}
                    icon={TrendingDown}
                />

            </div>

                        {/* FILTRES */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="mb-4 flex items-center justify-between">

                    <div>

                        <h2 className="text-lg font-bold text-slate-900">

                            Filtres

                        </h2>

                        <p className="text-sm text-slate-500">

                            Affinez les dépenses à consulter.

                        </p>

                    </div>

                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

                    {/* Recherche */}

                    <div className="relative">

                        <Search
                            size={18}
                            className="
                                absolute
                                left-3
                                top-1/2
                                -translate-y-1/2
                                text-slate-400
                            "
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            placeholder="Rechercher..."
                            className="
                                w-full
                                rounded-xl
                                border
                                border-slate-200
                                py-3
                                pl-10
                                pr-4
                                outline-none
                                transition
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "
                        />

                    </div>

                    {/* Catégorie */}

                    <select
                        value={category}
                        onChange={(e) =>
                            setCategory(e.target.value)
                        }
                        className="
                            rounded-xl
                            border
                            border-slate-200
                            px-4
                            py-3
                            outline-none
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-100
                        "
                    >

                        <option value="all">
                            Toutes les catégories
                        </option>

                        {[
                            ...new Set(
                                expenses
                                    .map((expense) => expense.category)
                                    .filter(Boolean)
                            ),
                        ].map((cat) => (

                            <option
                                key={cat}
                                value={cat}
                            >
                                {cat}
                            </option>

                        ))}

                    </select>

                    {/* Mode de paiement */}

                    <select
                        value={paymentMethodFilter}
                        onChange={(e) =>
                            setPaymentMethodFilter(e.target.value)
                        }
                        className="
                            rounded-xl
                            border
                            border-slate-200
                            px-4
                            py-3
                            outline-none
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-100
                        "
                    >

                        <option value="all">

                            Tous les modes

                        </option>

                        {paymentMethods.map((method) => (

                            <option
                                key={method.id}
                                value={method.id}
                            >

                                {method.name}

                            </option>

                        ))}

                    </select>

                    {/* Dates */}

                    <div className="flex gap-2">

                        <div className="relative flex-1">

                            <CalendarDays
                                size={17}
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />

                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) =>
                                    setDateFrom(e.target.value)
                                }
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    py-3
                                    pl-10
                                    pr-2
                                    outline-none
                                    focus:border-blue-500
                                "
                            />

                        </div>

                        <div className="relative flex-1">

                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) =>
                                    setDateTo(e.target.value)
                                }
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    px-3
                                    py-3
                                    outline-none
                                    focus:border-blue-500
                                "
                            />

                        </div>

                    </div>

                </div>

            </div>

                        {/* TABLEAU */}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                    <div>

                        <h2 className="text-lg font-bold text-slate-900">

                            Historique des dépenses

                        </h2>

                        <p className="text-sm text-slate-500">

                            {filteredExpenses.length} dépense
                            {filteredExpenses.length > 1 ? "s" : ""}

                        </p>

                    </div>

                    <div className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">

                        {formatMoney(

                            filteredExpenses.reduce(

                                (sum, expense) =>

                                    sum + Number(expense.amount ?? 0),

                                0

                            )

                        )}

                    </div>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[1100px]">

                        <thead>

                            <tr className="border-b border-slate-200 bg-slate-50">

                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">

                                    Référence

                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">

                                    Catégorie

                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">

                                    Description

                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">

                                    Date

                                </th>

                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">

                                    Mode

                                </th>

                                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">

                                    Montant

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredExpenses.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="6"
                                        className="px-6 py-16 text-center"
                                    >

                                        <div className="flex flex-col items-center">

                                            <Receipt
                                                size={40}
                                                className="text-slate-300"
                                            />

                                            <p className="mt-3 font-semibold text-slate-600">

                                                Aucune dépense trouvée

                                            </p>

                                            <p className="mt-1 text-sm text-slate-400">

                                                Modifiez vos filtres pour afficher les résultats.

                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                filteredExpenses.map((expense) => (

                                    <tr
                                        key={expense.id}
                                        className="
                                            border-b
                                            border-slate-100
                                            transition
                                            hover:bg-slate-50
                                        "
                                    >

                                        <td className="px-6 py-4">

                                            <span className="font-semibold text-blue-600">

                                                {getReference(expense)}

                                            </span>

                                        </td>

                                        <td className="px-6 py-4">

                                            <span
                                                className="
                                                    inline-flex
                                                    rounded-full
                                                    bg-orange-100
                                                    px-3
                                                    py-1
                                                    text-xs
                                                    font-semibold
                                                    text-orange-700
                                                "
                                            >

                                                {getCategory(expense)}

                                            </span>

                                        </td>

                                        <td className="px-6 py-4 text-slate-600">

                                            {expense.description ?? "—"}

                                        </td>

                                        <td className="px-6 py-4 text-slate-600">

                                            {formatDate(

                                                expense.expense_date ??

                                                expense.date ??

                                                expense.created_at

                                            )}

                                        </td>

                                        <td className="px-6 py-4">

                                            <span
                                                className="
                                                    inline-flex
                                                    rounded-full
                                                    bg-slate-100
                                                    px-3
                                                    py-1
                                                    text-xs
                                                    font-semibold
                                                    text-slate-700
                                                "
                                            >

                                                {getPaymentMethod(expense)}

                                            </span>

                                        </td>

                                        <td className="px-6 py-4 text-right">

                                            <span className="font-bold text-red-600">

                                                {formatMoney(expense.amount)}

                                            </span>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

                    </div>

    );

}

/*
|--------------------------------------------------------------------------
| Stat Card
|--------------------------------------------------------------------------
*/

function StatCard({
    title,
    value,
    icon: Icon,
}) {

    return (

        <div
            className="
                rounded-2xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:shadow-md
            "
        >

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm font-medium text-slate-500">

                        {title}

                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-900">

                        {value}

                    </p>

                </div>

                <div
                    className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-blue-50
                        text-blue-600
                    "
                >

                    <Icon size={22} />

                </div>

            </div>

        </div>

    );

}