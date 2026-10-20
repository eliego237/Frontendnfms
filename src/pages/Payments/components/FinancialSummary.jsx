import {
    Wallet,
    CircleDollarSign,
    TrendingUp,
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    GraduationCap,
    UserPlus,
} from "lucide-react";

export default function FinancialSummary({
    enrollment,
    onContinue,
}) {
    if (!enrollment) {
        return null;
    }

    /*
    |--------------------------------------------------------------------------
    | DONNÉES FINANCIÈRES
    |--------------------------------------------------------------------------
    */

    const financial =
        enrollment.financial || {};

    /*
    |--------------------------------------------------------------------------
    | FRAIS D'INSCRIPTION
    |--------------------------------------------------------------------------
    */

    const registrationFee = Number(
        financial.registration_total ??
            financial.registration_fee ??
            enrollment.registration_fee ??
            0
    );

    const registrationPaid = Number(
        financial.registration_paid ??
            0
    );

    const registrationBalance = Number(
        financial.registration_balance ??
            0
    );

    /*
    |--------------------------------------------------------------------------
    | FORMATIONS
    |--------------------------------------------------------------------------
    */

    const trainings = Array.isArray(
        enrollment.trainings
    )
        ? enrollment.trainings
        : [];

    const getTrainingPrice = (training) => {
        return Number(
            training?.pivot?.training_fee ??
                training?.price ??
                0
        );
    };

    const trainingTotal = Number(
        financial.training_total ??
            trainings.reduce(
                (sum, training) =>
                    sum + getTrainingPrice(training),
                0
            )
    );

    /*
    |--------------------------------------------------------------------------
    | REMISE
    |--------------------------------------------------------------------------
    |
    | IMPORTANT :
    | La remise concerne uniquement les formations.
    |
    */

    const trainingDiscount = Number(
        financial.training_discount ??
            financial.discount ??
            enrollment.discount ??
            0
    );

    /*
    |--------------------------------------------------------------------------
    | NET FORMATIONS
    |--------------------------------------------------------------------------
    */

    const trainingNetTotal = Math.max(
        0,
        Number(
            financial.training_net_total ??
                trainingTotal -
                    trainingDiscount
        )
    );

    /*
    |--------------------------------------------------------------------------
    | PAIEMENTS FORMATIONS
    |--------------------------------------------------------------------------
    */

    const trainingPaid = Number(
        financial.training_paid ??
            0
    );

    const trainingBalance = Math.max(
        0,
        Number(
            financial.training_balance ??
                trainingNetTotal -
                    trainingPaid
        )
    );

    /*
    |--------------------------------------------------------------------------
    | TOTAL GLOBAL
    |--------------------------------------------------------------------------
    |
    | Inscription + formations après remise.
    |
    */

    const total = Number(
        financial.net_total ??
            financial.total_amount ??
            enrollment.total_amount ??
            registrationFee +
                trainingNetTotal
    );

    /*
    |--------------------------------------------------------------------------
    | TOTAL PAYÉ GLOBAL
    |--------------------------------------------------------------------------
    */

    const amountPaid = Number(
        financial.total_paid ??
            financial.amount_paid ??
            enrollment.amount_paid ??
            registrationPaid +
                trainingPaid
    );

    /*
    |--------------------------------------------------------------------------
    | SOLDE GLOBAL
    |--------------------------------------------------------------------------
    */

    const balance = Math.max(
        0,
        Number(
            financial.global_balance ??
                financial.balance ??
                enrollment.balance ??
                registrationBalance +
                    trainingBalance
        )
    );

    /*
    |--------------------------------------------------------------------------
    | PROGRESSION
    |--------------------------------------------------------------------------
    */

    const progress =
        total > 0
            ? Math.min(
                  100,
                  (amountPaid / total) * 100
              )
            : 0;

    /*
    |--------------------------------------------------------------------------
    | FORMAT MONÉTAIRE
    |--------------------------------------------------------------------------
    */

    function money(value) {
        return Number(
            value || 0
        ).toLocaleString(
            "fr-FR",
            {
                style: "currency",
                currency: "XAF",
                minimumFractionDigits: 0,
            }
        );
    }

    /*
    |--------------------------------------------------------------------------
    | NOMBRE DE FORMATIONS
    |--------------------------------------------------------------------------
    */

    const trainingCount =
        trainings.length;

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            {/* =========================================================
                HEADER
            ========================================================= */}

            <div className="mb-8 flex items-center gap-4">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100">

                    <Wallet
                        className="text-green-600"
                        size={30}
                    />

                </div>

                <div>

                    <h2 className="text-2xl font-bold text-slate-800">
                        Situation financière
                    </h2>

                    <p className="text-slate-500">
                        Vérifiez la situation financière
                        avant d'encaisser.
                    </p>

                </div>

            </div>

            {/* =========================================================
                RÉSUMÉ ÉTUDIANT
            ========================================================= */}

            <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">

                <div className="flex flex-wrap items-center justify-between gap-4">

                    <div>

                        <p className="text-sm text-slate-500">
                            Étudiant
                        </p>

                        <p className="text-lg font-bold text-slate-800">
                            {enrollment.student?.full_name ||
                                "Étudiant"}
                        </p>

                        {enrollment.student?.matricule && (
                            <p className="mt-1 text-sm text-slate-500">
                                Matricule :{" "}
                                <strong>
                                    {
                                        enrollment.student
                                            .matricule
                                    }
                                </strong>
                            </p>
                        )}

                    </div>

                    <div className="text-right">

                        <p className="text-sm text-slate-500">
                            Inscription
                        </p>

                        <p className="font-bold text-slate-800">
                            {enrollment.enrollment_number ||
                                `#${enrollment.id}`}
                        </p>

                        {enrollment.academic_year && (
                            <p className="text-sm text-slate-500">
                                {
                                    enrollment.academic_year
                                }
                            </p>
                        )}

                    </div>

                </div>

            </div>

            {/* =========================================================
                FORMATIONS
            ========================================================= */}

            <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">

                <div className="mb-4 flex items-center justify-between gap-3">

                    <div className="flex items-center gap-3">

                        <GraduationCap
                            className="text-blue-600"
                            size={22}
                        />

                        <div>

                            <p className="font-bold text-blue-900">
                                Formations
                            </p>

                            <p className="text-sm text-blue-700">
                                {trainingCount} formation
                                {trainingCount > 1
                                    ? "s"
                                    : ""}{" "}
                                dans cette inscription
                            </p>

                        </div>

                    </div>

                </div>

                {trainings.length > 0 ? (
                    <div className="space-y-2">

                        {trainings.map(
                            (training) => {

                                const price =
                                    getTrainingPrice(
                                        training
                                    );

                                return (
                                    <div
                                        key={
                                            training.id
                                        }
                                        className="flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-3"
                                    >

                                        <div className="min-w-0">

                                            <p className="font-semibold text-slate-700">
                                                {
                                                    training.title
                                                }
                                            </p>

                                            {training.code && (
                                                <p className="text-xs text-slate-500">
                                                    {
                                                        training.code
                                                    }
                                                </p>
                                            )}

                                        </div>

                                        <span className="shrink-0 font-bold text-blue-700">
                                            {money(price)}
                                        </span>

                                    </div>
                                );
                            }
                        )}

                    </div>
                ) : (
                    <div className="rounded-xl bg-white p-4 text-sm text-orange-600">
                        Aucune formation associée
                        à cette inscription.
                    </div>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-blue-200 pt-4">

                    <span className="font-semibold text-blue-900">
                        Total formations
                    </span>

                    <span className="text-lg font-bold text-blue-700">
                        {money(trainingTotal)}
                    </span>

                </div>

            </div>

            {/* =========================================================
                DÉTAIL FINANCIER
            ========================================================= */}

            <div className="space-y-5">

                {/* FRAIS D'INSCRIPTION */}

                <div className="flex items-center justify-between gap-4">

                    <div className="flex items-center gap-3">

                        <UserPlus
                            size={20}
                            className="text-purple-600"
                        />

                        <span>
                            Frais d'inscription
                        </span>

                    </div>

                    <span className="font-bold">
                        {money(registrationFee)}
                    </span>

                </div>

                {/* FORMATIONS */}

                <div className="flex items-center justify-between gap-4">

                    <div className="flex items-center gap-3">

                        <GraduationCap
                            size={20}
                            className="text-blue-600"
                        />

                        <span>
                            Formations
                        </span>

                    </div>

                    <span className="font-bold">
                        {money(trainingTotal)}
                    </span>

                </div>

                {/* REMISE */}

                {trainingDiscount > 0 && (
                    <div className="flex items-center justify-between gap-4">

                        <span>
                            Remise sur formations
                        </span>

                        <span className="font-bold text-orange-600">
                            - {money(trainingDiscount)}
                        </span>

                    </div>
                )}

                {/* NET FORMATIONS */}

                <div className="flex items-center justify-between gap-4">

                    <span className="font-medium text-slate-600">
                        Net formations
                    </span>

                    <span className="font-bold text-blue-700">
                        {money(trainingNetTotal)}
                    </span>

                </div>

                {/* TOTAL GLOBAL */}

                <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-5">

                    <div className="flex items-center gap-3">

                        <CircleDollarSign
                            size={20}
                            className="text-slate-500"
                        />

                        <span className="font-semibold">
                            Total à payer
                        </span>

                    </div>

                    <span className="text-xl font-bold text-slate-900">
                        {money(total)}
                    </span>

                </div>

                {/* DÉJÀ PAYÉ */}

                <div className="flex items-center justify-between gap-4">

                    <div className="flex items-center gap-3">

                        <TrendingUp
                            size={20}
                            className="text-green-600"
                        />

                        <span>
                            Déjà payé
                        </span>

                    </div>

                    <span className="text-lg font-bold text-green-600">
                        {money(amountPaid)}
                    </span>

                </div>

                {/* SOLDE */}

                <div className="flex items-center justify-between gap-4">

                    <div className="flex items-center gap-3">

                        <AlertTriangle
                            size={20}
                            className="text-red-500"
                        />

                        <span>
                            Reste à payer
                        </span>

                    </div>

                    <span className="text-xl font-bold text-red-600">
                        {money(balance)}
                    </span>

                </div>

            </div>

            {/* =========================================================
                DÉTAIL DES SOLDES
            ========================================================= */}

            <div className="mt-6 grid gap-3 md:grid-cols-2">

                <div className="rounded-2xl bg-purple-50 p-4">

                    <div className="flex items-center justify-between">

                        <span className="text-sm text-purple-700">
                            Solde inscription
                        </span>

                        <span className="font-bold text-purple-800">
                            {money(
                                registrationBalance
                            )}
                        </span>

                    </div>

                </div>

                <div className="rounded-2xl bg-blue-50 p-4">

                    <div className="flex items-center justify-between">

                        <span className="text-sm text-blue-700">
                            Solde formations
                        </span>

                        <span className="font-bold text-blue-800">
                            {money(
                                trainingBalance
                            )}
                        </span>

                    </div>

                </div>

            </div>

            {/* =========================================================
                PROGRESSION
            ========================================================= */}

            <div className="mt-8">

                <div className="mb-2 flex justify-between">

                    <span className="text-sm text-slate-500">
                        Progression du paiement
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

            {/* =========================================================
                STATUT
            ========================================================= */}

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">

                <div className="flex flex-wrap items-center justify-between gap-4">

                    <div>

                        <p className="font-medium text-slate-700">
                            État du dossier
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            {balance <= 0
                                ? "Tous les montants sont réglés."
                                : "Un solde reste à encaisser."}
                        </p>

                    </div>

                    {balance <= 0 ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">

                            <CheckCircle2
                                size={16}
                            />

                            Soldé

                        </span>
                    ) : (
                        <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-bold text-orange-700">
                            Paiement en cours
                        </span>
                    )}

                </div>

            </div>

            {/* =========================================================
                BOUTON
            ========================================================= */}

            {balance > 0 && (
                <button
                    type="button"
                    onClick={onContinue}
                    className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 px-6 py-4 font-semibold text-white transition hover:bg-blue-700"
                >

                    Continuer vers le paiement

                    <ArrowRight
                        size={20}
                    />

                </button>
            )}

        </div>
    );
}