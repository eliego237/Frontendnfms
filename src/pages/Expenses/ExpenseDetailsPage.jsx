import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import {
    ArrowLeft,
    Pencil,
    Trash2,
} from "lucide-react";

import {
    getExpense,
    deleteExpense,
} from "../../services/expenseService";

export default function ExpenseDetailsPage() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [expense, setExpense] = useState(null);

    const [loading, setLoading] = useState(true);

    const [deleting, setDeleting] = useState(false);

    useEffect(() => {

        loadExpense();

    }, [id]);

    async function loadExpense() {

        try {

            setLoading(true);

            const response = await getExpense(id);

            setExpense(
                response.data?.data ??
                response.data
            );

        } catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                "Impossible de charger la dépense."
            );

            navigate("/expenses");

        } finally {

            setLoading(false);

        }

    }

    async function handleDelete() {

        const confirmed = window.confirm(
            "Voulez-vous vraiment supprimer cette dépense ?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setDeleting(true);

            await deleteExpense(id);

            toast.success(
                "Dépense supprimée avec succès."
            );

            navigate("/expenses");

        } catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                "Impossible de supprimer la dépense."
            );

        } finally {

            setDeleting(false);

        }

    }

    function formatAmount(value) {

        return Number(value || 0).toLocaleString(
            "fr-FR"
        );

    }

    function formatDate(value) {

        if (!value) {
            return "-";
        }

        return new Date(value).toLocaleDateString(
            "fr-FR"
        );

    }

    if (loading) {

        return (
            <div className="p-12 text-center">
                Chargement de la dépense...
            </div>
        );

    }

    if (!expense) {

        return (
            <div className="p-12 text-center">
                Dépense introuvable.
            </div>
        );

    }

    const paymentMethod =
        expense.payment_method?.name ??
        expense.payment_method?.title ??
        expense.payment_method?.label ??
        "-";

    const recorder =
        expense.recorder?.name ??
        expense.recorder?.full_name ??
        "-";

    return (

        <div className="space-y-8">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>

                    <button
                        type="button"
                        onClick={() => navigate("/expenses")}
                        className="mb-4 flex items-center gap-2 text-slate-500 hover:text-blue-600"
                    >
                        <ArrowLeft size={18} />

                        Retour aux dépenses
                    </button>

                    <h1 className="text-3xl font-bold text-slate-900">
                        Détails de la dépense
                    </h1>

                    <p className="mt-2 text-slate-500">
                        {expense.expense_number}
                    </p>

                </div>

                <div className="flex gap-3">

                    <Link
                        to={`/expenses/${id}/edit`}
                        className="flex items-center gap-2 rounded-xl bg-amber-100 px-5 py-3 font-semibold text-amber-700"
                    >
                        <Pencil size={18} />

                        Modifier
                    </Link>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={deleting}
                        className="flex items-center gap-2 rounded-xl bg-red-100 px-5 py-3 font-semibold text-red-700 disabled:opacity-50"
                    >
                        <Trash2 size={18} />

                        {deleting
                            ? "Suppression..."
                            : "Supprimer"}
                    </button>

                </div>

            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                <div className="rounded-3xl bg-white p-7 shadow lg:col-span-2">

                    <h2 className="mb-6 text-xl font-bold">
                        Informations de la dépense
                    </h2>

                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                        <div>
                            <p className="text-sm text-slate-500">
                                Numéro
                            </p>

                            <p className="mt-1 font-semibold">
                                {expense.expense_number}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                Catégorie
                            </p>

                            <p className="mt-1 font-semibold">
                                {expense.category}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                Libellé
                            </p>

                            <p className="mt-1 font-semibold">
                                {expense.title}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                Date
                            </p>

                            <p className="mt-1 font-semibold">
                                {formatDate(expense.expense_date)}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                Moyen de paiement
                            </p>

                            <p className="mt-1 font-semibold">
                                {paymentMethod}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                Référence
                            </p>

                            <p className="mt-1 font-semibold">
                                {expense.reference || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                Enregistré par
                            </p>

                            <p className="mt-1 font-semibold">
                                {recorder}
                            </p>
                        </div>

                    </div>

                    <div className="mt-8">

                        <p className="text-sm text-slate-500">
                            Description
                        </p>

                        <p className="mt-2 whitespace-pre-wrap text-slate-700">
                            {expense.description || "Aucune description."}
                        </p>

                    </div>

                    <div className="mt-8">

                        <p className="text-sm text-slate-500">
                            Notes
                        </p>

                        <p className="mt-2 whitespace-pre-wrap text-slate-700">
                            {expense.notes || "Aucune note."}
                        </p>

                    </div>

                </div>

                <div className="rounded-3xl bg-white p-7 shadow">

                    <p className="text-sm text-slate-500">
                        Montant de la dépense
                    </p>

                    <p className="mt-3 text-3xl font-bold text-red-600">
                        {formatAmount(expense.amount)} FCFA
                    </p>

                    <div className="mt-8 rounded-2xl bg-slate-50 p-5">

                        <p className="text-sm text-slate-500">
                            Date d'enregistrement
                        </p>

                        <p className="mt-1 font-semibold">
                            {formatDate(expense.created_at)}
                        </p>

                    </div>

                    {expense.cash_transaction && (

                        <div className="mt-4 rounded-2xl bg-red-50 p-5">

                            <p className="text-sm text-red-600">
                                Transaction de caisse
                            </p>

                            <p className="mt-1 font-semibold text-red-700">
                                Transaction enregistrée
                            </p>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}