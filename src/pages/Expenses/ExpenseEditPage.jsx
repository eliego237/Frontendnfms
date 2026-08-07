import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
    getExpense,
    updateExpense,
} from "../../services/expenseService";

import {
    getPaymentMethods,
} from "../../services/paymentMethodService";

export default function ExpenseEditPage() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [paymentMethods, setPaymentMethods] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        category: "",
        title: "",
        description: "",
        amount: "",
        payment_method_id: "",
        expense_date: "",
        reference: "",
        notes: "",
    });

    useEffect(() => {

        loadData();

    }, [id]);

    async function loadData() {

        try {

            setLoading(true);

            const [
                expenseResponse,
                methodsResponse,
            ] = await Promise.all([

                getExpense(id),

                getPaymentMethods(),

            ]);

            const expense =
                expenseResponse.data?.data ??
                expenseResponse.data;

            const methods =
                methodsResponse.data?.data ??
                methodsResponse.data ??
                [];

            setPaymentMethods(methods);

            setForm({

                category: expense?.category ?? "",

                title: expense?.title ?? "",

                description: expense?.description ?? "",

                amount: expense?.amount ?? "",

                payment_method_id:
                    expense?.payment_method_id ?? "",

                expense_date:
                    expense?.expense_date?.slice(0, 10) ?? "",

                reference: expense?.reference ?? "",

                notes: expense?.notes ?? "",

            });

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

    function handleChange(e) {

        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

    }

    async function handleSubmit(e) {

        e.preventDefault();

        if (!form.category.trim()) {

            toast.error("La catégorie est obligatoire.");

            return;

        }

        if (!form.title.trim()) {

            toast.error("Le libellé de la dépense est obligatoire.");

            return;

        }

        if (!form.amount || Number(form.amount) <= 0) {

            toast.error("Le montant doit être supérieur à zéro.");

            return;

        }

        try {

            setSaving(true);

            await updateExpense(id, {

                category: form.category,

                title: form.title,

                description: form.description || null,

                amount: Number(form.amount),

                payment_method_id:
                    form.payment_method_id
                        ? Number(form.payment_method_id)
                        : null,

                expense_date: form.expense_date,

                reference: form.reference || null,

                notes: form.notes || null,

            });

            toast.success(
                "Dépense modifiée avec succès."
            );

            navigate(`/expenses/${id}`);

        } catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                "Impossible de modifier la dépense."
            );

        } finally {

            setSaving(false);

        }

    }

    if (loading) {

        return (
            <div className="p-12 text-center">
                Chargement de la dépense...
            </div>
        );

    }

    return (

        <div className="space-y-8">

            <div>

                <h1 className="text-3xl font-bold text-slate-900">
                    Modifier une dépense
                </h1>

                <p className="mt-2 text-slate-500">
                    Modifiez les informations de la dépense.
                </p>

            </div>

            <form
                onSubmit={handleSubmit}
                className="rounded-3xl bg-white p-8 shadow"
            >

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

                    <div>
                        <label className="mb-2 block font-medium">
                            Catégorie *
                        </label>

                        <input
                            type="text"
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            Libellé *
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            Montant (FCFA) *
                        </label>

                        <input
                            type="number"
                            name="amount"
                            min="0.01"
                            step="0.01"
                            value={form.amount}
                            onChange={handleChange}
                            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            Moyen de paiement
                        </label>

                        <select
                            name="payment_method_id"
                            value={form.payment_method_id}
                            onChange={handleChange}
                            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
                        >

                            <option value="">
                                Aucun moyen sélectionné
                            </option>

                            {paymentMethods.map((method) => (

                                <option
                                    key={method.id}
                                    value={method.id}
                                >
                                    {method.name ??
                                        method.title ??
                                        method.label ??
                                        `Moyen #${method.id}`}
                                </option>

                            ))}

                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            Date de la dépense *
                        </label>

                        <input
                            type="date"
                            name="expense_date"
                            value={form.expense_date}
                            onChange={handleChange}
                            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block font-medium">
                            Référence
                        </label>

                        <input
                            type="text"
                            name="reference"
                            value={form.reference}
                            onChange={handleChange}
                            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="md:col-span-2">

                        <label className="mb-2 block font-medium">
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
                        />

                    </div>

                    <div className="md:col-span-2">

                        <label className="mb-2 block font-medium">
                            Notes
                        </label>

                        <textarea
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            rows="4"
                            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-blue-500"
                        />

                    </div>

                </div>

                <div className="mt-8 flex justify-end gap-4">

                    <button
                        type="button"
                        onClick={() => navigate(`/expenses/${id}`)}
                        className="rounded-xl border px-6 py-3 font-medium"
                    >
                        Annuler
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving
                            ? "Enregistrement..."
                            : "Enregistrer les modifications"}
                    </button>

                </div>

            </form>

        </div>

    );

}