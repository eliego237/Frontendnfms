import {
    Pencil,
    CreditCard,
    Printer,
    Trash2,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function EnrollmentQuickActions({

    enrollment,

}) {

    return (

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

            <div className="mb-8">

                <h2 className="text-2xl font-bold">

                    Actions rapides

                </h2>

                <p className="mt-1 text-slate-500">

                    Gérez cette inscription en quelques clics.

                </p>

            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">

                <Link
                    to={`/enrollments/${enrollment.id}/edit`}
                    className="flex items-center justify-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-6 py-5 font-semibold text-blue-700 transition hover:bg-blue-100"
                >

                    <Pencil size={20} />

                    Modifier

                </Link>

                <Link
                    to={`/payments/create?enrollment=${enrollment.id}`}
                    className="flex items-center justify-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-6 py-5 font-semibold text-green-700 transition hover:bg-green-100"
                >

                    <CreditCard size={20} />

                    Nouveau paiement

                </Link>

                <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex items-center justify-center gap-3 rounded-2xl border border-purple-200 bg-purple-50 px-6 py-5 font-semibold text-purple-700 transition hover:bg-purple-100"
                >

                    <Printer size={20} />

                    Imprimer

                </button>

                <button
                    type="button"
                    className="flex items-center justify-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-6 py-5 font-semibold text-red-700 transition hover:bg-red-100"
                >

                    <Trash2 size={20} />

                    Supprimer

                </button>

            </div>

        </div>

    );

}