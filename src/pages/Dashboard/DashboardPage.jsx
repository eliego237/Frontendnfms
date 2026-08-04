import { useEffect, useMemo, useState } from "react";
import {
    Activity,
    ArrowDownRight,
    ArrowUpRight,
    BookOpen,
    CalendarDays,
    CheckCircle2,
    CircleDollarSign,
    CreditCard,
    GraduationCap,
    Loader2,
    RefreshCw,
    TrendingUp,
    UserRound,
    Wallet,
    AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import { getDashboard } from "../../services/dashboardService";

export default function DashboardPage() {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    async function loadDashboard(showRefresh = false) {

        try {

            if (showRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError(null);

            const data = await getDashboard();

            console.log("Dashboard :", data);

            setDashboard(data);

        } catch (err) {

            console.error("Erreur Dashboard :", err);

            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Impossible de charger le tableau de bord.";

            setError(message);

            if (showRefresh) {
                toast.error(message);
            }

        } finally {

            setLoading(false);
            setRefreshing(false);

        }

    }

    useEffect(() => {

        loadDashboard();

    }, []);

    const formatMoney = (value) => {

        const amount = Number(value ?? 0);

        return `${amount.toLocaleString("fr-FR")} FCFA`;

    };

    const statistics = dashboard?.statistics ?? {};

    const finance = dashboard?.finance ?? {};

    const chart = dashboard?.payments_chart ?? [];

    const latest = dashboard?.latest ?? {};

    const enrollments = latest.enrollments ?? [];

    const payments = latest.payments ?? [];

    const expenses = latest.expenses ?? [];

    const transactions = latest.transactions ?? [];

    const paymentRate = Number(finance.payment_rate ?? 0);

    const maxChartValue = useMemo(() => {

        if (!chart.length) {
            return 1;
        }

        return Math.max(
            ...chart.map((item) => Number(item.amount ?? 0)),
            1
        );

    }, [chart]);

    if (loading) {

        return (

            <div className="flex min-h-[500px] items-center justify-center">

                <div className="text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">

                        <Loader2
                            size={32}
                            className="animate-spin text-blue-600"
                        />

                    </div>

                    <h2 className="mt-5 text-xl font-bold text-slate-800">

                        Chargement du tableau de bord

                    </h2>

                    <p className="mt-2 text-slate-500">

                        Récupération des dernières données...

                    </p>

                </div>

            </div>

        );

    }

    if (error || !dashboard) {

        return (

            <div className="rounded-3xl border border-red-100 bg-white p-12 shadow-sm">

                <div className="mx-auto max-w-xl text-center">

                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-red-100">

                        <AlertCircle
                            size={40}
                            className="text-red-600"
                        />

                    </div>

                    <h2 className="mt-6 text-3xl font-extrabold text-red-600">

                        Impossible de charger le Dashboard

                    </h2>

                    <p className="mt-3 text-slate-500">

                        {error ||
                            "Vérifiez la connexion avec le serveur."}

                    </p>

                    <button
                        onClick={() => loadDashboard(true)}
                        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700"
                    >

                        <RefreshCw size={18} />

                        Réessayer

                    </button>

                </div>

            </div>

        );

    }

    return (

        <div className="space-y-8">

            {/* =====================================================
                HEADER
            ====================================================== */}

            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 p-8 text-white shadow-xl">

                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />

                <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-white/5" />

                <div className="relative flex flex-col justify-between gap-6 lg:flex-row lg:items-center">

                    <div>

                        <div className="mb-3 flex items-center gap-2 text-blue-100">

                            <CalendarDays size={18} />

                            <span className="text-sm font-medium">

                                Vue générale du centre

                            </span>

                        </div>

                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">

                            Dashboard

                        </h1>

                        <p className="mt-3 max-w-2xl text-lg text-blue-100">

                            Suivez en temps réel les étudiants,
                            formations, inscriptions et finances
                            de votre centre.

                        </p>

                    </div>

                    <button
                        onClick={() => loadDashboard(true)}
                        disabled={refreshing}
                        className="inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-6 py-4 font-bold text-blue-700 shadow-lg transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
                    >

                        <RefreshCw
                            size={20}
                            className={
                                refreshing
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        {refreshing
                            ? "Actualisation..."
                            : "Actualiser"}

                    </button>

                </div>

            </section>

            {/* =====================================================
                KPI PRINCIPAUX
            ====================================================== */}

            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

                <DashboardCard
                    title="Étudiants"
                    value={statistics.students ?? 0}
                    subtitle="Étudiants enregistrés"
                    icon={UserRound}
                    gradient="from-blue-600 to-cyan-500"
                />

                <DashboardCard
                    title="Formations"
                    value={statistics.trainings ?? 0}
                    subtitle="Formations disponibles"
                    icon={GraduationCap}
                    gradient="from-violet-600 to-purple-500"
                />

                <DashboardCard
                    title="Inscriptions"
                    value={statistics.enrollments ?? 0}
                    subtitle="Inscriptions enregistrées"
                    icon={BookOpen}
                    gradient="from-orange-500 to-amber-500"
                />

                <DashboardCard
                    title="Taux de paiement"
                    value={`${paymentRate.toFixed(2)} %`}
                    subtitle="Progression globale"
                    icon={TrendingUp}
                    gradient="from-emerald-600 to-green-500"
                />

            </section>

            {/* =====================================================
                FINANCES
            ====================================================== */}

            <section>

                <div className="mb-5 flex items-center justify-between">

                    <div>

                        <h2 className="text-2xl font-extrabold text-slate-900">

                            Situation financière

                        </h2>

                        <p className="mt-1 text-slate-500">

                            Vue synthétique des finances du centre.

                        </p>

                    </div>

                    <Wallet className="text-slate-400" />

                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

                    <FinanceCard
                        title="Recettes attendues"
                        value={formatMoney(
                            finance.expected_revenue
                        )}
                        icon={CircleDollarSign}
                        iconClass="bg-blue-100 text-blue-600"
                    />

                    <FinanceCard
                        title="Recettes encaissées"
                        value={formatMoney(
                            finance.collected_revenue
                        )}
                        icon={ArrowUpRight}
                        iconClass="bg-green-100 text-green-600"
                    />

                    <FinanceCard
                        title="Reste à encaisser"
                        value={formatMoney(
                            finance.remaining_revenue
                        )}
                        icon={ArrowDownRight}
                        iconClass="bg-orange-100 text-orange-600"
                    />

                    <FinanceCard
                        title="Solde caisse"
                        value={formatMoney(
                            finance.cash_balance
                        )}
                        icon={Wallet}
                        iconClass="bg-purple-100 text-purple-600"
                    />

                </div>

            </section>

            {/* =====================================================
                GRAPHIQUE + STATUTS
            ====================================================== */}

            <section className="grid gap-6 xl:grid-cols-3">

                {/* Graphique */}

                <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm xl:col-span-2">

                    <div className="mb-8 flex items-center justify-between">

                        <div>

                            <h2 className="text-2xl font-extrabold text-slate-900">

                                Évolution des paiements

                            </h2>

                            <p className="mt-1 text-slate-500">

                                Paiements enregistrés par mois.

                            </p>

                        </div>

                        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">

                            <Activity size={22} />

                        </div>

                    </div>

                    <div className="flex h-72 items-end gap-3 overflow-x-auto">

                        {chart.map((item, index) => {

                            const amount =
                                Number(item.amount ?? 0);

                            const height =
                                amount > 0
                                    ? Math.max(
                                        (amount /
                                            maxChartValue) *
                                            100,
                                        5
                                    )
                                    : 3;

                            return (

                                <div
                                    key={`${item.month}-${index}`}
                                    className="group flex min-w-[48px] flex-1 flex-col items-center justify-end gap-3"
                                >

                                    <div className="relative flex h-56 w-full items-end justify-center">

                                        <div
                                            className="w-full max-w-[42px] rounded-t-xl bg-gradient-to-t from-blue-600 to-indigo-400 transition-all duration-500 group-hover:from-indigo-600 group-hover:to-purple-500"
                                            style={{
                                                height: `${height}%`,
                                            }}
                                        />

                                        {amount > 0 && (

                                            <div className="absolute -top-8 rounded-lg bg-slate-900 px-2 py-1 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">

                                                {formatMoney(amount)}

                                            </div>

                                        )}

                                    </div>

                                    <span className="text-xs font-semibold text-slate-500">

                                        {item.month}

                                    </span>

                                </div>

                            );

                        })}

                    </div>

                </div>

                {/* Statuts */}

                <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

                    <div className="mb-7">

                        <h2 className="text-2xl font-extrabold text-slate-900">

                            Inscriptions

                        </h2>

                        <p className="mt-1 text-slate-500">

                            Répartition par statut.

                        </p>

                    </div>

                    <div className="space-y-5">

                        <StatusRow
                            label="En attente"
                            value={
                                statistics.pending_enrollments ??
                                0
                            }
                            color="bg-red-500"
                            icon={AlertCircle}
                        />

                        <StatusRow
                            label="Paiement partiel"
                            value={
                                statistics.partial_enrollments ??
                                0
                            }
                            color="bg-orange-500"
                            icon={Wallet}
                        />

                        <StatusRow
                            label="Soldées"
                            value={
                                statistics.paid_enrollments ??
                                0
                            }
                            color="bg-green-500"
                            icon={CheckCircle2}
                        />

                        <div className="mt-7 rounded-2xl bg-slate-50 p-5">

                            <p className="text-sm text-slate-500">

                                Étudiants avec un solde

                            </p>

                            <p className="mt-2 text-3xl font-extrabold text-slate-900">

                                {statistics.students_with_balance ??
                                    0}

                            </p>

                        </div>

                    </div>

                </div>

            </section>

            {/* =====================================================
                DERNIÈRES INSCRIPTIONS
            ====================================================== */}

            <section className="rounded-3xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-100 p-7">

                    <div className="flex items-center justify-between">

                        <div>

                            <h2 className="text-2xl font-extrabold text-slate-900">

                                Dernières inscriptions

                            </h2>

                            <p className="mt-1 text-slate-500">

                                Les dernières inscriptions enregistrées.

                            </p>

                        </div>

                        <BookOpen className="text-slate-400" />

                    </div>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-slate-50">

                            <tr className="text-left text-sm text-slate-500">

                                <th className="px-7 py-4">

                                    Étudiant

                                </th>

                                <th className="px-7 py-4">

                                    Formation

                                </th>

                                <th className="px-7 py-4">

                                    Total

                                </th>

                                <th className="px-7 py-4">

                                    Payé

                                </th>

                                <th className="px-7 py-4">

                                    Solde

                                </th>

                                <th className="px-7 py-4">

                                    Statut

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {enrollments.map((item) => (

                                <tr
                                    key={item.id}
                                    className="border-t border-slate-100 transition hover:bg-slate-50"
                                >

                                    <td className="px-7 py-5">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">

                                                {getInitials(
                                                    item.student
                                                )}

                                            </div>

                                            <div>

                                                <p className="font-bold text-slate-900">

                                                    {item.student?.first_name ??
                                                        ""}{" "}

                                                    {item.student?.last_name ??
                                                        ""}

                                                </p>

                                                <p className="text-sm text-slate-500">

                                                    {item.enrollment_number}

                                                </p>

                                            </div>

                                        </div>

                                    </td>

                                    <td className="px-7 py-5">

                                        <p className="font-semibold text-slate-800">

                                            {item.training?.title ??
                                                "Formation inconnue"}

                                        </p>

                                    </td>

                                    <td className="px-7 py-5 font-semibold">

                                        {formatMoney(
                                            item.total_amount
                                        )}

                                    </td>

                                    <td className="px-7 py-5 font-semibold text-green-600">

                                        {formatMoney(
                                            item.amount_paid
                                        )}

                                    </td>

                                    <td className="px-7 py-5 font-semibold text-red-600">

                                        {formatMoney(
                                            item.balance
                                        )}

                                    </td>

                                    <td className="px-7 py-5">

                                        <StatusBadge
                                            status={item.status}
                                        />

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </section>

            {/* =====================================================
                RÉSUMÉ ACTIVITÉ
            ====================================================== */}

            <section className="grid gap-6 md:grid-cols-3">

                <ActivityCard
                    title="Paiements du mois"
                    value={formatMoney(
                        finance.payments_month
                    )}
                    icon={CreditCard}
                    description="Total encaissé ce mois"
                />

                <ActivityCard
                    title="Dépenses du mois"
                    value={formatMoney(
                        finance.expenses_month
                    )}
                    icon={ArrowDownRight}
                    description="Dépenses enregistrées"
                />

                <ActivityCard
                    title="Paiements aujourd'hui"
                    value={formatMoney(
                        finance.payments_today
                    )}
                    icon={CircleDollarSign}
                    description="Encaissements du jour"
                />

            </section>

        </div>

    );

}


/* ================================================================
   COMPOSANTS INTERNES
================================================================ */

function DashboardCard({
    title,
    value,
    subtitle,
    icon: Icon,
    gradient,
}) {

    return (

        <div className="group overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl">

            <div className={`bg-gradient-to-r ${gradient} p-1`} />

            <div className="flex items-center justify-between p-6">

                <div>

                    <p className="text-sm font-semibold text-slate-500">

                        {title}

                    </p>

                    <p className="mt-2 text-3xl font-extrabold text-slate-900">

                        {value}

                    </p>

                    <p className="mt-1 text-xs text-slate-400">

                        {subtitle}

                    </p>

                </div>

                <div className={`rounded-2xl bg-gradient-to-r ${gradient} p-4 text-white shadow-lg`}>

                    <Icon size={25} />

                </div>

            </div>

        </div>

    );

}


function FinanceCard({
    title,
    value,
    icon: Icon,
    iconClass,
}) {

    return (

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg">

            <div className="flex items-center gap-4">

                <div className={`rounded-2xl p-4 ${iconClass}`}>

                    <Icon size={24} />

                </div>

                <div className="min-w-0">

                    <p className="text-sm text-slate-500">

                        {title}

                    </p>

                    <p className="mt-1 truncate text-xl font-extrabold text-slate-900">

                        {value}

                    </p>

                </div>

            </div>

        </div>

    );

}


function StatusRow({
    label,
    value,
    color,
    icon: Icon,
}) {

    return (

        <div className="flex items-center justify-between rounded-2xl border border-slate-100 p-4">

            <div className="flex items-center gap-3">

                <div className={`rounded-xl p-2 text-white ${color}`}>

                    <Icon size={17} />

                </div>

                <span className="font-semibold text-slate-700">

                    {label}

                </span>

            </div>

            <span className="text-xl font-extrabold text-slate-900">

                {value}

            </span>

        </div>

    );

}


function StatusBadge({ status }) {

    const config = {

        pending: {
            label: "En attente",
            className:
                "bg-red-100 text-red-700",
        },

        partial: {
            label: "Partielle",
            className:
                "bg-orange-100 text-orange-700",
        },

        paid: {
            label: "Soldée",
            className:
                "bg-green-100 text-green-700",
        },

    };

    const current =
        config[status] ?? {
            label: status ?? "Inconnu",
            className:
                "bg-slate-100 text-slate-700",
        };

    return (

        <span
            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${current.className}`}
        >

            {current.label}

        </span>

    );

}


function ActivityCard({
    title,
    value,
    icon: Icon,
    description,
}) {

    return (

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm font-semibold text-slate-500">

                        {title}

                    </p>

                    <p className="mt-2 text-2xl font-extrabold text-slate-900">

                        {value}

                    </p>

                    <p className="mt-1 text-xs text-slate-400">

                        {description}

                    </p>

                </div>

                <div className="rounded-2xl bg-slate-100 p-4 text-slate-700">

                    <Icon size={24} />

                </div>

            </div>

        </div>

    );

}


function getInitials(student) {

    if (!student) {
        return "?";
    }

    const first =
        student.first_name?.charAt(0) ?? "";

    const last =
        student.last_name?.charAt(0) ?? "";

    return `${first}${last}`.toUpperCase();

}