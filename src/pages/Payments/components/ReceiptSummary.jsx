import {
    User,
    GraduationCap,
    CreditCard,
    Calendar,
    Receipt,
    Wallet,
    Hash,
} from "lucide-react";

export default function ReceiptSummary({ payment }) {

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

    return (

        <div className="space-y-6">

            {/* Numéro du reçu */}

            <div className="rounded-2xl border bg-slate-50 p-5">

                <div className="flex items-center gap-3">

                    <Receipt
                        className="text-blue-600"
                        size={22}
                    />

                    <div>

                        <p className="text-sm text-slate-500">
                            Reçu de paiement
                        </p>

                        <p className="text-xl font-bold text-slate-800">
                            {payment.receipt_number}
                        </p>

                    </div>

                </div>

            </div>

            {/* Informations */}

            <div className="grid gap-4">

                <InfoRow
                    icon={<User size={18} />}
                    label="Étudiant"
                    value={payment.enrollment?.student?.full_name || "-"}
                />

                <InfoRow
                    icon={<Hash size={18} />}
                    label="Matricule"
                    value={payment.enrollment?.student?.matricule || "-"}
                />

                <InfoRow
                    icon={<GraduationCap size={18} />}
                    label="Formation"
                    value={payment.enrollment?.training?.title || "-"}
                />

                <InfoRow
                    icon={<Wallet size={18} />}
                    label="Montant payé"
                    value={money(payment.amount)}
                    strong
                />

                <InfoRow
                    icon={<CreditCard size={18} />}
                    label="Mode de paiement"
                    value={payment.payment_method?.name || "-"}
                />

                <InfoRow
                    icon={<Calendar size={18} />}
                    label="Date du paiement"
                    value={payment.payment_date || "-"}
                />

            </div>

        </div>

    );

}

function InfoRow({
    icon,
    label,
    value,
    strong,
}) {

    return (

        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">

            <div className="flex items-center gap-3">

                <div className="text-slate-500">

                    {icon}

                </div>

                <span className="text-slate-600">

                    {label}

                </span>

            </div>

            <span
                className={
                    strong
                        ? "font-bold text-green-700"
                        : "font-semibold text-slate-800"
                }
            >
                {value}
            </span>

        </div>

    );

}