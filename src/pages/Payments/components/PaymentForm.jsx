import {
    Receipt,
    CreditCard,
    Calendar,
    FileText,
    Wallet,
    AlertCircle,
    CheckCircle2,
    Coins,
    TrendingDown,
    GraduationCap,
    UserPlus,
} from "lucide-react";

export default function PaymentForm({
    form,
    handleChange,
    paymentMethods,
    enrollment,
    totalBalance,
}) {
    if (!enrollment) {
        return null;
    }

    const trainings = Array.isArray(enrollment.trainings)
        ? enrollment.trainings
        : [];

    const paymentType = form.payment_type || "training";

    // ============================================================
    // FRAIS D'INSCRIPTION
    // ============================================================

    const registrationFee = Number(
        enrollment.registration_total ??
            enrollment.registration_fee ??
            0
    );

    const registrationPaid = Number(
        enrollment.registration_paid ?? 0
    );

    const registrationBalance = Math.max(
        0,
        Number(
            enrollment.registration_balance ??
                registrationFee - registrationPaid
        )
    );

    // ============================================================
    // FORMATIONS
    // ============================================================

    const trainingTotal = Number(
        enrollment.training_total ??
            trainings.reduce((sum, training) => {
                return (
                    sum +
                    Number(
                        training?.pivot?.training_fee ??
                            training?.price ??
                            0
                    )
                );
            }, 0)
    );

    const trainingDiscount = Math.min(
        trainingTotal,
        Math.max(
            0,
            Number(
                enrollment.training_discount ??
                    enrollment.discount ??
                    0
            )
        )
    );

    const trainingNetTotal = Math.max(
        0,
        Number(
            enrollment.training_net_total ??
                trainingTotal - trainingDiscount
        )
    );

    const trainingPaid = Number(
        enrollment.training_paid ?? 0
    );

    /*
     * IMPORTANT :
     * Le solde formation est totalement indépendant
     * du solde inscription.
     *
     * On ne fait surtout pas :
     *
     * trainingBalance = globalBalance - registrationBalance
     *
     * Exemple :
     * Formations nettes = 350 000
     * Formation payée = 0
     * Solde formation = 350 000
     */
    const trainingBalance = Math.max(
        0,
        Number(
            enrollment.training_balance ??
                trainingNetTotal - trainingPaid
        )
    );

    // ============================================================
    // SOLDE SELON LE TYPE DE PAIEMENT
    // ============================================================

    const balance =
        paymentType === "registration"
            ? registrationBalance
            : trainingBalance;

    const amount = Number(form.amount || 0);

    const remaining = Math.max(
        balance - amount,
        0
    );

    const overpayment = amount > balance;

    const isFullPayment =
        amount > 0 &&
        amount === balance &&
        balance > 0;

    const isPartialPayment =
        amount > 0 &&
        amount < balance;

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

    function setAmount(value) {
        handleChange({
            target: {
                name: "amount",
                value: String(value),
            },
        });
    }

    function setPaymentType(type) {
        handleChange({
            target: {
                name: "payment_type",
                value: type,
            },
        });

        handleChange({
            target: {
                name: "amount",
                value: "",
            },
        });
    }

    // ============================================================
    // PROGRESSION GLOBALE
    // ============================================================

    const globalTotal = Number(
        enrollment.net_total ??
            enrollment.total_amount ??
            registrationFee + trainingNetTotal
    );

    const globalPaid = Number(
        enrollment.total_paid ??
            enrollment.amount_paid ??
            registrationPaid + trainingPaid
    );

    const paymentAfterCurrent =
        globalPaid + amount;

    const progress =
        globalTotal > 0
            ? Math.min(
                  (paymentAfterCurrent /
                      globalTotal) *
                      100,
                  100
              )
            : 0;

    return (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

            {/* HEADER */}

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
                            Encaissement
                        </h2>

                        <p className="text-slate-500">
                            Enregistrez le paiement de
                            l'inscription ou de la formation.
                        </p>
                    </div>

                </div>

            </div>

            <div className="space-y-8 p-8">

                {/* ÉTUDIANT */}

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">

                    <div className="flex flex-wrap items-center justify-between gap-4">

                        <div>
                            <p className="text-sm text-slate-500">
                                Étudiant
                            </p>

                            <p className="text-xl font-bold">
                                {enrollment.student?.full_name ||
                                    "Étudiant"}
                            </p>

                            {enrollment.student?.matricule && (
                                <p className="mt-1 text-sm text-slate-500">
                                    Matricule :{" "}
                                    <strong>
                                        {enrollment.student.matricule}
                                    </strong>
                                </p>
                            )}
                        </div>

                        <div className="text-right">
                            <p className="text-sm text-slate-500">
                                Inscription
                            </p>

                            <p className="font-bold">
                                {enrollment.enrollment_number ||
                                    `#${enrollment.id}`}
                            </p>

                            {enrollment.academic_year && (
                                <p className="text-sm text-slate-500">
                                    {enrollment.academic_year}
                                </p>
                            )}
                        </div>

                    </div>

                </div>

                {/* FORMATIONS */}

                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">

                    <div className="mb-5 flex items-center gap-3">

                        <GraduationCap
                            size={24}
                            className="text-blue-600"
                        />

                        <div>
                            <h3 className="font-bold text-blue-900">
                                Formations concernées
                            </h3>

                            <p className="text-sm text-blue-700">
                                {trainings.length} formation
                                {trainings.length > 1 ? "s" : ""}
                            </p>
                        </div>

                    </div>

                    {trainings.length > 0 ? (
                        <div className="space-y-3">

                            {trainings.map((training) => {

                                const price = Number(
                                    training.pivot?.training_fee ??
                                        training.price ??
                                        0
                                );

                                return (
                                    <div
                                        key={training.id}
                                        className="flex items-center justify-between rounded-xl bg-white p-4"
                                    >

                                        <div>
                                            <p className="font-semibold">
                                                {training.title}
                                            </p>

                                            {training.code && (
                                                <p className="text-xs text-slate-500">
                                                    {training.code}
                                                </p>
                                            )}
                                        </div>

                                        <p className="font-bold text-blue-700">
                                            {money(price)}
                                        </p>

                                    </div>
                                );
                            })}

                        </div>
                    ) : (
                        <p className="text-sm text-slate-500">
                            Aucune formation trouvée.
                        </p>
                    )}

                </div>

                                {/* TYPE DE PAIEMENT */}

                <div>

                    <label className="mb-3 block font-semibold">
                        Type de paiement
                    </label>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        {/* FRAIS INSCRIPTION */}

                        <button
                            type="button"
                            onClick={() =>
                                setPaymentType("registration")
                            }
                            className={`rounded-2xl border-2 p-5 text-left transition ${
                                paymentType === "registration"
                                    ? "border-purple-600 bg-purple-50"
                                    : "border-slate-200 bg-white hover:border-purple-300"
                            }`}
                        >

                            <div className="flex items-start gap-4">

                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                                        paymentType === "registration"
                                            ? "bg-purple-600 text-white"
                                            : "bg-purple-100 text-purple-600"
                                    }`}
                                >
                                    <UserPlus size={22} />
                                </div>

                                <div className="flex-1">

                                    <p className="font-bold">
                                        Frais d'inscription
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Paiement unique de
                                        l'inscription.
                                    </p>

                                    <p className="mt-3 font-bold text-purple-700">
                                        Solde :{" "}
                                        {money(
                                            registrationBalance
                                        )}
                                    </p>

                                </div>

                                {paymentType === "registration" && (
                                    <CheckCircle2
                                        className="text-purple-600"
                                        size={22}
                                    />
                                )}

                            </div>

                        </button>

                        {/* PAIEMENT FORMATION */}

                        <button
                            type="button"
                            onClick={() =>
                                setPaymentType("training")
                            }
                            className={`rounded-2xl border-2 p-5 text-left transition ${
                                paymentType === "training"
                                    ? "border-blue-600 bg-blue-50"
                                    : "border-slate-200 bg-white hover:border-blue-300"
                            }`}
                        >

                            <div className="flex items-start gap-4">

                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                                        paymentType === "training"
                                            ? "bg-blue-600 text-white"
                                            : "bg-blue-100 text-blue-600"
                                    }`}
                                >
                                    <GraduationCap size={22} />
                                </div>

                                <div className="flex-1">

                                    <p className="font-bold">
                                        Paiement formation
                                    </p>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Paiement des formations.
                                    </p>

                                    <p className="mt-3 font-bold text-blue-700">
                                        Solde :{" "}
                                        {money(trainingBalance)}
                                    </p>

                                </div>

                                {paymentType === "training" && (
                                    <CheckCircle2
                                        className="text-blue-600"
                                        size={22}
                                    />
                                )}

                            </div>

                        </button>

                    </div>

                </div>

                {/* BOUTONS RAPIDES */}

                {balance > 0 && (

                    <div>

                        <label className="mb-3 block font-semibold">
                            Montant rapide
                        </label>

                        <div className="flex flex-wrap gap-3">

                            <button
                                type="button"
                                onClick={() =>
                                    setAmount(balance)
                                }
                                className="rounded-xl bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-700"
                            >
                                Encaisser le solde
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setAmount(
                                        Math.round(
                                            balance * 0.5
                                        )
                                    )
                                }
                                className="rounded-xl border border-blue-600 px-5 py-2 font-semibold text-blue-600 hover:bg-blue-50"
                            >
                                50 %
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    setAmount(
                                        Math.round(
                                            balance * 0.25
                                        )
                                    )
                                }
                                className="rounded-xl border border-orange-500 px-5 py-2 font-semibold text-orange-600 hover:bg-orange-50"
                            >
                                25 %
                            </button>

                        </div>

                    </div>

                )}

                {/* INFORMATIONS PAIEMENT */}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                    {/* MONTANT */}

                    <div>

                        <label className="mb-2 block font-semibold">
                            Montant à encaisser
                        </label>

                        <div className="relative">

                            <Wallet
                                size={18}
                                className="absolute left-4 top-4 text-slate-400"
                            />

                            <input
                                type="number"
                                name="amount"
                                value={form.amount || ""}
                                onChange={handleChange}
                                placeholder="0"
                                min="0"
                                step="1"
                                className={`w-full rounded-xl border py-3 pl-12 pr-4 ${
                                    overpayment
                                        ? "border-red-500 bg-red-50"
                                        : "border-slate-300 focus:border-blue-500"
                                }`}
                            />

                        </div>

                        {amount > 0 && (

                            <div className="mt-3">

                                {isPartialPayment && (
                                    <div className="flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 p-3 text-orange-700">

                                        <Coins size={18} />

                                        <span>
                                            Paiement partiel.
                                            Il restera{" "}
                                            <strong>
                                                {money(remaining)}
                                            </strong>
                                        </span>

                                    </div>
                                )}

                                {isFullPayment && (
                                    <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-green-700">

                                        <CheckCircle2 size={18} />

                                        <span>
                                            Paiement entièrement
                                            réglé.
                                        </span>

                                    </div>
                                )}

                                {overpayment && (
                                    <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">

                                        <AlertCircle size={18} />

                                        <span>
                                            Le montant dépasse le
                                            solde de{" "}
                                            <strong>
                                                {money(balance)}
                                            </strong>
                                        </span>

                                    </div>
                                )}

                            </div>

                        )}

                    </div>

                    {/* MÉTHODE */}

                    <div>

                        <label className="mb-2 block font-semibold">
                            Méthode de paiement
                        </label>

                        <div className="relative">

                            <CreditCard
                                size={18}
                                className="absolute left-4 top-4 text-slate-400"
                            />

                            <select
                                name="payment_method_id"
                                value={
                                    form.payment_method_id || ""
                                }
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4"
                            >

                                <option value="">
                                    Choisir une méthode
                                </option>

                                {paymentMethods.map((method) => (
                                    <option
                                        key={method.id}
                                        value={method.id}
                                    >
                                        {method.name}
                                    </option>
                                ))}

                            </select>

                        </div>

                    </div>

                    {/* DATE */}

                    <div>

                        <label className="mb-2 block font-semibold">
                            Date du paiement
                        </label>

                        <div className="relative">

                            <Calendar
                                size={18}
                                className="absolute left-4 top-4 text-slate-400"
                            />

                            <input
                                type="date"
                                name="payment_date"
                                value={
                                    form.payment_date || ""
                                }
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4"
                            />

                        </div>

                    </div>

                    {/* RÉFÉRENCE */}

                    <div>

                        <label className="mb-2 block font-semibold">
                            Référence de transaction
                        </label>

                        <div className="relative">

                            <FileText
                                size={18}
                                className="absolute left-4 top-4 text-slate-400"
                            />

                            <input
                                type="text"
                                name="reference"
                                value={form.reference || ""}
                                onChange={handleChange}
                                placeholder="Ex : OM123456789"
                                className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4"
                            />

                        </div>

                    </div>

                    {/* OBSERVATIONS */}

                    <div className="md:col-span-2">

                        <label className="mb-2 block font-semibold">
                            Observations
                        </label>

                        <textarea
                            rows="4"
                            name="notes"
                            value={form.notes || ""}
                            onChange={handleChange}
                            placeholder="Commentaires, précisions, informations complémentaires..."
                            className="w-full rounded-xl border border-slate-300 p-4"
                        />

                    </div>

                </div>

                {/* RÉSUMÉ */}

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">

                    <div className="mb-6 flex items-center gap-3">

                        <TrendingDown
                            className="text-blue-600"
                            size={22}
                        />

                        <h3 className="text-xl font-bold">
                            Résumé de l'encaissement
                        </h3>

                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                        <div className="rounded-2xl border bg-white p-5">

                            <p className="text-sm text-slate-500">
                                Solde actuel
                            </p>

                            <p className="mt-2 text-2xl font-bold text-red-600">
                                {money(balance)}
                            </p>

                        </div>

                        <div className="rounded-2xl border bg-white p-5">

                            <p className="text-sm text-slate-500">
                                Montant encaissé
                            </p>

                            <p className="mt-2 text-2xl font-bold text-blue-600">
                                {money(amount)}
                            </p>

                        </div>

                        <div className="rounded-2xl border bg-white p-5">

                            <p className="text-sm text-slate-500">
                                Nouveau solde
                            </p>

                            <p
                                className={`mt-2 text-2xl font-bold ${
                                    remaining === 0 &&
                                    balance > 0
                                        ? "text-green-600"
                                        : "text-orange-600"
                                }`}
                            >
                                {money(remaining)}
                            </p>

                        </div>

                    </div>

                                        {/* PROGRESSION */}

                    <div className="mt-8">

                        <div className="mb-2 flex justify-between text-sm">

                            <span>
                                Progression après paiement
                            </span>

                            <span>
                                {progress.toFixed(0)} %
                            </span>

                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-slate-200">

                            <div
                                className="h-full rounded-full bg-green-500 transition-all duration-500"
                                style={{
                                    width: `${progress}%`,
                                }}
                            />

                        </div>

                    </div>

                    {/* MESSAGE */}

                    <div className="mt-6">

                        {balance <= 0 && (
                            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">

                                <div className="flex items-center gap-2 font-semibold">

                                    <CheckCircle2 size={18} />

                                    Aucun solde à régler pour
                                    ce type de paiement.

                                </div>

                            </div>
                        )}

                        {overpayment && (
                            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">

                                <div className="flex items-center gap-2 font-semibold">

                                    <AlertCircle size={18} />

                                    Paiement impossible

                                </div>

                                <p className="mt-2 text-sm">
                                    Le montant saisi dépasse le
                                    solde restant.
                                </p>

                            </div>
                        )}

                        {!overpayment &&
                            remaining === 0 &&
                            amount > 0 &&
                            balance > 0 && (
                                <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">

                                    <div className="flex items-center gap-2 font-semibold">

                                        <CheckCircle2 size={18} />

                                        Paiement soldé.

                                    </div>

                                </div>
                            )}

                        {!overpayment &&
                            remaining > 0 &&
                            amount > 0 && (
                                <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-orange-700">

                                    <div className="flex items-center gap-2 font-semibold">

                                        <Coins size={18} />

                                        Paiement partiel

                                    </div>

                                    <p className="mt-2 text-sm">

                                        Il restera{" "}

                                        <strong>
                                            {money(remaining)}
                                        </strong>{" "}

                                        à régler.

                                    </p>

                                </div>
                            )}

                    </div>

                    {/* BOUTON */}

                    <div className="mt-8 flex justify-end">

                        <button
                            type="submit"
                            disabled={
                                balance <= 0 ||
                                overpayment ||
                                amount <= 0 ||
                                !form.payment_method_id
                            }
                            className="rounded-2xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                        >
                            Enregistrer le paiement
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}