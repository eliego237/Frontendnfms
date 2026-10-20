
import { useCallback, useEffect, useState } from "react";
import api from "../../services/api";
import {
    CreditCard,
    Search,
    CalendarDays,
    RefreshCw,
    Wallet,
    Banknote,
    TrendingUp,
    Receipt,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

const PER_PAGE = 20;

export default function PaymentsReportPage() {
    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState([]);
    const [search, setSearch] = useState("");

    const [trainingFilter, setTrainingFilter] = useState("all");
    const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [from, setFrom] = useState(0);
    const [to, setTo] = useState(0);

    const [stats, setStats] = useState({
        totalPayments: 0,
        totalAmount: 0,
        todayAmount: 0,
        averageAmount: 0,
        paymentMethods: [],
    });

    /*
    |--------------------------------------------------------------------------
    | Chargement des paiements avec pagination serveur
    |--------------------------------------------------------------------------
    */

    const loadPayments = useCallback(async (page = 1) => {
        try {
            setLoading(true);

            const params = {
                page,
                per_page: PER_PAGE,
            };

            if (dateFrom) params.date_from = dateFrom;
            if (dateTo) params.date_to = dateTo;

            if (trainingFilter !== "all") {
                params.training_id = trainingFilter;
            }

            if (paymentMethodFilter !== "all") {
                params.payment_method_id = paymentMethodFilter;
            }

            const response = await api.get("/reports/payments", {
                params,
            });

            const report =
                response?.data?.data ??
                response?.data ??
                {};

            const paginator = report?.payments ?? {};
            const paymentList = Array.isArray(paginator.data)
                ? paginator.data
                : Array.isArray(report.payments)
                    ? report.payments
                    : [];

            setPayments(paymentList);

            // Métadonnées de pagination Laravel
            const totalItems = Number(
                paginator.total ?? report.total_payments ?? paymentList.length
            );

            const pageSize = Number(
                paginator.per_page ?? PER_PAGE
            );

            const pageCount = Number(
                paginator.last_page ??
                Math.max(1, Math.ceil(totalItems / pageSize))
            );

            const activePage = Number(
                paginator.current_page ?? page
            );

            setTotal(totalItems);
            setLastPage(Math.max(1, pageCount));
            setCurrentPage(activePage);
            setFrom(Number(paginator.from ?? (
                paymentList.length ? (activePage - 1) * pageSize + 1 : 0
            )));
            setTo(Number(paginator.to ?? (
                paymentList.length
                    ? (activePage - 1) * pageSize + paymentList.length
                    : 0
            )));

            // Statistiques globales fournies par le backend
            setStats({
                totalPayments: Number(
                    report.total_payments ?? paginator.total ?? 0
                ),
                totalAmount: Number(report.total_amount ?? 0),
                todayAmount: Number(report.today_amount ?? 0),
                averageAmount: Number(report.average_amount ?? 0),
                paymentMethods: report.payment_methods ?? [],
            });
        } catch (error) {
            console.error(
                "Erreur chargement rapport paiements :",
                error.response?.data ?? error
            );

            setPayments([]);
            setTotal(0);
            setFrom(0);
            setTo(0);
            setLastPage(1);
        } finally {
            setLoading(false);
        }
    }, [
        dateFrom,
        dateTo,
        trainingFilter,
        paymentMethodFilter,
    ]);

    useEffect(() => {
        loadPayments(currentPage);
    }, [loadPayments, currentPage]);

    /*
    |--------------------------------------------------------------------------
    | Helpers
    |--------------------------------------------------------------------------
    */

    function formatMoney(value) {
        return new Intl.NumberFormat("fr-FR", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(Number(value ?? 0)) + " FCFA";
    }

    function formatDate(date) {
        if (!date) return "—";

        const parsed = new Date(date);

        if (Number.isNaN(parsed.getTime())) {
            return "—";
        }

        return parsed.toLocaleDateString("fr-FR");
    }

    function getStudentName(payment) {
        const student = payment?.enrollment?.student;

        if (!student) return "Étudiant inconnu";

        return [
            student.first_name,
            student.last_name,
        ].filter(Boolean).join(" ");
    }

    function getTrainingName(payment) {
        const enrollment = payment?.enrollment;

        // Compatibilité avec une inscription liée à plusieurs formations
        const trainings = enrollment?.trainings;

        if (Array.isArray(trainings) && trainings.length > 0) {
            return trainings
                .map((training) => training?.title ?? training?.name)
                .filter(Boolean)
                .join(", ");
        }

        return (
            enrollment?.training?.title ??
            enrollment?.training?.name ??
            "—"
        );
    }

    function getPaymentMethod(payment) {
        return (
            payment?.paymentMethod?.name ??
            payment?.payment_method?.name ??
            payment?.payment_method ??
            "—"
        );
    }

    function getPaymentMethodId(payment) {
        return (
            payment?.payment_method_id ??
            payment?.paymentMethod?.id ??
            payment?.payment_method?.id ??
            null
        );
    }

    function getPaymentNumber(payment) {
        return (
            payment?.payment_number ??
            payment?.reference ??
            `PAY-${payment?.id ?? "—"}`
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Recherche locale dans la page chargée
    |--------------------------------------------------------------------------
    */

    const filteredPayments = payments.filter((payment) => {
        if (!search.trim()) return true;

        const term = search.toLowerCase().trim();

        const searchable = [
            getStudentName(payment),
            getTrainingName(payment),
            getPaymentMethod(payment),
            getPaymentNumber(payment),
            payment?.amount,
        ].filter(Boolean).join(" ").toLowerCase();

        return searchable.includes(term);
    });

    /*
    |--------------------------------------------------------------------------
    | Navigation pagination
    |--------------------------------------------------------------------------
    */

    function changePage(page) {
        if (page < 1 || page > lastPage || page === currentPage) {
            return;
        }

        setCurrentPage(page);
    }

    function resetFiltersAndReload() {
        setCurrentPage(1);
        setSearch("");
        setTrainingFilter("all");
        setPaymentMethodFilter("all");
        setDateFrom("");
        setDateTo("");
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
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
                    <p className="mt-4 text-slate-600">
                        Chargement du rapport des paiements...
                    </p>
                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Affichage
    |--------------------------------------------------------------------------
    */

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl">
                <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
                    <div className="flex items-center gap-5">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
                            <CreditCard size={32} />
                        </div>

                        <div>
                            <p className="mb-1 text-sm font-medium text-blue-100">
                                Analyse & statistiques • Rapports
                            </p>
                            <h1 className="text-3xl font-bold">
                                Rapport des paiements
                            </h1>
                            <p className="mt-2 text-blue-100">
                                Consultez et analysez l'historique des paiements enregistrés.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => loadPayments(currentPage)}
                        className="flex items-center gap-2 rounded-xl bg-white/15 px-5 py-3 font-medium backdrop-blur transition hover:bg-white/25"
                    >
                        <RefreshCw size={18} />
                        Actualiser
                    </button>
                </div>
            </div>

            {/* STATISTIQUES GLOBALES */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    title="Total paiements"
                    value={stats.totalPayments}
                    icon={Receipt}
                />

                <StatCard
                    title="Montant encaissé"
                    value={formatMoney(stats.totalAmount)}
                    icon={Wallet}
                />

                <StatCard
                    title="Paiements aujourd'hui"
                    value={formatMoney(stats.todayAmount)}
                    icon={TrendingUp}
                />

                <StatCard
                    title="Paiement moyen"
                    value={formatMoney(stats.averageAmount)}
                    icon={Banknote}
                />
            </div>

            {/* FILTRES */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Filtres
                        </h2>
                        <p className="text-sm text-slate-500">
                            Affinez les paiements à consulter.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={resetFiltersAndReload}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                    >
                        Réinitialiser les filtres
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {/* Recherche */}
                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Rechercher sur cette page..."
                            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />
                    </div>

                    {/* Formation */}
                    <select
                        value={trainingFilter}
                        onChange={(e) => {
                            setTrainingFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="all">Toutes les formations</option>

                        {[...new Map(
                            payments
                                .flatMap((payment) => {
                                    const enrollment = payment?.enrollment;

                                    if (
                                        Array.isArray(enrollment?.trainings) &&
                                        enrollment.trainings.length
                                    ) {
                                        return enrollment.trainings;
                                    }

                                    return enrollment?.training
                                        ? [enrollment.training]
                                        : [];
                                })
                                .filter((training) => training?.id != null)
                                .map((training) => [String(training.id), training])
                        ).values()].map((training) => (
                            <option key={training.id} value={training.id}>
                                {training.title ?? training.name ?? "Formation"}
                            </option>
                        ))}
                    </select>

                    {/* Mode de paiement */}
                    <select
                        value={paymentMethodFilter}
                        onChange={(e) => {
                            setPaymentMethodFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                        <option value="all">Tous les modes de paiement</option>

                        {[...new Map(
                            payments
                                .map((payment) => {
                                    const method =
                                        payment?.paymentMethod ??
                                        (
                                            typeof payment?.payment_method === "object"
                                                ? payment.payment_method
                                                : null
                                        );

                                    return method?.id != null
                                        ? [String(method.id), method]
                                        : null;
                                })
                                .filter(Boolean)
                        ).values()].map((method) => (
                            <option key={method.id} value={method.id}>
                                {method.name ?? "Mode de paiement"}
                            </option>
                        ))}
                    </select>

                    {/* Dates */}
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <CalendarDays
                                size={17}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="date"
                                aria-label="Date de début"
                                value={dateFrom}
                                onChange={(e) => {
                                    setDateFrom(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-2 outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="flex-1">
                            <input
                                type="date"
                                aria-label="Date de fin"
                                value={dateTo}
                                onChange={(e) => {
                                    setDateTo(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full rounded-xl border border-slate-200 px-3 py-3 outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* TABLEAU */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col justify-between gap-4 border-b border-slate-200 px-6 py-5 md:flex-row md:items-center">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Historique des paiements
                        </h2>
                        <p className="text-sm text-slate-500">
                            {filteredPayments.length} affiché(s) sur {total} paiement(s) au total
                            {search.trim() ? " — recherche limitée à la page actuelle" : ""}
                        </p>
                    </div>

                    <div className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
                        {formatMoney(
                            filteredPayments.reduce(
                                (sum, payment) =>
                                    sum + Number(payment?.amount ?? 0),
                                0
                            )
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[950px]">
                        <thead>
                            <tr className="border-b border-slate-200 bg-slate-50">
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                    Référence
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                    Étudiant
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                                    Formation
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
                            {filteredPayments.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center">
                                            <Receipt size={40} className="text-slate-300" />
                                            <p className="mt-3 font-semibold text-slate-600">
                                                Aucun paiement trouvé
                                            </p>
                                            <p className="mt-1 text-sm text-slate-400">
                                                Modifiez votre recherche ou vos filtres.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredPayments.map((payment) => (
                                    <tr
                                        key={payment.id}
                                        className="border-b border-slate-100 transition hover:bg-slate-50"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="font-semibold text-blue-600">
                                                {getPaymentNumber(payment)}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="font-semibold text-slate-900">
                                                {getStudentName(payment)}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 text-slate-600">
                                            {getTrainingName(payment)}
                                        </td>

                                        <td className="px-6 py-4 text-slate-600">
                                            {formatDate(
                                                payment?.payment_date ??
                                                payment?.date ??
                                                payment?.created_at
                                            )}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                                {getPaymentMethod(payment)}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <span className="font-bold text-emerald-600">
                                                {formatMoney(payment?.amount)}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION */}
                <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-600">
                        {total > 0 ? (
                            <>
                                Affichage de{" "}
                                <span className="font-semibold">{from}</span>
                                {" à "}
                                <span className="font-semibold">{to}</span>
                                {" sur "}
                                <span className="font-semibold">{total}</span>
                                {" paiements"}
                            </>
                        ) : (
                            "Aucun paiement à afficher"
                        )}
                    </p>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                        <button
                            type="button"
                            onClick={() => changePage(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="flex items-center gap-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft size={18} />
                            Précédent
                        </button>

                        <span className="whitespace-nowrap text-sm font-semibold text-slate-700">
                            Page {currentPage} / {lastPage}
                        </span>

                        <button
                            type="button"
                            onClick={() => changePage(currentPage + 1)}
                            disabled={currentPage >= lastPage}
                            className="flex items-center gap-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
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

/*
|--------------------------------------------------------------------------
| Carte statistique
|--------------------------------------------------------------------------
*/

function StatCard({ title, value, icon: Icon }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        {title}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-slate-900">
                        {value}
                    </p>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={22} />
                </div>
            </div>
        </div>
    );
}
