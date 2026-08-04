import {
    Wallet,
    BadgeDollarSign,
    Receipt,
    CircleDollarSign,
    TrendingDown,
    TrendingUp,
} from "lucide-react";

export default function EnrollmentFinanceSummary({ enrollment }) {

    const registrationFee = Number(
        enrollment.registration_fee || 0
    );

    const trainingFee = Number(
        enrollment.training_fee || 0
    );

    const discount = Number(
        enrollment.discount || 0
    );

    const totalAmount = Number(
        enrollment.total_amount || 0
    );

    const amountPaid = Number(
        enrollment.amount_paid || 0
    );

    const balance = Number(
        enrollment.balance || 0
    );

    function money(value) {

        return `${value.toLocaleString()} FCFA`;

    }

    return (

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100">

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

                        Récapitulatif des montants

                    </p>

                </div>

            </div>

            <div className="space-y-5">

                <FinanceRow
                    icon={<Receipt size={18} />}
                    label="Frais d'inscription"
                    value={money(registrationFee)}
                />

                <FinanceRow
                    icon={<BadgeDollarSign size={18} />}
                    label="Coût de la formation"
                    value={money(trainingFee)}
                />

                <FinanceRow
                    icon={<TrendingDown size={18} />}
                    label="Réduction"
                    value={money(discount)}
                    color="text-orange-600"
                />

                <div className="border-t border-dashed" />

                <FinanceRow
                    icon={<CircleDollarSign size={18} />}
                    label="Montant total"
                    value={money(totalAmount)}
                    bold
                />

                <FinanceRow
                    icon={<TrendingUp size={18} />}
                    label="Montant payé"
                    value={money(amountPaid)}
                    color="text-green-600"
                />

                <FinanceRow
                    icon={<Wallet size={18} />}
                    label="Reste à payer"
                    value={money(balance)}
                    color={
                        balance > 0
                            ? "text-red-600"
                            : "text-green-600"
                    }
                    bold
                />

            </div>

        </div>

    );

}

function FinanceRow({

    icon,
    label,
    value,
    color = "",
    bold = false,

}) {

    return (

        <div className="flex items-center justify-between">

            <div className="flex items-center gap-3 text-slate-600">

                {icon}

                <span>{label}</span>

            </div>

            <span
                className={`
                    ${color}
                    ${bold ? "font-bold text-lg" : "font-semibold"}
                `}
            >

                {value}

            </span>

        </div>

    );

}