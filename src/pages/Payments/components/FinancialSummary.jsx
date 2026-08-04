import {
    Wallet,
    CircleDollarSign,
    TrendingUp,
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
} from "lucide-react";

export default function FinancialSummary({

    enrollment,

    onContinue,

}) {

    if (!enrollment) return null;

    const total = Number(enrollment.total_amount || 0);

    const paid = Number(enrollment.amount_paid || 0);

    const balance = Number(enrollment.balance || 0);

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

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            {/* Header */}

            <div className="mb-8 flex items-center gap-4">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">

                    <Wallet
                        className="text-green-600"
                        size={30}
                    />

                </div>

                <div>

                    <h2 className="text-2xl font-bold">

                        Situation financière

                    </h2>

                    <p className="text-slate-500">

                        Vérifiez la situation avant d'encaisser.

                    </p>

                </div>

            </div>

            {/* Totaux */}

            <div className="space-y-5">

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <CircleDollarSign
                            size={20}
                            className="text-slate-500"
                        />

                        <span>Total de la formation</span>

                    </div>

                    <span className="text-lg font-bold">

                        {money(total)}

                    </span>

                </div>

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <TrendingUp
                            size={20}
                            className="text-green-600"
                        />

                        <span>Déjà payé</span>

                    </div>

                    <span className="text-lg font-bold text-green-600">

                        {money(paid)}

                    </span>

                </div>

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <AlertTriangle
                            size={20}
                            className="text-red-500"
                        />

                        <span>Reste à payer</span>

                    </div>

                    <span className="text-lg font-bold text-red-600">

                        {money(balance)}

                    </span>

                </div>

            </div>

            {/* Progression */}

            <div className="mt-8">

                <div className="mb-2 flex justify-between">

                    <span className="text-sm text-slate-500">

                        Progression

                    </span>

                    <span className="font-semibold">

                        {progress.toFixed(0)} %

                    </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-200">

                    <div

                        className="h-full rounded-full bg-green-500 transition-all duration-700"

                        style={{

                            width: `${progress}%`,

                        }}

                    />

                </div>

            </div>

            {/* Statut */}

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">

                <div className="flex items-center justify-between">

                    <span className="font-medium">

                        État du dossier

                    </span>

                    {balance <= 0 ? (

                        <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">

                            <CheckCircle2 size={16} />

                            Soldé

                        </span>

                    ) : (

                        <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-700">

                            Paiement en cours

                        </span>

                    )}

                </div>

            </div>

            {/* Bouton */}

            {balance > 0 && (

                <button

                    type="button"

                    onClick={onContinue}

                    className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700"

                >

                    Continuer vers le paiement

                    <ArrowRight size={20} />

                </button>

            )}

        </div>

    );

}