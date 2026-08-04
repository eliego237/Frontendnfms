import {
    CheckCircle,
    AlertTriangle,
    Receipt,
    Wallet,
} from "lucide-react";

export default function PaymentSummary({

    enrollment,

    amount,

}) {

    if (!enrollment) return null;

    const balance = Number(enrollment.balance || 0);

    const value = Number(amount || 0);

    const remaining = Math.max(balance - value, 0);

    const extra = Math.max(value - balance, 0);

    function money(v) {

        return Number(v).toLocaleString("fr-FR") + " FCFA";

    }

    return (

        <div className="sticky top-6 rounded-3xl border border-blue-100 bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center gap-3">

                <Receipt
                    className="text-blue-600"
                    size={28}
                />

                <h2 className="text-xl font-bold">

                    Résumé

                </h2>

            </div>

            <div className="space-y-4">

                <div className="flex justify-between">

                    <span>Montant reçu</span>

                    <span className="font-bold">

                        {money(value)}

                    </span>

                </div>

                <div className="flex justify-between">

                    <span>Reste actuel</span>

                    <span className="font-bold text-red-600">

                        {money(balance)}

                    </span>

                </div>

                <div className="flex justify-between">

                    <span>Après paiement</span>

                    <span className="font-bold text-green-600">

                        {money(remaining)}

                    </span>

                </div>

            </div>

            {value > 0 && value < balance && (

                <div className="mt-8 rounded-xl bg-orange-50 p-4">

                    <div className="flex gap-3">

                        <Wallet
                            className="text-orange-600"
                            size={22}
                        />

                        <div>

                            <p className="font-semibold text-orange-700">

                                Paiement partiel

                            </p>

                            <p className="text-sm text-orange-600">

                                Il restera

                                {" "}

                                {money(remaining)}

                            </p>

                        </div>

                    </div>

                </div>

            )}

            {value === balance && balance > 0 && (

                <div className="mt-8 rounded-xl bg-green-50 p-4">

                    <div className="flex gap-3">

                        <CheckCircle
                            className="text-green-600"
                            size={22}
                        />

                        <div>

                            <p className="font-semibold text-green-700">

                                Paiement complet

                            </p>

                            <p className="text-sm text-green-600">

                                Cette inscription sera soldée.

                            </p>

                        </div>

                    </div>

                </div>

            )}

            {value > balance && (

                <div className="mt-8 rounded-xl bg-red-50 p-4">

                    <div className="flex gap-3">

                        <AlertTriangle
                            className="text-red-600"
                            size={22}
                        />

                        <div>

                            <p className="font-semibold text-red-700">

                                Excédent détecté

                            </p>

                            <p className="text-sm text-red-600">

                                Excédent :

                                {" "}

                                {money(extra)}

                            </p>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}