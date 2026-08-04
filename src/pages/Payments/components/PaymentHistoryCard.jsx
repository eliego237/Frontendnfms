import {
    History,
    Calendar,
    CreditCard,
    User,
    Receipt,
    CheckCircle2,
} from "lucide-react";

export default function PaymentHistoryCard({ payments = [] }) {

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

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

            {/* Header */}

            <div className="border-b border-slate-200 p-6">

                <div className="flex items-center gap-4">

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100">

                        <History
                            size={30}
                            className="text-violet-600"
                        />

                    </div>

                    <div>

                        <h2 className="text-xl font-bold">

                            Historique des paiements

                        </h2>

                        <p className="text-slate-500">

                            Tous les versements effectués

                        </p>

                    </div>

                </div>

            </div>

            {/* Tableau */}

            <div className="overflow-x-auto">

                <table className="min-w-full">

                    <thead className="bg-slate-50">

                        <tr>

                            <th className="px-6 py-4 text-left">

                                Reçu

                            </th>

                            <th className="px-6 py-4 text-left">

                                Date

                            </th>

                            <th className="px-6 py-4 text-left">

                                Méthode

                            </th>

                            <th className="px-6 py-4 text-right">

                                Montant

                            </th>

                            <th className="px-6 py-4 text-left">

                                Caissier

                            </th>

                            <th className="px-6 py-4 text-center">

                                Statut

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {payments.length === 0 && (

                            <tr>

                                <td
                                    colSpan="6"
                                    className="py-12 text-center text-slate-500"
                                >

                                    Aucun paiement trouvé.

                                </td>

                            </tr>

                        )}

                        {payments.map((payment) => (

                            <tr
                                key={payment.id}
                                className="border-t hover:bg-slate-50"
                            >

                                <td className="px-6 py-5">

                                    <div className="flex items-center gap-2">

                                        <Receipt
                                            size={18}
                                            className="text-blue-600"
                                        />

                                        <span className="font-semibold">

                                            {payment.receipt_number ||
                                                payment.receipt}

                                        </span>

                                    </div>

                                </td>

                                <td className="px-6 py-5">

                                    <div className="flex items-center gap-2">

                                        <Calendar
                                            size={16}
                                            className="text-slate-500"
                                        />

                                        {payment.payment_date}

                                    </div>

                                </td>

                                <td className="px-6 py-5">

                                    <div className="flex items-center gap-2">

                                        <CreditCard
                                            size={16}
                                            className="text-indigo-600"
                                        />

                                        {payment.payment_method || "-"}

                                    </div>

                                </td>

                                <td className="px-6 py-5 text-right font-bold text-green-600">

                                    {payment.formatted_amount ||
                                        money(payment.amount)}

                                </td>

                                <td className="px-6 py-5">

                                    <div className="flex items-center gap-2">

                                        <User
                                            size={16}
                                            className="text-slate-500"
                                        />

                                        {
                                            payment.receiver?.name ||
                                            payment.receiver ||
                                            payment.user?.name ||
                                            payment.cashier ||
                                            "-"
                                        }

                                    </div>

                                </td>

                                <td className="px-6 py-5 text-center">

                                    <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">

                                        <CheckCircle2 size={16} />

                                        Validé

                                    </span>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            {/* Footer */}

            <div className="border-t border-slate-200 bg-slate-50 px-6 py-4">

                <div className="flex items-center justify-between">

                    <span className="font-medium text-slate-600">

                        Nombre de paiements

                    </span>

                    <span className="rounded-full bg-blue-100 px-4 py-2 font-bold text-blue-700">

                        {payments.length}

                    </span>

                </div>

            </div>

        </div>

    );

}