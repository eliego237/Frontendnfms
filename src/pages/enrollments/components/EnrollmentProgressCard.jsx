import {
    CheckCircle2,
    Clock3,
    CircleDollarSign,
} from "lucide-react";

export default function EnrollmentProgressCard({ enrollment }) {

    const total = Number(enrollment.total_amount || 0);

    const paid = Number(enrollment.amount_paid || 0);

    const balance = Number(enrollment.balance || 0);

    const progress =
        total > 0
            ? Math.min(
                  100,
                  Math.round((paid / total) * 100)
              )
            : 0;

    function money(value) {

        return Number(value).toLocaleString("fr-FR") + " FCFA";

    }

    function badge() {

        switch (enrollment.status) {

            case "paid":

                return (
                    <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                        Soldé
                    </span>
                );

            case "partial":

                return (
                    <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
                        Partiellement payé
                    </span>
                );

            default:

                return (
                    <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                        En attente
                    </span>
                );

        }

    }

    return (

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">

                    <CheckCircle2
                        className="text-blue-600"
                        size={24}
                    />

                </div>

                <div>

                    <h2 className="text-lg font-bold">

                        Progression

                    </h2>

                    <p className="text-sm text-slate-500">

                        État du paiement

                    </p>

                </div>

            </div>

            <div className="space-y-6">

                <div>

                    <div className="mb-2 flex items-center justify-between">

                        <span className="text-sm text-slate-600">

                            Progression

                        </span>

                        <span className="font-bold text-blue-600">

                            {progress} %

                        </span>

                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-200">

                        <div
                            className="h-full rounded-full bg-blue-600 transition-all duration-500"
                            style={{
                                width: `${progress}%`,
                            }}
                        />

                    </div>

                </div>

                <div className="grid gap-4">

                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-2 text-slate-600">

                            <CircleDollarSign size={18} />

                            Montant payé

                        </div>

                        <span className="font-semibold text-green-600">

                            {money(paid)}

                        </span>

                    </div>

                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-2 text-slate-600">

                            <Clock3 size={18} />

                            Reste à payer

                        </div>

                        <span
                            className={`font-semibold ${
                                balance > 0
                                    ? "text-red-600"
                                    : "text-green-600"
                            }`}
                        >

                            {money(balance)}

                        </span>

                    </div>

                </div>

                <div className="border-t pt-5">

                    <div className="flex items-center justify-between">

                        <span className="font-medium text-slate-600">

                            Statut

                        </span>

                        {badge()}

                    </div>

                </div>

            </div>

        </div>

    );

}