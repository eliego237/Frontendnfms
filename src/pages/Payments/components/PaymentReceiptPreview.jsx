import {
    Receipt,
    Calendar,
    User,
    GraduationCap,
    Wallet,
    Hash,
    CreditCard,
    TrendingUp,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

export default function PaymentReceiptPreview({

    enrollment,

    form,

    paymentMethods,

}) {

    if (!enrollment) return null;

    const method = paymentMethods.find(

        item => item.id === Number(form.payment_method_id)

    );

    const amount = Number(form.amount || 0);

    const balanceBefore = Number(enrollment.balance || 0);

    const total = Number(enrollment.total_amount || 0);

    const alreadyPaid = Number(enrollment.amount_paid || 0);

    const paid = Math.min(amount, balanceBefore);

    const balanceAfter = balanceBefore - paid;

    const progress = total === 0

        ? 100

        : ((alreadyPaid + paid) / total) * 100;

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

            {/* Header */}

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

                {/* Informations générales */}

                <div className="grid gap-5 md:grid-cols-2">

                    <div className="flex items-center gap-3">

                        <User className="text-blue-600" size={20}/>

                        <div>

                            <p className="text-sm text-slate-500">

                                Étudiant

                            </p>

                            <p className="font-semibold">

                                {enrollment.student?.full_name}

                            </p>

                        </div>

                    </div>

                    <div className="flex items-center gap-3">

                        <Hash className="text-slate-500" size={20}/>

                        <div>

                            <p className="text-sm text-slate-500">

                                Matricule

                            </p>

                            <p className="font-semibold">

                                {enrollment.student?.matricule}

                            </p>

                        </div>

                    </div>

                    <div className="flex items-center gap-3">

                        <GraduationCap

                            className="text-indigo-600"

                            size={20}

                        />

                        <div>

                            <p className="text-sm text-slate-500">

                                Formation

                            </p>

                            <p className="font-semibold">

                                {enrollment.training?.title}

                            </p>

                        </div>

                    </div>

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

                                {form.payment_date}

                            </p>

                        </div>

                    </div>

                </div>

                {/* Détails du paiement */}

                <div className="rounded-2xl bg-slate-50 p-6">

                    <div className="flex justify-between py-2">

                        <span>Montant encaissé</span>

                        <strong className="text-green-600">

                            {money(paid)}

                        </strong>

                    </div>

                    <div className="flex justify-between py-2">

                        <span>Méthode</span>

                        <strong>

                            {method?.name || "-"}

                        </strong>

                    </div>

                    <div className="flex justify-between py-2">

                        <span>Référence</span>

                        <strong>

                            {form.reference || "-"}

                        </strong>

                    </div>

                </div>

                                {/* ================= Situation après paiement ================= */}

                <div className="rounded-2xl border border-slate-200 p-6">

                    <div className="mb-5 flex items-center gap-3">

                        <Wallet

                            className="text-green-600"

                            size={22}

                        />

                        <h3 className="font-bold text-lg">

                            Situation après paiement

                        </h3>

                    </div>

                    <div className="space-y-4">

                        <div className="flex justify-between">

                            <span>Total de la formation</span>

                            <strong>

                                {money(total)}

                            </strong>

                        </div>

                        <div className="flex justify-between">

                            <span>Déjà payé</span>

                            <strong className="text-green-600">

                                {money(alreadyPaid)}

                            </strong>

                        </div>

                        <div className="flex justify-between">

                            <span>Montant encaissé</span>

                            <strong className="text-blue-600">

                                {money(paid)}

                            </strong>

                        </div>

                        <div className="border-t pt-4 flex justify-between text-lg">

                            <span className="font-semibold">

                                Nouveau solde

                            </span>

                            <strong

                                className={`font-bold ${

                                    balanceAfter === 0

                                        ? "text-green-600"

                                        : "text-red-600"

                                }`}

                            >

                                {money(balanceAfter)}

                            </strong>

                        </div>

                    </div>

                </div>

                {/* ================= Progression ================= */}

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

                            {Math.min(progress,100).toFixed(0)} %

                        </span>

                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-200">

                        <div

                            className="h-full rounded-full bg-green-500 transition-all duration-700"

                            style={{

                                width:`${Math.min(progress,100)}%`

                            }}

                        />

                    </div>

                </div>

                {/* ================= Résumé ================= */}

                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">

                    <h3 className="mb-5 text-lg font-bold text-blue-700">

                        Résumé de l'encaissement

                    </h3>

                    <div className="space-y-3">

                        <div className="flex justify-between">

                            <span>Étudiant</span>

                            <strong>

                                {enrollment.student?.full_name}

                            </strong>

                        </div>

                        <div className="flex justify-between">

                            <span>Formation</span>

                            <strong>

                                {enrollment.training?.title}

                            </strong>

                        </div>

                        <div className="flex justify-between">

                            <span>Montant encaissé</span>

                            <strong className="text-blue-700">

                                {money(paid)}

                            </strong>

                        </div>

                        <div className="flex justify-between">

                            <span>Nouveau solde</span>

                            <strong>

                                {money(balanceAfter)}

                            </strong>

                        </div>

                    </div>

                </div>

                {/* ================= Statut ================= */}

                {balanceAfter === 0 ? (

                    <div className="rounded-2xl border border-green-300 bg-green-50 p-5">

                        <div className="flex items-center gap-3">

                            <CheckCircle2

                                className="text-green-600"

                                size={22}

                            />

                            <div>

                                <p className="font-bold text-green-700">

                                    Formation entièrement soldée

                                </p>

                                <p className="text-sm text-green-600">

                                    Après validation, cette inscription sera totalement payée.

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

                                    Il restera

                                    <strong>

                                        {" "}{money(balanceAfter)}{" "}

                                    </strong>

                                    à encaisser.

                                </p>

                            </div>

                        </div>

                    </div>

                )}

                {/* ================= Zone impression (prochaine étape) ================= */}

                <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center">

                    <Receipt

                        className="mx-auto mb-3 text-slate-400"

                        size={36}

                    />

                    <h3 className="font-semibold text-slate-700">

                        Le reçu PDF sera disponible immédiatement après l'enregistrement.

                    </h3>

                    <p className="mt-2 text-sm text-slate-500">

                        Vous pourrez l'imprimer, le télécharger ou l'envoyer directement au client.

                    </p>

                </div>

            </div>

        </div>

    );

}