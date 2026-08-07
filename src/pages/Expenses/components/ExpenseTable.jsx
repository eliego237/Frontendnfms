import {
    Eye,
    Pencil,
    ReceiptText,
    Trash2,
} from "lucide-react";

import { Link } from "react-router-dom";

function formatMoney(value) {

    return `${Number(value || 0).toLocaleString("fr-FR")} FCFA`;

}

function formatDate(value) {

    if (!value) {
        return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

}

export default function ExpenseTable({
    expenses = [],
    onRefresh,
    onDelete,
}) {

    if (!expenses.length) {

        return (

            <div className="rounded-3xl border border-slate-100 bg-white p-16 text-center shadow-sm">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">

                    <ReceiptText size={30} />

                </div>

                <h2 className="mt-5 text-2xl font-bold text-slate-900">

                    Aucune dépense trouvée

                </h2>

                <p className="mx-auto mt-2 max-w-md text-slate-500">

                    Aucune dépense ne correspond aux critères
                    sélectionnés.

                </p>

                <Link
                    to="/expenses/create"
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >

                    Enregistrer une dépense

                </Link>

            </div>

        );

    }

    return (

        <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">

            {/* En-tête */}

            <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <h2 className="text-xl font-bold text-slate-900">

                        Historique des dépenses

                    </h2>

                    <p className="mt-1 text-sm text-slate-500">

                        Suivi des sorties de caisse

                    </p>

                </div>

                <div className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">

                    {expenses.length} opération
                    {expenses.length > 1 ? "s" : ""}

                </div>

            </div>

            {/* Table */}

            <div className="overflow-x-auto">

                <table className="w-full min-w-[1100px]">

                    <thead className="border-b border-slate-100 bg-slate-50">

                        <tr className="text-left text-xs uppercase tracking-wider text-slate-500">

                            <th className="px-6 py-4 font-bold">
                                Dépense
                            </th>

                            <th className="px-6 py-4 font-bold">
                                Catégorie
                            </th>

                            <th className="px-6 py-4 font-bold">
                                Date
                            </th>

                            <th className="px-6 py-4 font-bold">
                                Paiement
                            </th>

                            <th className="px-6 py-4 text-right font-bold">
                                Montant
                            </th>

                            <th className="px-6 py-4 text-center font-bold">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {expenses.map((expense) => (

                            <tr
                                key={expense.id}
                                className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/80"
                            >

                                {/* Dépense */}

                                <td className="px-6 py-5">

                                    <div className="flex items-center gap-4">

                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-red-700">

                                            <ReceiptText
                                                size={20}
                                            />

                                        </div>

                                        <div className="min-w-0">

                                            <p className="truncate font-bold text-slate-900">

                                                {expense.title || "Sans libellé"}

                                            </p>

                                            <p className="mt-1 text-xs font-medium text-slate-400">

                                                {expense.expense_number || "—"}

                                            </p>

                                            {expense.reference && (

                                                <p className="mt-1 text-xs text-slate-500">

                                                    Réf. : {expense.reference}

                                                </p>

                                            )}

                                        </div>

                                    </div>

                                </td>

                                {/* Catégorie */}

                                <td className="px-6 py-5">

                                    <span className="inline-flex rounded-full bg-orange-100 px-3 py-1.5 text-xs font-bold text-orange-700">

                                        {expense.category || "—"}

                                    </span>

                                </td>

                                {/* Date */}

                                <td className="px-6 py-5">

                                    <p className="font-semibold text-slate-700">

                                        {formatDate(
                                            expense.expense_date
                                        )}

                                    </p>

                                </td>

                                {/* Moyen paiement */}

                                <td className="px-6 py-5">

                                    {expense.paymentMethod ? (

                                        <span className="inline-flex rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700">

                                            {
                                                expense
                                                    .paymentMethod
                                                    .name
                                            }

                                        </span>

                                    ) : (

                                        <span className="text-sm text-slate-400">

                                            Non renseigné

                                        </span>

                                    )}

                                </td>

                                {/* Montant */}

                                <td className="px-6 py-5 text-right">

                                    <span className="font-bold text-red-600">

                                        - {formatMoney(
                                            expense.amount
                                        )}

                                    </span>

                                </td>

                                {/* Actions */}

                                <td className="px-6 py-5">

                                    <div className="flex justify-center gap-2">

                                        <Link
                                            to={`/expenses/${expense.id}`}
                                            title="Voir"
                                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 transition hover:bg-blue-200"
                                        >

                                            <Eye size={18} />

                                        </Link>

                                        <Link
                                            to={`/expenses/${expense.id}/edit`}
                                            title="Modifier"
                                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700 transition hover:bg-yellow-200"
                                        >

                                            <Pencil size={18} />

                                        </Link>

                                        <button
    type="button"
    onClick={() => onDelete(expense.id)}
    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600 transition hover:bg-red-200"
    title="Supprimer"
>
    <Trash2 size={18} />
</button>

                                    </div>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}