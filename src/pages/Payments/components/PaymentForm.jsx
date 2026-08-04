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
} from "lucide-react";

export default function PaymentForm({

    form,

    handleChange,

    paymentMethods,

    enrollment,

}) {

    if (!enrollment) return null;

    const balance = Number(enrollment.balance || 0);

    const amount = Number(form.amount || 0);

    const remaining = Math.max(balance - amount, 0);

    const overpayment = amount > balance;

    const isFullPayment = amount === balance && balance > 0;

    const isPartialPayment = amount > 0 && amount < balance;

    function money(value) {

        return Number(value).toLocaleString("fr-FR", {

            style: "currency",

            currency: "XAF",

            minimumFractionDigits: 0,

        });

    }

    return (

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

            {/* ================= HEADER ================= */}

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

                            Saisissez les informations du paiement.

                        </p>

                    </div>

                </div>

            </div>

            {/* ================= CONTENU ================= */}

            <div className="space-y-8 p-8">

                {/* Boutons rapides */}

                <div className="flex flex-wrap gap-3">

                    <button

                        type="button"

                        onClick={() =>

                            handleChange({

                                target: {

                                    name: "amount",

                                    value: balance,

                                },

                            })

                        }

                        className="rounded-xl bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-700"

                    >

                        Encaisser le solde

                    </button>

                    <button

                        type="button"

                        onClick={() =>

                            handleChange({

                                target: {

                                    name: "amount",

                                    value: Math.round(balance * 0.5),

                                },

                            })

                        }

                        className="rounded-xl border border-blue-600 px-5 py-2 font-semibold text-blue-600 hover:bg-blue-50"

                    >

                        50 %

                    </button>

                    <button

                        type="button"

                        onClick={() =>

                            handleChange({

                                target: {

                                    name: "amount",

                                    value: Math.round(balance * 0.25),

                                },

                            })

                        }

                        className="rounded-xl border border-orange-500 px-5 py-2 font-semibold text-orange-600 hover:bg-orange-50"

                    >

                        25 %

                    </button>

                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                                        {/* ================= MONTANT ================= */}

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

                                value={form.amount}

                                onChange={handleChange}

                                placeholder="0"

                                className={`w-full rounded-xl border pl-12 pr-4 py-3 transition

                                ${overpayment

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

                                        Paiement partiel.

                                        Il restera

                                        <strong>

                                            {money(remaining)}

                                        </strong>

                                        après validation.

                                    </div>

                                )}

                                {isFullPayment && (

                                    <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 p-3 text-green-700">

                                        <CheckCircle2 size={18} />

                                        Cette inscription sera totalement soldée.

                                    </div>

                                )}

                                {overpayment && (

                                    <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">

                                        <AlertCircle size={18} />

                                        Le montant dépasse le solde restant de

                                        <strong>

                                            {money(balance)}

                                        </strong>

                                    </div>

                                )}

                            </div>

                        )}

                    </div>

                    {/* ================= METHODE ================= */}

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

                                value={form.payment_method_id}

                                onChange={handleChange}

                                className="w-full rounded-xl border border-slate-300 pl-12 pr-4 py-3"

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

                    {/* ================= DATE ================= */}

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

                                value={form.payment_date}

                                onChange={handleChange}

                                className="w-full rounded-xl border border-slate-300 pl-12 pr-4 py-3"

                            />

                        </div>

                    </div>

                    {/* ================= REFERENCE ================= */}

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

                                value={form.reference}

                                onChange={handleChange}

                                placeholder="Ex : OM123456789"

                                className="w-full rounded-xl border border-slate-300 pl-12 pr-4 py-3"

                            />

                        </div>

                    </div>

                    {/* ================= OBSERVATIONS ================= */}

                    <div className="md:col-span-2">

                        <label className="mb-2 block font-semibold">

                            Observations

                        </label>

                        <textarea

                            rows="4"

                            name="notes"

                            value={form.notes}

                            onChange={handleChange}

                            placeholder="Commentaires, précisions, informations complémentaires..."

                            className="w-full rounded-xl border border-slate-300 p-4"

                        />

                    </div>

                </div>

                                {/* ================= RÉSUMÉ DE L'ENCAISSEMENT ================= */}

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

                                    remaining === 0

                                        ? "text-green-600"

                                        : "text-orange-600"

                                }`}

                            >

                                {money(remaining)}

                            </p>

                        </div>

                    </div>

                    {/* Barre de progression */}

                    <div className="mt-8">

                        <div className="mb-2 flex justify-between text-sm">

                            <span>Progression après paiement</span>

                            <span>

                                {Math.min(

                                    (

                                        ((Number(enrollment.amount_paid || 0) + amount) /

                                            Number(enrollment.total_amount || 1)) *

                                        100

                                    ),

                                    100

                                ).toFixed(0)} %

                            </span>

                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-slate-200">

                            <div

                                className="h-full rounded-full bg-green-500 transition-all duration-500"

                                style={{

                                    width: `${Math.min(

                                        (

                                            ((Number(enrollment.amount_paid || 0) + amount) /

                                                Number(enrollment.total_amount || 1)) *

                                            100

                                        ),

                                        100

                                    )}%`,

                                }}

                            />

                        </div>

                    </div>

                    {/* Message métier */}

                    <div className="mt-6">

                        {overpayment && (

                            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">

                                <div className="flex items-center gap-2 font-semibold">

                                    <AlertCircle size={18} />

                                    Paiement impossible

                                </div>

                                <p className="mt-2 text-sm">

                                    Le montant saisi dépasse le solde restant.

                                    Corrigez le montant avant de poursuivre.

                                </p>

                            </div>

                        )}

                        {!overpayment && remaining === 0 && amount > 0 && (

                            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">

                                <div className="flex items-center gap-2 font-semibold">

                                    <CheckCircle2 size={18} />

                                    Inscription soldée

                                </div>

                                <p className="mt-2 text-sm">

                                    Après validation, cette inscription sera

                                    entièrement payée.

                                </p>

                            </div>

                        )}

                        {!overpayment && remaining > 0 && amount > 0 && (

                            <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-orange-700">

                                <div className="flex items-center gap-2 font-semibold">

                                    <Coins size={18} />

                                    Paiement partiel

                                </div>

                                <p className="mt-2 text-sm">

                                    Il restera

                                    <strong>

                                        {" "}{money(remaining)}{" "}

                                    </strong>

                                    à régler après cette opération.

                                </p>

                            </div>

                        )}

                    </div>

                    {/* Bouton principal */}

                    <div className="mt-8 flex justify-end">

                        <button

                            type="submit"

                            disabled={

                                overpayment ||

                                amount <= 0 ||

                                !form.payment_method_id

                            }

                            className="rounded-2xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"

                        >

                            Enregistrer le paiement

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}