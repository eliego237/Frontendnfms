import {
    Wallet,
    CircleDollarSign,
    TrendingUp,
    AlertTriangle,
    CheckCircle2,
    BarChart3,
} from "lucide-react";

export default function PaymentFinanceCard({ payment }) {

    const enrollment = payment?.enrollment || {};

    const total = Number(enrollment.total_amount || 0);

    const amountPaid = Number(enrollment.amount_paid || 0);

    const balance = Number(enrollment.balance || 0);

    const paymentAmount = Number(payment?.amount || 0);

    const progress = Number(enrollment.payment_progress || 0);

    function money(value) {

        return Number(value).toLocaleString(
            "fr-FR",
            {
                style: "currency",
                currency: "XAF",
                minimumFractionDigits: 0,
            }
        );

    }

    return (

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

            {/* ================= HEADER ================= */}

            <div className="border-b border-slate-200 p-6">

                <div className="flex items-center gap-4">

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">

                        <Wallet
                            size={30}
                            className="text-green-600"
                        />

                    </div>

                    <div>

                        <h2 className="text-xl font-bold">

                            Situation financière

                        </h2>

                        <p className="text-slate-500">

                            État financier de l'inscription

                        </p>

                    </div>

                </div>

            </div>

            {/* ================= BODY ================= */}

            <div className="grid gap-5 p-6">

                <div className="rounded-2xl border bg-slate-50 p-5">

                    <div className="flex items-center gap-3">

                        <CircleDollarSign
                            size={22}
                            className="text-slate-600"
                        />

                        <span>Total de la formation</span>

                    </div>

                    <p className="mt-3 text-3xl font-bold">

                        {money(total)}

                    </p>

                </div>

                <div className="rounded-2xl border bg-green-50 p-5">

                    <div className="flex items-center gap-3">

                        <TrendingUp
                            size={22}
                            className="text-green-600"
                        />

                        <span>Total payé</span>

                    </div>

                    <p className="mt-3 text-3xl font-bold text-green-600">

                        {money(amountPaid)}

                    </p>

                </div>

                <div className="rounded-2xl border bg-blue-50 p-5">

                    <div className="flex items-center gap-3">

                        <Wallet
                            size={22}
                            className="text-blue-600"
                        />

                        <span>Dernier paiement</span>

                    </div>

                    <p className="mt-3 text-3xl font-bold text-blue-600">

                        {money(paymentAmount)}

                    </p>

                </div>

                <div className="rounded-2xl border bg-red-50 p-5">

                    <div className="flex items-center gap-3">

                        <AlertTriangle
                            size={22}
                            className="text-red-600"
                        />

                        <span>Reste à payer</span>

                    </div>

                    <p className="mt-3 text-3xl font-bold text-red-600">

                        {money(balance)}

                    </p>

                </div>

            </div>

            {/* ================= PROGRESSION ================= */}

            <div className="px-6 pb-6">

                <div className="mb-3 flex items-center justify-between">

                    <div className="flex items-center gap-2">

                        <BarChart3
                            size={18}
                            className="text-blue-600"
                        />

                        <span className="font-medium">

                            Progression du paiement

                        </span>

                    </div>

                    <span className="font-bold">

                        {progress.toFixed(2)}%

                    </span>

                </div>

                <div className="h-4 overflow-hidden rounded-full bg-slate-200">

                    <div
                        className="h-full rounded-full bg-green-500 transition-all duration-700"
                        style={{
                            width: `${progress}%`,
                        }}
                    />

                </div>

            </div>

            {/* ================= FOOTER ================= */}

            <div className="border-t border-slate-200 bg-slate-50 p-6">

                {

                    balance <= 0 ? (

                        <div className="flex items-center gap-4 rounded-2xl bg-green-100 p-4">

                            <CheckCircle2
                                size={28}
                                className="text-green-600"
                            />

                            <div>

                                <p className="font-bold text-green-700">

                                    Formation entièrement soldée

                                </p>

                                <p className="text-sm text-green-600">

                                    Aucun paiement supplémentaire n'est nécessaire.

                                </p>

                            </div>

                        </div>

                    ) : (

                        <div className="flex items-center gap-4 rounded-2xl bg-orange-100 p-4">

                            <AlertTriangle
                                size={28}
                                className="text-orange-600"
                            />

                            <div>

                                <p className="font-bold text-orange-700">

                                    Paiement partiel

                                </p>

                                <p className="text-sm text-orange-600">

                                    Il reste {money(balance)} à encaisser.

                                </p>

                            </div>

                        </div>

                    )

                }

            </div>

        </div>

    );

}