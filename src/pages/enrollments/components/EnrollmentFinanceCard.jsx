import {
    Wallet,
    Banknote,
    BadgePercent,
    Calculator,
} from "lucide-react";

export default function EnrollmentFinanceCard({
    registrationFee = 0,
    trainingFee = 0,
    discount = 0,
    setDiscount,
}) {

    const total =
        Number(registrationFee) +
        Number(trainingFee) -
        Number(discount || 0);

    const money = (value) =>
        Number(value || 0).toLocaleString("fr-FR") + " FCFA";

    return (

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100">

                    <Wallet
                        size={24}
                        className="text-green-600"
                    />

                </div>

                <div>

                    <h2 className="text-xl font-bold">

                        Informations financières

                    </h2>

                    <p className="text-sm text-slate-500">

                        Calcul automatique des frais d'inscription

                    </p>

                </div>

            </div>

            <div className="space-y-5">

                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

                    <div className="flex items-center gap-3">

                        <Banknote
                            size={20}
                            className="text-green-600"
                        />

                        <span className="font-medium">

                            Frais d'inscription

                        </span>

                    </div>

                    <span className="font-bold">

                        {money(registrationFee)}

                    </span>

                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

                    <div className="flex items-center gap-3">

                        <Banknote
                            size={20}
                            className="text-blue-600"
                        />

                        <span className="font-medium">

                            Prix de la formation

                        </span>

                    </div>

                    <span className="font-bold">

                        {money(trainingFee)}

                    </span>

                </div>

                <div>

                    <label className="mb-2 flex items-center gap-2 font-semibold">

                        <BadgePercent
                            size={18}
                            className="text-orange-500"
                        />

                        Réduction

                    </label>

                    <input
                        type="number"
                        min="0"
                        value={discount}
                        onChange={(e) =>
                            setDiscount(e.target.value)
                        }
                        placeholder="0"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                    />

                </div>

                <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">

                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3">

                            <Calculator size={24} />

                            <div>

                                <p className="text-sm opacity-90">

                                    Total à payer

                                </p>

                                <h3 className="text-2xl font-bold">

                                    {money(total)}

                                </h3>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}