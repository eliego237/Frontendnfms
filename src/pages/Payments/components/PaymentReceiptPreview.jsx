import {
    Receipt,
    Calendar,
    User,
    GraduationCap,
    Wallet,
    Hash,
    TrendingUp,
    CheckCircle2,
    AlertCircle,
    CreditCard,
    UserPlus,
} from "lucide-react";

export default function PaymentReceiptPreview({
    enrollment,
    form,
    paymentMethods = [],
}) {
    if (!enrollment) {
        return null;
    }

    const trainings = Array.isArray(enrollment.trainings)
        ? enrollment.trainings
        : [];

    const paymentType = form.payment_type || "training";

    const method = paymentMethods.find(
        (item) =>
            Number(item.id) ===
            Number(form.payment_method_id)
    );

    const amount = Number(form.amount || 0);

    /*
    |--------------------------------------------------------------------------
    | FRAIS D'INSCRIPTION
    |--------------------------------------------------------------------------
    */

    const registrationFee = Number(
        enrollment.registration_fee || 0
    );

    /*
    |--------------------------------------------------------------------------
    | TOTAL DES FORMATIONS
    |--------------------------------------------------------------------------
    */

    const trainingTotal = trainings.reduce(
        (sum, training) => {
            const price = Number(
                training.pivot?.training_fee ??
                    training.price ??
                    0
            );

            return sum + price;
        },
        0
    );

    /*
    |--------------------------------------------------------------------------
    | TOTAL INSCRIPTION
    |--------------------------------------------------------------------------
    */

    const totalAmount = Number(
        enrollment.total_amount ??
            registrationFee + trainingTotal
    );

    /*
    |--------------------------------------------------------------------------
    | MONTANT DÉJÀ PAYÉ
    |--------------------------------------------------------------------------
    */

    const amountPaid = Number(
        enrollment.amount_paid || 0
    );

    /*
    |--------------------------------------------------------------------------
    | SOLDE AVANT PAIEMENT
    |--------------------------------------------------------------------------
    */

    const globalBalance = Number(
        enrollment.balance ??
            Math.max(
                totalAmount - amountPaid,
                0
            )
    );

    /*
    |--------------------------------------------------------------------------
    | SOLDE SPÉCIFIQUE AU TYPE DE PAIEMENT
    |--------------------------------------------------------------------------
    */

    const registrationBalance = Math.max(
        registrationFee,
        0
    );

    const trainingBalance = Math.max(
        globalBalance - registrationBalance,
        0
    );

    const balanceBefore =
        paymentType === "registration"
            ? registrationBalance
            : trainingBalance;

    /*
    |--------------------------------------------------------------------------
    | MONTANT RÉELLEMENT PRIS EN COMPTE
    |--------------------------------------------------------------------------
    */

    const paid = Math.min(
        amount,
        balanceBefore
    );

    /*
    |--------------------------------------------------------------------------
    | NOUVEAU SOLDE
    |--------------------------------------------------------------------------
    */

    const balanceAfter = Math.max(
        balanceBefore - paid,
        0
    );

    /*
    |--------------------------------------------------------------------------
    | PROGRESSION
    |--------------------------------------------------------------------------
    */

    const progress =
        totalAmount > 0
            ? Math.min(
                  ((amountPaid + paid) /
                      totalAmount) *
                      100,
                  100
              )
            : 0;

    /*
    |--------------------------------------------------------------------------
    | FORMAT MONÉTAIRE
    |--------------------------------------------------------------------------
    */

    function money(value) {
        return Number(value || 0).toLocaleString(
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
    | NOMS DES FORMATIONS
    |--------------------------------------------------------------------------
    */

    const trainingNames =
        trainings.length > 0
            ? trainings
                  .map(
                      (training) =>
                          training.title
                  )
                  .filter(Boolean)
                  .join(" + ")
            : "Aucune formation";

    /*
    |--------------------------------------------------------------------------
    | LIBELLÉS
    |--------------------------------------------------------------------------
    */

    const paymentTypeLabel =
        paymentType === "registration"
            ? "Frais d'inscription"
            : "Paiement formation";

    const receiptPrefix =
        paymentType === "registration"
            ? "RI"
            : "RP";

    return (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

            {/* ========================================================= */}
            {/* HEADER */}
            {/* ========================================================= */}

            <div className="border-b border-slate-200 p-8">

                <div className="flex items-center gap-4">

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">

                        <Receipt
                            className="text-orange-600"
                            size={30}
                        />

                    </div>

                    <div>

                        <h2 className="text-2xl font-bold">
                            Aperçu du reçu
                        </h2>

                        <p className="text-slate-500">
                            Vérification avant validation du paiement
                        </p>

                    </div>

                </div>

            </div>

            <div className="space-y-8 p-8">

                {/* ===================================================== */}
                {/* TYPE DE PAIEMENT */}
                {/* ===================================================== */}

                <div
                    className={`rounded-2xl border p-6 ${
                        paymentType === "registration"
                            ? "border-purple-200 bg-purple-50"
                            : "border-blue-200 bg-blue-50"
                    }`}
                >

                    <div className="flex items-center gap-4">

                        <div
                            className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                                paymentType === "registration"
                                    ? "bg-purple-600 text-white"
                                    : "bg-blue-600 text-white"
                            }`}
                        >
                            {paymentType ===
                            "registration" ? (
                                <UserPlus size={22} />
                            ) : (
                                <GraduationCap
                                    size={22}
                                />
                            )}
                        </div>

                        <div>

                            <p className="text-sm text-slate-500">
                                Type de paiement
                            </p>

                            <p
                                className={`text-xl font-bold ${
                                    paymentType ===
                                    "registration"
                                        ? "text-purple-700"
                                        : "text-blue-700"
                                }`}
                            >
                                {paymentTypeLabel}
                            </p>

                        </div>

                        <div className="ml-auto">

                            <span
                                className={`rounded-full px-4 py-2 text-sm font-bold ${
                                    paymentType ===
                                    "registration"
                                        ? "bg-purple-600 text-white"
                                        : "bg-blue-600 text-white"
                                }`}
                            >
                                {receiptPrefix}
                            </span>

                        </div>

                    </div>

                </div>

                {/* ===================================================== */}
                {/* INFORMATIONS GÉNÉRALES */}
                {/* ===================================================== */}

                <div className="grid gap-5 md:grid-cols-2">

                    {/* ÉTUDIANT */}

                    <div className="flex items-center gap-3">

                        <User
                            className="text-blue-600"
                            size={20}
                        />

                        <div>

                            <p className="text-sm text-slate-500">
                                Étudiant
                            </p>

                            <p className="font-semibold">
                                {enrollment.student
                                    ?.full_name ||
                                    "Étudiant"}
                            </p>

                        </div>

                    </div>

                    {/* MATRICULE */}

                    <div className="flex items-center gap-3">

                        <Hash
                            className="text-slate-500"
                            size={20}
                        />

                        <div>

                            <p className="text-sm text-slate-500">
                                Matricule
                            </p>

                            <p className="font-semibold">
                                {enrollment.student
                                    ?.matricule ||
                                    "-"}
                            </p>

                        </div>

                    </div>

                    {/* FORMATIONS */}

                    <div className="flex items-start gap-3">

                        <GraduationCap
                            className="mt-1 text-indigo-600"
                            size={20}
                        />

                        <div>

                            <p className="text-sm text-slate-500">
                                Formations
                            </p>

                            <p className="font-semibold">
                                {trainingNames}
                            </p>

                        </div>

                    </div>

                    {/* DATE */}

                    <div className="flex items-center gap-3">

                        <Calendar
                            className="text-green-600"
                            size={20}
                        />

                        <div>

                            <p className="text-sm text-slate-500">
                                Date
                            </p>

                            <p className="font-semibold">
                                {form.payment_date ||
                                    "-"}
                            </p>

                        </div>

                    </div>

                </div>

                {/* ===================================================== */}
                {/* DÉTAIL DES FORMATIONS */}
                {/* ===================================================== */}

                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">

                    <div className="mb-5">

                        <h3 className="text-lg font-bold text-blue-900">
                            Détail des formations
                        </h3>

                        <p className="mt-1 text-sm text-blue-700">
                            {trainings.length} formation
                            {trainings.length > 1
                                ? "s"
                                : ""}{" "}
                            associée
                            {trainings.length > 1
                                ? "s"
                                : ""}{" "}
                            à cette inscription.
                        </p>

                    </div>

                    {trainings.length > 0 ? (
                        <div className="space-y-3">

                            {trainings.map(
                                (training) => {

                                    const price =
                                        Number(
                                            training
                                                .pivot
                                                ?.training_fee ??
                                                training.price ??
                                                0
                                        );

                                    return (
                                        <div
                                            key={
                                                training.id
                                            }
                                            className="rounded-xl bg-white p-4"
                                        >

                                            <div className="flex items-center justify-between gap-4">

                                                <div>

                                                    <p className="font-bold text-slate-800">
                                                        {
                                                            training.title
                                                        }
                                                    </p>

                                                    {training.code && (
                                                        <p className="text-sm text-slate-500">
                                                            {
                                                                training.code
                                                            }
                                                        </p>
                                                    )}

                                                </div>

                                                <p className="font-bold text-blue-600">
                                                    {money(
                                                        price
                                                    )}
                                                </p>

                                            </div>

                                        </div>
                                    );
                                }
                            )}

                        </div>
                    ) : (
                        <p className="text-sm text-slate-500">
                            Aucune formation trouvée.
                        </p>
                    )}

                    <div className="mt-5 flex justify-between border-t border-blue-200 pt-4">

                        <span className="font-semibold">
                            Total formations
                        </span>

                        <strong className="text-blue-700">
                            {money(trainingTotal)}
                        </strong>

                    </div>

                </div>

                {/* ===================================================== */}
                {/* INFORMATIONS PAIEMENT */}
                {/* ===================================================== */}

                <div className="rounded-2xl bg-slate-50 p-6">

                    <div className="mb-5 flex items-center gap-3">

                        <CreditCard
                            className="text-blue-600"
                            size={22}
                        />

                        <h3 className="text-lg font-bold">
                            Informations du paiement
                        </h3>

                    </div>

                    <div className="space-y-3">

                        <div className="flex justify-between gap-4">

                            <span>
                                Type
                            </span>

                            <strong>
                                {paymentTypeLabel}
                            </strong>

                        </div>

                        <div className="flex justify-between gap-4">

                            <span>
                                Montant encaissé
                            </span>

                            <strong className="text-green-600">
                                {money(paid)}
                            </strong>

                        </div>

                        <div className="flex justify-between gap-4">

                            <span>
                                Méthode
                            </span>

                            <strong>
                                {method?.name || "-"}
                            </strong>

                        </div>

                        <div className="flex justify-between gap-4">

                            <span>
                                Référence
                            </span>

                            <strong>
                                {form.reference || "-"}
                            </strong>

                        </div>

                    </div>

                </div>

                {/* ===================================================== */}
                {/* SITUATION FINANCIÈRE */}
                {/* ===================================================== */}

                <div className="rounded-2xl border border-slate-200 p-6">

                    <div className="mb-5 flex items-center gap-3">

                        <Wallet
                            className="text-green-600"
                            size={22}
                        />

                        <h3 className="text-lg font-bold">
                            Situation financière
                        </h3>

                    </div>

                    <div className="space-y-4">

                        <div className="flex justify-between">

                            <span>
                                Frais d'inscription
                            </span>

                            <strong>
                                {money(
                                    registrationFee
                                )}
                            </strong>

                        </div>

                        <div className="flex justify-between">

                            <span>
                                Total formations
                            </span>

                            <strong>
                                {money(trainingTotal)}
                            </strong>

                        </div>

                        <div className="flex justify-between border-t pt-4">

                            <span className="font-semibold">
                                Total inscription
                            </span>

                            <strong>
                                {money(totalAmount)}
                            </strong>

                        </div>

                        <div className="flex justify-between">

                            <span>
                                Déjà payé
                            </span>

                            <strong className="text-green-600">
                                {money(amountPaid)}
                            </strong>

                        </div>

                        <div className="flex justify-between">

                            <span>
                                Montant encaissé
                            </span>

                            <strong className="text-blue-600">
                                {money(paid)}
                            </strong>

                        </div>

                        <div className="flex justify-between border-t pt-4 text-lg">

                            <span className="font-semibold">
                                Nouveau solde
                            </span>

                            <strong
                                className={
                                    balanceAfter === 0
                                        ? "font-bold text-green-600"
                                        : "font-bold text-red-600"
                                }
                            >
                                {money(balanceAfter)}
                            </strong>

                        </div>

                    </div>

                </div>

                {/* ===================================================== */}
                {/* PROGRESSION */}
                {/* ===================================================== */}

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

                    <div className="mb-3 flex items-center justify-between">

                        <div className="flex items-center gap-2">

                            <TrendingUp
                                className="text-blue-600"
                                size={20}
                            />

                            <span className="font-semibold">
                                Progression du paiement
                            </span>

                        </div>

                        <span className="font-bold">
                            {Math.min(
                                progress,
                                100
                            ).toFixed(0)}
                            %
                        </span>

                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-200">

                        <div
                            className="h-full rounded-full bg-green-500 transition-all duration-700"
                            style={{
                                width: `${Math.min(
                                    progress,
                                    100
                                )}%`,
                            }}
                        />

                    </div>

                </div>

                {/* ===================================================== */}
                {/* RÉSUMÉ */}
                {/* ===================================================== */}

                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">

                    <h3 className="mb-5 text-lg font-bold text-blue-700">
                        Résumé de l'encaissement
                    </h3>

                    <div className="space-y-3">

                        <div className="flex justify-between gap-4">

                            <span>
                                Étudiant
                            </span>

                            <strong className="text-right">
                                {enrollment.student
                                    ?.full_name ||
                                    "-"}
                            </strong>

                        </div>

                        <div className="flex justify-between gap-4">

                            <span>
                                Formations
                            </span>

                            <strong className="max-w-[60%] text-right">
                                {trainingNames}
                            </strong>

                        </div>

                        <div className="flex justify-between gap-4">

                            <span>
                                Type de paiement
                            </span>

                            <strong>
                                {paymentTypeLabel}
                            </strong>

                        </div>

                        <div className="flex justify-between gap-4">

                            <span>
                                Montant encaissé
                            </span>

                            <strong className="text-blue-700">
                                {money(paid)}
                            </strong>

                        </div>

                        <div className="flex justify-between gap-4">

                            <span>
                                Nouveau solde
                            </span>

                            <strong>
                                {money(balanceAfter)}
                            </strong>

                        </div>

                    </div>

                </div>

                {/* ===================================================== */}
                {/* STATUT */}
                {/* ===================================================== */}

                {balanceAfter === 0 ? (

                    <div className="rounded-2xl border border-green-300 bg-green-50 p-5">

                        <div className="flex items-center gap-3">

                            <CheckCircle2
                                className="text-green-600"
                                size={22}
                            />

                            <div>

                                <p className="font-bold text-green-700">
                                    {paymentType ===
                                    "registration"
                                        ? "Frais d'inscription entièrement soldés"
                                        : "Paiement formation entièrement soldé"}
                                </p>

                                <p className="text-sm text-green-600">
                                    Ce paiement couvrira
                                    entièrement le solde
                                    concerné.
                                </p>

                            </div>

                        </div>

                    </div>

                ) : (

                    <div className="rounded-2xl border border-orange-300 bg-orange-50 p-5">

                        <div className="flex items-center gap-3">

                            <AlertCircle
                                className="text-orange-600"
                                size={22}
                            />

                            <div>

                                <p className="font-bold text-orange-700">
                                    Paiement partiel
                                </p>

                                <p className="text-sm text-orange-600">

                                    Il restera{" "}

                                    <strong>
                                        {money(
                                            balanceAfter
                                        )}
                                    </strong>{" "}

                                    à encaisser.

                                </p>

                            </div>

                        </div>

                    </div>

                )}

                {/* ===================================================== */}
                {/* INFORMATION PDF */}
                {/* ===================================================== */}

                <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center">

                    <Receipt
                        className="mx-auto mb-3 text-slate-400"
                        size={36}
                    />

                    <h3 className="font-semibold text-slate-700">
                        Le reçu PDF sera disponible
                        immédiatement après
                        l'enregistrement.
                    </h3>

                    <p className="mt-2 text-sm text-slate-500">
                        Vous pourrez l'imprimer, le
                        télécharger ou l'envoyer
                        directement au client.
                    </p>

                </div>

            </div>

        </div>
    );
}