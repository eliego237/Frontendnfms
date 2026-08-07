import { Receipt } from "lucide-react";

const money = (value) =>
    Number(value).toLocaleString("fr-FR") + " FCFA";

export default function RecentPayments({ payments = [] }) {

    return (

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center gap-3">

                <div className="rounded-xl bg-green-100 p-3 text-green-600">

                    <Receipt size={22} />

                </div>

                <div>

                    <h2 className="text-xl font-bold">

                        Derniers paiements

                    </h2>

                    <p className="text-sm text-slate-500">

                        Paiements récemment enregistrés

                    </p>

                </div>

            </div>

            <div className="space-y-4">

                {payments.map((item) => (

                    <div
                        key={item.id}
                        className="flex items-center justify-between rounded-xl border p-4"
                    >

                        <div>

                            <p className="font-semibold">

                                {item.student}

                            </p>

                            <p className="text-sm text-slate-500">

                                {item.reference}

                            </p>

                        </div>

                        <span className="font-bold text-green-600">

                            {money(item.amount)}

                        </span>

                    </div>

                ))}

            </div>

        </div>

    );

}