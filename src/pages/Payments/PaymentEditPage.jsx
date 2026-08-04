import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Printer, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import api from "../../services/api";
import { money } from "./utils/paymentHelpers";

export default function PaymentEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [payment, setPayment] = useState(null);

    useEffect(() => {
        loadPayment();
    }, [id]);

    async function loadPayment() {
        try {
            setLoading(true);

            const response = await api.get(`/payments/${id}`);

            setPayment(response.data.data);

        } catch (error) {

            Swal.fire({
                icon: "error",
                title: "Erreur",
                text: "Impossible de charger le paiement.",
            });

            navigate("/payments");

        } finally {

            setLoading(false);

        }
    }

    async function handleDelete() {

        const result = await Swal.fire({
            title: "Supprimer ce paiement ?",
            text: "Cette action est irréversible.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Oui, supprimer",
            cancelButtonText: "Annuler",
            confirmButtonColor: "#dc2626",
        });

        if (!result.isConfirmed) return;

        try {

            await api.delete(`/payments/${id}`);

            Swal.fire({
                icon: "success",
                title: "Supprimé",
                text: "Le paiement a été supprimé avec succès.",
            });

            navigate("/payments");

        } catch (error) {

            Swal.fire({
                icon: "error",
                title: "Erreur",
                text: error.response?.data?.message || "Impossible de supprimer le paiement.",
            });

        }
    }

    if (loading) {

        return (
            <div className="flex items-center justify-center py-24">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
        );
    }

    if (!payment) return null;

    return (
        <div className="space-y-6">

            {/* HEADER */}

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div className="flex items-center gap-3">

                    <button
                        onClick={() => navigate(-1)}
                        className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">
                            Paiement {payment.receipt_number}
                        </h1>
                        <p className="text-sm text-slate-500">
                            Consultation du paiement
                        </p>
                    </div>

                </div>

                <div className="flex gap-3">

                    <a
                        href={`${api.defaults.baseURL}/payments/${payment.id}/receipt`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                    >
                        <Printer size={18} />
                        Imprimer
                    </a>

                    <button
                        onClick={handleDelete}
                        className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                        <Trash2 size={18} />
                        Supprimer
                    </button>

                </div>

            </div>

            {/* MESSAGE */}

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
                Ce paiement est validé et ne peut plus être modifié.
                En cas d’erreur, supprimez-le puis créez un nouveau paiement.
            </div>

            {/* INFOS PAIEMENT */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <h2 className="mb-4 text-lg font-semibold text-slate-800">
                    Informations du paiement
                </h2>

                <div className="grid gap-4 md:grid-cols-2">

                    <div>
                        <p className="text-sm text-slate-500">Reçu</p>
                        <p className="font-semibold text-blue-600">
                            {payment.receipt_number}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Date</p>
                        <p className="font-medium">
                            {payment.payment_date}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Montant</p>
                        <p className="text-xl font-bold text-green-600">
                            {money(payment.amount)}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Méthode</p>
                        <p className="font-medium">
                            {payment.payment_method?.name || "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Référence</p>
                        <p className="font-medium">
                            {payment.reference || "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Encaisseur</p>
                        <p className="font-medium">
                            {payment.receiver?.name || "-"}
                        </p>
                    </div>

                </div>

                <div className="mt-4">
                    <p className="text-sm text-slate-500">Observations</p>
                    <p className="mt-1 rounded-xl bg-slate-50 p-3 text-slate-700">
                        {payment.notes || "Aucune observation."}
                    </p>
                </div>

            </div>

            {/* ETUDIANT */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <h2 className="mb-4 text-lg font-semibold text-slate-800">
                    Étudiant
                </h2>

                <div className="grid gap-4 md:grid-cols-2">

                    <div>
                        <p className="text-sm text-slate-500">Nom complet</p>
                        <p className="font-medium">
                            {payment.enrollment?.student?.full_name}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Matricule</p>
                        <p className="font-medium">
                            {payment.enrollment?.student?.matricule}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Téléphone</p>
                        <p className="font-medium">
                            {payment.enrollment?.student?.phone || "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Email</p>
                        <p className="font-medium">
                            {payment.enrollment?.student?.email || "-"}
                        </p>
                    </div>

                </div>

            </div>

            {/* FORMATION */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <h2 className="mb-4 text-lg font-semibold text-slate-800">
                    Formation
                </h2>

                <div className="grid gap-4 md:grid-cols-2">

                    <div>
                        <p className="text-sm text-slate-500">Formation</p>
                        <p className="font-medium">
                            {payment.enrollment?.training?.title}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Code</p>
                        <p className="font-medium">
                            {payment.enrollment?.training?.code || "-"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Inscription</p>
                        <p className="font-medium">
                            {payment.enrollment?.enrollment_number}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-slate-500">Statut financier</p>
                        <p className="font-medium text-blue-600">
                            {payment.enrollment?.formatted_status}
                        </p>
                    </div>

                </div>

            </div>

            {/* SITUATION FINANCIERE */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <h2 className="mb-4 text-lg font-semibold text-slate-800">
                    Situation financière
                </h2>

                <div className="grid gap-4 md:grid-cols-4">

                    <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Total</p>
                        <p className="font-bold">
                            {money(payment.enrollment?.total_amount)}
                        </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Déjà payé</p>
                        <p className="font-bold text-green-600">
                            {money(payment.enrollment?.amount_paid)}
                        </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Reste à payer</p>
                        <p className="font-bold text-red-600">
                            {money(payment.enrollment?.balance)}
                        </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-sm text-slate-500">Progression</p>
                        <p className="font-bold text-blue-600">
                            {payment.enrollment?.payment_progress} %
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
}