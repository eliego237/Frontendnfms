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
} from "lucide-react";

export default function PaymentsReportPage() {

    /*
    |--------------------------------------------------------------------------
    | States
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] = useState(true);

    const [payments, setPayments] = useState([]);

    const [stats, setStats] = useState({
        totalPayments: 0,
        totalAmount: 0,
        todayAmount: 0,
        averageAmount: 0,
        paymentMethods: [],
    });

    const [search, setSearch] = useState("");

    const [trainingFilter, setTrainingFilter] = useState("all");

    const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");

    const [dateFrom, setDateFrom] = useState("");

    const [dateTo, setDateTo] = useState("");

    /*
    |--------------------------------------------------------------------------
    | Chargement
    |--------------------------------------------------------------------------
    */

const loadPayments = useCallback(async () => {
    try {

        setLoading(true);

        const params = {};

        if (dateFrom) params.date_from = dateFrom;
        if (dateTo) params.date_to = dateTo;

        if (trainingFilter !== "all") {
            params.training_id = trainingFilter;
        }

        if (paymentMethodFilter !== "all") {
            params.payment_method_id = paymentMethodFilter;
        }

        const response = await api.get(
            "/reports/payments",
            {
                params,
            }
        );

        console.log("Réponse :", response.data);

        const report = response.data.data;

        setPayments(report.payments.data);

        setStats({
            totalPayments: Number(report.total_payments ?? 0),
            totalAmount: Number(report.total_amount ?? 0),
            todayAmount: Number(report.today_amount ?? 0),
            averageAmount: Number(report.average_amount ?? 0),
            paymentMethods: report.payment_methods ?? [],
        });

    } catch (error) {

        console.log(error.response);

        setPayments([]);

    } finally {

        setLoading(false);

    }

}, [
    dateFrom,
    dateTo,
    trainingFilter,
    paymentMethodFilter,
]);
    /*
    |--------------------------------------------------------------------------
    | useEffect
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadPayments();

    }, [loadPayments]);

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

    function getStudentName(payment) {

        const student =
            payment?.enrollment?.student;

        if (!student) {
            return "Étudiant inconnu";
        }

        return [
            student.first_name,
            student.last_name,
        ]
            .filter(Boolean)
            .join(" ");
    }

    function getTrainingName(payment) {

        return (
            payment?.enrollment?.training?.title ??
            payment?.enrollment?.training?.name ??
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

    function getPaymentNumber(payment) {

        return (
            payment?.payment_number ??
            payment?.reference ??
            `PAY-${payment?.id ?? "—"}`
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Filtrage local recherche
    |--------------------------------------------------------------------------
    */

    const filteredPayments = payments.filter((payment) => {

        if (!search.trim()) {
            return true;
        }

        const term =
            search.toLowerCase().trim();

        const searchable = [

            getStudentName(payment),

            getTrainingName(payment),

            getPaymentMethod(payment),

            getPaymentNumber(payment),

            payment?.amount,

        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return searchable.includes(term);

    });

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
                            mx-auto h-12 w-12
                            animate-spin rounded-full
                            border-4 border-slate-200
                            border-t-blue-600
                        "
                    />

                    <p className="mt-4 text-slate-600">

                        Chargement du rapport des paiements...

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
                                flex h-16 w-16
                                items-center justify-center
                                rounded-2xl
                                bg-white/15
                                backdrop-blur
                            "
                        >

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

                                Consultez et analysez l'historique
                                des paiements enregistrés.

                            </p>

                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={loadPayments}
                        className="
                            flex items-center gap-2
                            rounded-xl
                            bg-white/15
                            px-5 py-3
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
                    title="Total paiements"
                    value={stats.totalPayments}
                    icon={Receipt}
                    suffix=""
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

                <div className="mb-4 flex items-center justify-between">

                    <div>

                        <h2 className="text-lg font-bold text-slate-900">

                            Filtres

                        </h2>

                        <p className="text-sm text-slate-500">

                            Affinez les paiements à consulter.

                        </p>

                    </div>

                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

                    {/* Recherche */}

                    <div className="relative">

                        <Search
                            size={18}
                            className="
                                absolute left-3 top-1/2
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
                                w-full rounded-xl
                                border border-slate-200
                                py-3 pl-10 pr-4
                                outline-none
                                transition
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "
                        />

                    </div>

                    {/* Formation */}

                    <select
                        value={trainingFilter}
                        onChange={(e) =>
                            setTrainingFilter(e.target.value)
                        }
                        className="
                            rounded-xl
                            border border-slate-200
                            px-4 py-3
                            outline-none
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-100
                        "
                    >

                        <option value="all">

                            Toutes les formations

                        </option>

                        {[
                            ...new Map(
                                payments
                                    .map((payment) => {

                                        const training =
                                            payment?.enrollment?.training;

                                        return training
                                            ? [
                                                training.id,
                                                training,
                                            ]
                                            : null;

                                    })
                                    .filter(Boolean)
                            ).values()
                        ].map((training) => (

                            <option
                                key={training.id}
                                value={training.id}
                            >

                                {training.title ??
                                    training.name ??
                                    "Formation"}

                            </option>

                        ))}

                    </select>

                    {/* Mode paiement */}

                    <select
                        value={paymentMethodFilter}
                        onChange={(e) =>
                            setPaymentMethodFilter(e.target.value)
                        }
                        className="
                            rounded-xl
                            border border-slate-200
                            px-4 py-3
                            outline-none
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-100
                        "
                    >

                        <option value="all">

                            Tous les modes de paiement

                        </option>

                        {[
                            ...new Map(
                                payments
                                    .map((payment) => {

                                        const method =
                                            payment?.paymentMethod;

                                        return method
                                            ? [
                                                method.id,
                                                method,
                                            ]
                                            : null;

                                    })
                                    .filter(Boolean)
                            ).values()
                        ].map((method) => (

                            <option
                                key={method.id}
                                value={method.id}
                            >

                                {method.name}

                            </option>

                        ))}

                    </select>

                    {/* Date */}

                    <div className="flex gap-2">

                        <div className="relative flex-1">

                            <CalendarDays
                                size={17}
                                className="
                                    absolute left-3 top-1/2
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
                                    w-full rounded-xl
                                    border border-slate-200
                                    py-3 pl-10 pr-2
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
                                    w-full rounded-xl
                                    border border-slate-200
                                    px-3 py-3
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

                            Historique des paiements

                        </h2>

                        <p className="text-sm text-slate-500">

                            {filteredPayments.length} paiement
                            {filteredPayments.length > 1 ? "s" : ""}

                        </p>

                    </div>

                    <div className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">

                        {formatMoney(
                            filteredPayments.reduce(
                                (sum, payment) =>
                                    sum +
                                    Number(payment?.amount ?? 0),
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

                                                Aucun paiement trouvé

                                            </p>

                                            <p className="mt-1 text-sm text-slate-400">

                                                Modifiez vos filtres pour
                                                afficher les résultats.

                                            </p>

                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                filteredPayments.map((payment) => (

                                    <tr
                                        key={payment.id}
                                        className="
                                            border-b
                                            border-slate-100
                                            transition
                                            hover:bg-slate-50
                                        "
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

                                            <span
                                                className="
                                                    inline-flex
                                                    rounded-full
                                                    bg-slate-100
                                                    px-3 py-1
                                                    text-xs
                                                    font-semibold
                                                    text-slate-700
                                                "
                                            >

                                                {getPaymentMethod(payment)}

                                            </span>

                                        </td>

                                        <td className="px-6 py-4 text-right">

                                            <span className="font-bold text-emerald-600">

                                                {formatMoney(
                                                    payment?.amount
                                                )}

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
                border border-slate-200
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
                        flex h-11 w-11
                        items-center justify-center
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