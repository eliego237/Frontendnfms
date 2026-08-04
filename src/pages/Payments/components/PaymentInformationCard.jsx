import {
    CreditCard,
    Calendar,
    Hash,
    User,
    FileText,
    Wallet,
} from "lucide-react";

export default function PaymentInformationCard({ payment }) {

    if (!payment) return null;

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

    function Row({
        icon,
        label,
        value,
    }) {
        return (
            <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">

                <div className="flex items-center gap-3">

                    <div className="text-slate-500">
                        {icon}
                    </div>

                    <span className="text-slate-600">
                        {label}
                    </span>

                </div>

                <span className="font-semibold text-slate-800">
                    {value || "-"}
                </span>

            </div>
        );
    }

    return (

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">

            {/* Header */}

            <div className="border-b border-slate-200 p-6">

                <div className="flex items-center gap-4">

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100">

                        <Wallet
                            size={30}
                            className="text-orange-600"
                        />

                    </div>

                    <div>

                        <h2 className="text-xl font-bold text-slate-800">

                            Informations du paiement

                        </h2>

                        <p className="text-slate-500">

                            Détails complets de la transaction

                        </p>

                    </div>

                </div>

            </div>

            {/* Corps */}

            <div className="space-y-4 p-6">

                <Row
                    icon={<Hash size={18} />}
                    label="Numéro du reçu"
                    value={payment.receipt_number}
                />

                <Row
                    icon={<Calendar size={18} className="text-green-600" />}
                    label="Date de paiement"
                    value={payment.payment_date}
                />

                <Row
                    icon={<CreditCard size={18} className="text-blue-600" />}
                    label="Mode de paiement"
                    value={payment.payment_method?.name}
                />

                <Row
                    icon={<FileText size={18} className="text-purple-600" />}
                    label="Référence"
                    value={payment.reference || "-"}
                />

                <Row
                    icon={<User size={18} className="text-indigo-600" />}
                    label="Caissier"
                    value={payment.receiver?.name}
                />

            </div>

            {/* Footer */}

            <div className="border-t border-slate-200 bg-gradient-to-r from-green-50 to-emerald-50 p-6">

                <div className="flex items-center justify-between">

                    <span className="text-lg font-semibold text-slate-700">

                        Montant encaissé

                    </span>

                    <span className="text-3xl font-extrabold text-green-600">

                        {money(payment.amount)}

                    </span>

                </div>

            </div>

        </div>

    );

}