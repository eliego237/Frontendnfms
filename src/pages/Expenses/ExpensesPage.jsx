import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
    Search,
    Wallet,
    TrendingDown,
    CalendarDays,
    Receipt,
    RefreshCw,
} from "lucide-react";

import {
    getExpenses,
    deleteExpense,
} from "../../services/expenseService";

import ExpenseTable from "./components/ExpenseTable";
import ExpenseHeader from "./components/ExpenseHeader";
import Swal from "sweetalert2";

export default function ExpensesPage() {

    const [expenses, setExpenses] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("");

    const [period, setPeriod] = useState("");

    /**
     * Charger les dépenses
     */
    async function loadExpenses() {

        try {

            setLoading(true);

            const response = await getExpenses();

            setExpenses(
                response?.data?.data ?? []
            );

        } catch (error) {

            console.error(
                "Erreur chargement dépenses :",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                "Impossible de charger les dépenses."
            );

        } finally {

            setLoading(false);

        }

    }
    
    /**
 * Supprimer une dépense
 */
async function handleDelete(id) {

    const result = await Swal.fire({

        title: "Supprimer cette dépense ?",

        text: "Cette action est irréversible.",

        icon: "warning",

        showCancelButton: true,

        confirmButtonText: "Supprimer",

        cancelButtonText: "Annuler",

        confirmButtonColor: "#dc2626",

        cancelButtonColor: "#64748b",

    });

    if (!result.isConfirmed) {
        return;
    }

    try {

        await deleteExpense(id);

        setExpenses((previous) =>
            previous.filter(
                (expense) => expense.id !== id
            )
        );

        toast.success(
            "Dépense supprimée avec succès."
        );

    } catch (error) {

        console.error(
            "Erreur suppression dépense :",
            error
        );

        toast.error(
            error?.response?.data?.message ||
            "Impossible de supprimer la dépense."
        );

    }

}

    useEffect(() => {

        loadExpenses();

    }, []);

    /**
     * Catégories disponibles
     */
    const categories = useMemo(() => {

        return [
            ...new Set(
                expenses
                    .map((expense) => expense.category)
                    .filter(Boolean)
            ),
        ];

    }, [expenses]);

    /**
     * Filtrage
     */
    const filteredExpenses = useMemo(() => {

        const normalizedSearch =
            search.trim().toLowerCase();

            async function handleDelete(id) {

    const result = await Swal.fire({

        title: "Supprimer cette dépense ?",

        text: "Cette action est irréversible.",

        icon: "warning",

        showCancelButton: true,

        confirmButtonText: "Supprimer",

        cancelButtonText: "Annuler",

        confirmButtonColor: "#dc2626",

        cancelButtonColor: "#64748b",

    });

    if (!result.isConfirmed) {
        return;
    }

    try {

        await deleteExpense(id);

        setExpenses((previous) =>
            previous.filter(
                (expense) => expense.id !== id
            )
        );

        toast.success(
            "Dépense supprimée avec succès."
        );

    } catch (error) {

        console.error(
            "Erreur suppression dépense :",
            error
        );

        toast.error(
            error?.response?.data?.message ||
            "Impossible de supprimer cette dépense."
        );

    }

}

        return expenses.filter((expense) => {

            const searchableText = [

                expense.expense_number,

                expense.title,

                expense.category,

                expense.reference,

                expense.description,

            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                !normalizedSearch ||
                searchableText.includes(normalizedSearch);

            const matchesCategory =
                !category ||
                expense.category === category;

            let matchesPeriod = true;

            if (period && expense.expense_date) {

                const date =
                    new Date(expense.expense_date);

                const now = new Date();

                if (period === "today") {

                    matchesPeriod =
                        date.toDateString() ===
                        now.toDateString();

                }

                if (period === "month") {

                    matchesPeriod =
                        date.getMonth() === now.getMonth() &&
                        date.getFullYear() === now.getFullYear();

                }

                if (period === "year") {

                    matchesPeriod =
                        date.getFullYear() ===
                        now.getFullYear();

                }

            }

            return (
                matchesSearch &&
                matchesCategory &&
                matchesPeriod
            );

        });

    }, [
        expenses,
        search,
        category,
        period,
    ]);

    /**
     * Statistiques
     */
    const stats = useMemo(() => {

        const total = expenses.reduce(
            (sum, expense) =>
                sum + Number(expense.amount || 0),
            0
        );

        const currentMonth =
            new Date().getMonth();

        const currentYear =
            new Date().getFullYear();

        const monthTotal = expenses
            .filter((expense) => {

                if (!expense.expense_date) {
                    return false;
                }

                const date =
                    new Date(expense.expense_date);

                return (
                    date.getMonth() === currentMonth &&
                    date.getFullYear() === currentYear
                );

            })
            .reduce(
                (sum, expense) =>
                    sum + Number(expense.amount || 0),
                0
            );

        const largeExpenses = expenses.filter(
            (expense) =>
                Number(expense.amount || 0) >= 100000
        ).length;

        const categoriesCount =
            new Set(
                expenses
                    .map((expense) => expense.category)
                    .filter(Boolean)
            ).size;

        return {

            total,

            monthTotal,

            largeExpenses,

            categoriesCount,

        };

    }, [expenses]);

    /**
     * Format FCFA
     */
    function formatMoney(value) {

        return `${Number(value || 0).toLocaleString(
            "fr-FR"
        )} FCFA`;

    }

    /**
     * Reset filtres
     */
    function resetFilters() {

        setSearch("");

        setCategory("");

        setPeriod("");

    }

    if (loading) {

        return (

            <div className="min-h-[60vh] flex items-center justify-center">

                <div className="text-center">

                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

                    <p className="font-medium text-slate-600">
                        Chargement des dépenses...
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

            <ExpenseHeader />

            {/* =====================================================
                STATISTIQUES
            ====================================================== */}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

                <StatCard
                    title="Total des dépenses"
                    value={formatMoney(stats.total)}
                    icon={<TrendingDown size={21} />}
                    description={`${expenses.length} opération(s)`}
                />

                <StatCard
                    title="Ce mois"
                    value={formatMoney(stats.monthTotal)}
                    icon={<CalendarDays size={21} />}
                    description="Dépenses du mois courant"
                />

                <StatCard
                    title="Dépenses importantes"
                    value={stats.largeExpenses}
                    icon={<Receipt size={21} />}
                    description="≥ 100 000 FCFA"
                />

                <StatCard
                    title="Catégories"
                    value={stats.categoriesCount}
                    icon={<Wallet size={21} />}
                    description="Catégories utilisées"
                />

            </div>

                        {/* =====================================================
                FILTRES
            ====================================================== */}

            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">

                <div className="flex flex-col gap-4 xl:flex-row xl:items-center">

                    {/* Recherche */}

                    <div className="relative flex-1">

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
                            placeholder="Rechercher une dépense..."
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                        />

                    </div>

                    {/* Catégorie */}

                    <select
                        value={category}
                        onChange={(event) =>
                            setCategory(event.target.value)
                        }
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    >

                        <option value="">
                            Toutes les catégories
                        </option>

                        {categories.map((item) => (

                            <option
                                key={item}
                                value={item}
                            >
                                {item}
                            </option>

                        ))}

                    </select>

                    {/* Période */}

                    <select
                        value={period}
                        onChange={(event) =>
                            setPeriod(event.target.value)
                        }
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    >

                        <option value="">
                            Toutes les périodes
                        </option>

                        <option value="today">
                            Aujourd'hui
                        </option>

                        <option value="month">
                            Ce mois
                        </option>

                        <option value="year">
                            Cette année
                        </option>

                    </select>

                    {/* Reset */}

                    {(search || category || period) && (

                        <button
                            type="button"
                            onClick={resetFilters}
                            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                        >

                            <RefreshCw size={17} />

                            Réinitialiser

                        </button>

                    )}

                </div>

            </div>

            {/* =====================================================
                TABLEAU
            ====================================================== */}

            <ExpenseTable
    expenses={filteredExpenses}
    onRefresh={loadExpenses}
    onDelete={handleDelete}
/>

        </div>

    );

}


/**
 * Carte statistique locale
 */
function StatCard({
    title,
    value,
    icon,
    description,
}) {

    return (

        <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

            <div className="flex items-start justify-between">

                <div>

                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>

                    <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                        {value}
                    </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 transition group-hover:scale-105">

                    {icon}

                </div>

            </div>

            <p className="mt-4 text-xs font-medium text-slate-400">
                {description}
            </p>

        </div>

    );

}