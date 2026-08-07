import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../../services/api";

import {
    ArrowDownCircle,
    ArrowUpCircle,
    Banknote,
    CalendarDays,
    ChevronDown,
    CreditCard,
    FileText,
    RefreshCw,
    Search,
    Wallet,
    X,
} from "lucide-react";

export default function CashBookReportPage() {

    /*
    |--------------------------------------------------------------------------
    | STATES
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] = useState(true);

    const [transactions, setTransactions] = useState([]);

    const [search, setSearch] = useState("");

    const [typeFilter, setTypeFilter] = useState("all");

    const [trainingFilter, setTrainingFilter] = useState("all");

    const [paymentMethodFilter, setPaymentMethodFilter] =
        useState("all");

    const [dateFrom, setDateFrom] = useState("");

    const [dateTo, setDateTo] = useState("");

    const [stats, setStats] = useState({
        totalEntries: 0,
        totalExits: 0,
        balance: 0,
        transactionCount: 0,
    });

    /*
    |--------------------------------------------------------------------------
    | FORMATTERS
    |--------------------------------------------------------------------------
    */

    function formatMoney(value) {

        return (
            new Intl.NumberFormat("fr-FR", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(Number(value ?? 0)) + " FCFA"
        );

    }

    function formatDate(date) {

        if (!date) {
            return "—";
        }

        const parsed = new Date(date);

        if (Number.isNaN(parsed.getTime())) {
            return "—";
        }

        return parsed.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

    }

    function formatDateTime(date) {

        if (!date) {
            return "—";
        }

        const parsed = new Date(date);

        if (Number.isNaN(parsed.getTime())) {
            return "—";
        }

        return parsed.toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    }

    /*
    |--------------------------------------------------------------------------
    | CHARGEMENT DU LIVRE DE CAISSE
    |--------------------------------------------------------------------------
    */

    const loadCashBook = useCallback(async () => {

        try {

            setLoading(true);

            const params = {};

            if (dateFrom) {
                params.date_from = dateFrom;
            }

            if (dateTo) {
                params.date_to = dateTo;
            }

            const [
                paymentsResponse,
                expensesResponse,
            ] = await Promise.all([
                api.get("/reports/payments", {
                    params,
                }),

                api.get("/expenses", {
                    params,
                }),
            ]);

            /*
            |--------------------------------------------------------------------------
            | PAIEMENTS
            |--------------------------------------------------------------------------
            */

            const paymentReport =
                paymentsResponse?.data?.data ?? {};

            const paymentList =
                paymentReport?.payments?.data ?? [];

            /*
            |--------------------------------------------------------------------------
            | DÉPENSES
            |--------------------------------------------------------------------------
            */

            const expenseList =
                expensesResponse?.data?.data ?? [];

            /*
            |--------------------------------------------------------------------------
            | TRANSFORMER LES ENTRÉES
            |--------------------------------------------------------------------------
            */

            const entries = paymentList.map((payment) => {

                const student =
                    payment?.enrollment?.student;

                const training =
                    payment?.enrollment?.training;

                const studentName = [
                    student?.first_name,
                    student?.last_name,
                ]
                    .filter(Boolean)
                    .join(" ");

                return {

                    id: `payment-${payment.id}`,

                    number:
                        payment?.receipt_number ??
                        `REC-${payment?.id ?? "—"}`,

                    date:
                        payment?.payment_date ??
                        payment?.created_at,

                    type: "Entrée",

                    description:
                        studentName
                            ? `Paiement de ${studentName}`
                            : "Paiement étudiant",

                    student:
                        studentName || "Étudiant inconnu",

                    training:
                        training?.title ??
                        training?.name ??
                        "—",

                    category:
                        "Paiement formation",

                    paymentMethod:
                        payment?.payment_method?.name ??
                        payment?.paymentMethod?.name ??
                        "—",

                    amount:
                        Number(payment?.amount ?? 0),

                    reference:
                        payment?.reference ??
                        "—",

                    source: "payment",

                    original: payment,
                };

            });

            /*
            |--------------------------------------------------------------------------
            | TRANSFORMER LES SORTIES
            |--------------------------------------------------------------------------
            */

            const exits = expenseList.map((expense) => {

                return {

                    id: `expense-${expense.id}`,

                    number:
                        expense?.expense_number ??
                        `EXP-${expense?.id ?? "—"}`,

                    date:
                        expense?.expense_date ??
                        expense?.created_at,

                    type: "Sortie",

                    description:
                        expense?.title ??
                        expense?.description ??
                        "Dépense",

                    student: "—",

                    training: "—",

                    category:
                        expense?.category ??
                        "Dépense",

                    paymentMethod:
                        expense?.payment_method?.name ??
                        expense?.paymentMethod?.name ??
                        "—",

                    amount:
                        Number(expense?.amount ?? 0),

                    reference:
                        expense?.reference ??
                        "—",

                    source: "expense",

                    original: expense,
                };

            });

            /*
            |--------------------------------------------------------------------------
            | FUSION DES TRANSACTIONS
            |--------------------------------------------------------------------------
            */

            const mergedTransactions = [
                ...entries,
                ...exits,
            ].sort((a, b) => {

                const dateA =
                    new Date(a.date || 0).getTime();

                const dateB =
                    new Date(b.date || 0).getTime();

                return dateB - dateA;

            });

            setTransactions(mergedTransactions);

            /*
            |--------------------------------------------------------------------------
            | STATISTIQUES
            |--------------------------------------------------------------------------
            */

            const totalEntries =
                entries.reduce(
                    (total, transaction) =>
                        total + transaction.amount,
                    0
                );

            const totalExits =
                exits.reduce(
                    (total, transaction) =>
                        total + transaction.amount,
                    0
                );

            setStats({

                totalEntries,

                totalExits,

                balance:
                    totalEntries - totalExits,

                transactionCount:
                    mergedTransactions.length,

            });

        } catch (error) {

            console.error(
                "Erreur chargement livre de caisse :",
                error?.response?.data ?? error
            );

            setTransactions([]);

            setStats({
                totalEntries: 0,
                totalExits: 0,
                balance: 0,
                transactionCount: 0,
            });

        } finally {

            setLoading(false);

        }

    }, [dateFrom, dateTo]);

    /*
    |--------------------------------------------------------------------------
    | EFFECT
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadCashBook();

    }, [loadCashBook]);

    /*
    |--------------------------------------------------------------------------
    | OPTIONS DES FILTRES
    |--------------------------------------------------------------------------
    */

    const trainingOptions = useMemo(() => {

        const values = transactions
            .map((transaction) => transaction.training)
            .filter(
                (value) =>
                    value &&
                    value !== "—"
            );

        return [...new Set(values)].sort();

    }, [transactions]);

    const paymentMethodOptions = useMemo(() => {

        const values = transactions
            .map(
                (transaction) =>
                    transaction.paymentMethod
            )
            .filter(
                (value) =>
                    value &&
                    value !== "—"
            );

        return [...new Set(values)].sort();

    }, [transactions]);

    /*
    |--------------------------------------------------------------------------
    | FILTRAGE
    |--------------------------------------------------------------------------
    */

    const filteredTransactions = useMemo(() => {

        const term =
            search.trim().toLowerCase();

        return transactions.filter(
            (transaction) => {

                /*
                | Type
                */

                if (
                    typeFilter !== "all" &&
                    transaction.type !== typeFilter
                ) {
                    return false;
                }

                /*
                | Formation
                */

                if (
                    trainingFilter !== "all" &&
                    transaction.training !== trainingFilter
                ) {
                    return false;
                }

                /*
                | Moyen de paiement
                */

                if (
                    paymentMethodFilter !== "all" &&
                    transaction.paymentMethod !==
                        paymentMethodFilter
                ) {
                    return false;
                }

                /*
                | Recherche
                */

                if (term) {

                    const searchable = [
                        transaction.number,
                        transaction.description,
                        transaction.student,
                        transaction.training,
                        transaction.category,
                        transaction.paymentMethod,
                        transaction.reference,
                        transaction.type,
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();

                    if (!searchable.includes(term)) {
                        return false;
                    }

                }

                return true;

            }
        );

    }, [
        transactions,
        search,
        typeFilter,
        trainingFilter,
        paymentMethodFilter,
    ]);

    /*
    |--------------------------------------------------------------------------
    | STATISTIQUES FILTRÉES
    |--------------------------------------------------------------------------
    */

    const filteredStats = useMemo(() => {

        const totalEntries =
            filteredTransactions
                .filter(
                    (transaction) =>
                        transaction.type === "Entrée"
                )
                .reduce(
                    (total, transaction) =>
                        total + transaction.amount,
                    0
                );

        const totalExits =
            filteredTransactions
                .filter(
                    (transaction) =>
                        transaction.type === "Sortie"
                )
                .reduce(
                    (total, transaction) =>
                        total + transaction.amount,
                    0
                );

        return {

            totalEntries,

            totalExits,

            balance:
                totalEntries - totalExits,

            transactionCount:
                filteredTransactions.length,

        };

    }, [filteredTransactions]);

    /*
    |--------------------------------------------------------------------------
    | RESET FILTRES
    |--------------------------------------------------------------------------
    */

    function resetFilters() {

        setSearch("");

        setTypeFilter("all");

        setTrainingFilter("all");

        setPaymentMethodFilter("all");

        setDateFrom("");

        setDateTo("");

    }

    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="min-h-[60vh] flex items-center justify-center">

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

                    <p className="mt-4 text-sm text-slate-500">

                        Chargement du livre de caisse...

                    </p>

                </div>

            </div>

        );

    }

    /*
    |--------------------------------------------------------------------------
    | RENDER
    |--------------------------------------------------------------------------
    */

    return (

        <div className="min-h-full space-y-6">

            {/* =========================================================
                HEADER
            ========================================================= */}

            <div
                className="
                    relative
                    overflow-hidden
                    rounded-3xl
                    bg-gradient-to-br
                    from-blue-600
                    via-indigo-600
                     to-purple-600
                    p-10
                     text-white
                    shadow-xl
                    md:p-8
                "
            >

                <div
                    className="
                        absolute
                        -right-20
                        -top-20
                        h-64
                        w-64
                        rounded-full
                        bg-white/10
                        blur-2xl
                    "
                />

                <div
                    className="
                        absolute
                        -bottom-24
                        left-1/3
                        h-64
                        w-64
                        rounded-full
                        bg-blue-400/10
                        blur-3xl
                    "
                />

                <div
                    className="
                        relative
                        flex
                        flex-col
                        gap-6
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                    "
                >

                    <div className="flex items-center gap-4">

                        <div
                            className="
                                flex
                                h-14
                                w-14
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                bg-white/15
                                ring-1
                                ring-white/20
                            "
                        >

                            <Wallet
                                size={28}
                                className="text-white"
                            />

                        </div>

                        <div>

                            <p
                                className="
                                    mb-1
                                    text-sm
                                    font-medium
                                    text-blue-200
                                "
                            >
                                RAPPORT FINANCIER
                            </p>

                            <h1
                                className="
                                    text-2xl
                                    font-bold
                                    tracking-tight
                                    text-white
                                    md:text-3xl
                                "
                            >
                                Livre de caisse
                            </h1>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-slate-300
                                "
                            >
                                Suivez les entrées, les sorties et le
                                solde de votre caisse.
                            </p>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={loadCashBook}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-white
                            px-5
                            py-3
                            text-sm
                            font-semibold
                            text-slate-800
                            shadow-lg
                            transition
                            hover:bg-slate-100
                            active:scale-[0.98]
                        "
                    >

                        <RefreshCw size={17} />

                        Actualiser

                    </button>

                </div>

            </div>

            {/* =========================================================
                STATISTIQUES
            ========================================================= */}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                {/* ENTRÉES */}

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

                            <p
                                className="
                                    text-sm
                                    font-medium
                                    text-slate-500
                                "
                            >
                                Total des entrées
                            </p>

                            <p
                                className="
                                    mt-2
                                    text-2xl
                                    font-bold
                                    text-emerald-600
                                "
                            >
                                {formatMoney(
                                    filteredStats.totalEntries
                                )}
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
                                bg-emerald-50
                                text-emerald-600
                            "
                        >

                            <ArrowDownCircle size={23} />

                        </div>

                    </div>

                    <p className="mt-3 text-xs text-slate-400">
                        Argent encaissé
                    </p>

                </div>

                {/* SORTIES */}

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

                            <p
                                className="
                                    text-sm
                                    font-medium
                                    text-slate-500
                                "
                            >
                                Total des sorties
                            </p>

                            <p
                                className="
                                    mt-2
                                    text-2xl
                                    font-bold
                                    text-red-600
                                "
                            >
                                {formatMoney(
                                    filteredStats.totalExits
                                )}
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
                                bg-red-50
                                text-red-600
                            "
                        >

                            <ArrowUpCircle size={23} />

                        </div>

                    </div>

                    <p className="mt-3 text-xs text-slate-400">
                        Argent dépensé
                    </p>

                </div>

                {/* SOLDE */}

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

                            <p
                                className="
                                    text-sm
                                    font-medium
                                    text-slate-500
                                "
                            >
                                Solde de caisse
                            </p>

                            <p
                                className={`
                                    mt-2
                                    text-2xl
                                    font-bold
                                    ${
                                        filteredStats.balance >= 0
                                            ? "text-blue-600"
                                            : "text-red-600"
                                    }
                                `}
                            >
                                {formatMoney(
                                    filteredStats.balance
                                )}
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

                            <Banknote size={23} />

                        </div>

                    </div>

                    <p className="mt-3 text-xs text-slate-400">
                        Entrées moins sorties
                    </p>

                </div>

                {/* TRANSACTIONS */}

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

                            <p
                                className="
                                    text-sm
                                    font-medium
                                    text-slate-500
                                "
                            >
                                Transactions
                            </p>

                            <p
                                className="
                                    mt-2
                                    text-2xl
                                    font-bold
                                    text-slate-800
                                "
                            >
                                {filteredStats.transactionCount}
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
                                bg-slate-100
                                text-slate-600
                            "
                        >

                            <FileText size={23} />

                        </div>

                    </div>

                    <p className="mt-3 text-xs text-slate-400">
                        Opérations affichées
                    </p>

                </div>

            </div>

            {/* =========================================================
                FILTRES
            ========================================================= */}

            <div
                className="
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    p-5
                    shadow-sm
                "
            >

                <div
                    className="
                        mb-5
                        flex
                        flex-col
                        gap-3
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
                    "
                >

                    <div>

                        <h2
                            className="
                                text-lg
                                font-bold
                                text-slate-800
                            "
                        >
                            Filtres et recherche
                        </h2>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-slate-500
                            "
                        >
                            Affinez l'affichage des opérations de caisse.
                        </p>

                    </div>

                    <button
                        type="button"
                        onClick={resetFilters}
                        className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-slate-200
                            px-4
                            py-2.5
                            text-sm
                            font-medium
                            text-slate-600
                            transition
                            hover:bg-slate-50
                        "
                    >

                        <X size={16} />

                        Réinitialiser

                    </button>

                </div>

                <div
                    className="
                        grid
                        gap-4
                        md:grid-cols-2
                        xl:grid-cols-6
                    "
                >

                    {/* RECHERCHE */}

                    <div className="xl:col-span-2">

                        <label
                            className="
                                mb-2
                                block
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-slate-500
                            "
                        >
                            Recherche
                        </label>

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
                                placeholder="
                                    Étudiant, reçu, référence...
                                "
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    py-2.5
                                    pl-10
                                    pr-4
                                    text-sm
                                    outline-none
                                    transition
                                    focus:border-blue-500
                                    focus:bg-white
                                    focus:ring-4
                                    focus:ring-blue-500/10
                                "
                            />

                        </div>

                    </div>

                    {/* TYPE */}

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-slate-500
                            "
                        >
                            Type
                        </label>

                        <div className="relative">

                            <select
                                value={typeFilter}
                                onChange={(e) =>
                                    setTypeFilter(e.target.value)
                                }
                                className="
                                    w-full
                                    appearance-none
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    px-3
                                    py-2.5
                                    pr-9
                                    text-sm
                                    outline-none
                                    focus:border-blue-500
                                    focus:bg-white
                                    focus:ring-4
                                    focus:ring-blue-500/10
                                "
                            >

                                <option value="all">
                                    Tous
                                </option>

                                <option value="Entrée">
                                    Entrées
                                </option>

                                <option value="Sortie">
                                    Sorties
                                </option>

                            </select>

                            <ChevronDown
                                size={16}
                                className="
                                    pointer-events-none
                                    absolute
                                    right-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />

                        </div>

                    </div>

                    {/* FORMATION */}

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-slate-500
                            "
                        >
                            Formation
                        </label>

                        <div className="relative">

                            <select
                                value={trainingFilter}
                                onChange={(e) =>
                                    setTrainingFilter(
                                        e.target.value
                                    )
                                }
                                className="
                                    w-full
                                    appearance-none
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    px-3
                                    py-2.5
                                    pr-9
                                    text-sm
                                    outline-none
                                    focus:border-blue-500
                                    focus:bg-white
                                    focus:ring-4
                                    focus:ring-blue-500/10
                                "
                            >

                                <option value="all">
                                    Toutes
                                </option>

                                {trainingOptions.map(
                                    (training) => (
                                        <option
                                            key={training}
                                            value={training}
                                        >
                                            {training}
                                        </option>
                                    )
                                )}

                            </select>

                            <ChevronDown
                                size={16}
                                className="
                                    pointer-events-none
                                    absolute
                                    right-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />

                        </div>

                    </div>

                    {/* MOYEN DE PAIEMENT */}

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-slate-500
                            "
                        >
                            Paiement
                        </label>

                        <div className="relative">

                            <select
                                value={paymentMethodFilter}
                                onChange={(e) =>
                                    setPaymentMethodFilter(
                                        e.target.value
                                    )
                                }
                                className="
                                    w-full
                                    appearance-none
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    px-3
                                    py-2.5
                                    pr-9
                                    text-sm
                                    outline-none
                                    focus:border-blue-500
                                    focus:bg-white
                                    focus:ring-4
                                    focus:ring-blue-500/10
                                "
                            >

                                <option value="all">
                                    Tous
                                </option>

                                {paymentMethodOptions.map(
                                    (method) => (
                                        <option
                                            key={method}
                                            value={method}
                                        >
                                            {method}
                                        </option>
                                    )
                                )}

                            </select>

                            <ChevronDown
                                size={16}
                                className="
                                    pointer-events-none
                                    absolute
                                    right-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-slate-400
                                "
                            />

                        </div>

                    </div>

                    {/* DATE DEBUT */}

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-slate-500
                            "
                        >
                            Du
                        </label>

                        <div className="relative">

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
                                    bg-slate-50
                                    py-2.5
                                    pl-10
                                    pr-3
                                    text-sm
                                    outline-none
                                    focus:border-blue-500
                                    focus:bg-white
                                    focus:ring-4
                                    focus:ring-blue-500/10
                                "
                            />

                        </div>

                    </div>

                    {/* DATE FIN */}

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-slate-500
                            "
                        >
                            Au
                        </label>

                        <div className="relative">

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
                                value={dateTo}
                                onChange={(e) =>
                                    setDateTo(e.target.value)
                                }
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    py-2.5
                                    pl-10
                                    pr-3
                                    text-sm
                                    outline-none
                                    focus:border-blue-500
                                    focus:bg-white
                                    focus:ring-4
                                    focus:ring-blue-500/10
                                "
                            />

                        </div>

                    </div>

                </div>

            </div>

            {/* =========================================================
                TABLEAU
            ========================================================= */}

            <div
                className="
                    overflow-hidden
                    rounded-2xl
                    border
                    border-slate-200
                    bg-white
                    shadow-sm
                "
            >

                {/* TABLE HEADER */}

                <div
                    className="
                        flex
                        flex-col
                        gap-3
                        border-b
                        border-slate-200
                        p-5
                        md:flex-row
                        md:items-center
                        md:justify-between
                    "
                >

                    <div>

                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-blue-50
                                    text-blue-600
                                "
                            >

                                <CreditCard size={20} />

                            </div>

                            <div>

                                <h2
                                    className="
                                        font-bold
                                        text-slate-800
                                    "
                                >
                                    Journal de caisse
                                </h2>

                                <p
                                    className="
                                        text-xs
                                        text-slate-500
                                    "
                                >
                                    {filteredTransactions.length} opération
                                    {filteredTransactions.length > 1
                                        ? "s"
                                        : ""} affichée
                                    {filteredTransactions.length > 1
                                        ? "s"
                                        : ""}
                                </p>

                            </div>

                        </div>

                    </div>

                    <div
                        className="
                            rounded-xl
                            bg-slate-50
                            px-4
                            py-2
                            text-sm
                            font-medium
                            text-slate-600
                        "
                    >

                        Solde :

                        <span
                            className={`
                                ml-2
                                font-bold
                                ${
                                    filteredStats.balance >= 0
                                        ? "text-blue-600"
                                        : "text-red-600"
                                }
                            `}
                        >
                            {formatMoney(
                                filteredStats.balance
                            )}
                        </span>

                    </div>

                </div>

                {/* TABLE */}

                <div className="overflow-x-auto">

                    <table className="min-w-[1100px] w-full">

                        <thead>

                            <tr className="bg-slate-50">

                                <th
                                    className="
                                        px-5
                                        py-4
                                        text-left
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-slate-500
                                    "
                                >
                                    Date / N°
                                </th>

                                <th
                                    className="
                                        px-5
                                        py-4
                                        text-left
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-slate-500
                                    "
                                >
                                    Type
                                </th>

                                <th
                                    className="
                                        px-5
                                        py-4
                                        text-left
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-slate-500
                                    "
                                >
                                    Opération
                                </th>

                                <th
                                    className="
                                        px-5
                                        py-4
                                        text-left
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-slate-500
                                    "
                                >
                                    Formation / Catégorie
                                </th>

                                <th
                                    className="
                                        px-5
                                        py-4
                                        text-left
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-slate-500
                                    "
                                >
                                    Moyen
                                </th>

                                <th
                                    className="
                                        px-5
                                        py-4
                                        text-right
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-slate-500
                                    "
                                >
                                    Montant
                                </th>

                                <th
                                    className="
                                        px-5
                                        py-4
                                        text-left
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-wide
                                        text-slate-500
                                    "
                                >
                                    Référence
                                </th>

                            </tr>

                        </thead>

                        <tbody
                            className="
                                divide-y
                                divide-slate-100
                            "
                        >

                            {filteredTransactions.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={7}
                                        className="
                                            px-6
                                            py-16
                                            text-center
                                        "
                                    >

                                        <div
                                            className="
                                                mx-auto
                                                flex
                                                h-14
                                                w-14
                                                items-center
                                                justify-center
                                                rounded-2xl
                                                bg-slate-100
                                                text-slate-400
                                            "
                                        >

                                            <FileText size={25} />

                                        </div>

                                        <p
                                            className="
                                                mt-4
                                                font-semibold
                                                text-slate-700
                                            "
                                        >
                                            Aucune transaction trouvée
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                text-slate-400
                                            "
                                        >
                                            Modifiez vos filtres ou
                                            réinitialisez la recherche.
                                        </p>

                                    </td>

                                </tr>

                            ) : (

                                filteredTransactions.map(
                                    (transaction) => (

                                        <tr
                                            key={transaction.id}
                                            className="
                                                group
                                                transition
                                                hover:bg-slate-50
                                            "
                                        >

                                            {/* DATE */}

                                            <td className="px-5 py-4">

                                                <div
                                                    className="
                                                        font-semibold
                                                        text-slate-800
                                                    "
                                                >
                                                    {formatDate(
                                                        transaction.date
                                                    )}
                                                </div>

                                                <div
                                                    className="
                                                        mt-1
                                                        text-xs
                                                        text-slate-400
                                                    "
                                                >
                                                    {transaction.number}
                                                </div>

                                            </td>

                                            {/* TYPE */}

                                            <td className="px-5 py-4">

                                                {transaction.type ===
                                                "Entrée" ? (

                                                    <span
                                                        className="
                                                            inline-flex
                                                            items-center
                                                            gap-1.5
                                                            rounded-full
                                                            bg-emerald-50
                                                            px-3
                                                            py-1.5
                                                            text-xs
                                                            font-bold
                                                            text-emerald-700
                                                        "
                                                    >

                                                        <ArrowDownCircle
                                                            size={14}
                                                        />

                                                        Entrée

                                                    </span>

                                                ) : (

                                                    <span
                                                        className="
                                                            inline-flex
                                                            items-center
                                                            gap-1.5
                                                            rounded-full
                                                            bg-red-50
                                                            px-3
                                                            py-1.5
                                                            text-xs
                                                            font-bold
                                                            text-red-700
                                                        "
                                                    >

                                                        <ArrowUpCircle
                                                            size={14}
                                                        />

                                                        Sortie

                                                    </span>

                                                )}

                                            </td>

                                            {/* OPÉRATION */}

                                            <td className="px-5 py-4">

                                                <div
                                                    className="
                                                        font-semibold
                                                        text-slate-800
                                                    "
                                                >
                                                    {transaction.description}
                                                </div>

                                                {transaction.student !==
                                                    "—" && (

                                                    <div
                                                        className="
                                                            mt-1
                                                            text-xs
                                                            text-slate-500
                                                        "
                                                    >
                                                        {transaction.student}
                                                    </div>

                                                )}

                                            </td>

                                            {/* FORMATION / CATÉGORIE */}

                                            <td className="px-5 py-4">

                                                {transaction.training !==
                                                    "—" && (

                                                    <div
                                                        className="
                                                            font-medium
                                                            text-slate-700
                                                        "
                                                    >
                                                        {transaction.training}
                                                    </div>

                                                )}

                                                <div
                                                    className="
                                                        text-xs
                                                        text-slate-400
                                                    "
                                                >
                                                    {transaction.category}
                                                </div>

                                            </td>

                                            {/* MOYEN */}

                                            <td className="px-5 py-4">

                                                <div
                                                    className="
                                                        inline-flex
                                                        items-center
                                                        gap-2
                                                        text-sm
                                                        text-slate-600
                                                    "
                                                >

                                                    <CreditCard
                                                        size={15}
                                                        className="
                                                            text-slate-400
                                                        "
                                                    />

                                                    {
                                                        transaction.paymentMethod
                                                    }

                                                </div>

                                            </td>

                                            {/* MONTANT */}

                                            <td className="px-5 py-4 text-right">

                                                <div
                                                    className={`
                                                        font-bold
                                                        ${
                                                            transaction.type ===
                                                            "Entrée"
                                                                ? "text-emerald-600"
                                                                : "text-red-600"
                                                        }
                                                    `}
                                                >

                                                    {transaction.type ===
                                                    "Entrée"
                                                        ? "+"
                                                        : "-"}{" "}

                                                    {formatMoney(
                                                        transaction.amount
                                                    )}

                                                </div>

                                            </td>

                                            {/* REFERENCE */}

                                            <td className="px-5 py-4">

                                                <span
                                                    className="
                                                        text-sm
                                                        text-slate-500
                                                    "
                                                >
                                                    {
                                                        transaction.reference
                                                    }
                                                </span>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

                {/* FOOTER */}

                {filteredTransactions.length > 0 && (

                    <div
                        className="
                            flex
                            flex-col
                            gap-3
                            border-t
                            border-slate-200
                            bg-slate-50
                            px-5
                            py-4
                            md:flex-row
                            md:items-center
                            md:justify-between
                        "
                    >

                        <p className="text-xs text-slate-500">

                            Dernière mise à jour :
                            <span className="ml-1 font-medium">
                                {formatDateTime(
                                    new Date()
                                )}
                            </span>

                        </p>

                        <div
                            className="
                                flex
                                items-center
                                gap-5
                                text-sm
                            "
                        >

                            <span className="text-slate-500">

                                Entrées :

                                <strong
                                    className="
                                        ml-1
                                        text-emerald-600
                                    "
                                >
                                    {formatMoney(
                                        filteredStats.totalEntries
                                    )}
                                </strong>

                            </span>

                            <span className="text-slate-500">

                                Sorties :

                                <strong
                                    className="
                                        ml-1
                                        text-red-600
                                    "
                                >
                                    {formatMoney(
                                        filteredStats.totalExits
                                    )}
                                </strong>

                            </span>

                        </div>

                    </div>

                )}

            </div>

        </div>

    );

}