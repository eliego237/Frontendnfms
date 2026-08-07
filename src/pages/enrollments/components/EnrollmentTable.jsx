import {
    Eye,
    Pencil,
    Trash2,
    Wallet,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function EnrollmentTable({

    enrollments = [],

    onDelete,

}) {

    if (!enrollments.length) {

        return (

            <div className="rounded-3xl bg-white p-20 text-center shadow">

                <h2 className="text-2xl font-bold">

                    Aucune inscription

                </h2>

                <p className="mt-2 text-slate-500">

                    Commencez par créer une inscription.

                </p>

            </div>

        );

    }

    return (

        <div className="overflow-hidden rounded-3xl bg-white shadow">

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead className="border-b bg-slate-50">

                        <tr className="text-left">

                            <th className="px-6 py-5">

                                Étudiant

                            </th>

                            <th>

                                Formation

                            </th>

                            <th>

                                Frais

                            </th>

                            <th>

                                Réduction

                            </th>

                            <th>

                                Payé

                            </th>

                            <th>

                                Solde

                            </th>

                            <th>

                                Progression

                            </th>

                            <th>

                                Statut

                            </th>

                            <th className="px-6 text-center">

                                Actions

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {enrollments.map((enrollment) => {

                            const student =
                                enrollment.student;

                            const training =
                                enrollment.training;

                            const total =
                                Number(enrollment.total_amount ?? 0);

                            const paid =
                                Number(enrollment.amount_paid ?? 0);

                            const balance =
                                Number(enrollment.balance ?? 0);

                            const discount =
                                Number(enrollment.discount ?? 0);

                            const progress =
                                total > 0
                                    ? Math.min(
                                        100,
                                        Math.round(
                                            (paid / total) * 100
                                        )
                                    )
                                    : 0;

                            const studentName =
                                `${student?.first_name ?? ""} ${student?.last_name ?? ""}`
                                    .trim() || "Étudiant";

                            return (

                                <tr
                                    key={enrollment.id}
                                    className="border-b last:border-b-0 hover:bg-slate-50"
                                >

                                    {/* Étudiant */}

                                    <td className="px-6 py-5">

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">

                                                {student?.first_name?.charAt(0) ?? ""}
                                                {student?.last_name?.charAt(0) ?? ""}

                                            </div>

                                            <div>

                                                <div className="font-semibold">

                                                    {studentName}

                                                </div>

                                                <div className="text-sm text-slate-500">

                                                    {enrollment.enrollment_number}

                                                </div>

                                            </div>

                                        </div>

                                    </td>

                                    {/* Formation */}

                                    <td>

                                        <div className="font-medium">

                                            {training?.title ?? "—"}

                                        </div>

                                        {training?.duration_months && (

                                            <div className="text-sm text-slate-500">

                                                {training.duration_months} mois

                                            </div>

                                        )}

                                    </td>

                                    {/* Frais */}

                                    <td>

                                        <span className="rounded-xl bg-indigo-50 px-3 py-2 font-medium text-indigo-600">

                                            {total.toLocaleString("fr-FR")} FCFA

                                        </span>

                                    </td>

                                    {/* Réduction */}

                                    <td>

                                        <span className="rounded-xl bg-orange-50 px-3 py-2 font-medium text-orange-600">

                                            {discount.toLocaleString("fr-FR")} FCFA

                                        </span>

                                    </td>

                                    {/* Payé */}

                                    <td>

                                        <span className="font-semibold text-green-600">

                                            {paid.toLocaleString("fr-FR")} FCFA

                                        </span>

                                    </td>

                                    {/* Solde */}

                                    <td>

                                        <span className="font-semibold text-red-600">

                                            {balance.toLocaleString("fr-FR")} FCFA

                                        </span>

                                    </td>

                                    {/* Progression */}

                                    <td className="min-w-[180px]">

                                        <div className="flex items-center gap-2">

                                            <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200">

                                                <div
                                                    className="h-full rounded-full bg-green-500 transition-all"
                                                    style={{
                                                        width: `${progress}%`,
                                                    }}
                                                />

                                            </div>

                                            <span className="text-sm font-medium">

                                                {progress}%

                                            </span>

                                        </div>

                                    </td>

                                    {/* Statut */}

                                    <td>

                                        {enrollment.status === "pending" && (

                                            <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-medium text-red-600">

                                                En attente

                                            </span>

                                        )}

                                        {enrollment.status === "partial" && (

                                            <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-600">

                                                Partielle

                                            </span>

                                        )}

                                        {enrollment.status === "paid" && (

                                            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-600">

                                                Soldée

                                            </span>

                                        )}

                                        {enrollment.status === "cancelled" && (

                                            <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">

                                                Annulée

                                            </span>

                                        )}

                                    </td>

                                    {/* Actions */}

                                    <td className="px-6">

                                        <div className="flex items-center justify-center gap-2">

                                            {/* Voir */}

                                            <Link
                                                to={`/enrollments/${enrollment.id}`}
                                                title="Voir"
                                                className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition hover:bg-blue-200"
                                            >

                                                <Eye size={18} />

                                            </Link>

                                            {/* Modifier */}

                                            <Link
                                                to={`/enrollments/${enrollment.id}/edit`}
                                                title="Modifier"
                                                className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-100 text-yellow-600 transition hover:bg-yellow-200"
                                            >

                                                <Pencil size={18} />

                                            </Link>

                                            {/* Paiement */}

                                            <Link
                                                to={`/payments/create?enrollment_id=${enrollment.id}`}
                                                title="Ajouter un paiement"
                                                className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-600 transition hover:bg-green-200"
                                            >

                                                <Wallet size={18} />

                                            </Link>

                                            {/* Supprimer */}

                                            <button
                                                type="button"
                                                title="Supprimer"
                                                onClick={() => {

                                                    if (onDelete) {

                                                        onDelete(enrollment);

                                                    }

                                                }}
                                                className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-100 text-red-600 transition hover:bg-red-200"
                                            >

                                                <Trash2 size={18} />

                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            );

                        })}

                    </tbody>

                </table>

            </div>

        </div>

    );

}