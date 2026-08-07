import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
    RefreshCw,
    Users,
    GraduationCap,
    BookOpen,
    TrendingUp,
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    CreditCard,
    Receipt,
    Landmark,
    CalendarDays,
    Eye,
} from "lucide-react";

import { getDashboard } from "../../services/dashboardService";

import PaymentsChart from "../../components/charts/PaymentsChart";

export default function DashboardPage() {

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    async function loadDashboard(showToast = false) {

        try {

            if (showToast) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            const data = await getDashboard();

            console.log("Dashboard :", data);

            setDashboard(data);

            if (showToast) {
                toast.success("Tableau de bord actualisé.");
            }

        } catch (error) {

            console.error("Erreur Dashboard :", error);

            if (error.response) {
                console.error("Status :", error.response.status);
                console.error("Data :", error.response.data);
            }

            toast.error(
                "Impossible de charger le tableau de bord."
            );

        } finally {

            setLoading(false);
            setRefreshing(false);

        }

    }

    useEffect(() => {

        loadDashboard();

    }, []);

    const paymentsChart = useMemo(() => {

        return dashboard?.payments_chart ?? [];

    }, [dashboard]);

    const latestEnrollments = useMemo(() => {

        return dashboard?.latest?.enrollments ?? [];

    }, [dashboard]);

    const latestPayments = useMemo(() => {

        return dashboard?.latest?.payments ?? [];

    }, [dashboard]);

    const latestExpenses = useMemo(() => {

        return dashboard?.latest?.expenses ?? [];

    }, [dashboard]);

    const latestTransactions = useMemo(() => {

        return dashboard?.latest?.transactions ?? [];

    }, [dashboard]);

    function formatMoney(value) {

        return `${Number(value ?? 0).toLocaleString(
            "fr-FR"
        )} FCFA`;

    }

    function formatDate(date) {

        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleDateString(
            "fr-FR",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }
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

    function getStudentName(student) {

        if (!student) {
            return "Étudiant inconnu";
        }

        return `${student.first_name ?? ""} ${
            student.last_name ?? ""
        }`.trim();

    }

    function getStatusLabel(status) {

        switch (status) {

            case "paid":
                return "Soldée";

            case "partial":
                return "Partielle";

            case "pending":
                return "En attente";

            case "cancelled":
                return "Annulée";

            default:
                return status ?? "—";

        }

    }

    function getStatusClass(status) {

        switch (status) {

            case "paid":
                return "bg-green-100 text-green-700";

            case "partial":
                return "bg-orange-100 text-orange-700";

            case "pending":
                return "bg-red-100 text-red-700";

            case "cancelled":
                return "bg-slate-100 text-slate-600";

            default:
                return "bg-slate-100 text-slate-600";

        }

    }

    if (loading) {

        return (

            <div className="flex min-h-[500px] items-center justify-center">

                <div className="text-center">

                    <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

                    <p className="font-semibold text-slate-600">

                        Chargement du tableau de bord...

                    </p>

                </div>

            </div>

        );

    }

    if (!dashboard) {

        return (

            <div className="rounded-3xl border border-red-100 bg-white p-16 text-center shadow-sm">

                <h2 className="text-3xl font-extrabold text-red-600">

                    Impossible de charger le Dashboard

                </h2>

                <p className="mt-3 text-slate-500">

                    Vérifiez la connexion avec le serveur.

                </p>

                <button
                    onClick={() => loadDashboard()}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                >

                    <RefreshCw size={18} />

                    Réessayer

                </button>

            </div>

        );

    }

    const statistics = dashboard.statistics ?? {};
    const finance = dashboard.finance ?? {};

    const statsCards = [

        {
            title: "Étudiants",
            value: statistics.students ?? 0,
            subtitle: "Étudiants enregistrés",
            icon: Users,
            gradient: "from-blue-500 to-cyan-500",
        },

        {
            title: "Formations",
            value: statistics.trainings ?? 0,
            subtitle: "Formations disponibles",
            icon: GraduationCap,
            gradient: "from-violet-500 to-purple-500",
        },

        {
            title: "Inscriptions",
            value: statistics.enrollments ?? 0,
            subtitle: "Inscriptions enregistrées",
            icon: BookOpen,
            gradient: "from-orange-500 to-amber-500",
        },

        {
            title: "Taux de paiement",
            value: `${Number(
                finance.payment_rate ?? 0
            ).toFixed(2)} %`,
            subtitle: "Progression globale",
            icon: TrendingUp,
            gradient: "from-emerald-500 to-green-500",
        },

    ];

    return (

        <div className="space-y-8 pb-12">

            {/* =====================================================
                HEADER
            ====================================================== */}

            <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 p-8 text-white shadow-xl">

                <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10" />

                <div className="absolute bottom-[-120px] left-[35%] h-72 w-72 rounded-full bg-white/10" />

                <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">

                    <div>

                        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-blue-100">

                            <CalendarDays size={17} />

                            Vue générale du centre

                        </div>

                        <h1 className="text-4xl font-black tracking-tight md:text-5xl">

                            Dashboard

                        </h1>

                        <p className="mt-3 max-w-2xl text-lg leading-relaxed text-blue-100">

                            Suivez en temps réel les étudiants,
                            formations, inscriptions et finances
                            de votre centre.

                        </p>

                    </div>

                    <button
                        onClick={() => loadDashboard(true)}
                        disabled={refreshing}
                        className="relative inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-7 py-4 font-bold text-blue-700 shadow-lg transition hover:scale-[1.02] hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
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
                KPI
            ====================================================== */}

            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

                {statsCards.map((card) => {

                    const Icon = card.icon;

                    return (

                        <div
                            key={card.title}
                            className="relative overflow-hidden rounded-[1.7rem] border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                        >

                            <div
                                className={`absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r ${card.gradient}`}
                            />

                            <div className="flex items-center justify-between">

                                <div>

                                    <p className="text-sm font-medium text-slate-500">

                                        {card.title}

                                    </p>

                                    <h2 className="mt-3 text-3xl font-black text-slate-900">

                                        {card.value}

                                    </h2>

                                    <p className="mt-2 text-xs text-slate-400">

                                        {card.subtitle}

                                    </p>

                                </div>

                                <div
                                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${card.gradient} text-white shadow-lg`}
                                >

                                    <Icon size={25} />

                                </div>

                            </div>

                        </div>

                    );

                })}

            </section>

            {/* =====================================================
                FINANCE
            ====================================================== */}

            <section>

                <div className="mb-5 flex items-center justify-between">

                    <div>

                        <h2 className="text-2xl font-black text-slate-900">

                            Situation financière

                        </h2>

                        <p className="mt-1 text-sm text-slate-500">

                            Vue synthétique des finances du centre.

                        </p>

                    </div>

                    <Wallet
                        className="text-slate-400"
                        size={26}
                    />

                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

                    <FinanceCard
                        title="Recettes attendues"
                        value={formatMoney(
                            finance.expected_revenue
                        )}
                        icon={CreditCard}
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

            <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">

                <div className="rounded-[1.7rem] border border-slate-200 bg-white p-7 shadow-sm">

                    <div className="mb-5 flex items-start justify-between">

                        <div>

                            <h2 className="text-2xl font-black text-slate-900">

                                Évolution des paiements

                            </h2>

                            <p className="mt-1 text-sm text-slate-500">

                                Paiements enregistrés par mois.

                            </p>

                        </div>

                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">

                            <TrendingUp size={23} />

                        </div>

                    </div>

                    <PaymentsChart
                        data={paymentsChart}
                    />

                </div>

                <div className="rounded-[1.7rem] border border-slate-200 bg-white p-7 shadow-sm">

                    <div className="mb-6">

                        <h2 className="text-2xl font-black text-slate-900">

                            Inscriptions

                        </h2>

                        <p className="mt-1 text-sm text-slate-500">

                            Répartition par statut.

                        </p>

                    </div>

                    <StatusRow
                        label="En attente"
                        value={statistics.pending_enrollments ?? 0}
                        icon="!"
                        className="bg-red-100 text-red-600"
                    />

                    <StatusRow
                        label="Paiement partiel"
                        value={statistics.partial_enrollments ?? 0}
                        icon="▣"
                        className="bg-orange-100 text-orange-600"
                    />

                    <StatusRow
                        label="Soldées"
                        value={statistics.paid_enrollments ?? 0}
                        icon="✓"
                        className="bg-green-100 text-green-600"
                    />

                    <div className="mt-5 rounded-2xl bg-slate-50 p-5">

                        <p className="text-sm text-slate-500">

                            Étudiants avec un solde

                        </p>

                        <p className="mt-2 text-3xl font-black text-slate-900">

                            {statistics.students_with_balance ?? 0}

                        </p>

                    </div>

                </div>

            </section>

            {/* =====================================================
                DERNIÈRES INSCRIPTIONS
            ====================================================== */}

            <DashboardSection
                title="Dernières inscriptions"
                subtitle="Les dernières inscriptions enregistrées."
                icon={BookOpen}
                actionText="Voir toutes"
                actionLink="/enrollments"
            >

                <div className="overflow-x-auto">

                    <table className="w-full min-w-[850px]">

                        <thead>

                            <tr className="border-b bg-slate-50 text-left text-sm text-slate-500">

                                <th className="px-7 py-4 font-semibold">
                                    Étudiant
                                </th>

                                <th className="px-5 py-4 font-semibold">
                                    Formation
                                </th>

                                <th className="px-5 py-4 font-semibold">
                                    Total
                                </th>

                                <th className="px-5 py-4 font-semibold">
                                    Payé
                                </th>

                                <th className="px-5 py-4 font-semibold">
                                    Solde
                                </th>

                                <th className="px-5 py-4 font-semibold">
                                    Statut
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {latestEnrollments.length === 0 ? (

                                <EmptyRow
                                    colSpan={6}
                                    text="Aucune inscription récente."
                                />

                            ) : (

                                latestEnrollments.map(
                                    (enrollment) => (

                                        <tr
                                            key={enrollment.id}
                                            className="border-b last:border-0 hover:bg-slate-50"
                                        >

                                            <td className="px-7 py-5">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">

                                                        {getInitials(
                                                            enrollment.student
                                                        )}

                                                    </div>

                                                    <div>

                                                        <p className="font-bold text-slate-900">

                                                            {getStudentName(
                                                                enrollment.student
                                                            )}

                                                        </p>

                                                        <p className="text-xs text-slate-500">

                                                            {enrollment.enrollment_number}

                                                        </p>

                                                    </div>

                                                </div>

                                            </td>

                                            <td className="px-5 py-5 font-medium text-slate-700">

                                                {enrollment.training?.title ?? "—"}

                                            </td>

                                            <td className="px-5 py-5 font-semibold">

                                                {formatMoney(
                                                    enrollment.total_amount
                                                )}

                                            </td>

                                            <td className="px-5 py-5 font-semibold text-green-600">

                                                {formatMoney(
                                                    enrollment.amount_paid
                                                )}

                                            </td>

                                            <td className="px-5 py-5 font-semibold text-red-600">

                                                {formatMoney(
                                                    enrollment.balance
                                                )}

                                            </td>

                                            <td className="px-5 py-5">

                                                <span
                                                    className={`rounded-full px-4 py-2 text-xs font-bold ${getStatusClass(
                                                        enrollment.status
                                                    )}`}
                                                >

                                                    {getStatusLabel(
                                                        enrollment.status
                                                    )}

                                                </span>

                                            </td>

                                        </tr>

                                    )
                                )

                            )}

                        </tbody>

                    </table>

                </div>

            </DashboardSection>

            {/* =====================================================
                DERNIERS PAIEMENTS
            ====================================================== */}

            <DashboardSection
                title="Derniers paiements"
                subtitle="Les dernières opérations d'encaissement."
                icon={CreditCard}
                actionText="Voir les paiements"
                actionLink="/payments"
            >

                <div className="divide-y divide-slate-100">

                    {latestPayments.length === 0 ? (

                        <EmptyState text="Aucun paiement récent." />

                    ) : (

                        latestPayments.map((payment) => {

                            const student =
                                payment.enrollment?.student;

                            return (

                                <div
                                    key={payment.id}
                                    className="flex flex-col gap-4 px-7 py-5 md:flex-row md:items-center md:justify-between"
                                >

                                    <div className="flex items-center gap-4">

                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600">

                                            <ArrowUpRight size={21} />

                                        </div>

                                        <div>

                                            <p className="font-bold text-slate-900">

                                                {getStudentName(
                                                    student
                                                )}

                                            </p>

                                            <p className="text-sm text-slate-500">

                                                {payment.receipt_number ??
                                                    "Paiement"}

                                                {" • "}

                                                {payment.paymentMethod?.name ??
                                                    payment.payment_method?.name ??
                                                    "Moyen non précisé"}

                                            </p>

                                        </div>

                                    </div>

                                    <div className="text-left md:text-right">

                                        <p className="font-black text-green-600">

                                            + {formatMoney(
                                                payment.amount
                                            )}

                                        </p>

                                        <p className="text-xs text-slate-400">

                                            {formatDate(
                                                payment.payment_date
                                            )}

                                        </p>

                                    </div>

                                </div>

                            );

                        })

                    )}

                </div>

            </DashboardSection>

            {/* =====================================================
                DEPENSES + CAISSE
            ====================================================== */}

            <section className="grid gap-6 xl:grid-cols-2">

                <DashboardSection
                    title="Dernières dépenses"
                    subtitle="Les dernières dépenses enregistrées."
                    icon={Receipt}
                    actionText="Voir les dépenses"
                    actionLink="/expenses"
                >

                    <div className="divide-y divide-slate-100">

                        {latestExpenses.length === 0 ? (

                            <EmptyState text="Aucune dépense récente." />

                        ) : (

                            latestExpenses.map((expense) => (

                                <div
                                    key={expense.id}
                                    className="flex items-center justify-between gap-4 px-7 py-5"
                                >

                                    <div className="flex items-center gap-4">

                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600">

                                            <ArrowDownRight size={21} />

                                        </div>

                                        <div>

                                            <p className="font-bold text-slate-900">

                                                {expense.title ??
                                                    expense.category ??
                                                    "Dépense"}

                                            </p>

                                            <p className="text-sm text-slate-500">

                                                {expense.expense_number ??
                                                    "—"}

                                                {" • "}

                                                {formatDate(
                                                    expense.expense_date
                                                )}

                                            </p>

                                        </div>

                                    </div>

                                    <p className="font-black text-red-600">

                                        - {formatMoney(
                                            expense.amount
                                        )}

                                    </p>

                                </div>

                            ))

                        )}

                    </div>

                </DashboardSection>

                <DashboardSection
                    title="Dernières opérations de caisse"
                    subtitle="Les mouvements récents de la caisse."
                    icon={Landmark}
                >

                    <div className="divide-y divide-slate-100">

                        {latestTransactions.length === 0 ? (

                            <EmptyState text="Aucune opération récente." />

                        ) : (

                            latestTransactions.map(
                                (transaction) => {

                                    const income =
                                        transaction.type ===
                                        "Entrée";

                                    return (

                                        <div
                                            key={transaction.id}
                                            className="flex items-center justify-between gap-4 px-7 py-5"
                                        >

                                            <div className="flex items-center gap-4">

                                                <div
                                                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                                                        income
                                                            ? "bg-green-100 text-green-600"
                                                            : "bg-red-100 text-red-600"
                                                    }`}
                                                >

                                                    {income ? (
                                                        <ArrowUpRight
                                                            size={21}
                                                        />
                                                    ) : (
                                                        <ArrowDownRight
                                                            size={21}
                                                        />
                                                    )}

                                                </div>

                                                <div>

                                                    <p className="font-bold text-slate-900">

                                                        {transaction.category ??
                                                            transaction.description ??
                                                            "Opération de caisse"}

                                                    </p>

                                                    <p className="text-sm text-slate-500">

                                                        {transaction.transaction_number ??
                                                            "—"}

                                                        {" • "}

                                                        {formatDate(
                                                            transaction.transaction_date
                                                        )}

                                                    </p>

                                                </div>

                                            </div>

                                            <p
                                                className={`font-black ${
                                                    income
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >

                                                {income ? "+" : "-"}

                                                {" "}

                                                {formatMoney(
                                                    transaction.amount
                                                )}

                                            </p>

                                        </div>

                                    );

                                }
                            )

                        )}

                    </div>

                </DashboardSection>

            </section>

            {/* =====================================================
                MINI FINANCE CARDS
            ====================================================== */}

            <section className="grid gap-5 md:grid-cols-3">

                <MiniFinanceCard
                    title="Paiements du mois"
                    value={formatMoney(
                        finance.payments_month
                    )}
                    subtitle="Total encaissé ce mois"
                    icon={CreditCard}
                />

                <MiniFinanceCard
                    title="Dépenses du mois"
                    value={formatMoney(
                        finance.expenses_month
                    )}
                    subtitle="Dépenses enregistrées"
                    icon={ArrowDownRight}
                />

                <MiniFinanceCard
                    title="Paiements aujourd'hui"
                    value={formatMoney(
                        finance.payments_today
                    )}
                    subtitle="Encaissements du jour"
                    icon={Wallet}
                />

            </section>

        </div>

    );

}


/* ================================================================
   FINANCE CARD
================================================================ */

function FinanceCard({
    title,
    value,
    icon: Icon,
    iconClass,
}) {

    return (

        <div className="flex items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

            <div>

                <p className="text-sm text-slate-500">

                    {title}

                </p>

                <p className="mt-2 text-xl font-black text-slate-900">

                    {value}

                </p>

            </div>

            <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconClass}`}
            >

                <Icon size={24} />

            </div>

        </div>

    );

}


/* ================================================================
   STATUS ROW
================================================================ */

function StatusRow({
    label,
    value,
    icon,
    className,
}) {

    return (

        <div className="mb-4 flex items-center justify-between rounded-2xl border border-slate-100 p-4">

            <div className="flex items-center gap-3">

                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl font-bold ${className}`}
                >

                    {icon}

                </div>

                <span className="font-semibold text-slate-700">

                    {label}

                </span>

            </div>

            <span className="text-lg font-black text-slate-900">

                {value}

            </span>

        </div>

    );

}


/* ================================================================
   SECTION
================================================================ */

function DashboardSection({
    title,
    subtitle,
    icon: Icon,
    actionText,
    actionLink,
    children,
}) {

    return (

        <section className="overflow-hidden rounded-[1.7rem] border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-100 px-7 py-6">

                <div className="flex items-center gap-4">

                    <div>

                        <h2 className="text-2xl font-black text-slate-900">

                            {title}

                        </h2>

                        <p className="mt-1 text-sm text-slate-500">

                            {subtitle}

                        </p>

                    </div>

                </div>

                {actionText && actionLink ? (

                    <a
                        href={actionLink}
                        className="hidden items-center gap-2 rounded-xl bg-slate-50 px-4 py-2 text-sm font-bold text-blue-600 transition hover:bg-blue-50 md:inline-flex"
                    >

                        {actionText}

                        <Eye size={16} />

                    </a>

                ) : (

                    Icon && (

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 text-slate-500">

                            <Icon size={21} />

                        </div>

                    )

                )}

            </div>

            {children}

        </section>

    );

}


/* ================================================================
   MINI CARD
================================================================ */

function MiniFinanceCard({
    title,
    value,
    subtitle,
    icon: Icon,
}) {

    return (

        <div className="flex items-center justify-between rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">

            <div>

                <p className="text-sm text-slate-500">

                    {title}

                </p>

                <p className="mt-2 text-2xl font-black text-slate-900">

                    {value}

                </p>

                <p className="mt-1 text-xs text-slate-400">

                    {subtitle}

                </p>

            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">

                <Icon size={23} />

            </div>

        </div>

    );

}


/* ================================================================
   EMPTY STATE
================================================================ */

function EmptyState({ text }) {

    return (

        <div className="px-7 py-12 text-center text-sm text-slate-400">

            {text}

        </div>

    );

}


/* ================================================================
   EMPTY TABLE ROW
================================================================ */

function EmptyRow({
    colSpan,
    text,
}) {

    return (

        <tr>

            <td
                colSpan={colSpan}
                className="px-7 py-12 text-center text-sm text-slate-400"
            >

                {text}

            </td>

        </tr>

    );

}