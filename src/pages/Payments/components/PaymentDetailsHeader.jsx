import {
    ArrowLeft,
    Receipt,
    CheckCircle2,
    Calendar,
} from "lucide-react";

export default function PaymentDetailsHeader({

    payment,

    onBack,

}) {

    return (

        <div className="rounded-3xl border border-slate-200 bg-gradient-to-r from-slate-50 to-blue-50 shadow-sm">

            <div className="flex flex-col gap-6 p-8 lg:flex-row lg:items-center lg:justify-between">

                {/* ================= LEFT ================= */}

                <div className="flex items-center gap-5">

                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-100">

                        <Receipt

                            size={42}

                            className="text-blue-600"

                        />

                    </div>

                    <div>

                        <h1 className="text-4xl font-extrabold text-slate-900">

                            Détail du paiement

                        </h1>

                        <p className="mt-2 text-slate-500">

                            Consultation complète du paiement enregistré.

                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-3">

                            <span className="rounded-full bg-blue-100 px-4 py-1 text-sm font-semibold text-blue-700">

                                {payment?.receipt_number}

                            </span>

                            <span className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-1 text-sm font-semibold text-green-700">

                                <CheckCircle2 size={15} />

                                Paiement validé

                            </span>

                            <span className="flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1 text-sm text-slate-600">

                                <Calendar size={15} />

                                {payment?.payment_date}

                            </span>

                        </div>

                    </div>

                </div>

                {/* ================= RIGHT ================= */}

                <button

                    onClick={onBack}

                    className="flex items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-6 py-4 font-semibold shadow-sm transition hover:bg-slate-100"

                >

                    <ArrowLeft size={20} />

                    Retour aux paiements

                </button>

            </div>

        </div>

    );

}