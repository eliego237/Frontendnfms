import {
    CreditCard,
    Calendar,
    Receipt,
    Wallet,
} from "lucide-react";

export default function EnrollmentPaymentsHistory({

    payments = [],

}) {

    const totalPaid = payments.reduce(

        (sum, payment) => sum + Number(payment.amount),

        0

    );

    function money(value) {

        return Number(value).toLocaleString("fr-FR") + " FCFA";

    }

    function paymentMethod(id) {

        switch (Number(id)) {

            case 1:

                return "Espèces";

            case 2:

                return "Orange Money";

            case 3:

                return "MTN Mobile Money";

            case 4:

                return "Virement bancaire";

            case 5:

                return "Carte bancaire";

            default:

                return "Autre";

        }

    }

    return (

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b p-6">

                <div className="flex items-center gap-4">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100">

                        <Wallet
                            size={28}
                            className="text-emerald-600"
                        />

                    </div>

                    <div>

                        <h2 className="text-2xl font-bold">

                            Historique des paiements

                        </h2>

                        <p className="text-slate-500">

                            Tous les versements enregistrés

                        </p>

                    </div>

                </div>

                <div className="rounded-xl bg-green-100 px-5 py-3">

                    <p className="text-xs text-green-700">

                        Total encaissé

                    </p>

                    <p className="text-lg font-bold text-green-700">

                        {money(totalPaid)}

                    </p>

                </div>

            </div>

            {

                payments.length === 0 ? (

                    <div className="p-12 text-center text-slate-500">

                        Aucun paiement enregistré.

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-slate-50">

                                <tr>

                                    <th className="px-6 py-4 text-left">

                                        Reçu

                                    </th>

                                    <th className="px-6 py-4 text-left">

                                        Date

                                    </th>

                                    <th className="px-6 py-4 text-left">

                                        Mode

                                    </th>

                                    <th className="px-6 py-4 text-right">

                                        Montant

                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    payments.map((payment) => (

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

                                                        {payment.receipt_number}

                                                    </span>

                                                </div>

                                            </td>

                                            <td className="px-6 py-5">

                                                <div className="flex items-center gap-2">

                                                    <Calendar
                                                        size={17}
                                                        className="text-slate-500"
                                                    />

                                                    {

                                                        new Date(

                                                            payment.payment_date

                                                        ).toLocaleDateString("fr-FR")

                                                    }

                                                </div>

                                            </td>

                                            <td className="px-6 py-5">

                                                <div className="flex items-center gap-2">

                                                    <CreditCard
                                                        size={17}
                                                        className="text-violet-600"
                                                    />

                                                    {

                                                        paymentMethod(

                                                            payment.payment_method_id

                                                        )

                                                    }

                                                </div>

                                            </td>

                                            <td className="px-6 py-5 text-right">

                                                <span className="rounded-xl bg-green-100 px-4 py-2 font-bold text-green-700">

                                                    {

                                                        money(

                                                            payment.amount

                                                        )

                                                    }

                                                </span>

                                            </td>

                                        </tr>

                                    ))

                                }

                            </tbody>

                        </table>

                    </div>

                )

            }

        </div>

    );

}