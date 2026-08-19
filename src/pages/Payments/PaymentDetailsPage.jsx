import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import toast from "react-hot-toast";
import Swal from "sweetalert2";

import api from "../../services/api";

import PaymentHeader from "./components/PaymentHeader";

import PaymentInformationCard from "./components/PaymentInformationCard";
import PaymentStudentCard from "./components/PaymentStudentCard";
import PaymentFinanceCard from "./components/PaymentFinanceCard";
import PaymentHistoryCard from "./components/PaymentHistoryCard";
import PaymentActionsCard from "./components/PaymentActionsCard";

export default function PaymentDetailsPage() {

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

        }

        catch {

            toast.error("Impossible de charger le paiement.");

            navigate("/payments");

        }

        finally {

            setLoading(false);

        }

    }

    async function handleDelete() {

        const result = await Swal.fire({

            icon: "warning",

            title: "Supprimer ce paiement ?",

            text: "Cette opération est irréversible.",

            showCancelButton: true,

            confirmButtonText: "Supprimer",

            cancelButtonText: "Annuler",

            confirmButtonColor: "#dc2626",

        });

        if (!result.isConfirmed) return;

        try {

            await api.delete(`/payments/${id}`);

            toast.success("Paiement supprimé.");

            navigate("/payments");

        }

        catch {

            toast.error("Impossible de supprimer ce paiement.");

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Ouvrir le reçu
    |--------------------------------------------------------------------------
    */

    async function handlePrint() {

        try {

            const response = await api.get(
                `/payments/${payment.id}/receipt`,
                {
                    responseType: "blob",
                }
            );

            const blob = new Blob(
                [response.data],
                {
                    type:
                        response.headers["content-type"] ||
                        "application/pdf",
                }
            );

            const blobUrl = window.URL.createObjectURL(blob);

            window.open(blobUrl, "_blank");

        }

        catch (error) {

            console.error(
                "Erreur lors de l'ouverture du reçu :",
                error
            );

            toast.error(
                "Impossible d'ouvrir le reçu."
            );

        }

    }

    /*
    |--------------------------------------------------------------------------
    | Télécharger le reçu
    |--------------------------------------------------------------------------
    */

    async function handleDownload() {

        try {

            const response = await api.get(
                `/payments/${payment.id}/receipt?download=1`,
                {
                    responseType: "blob",
                }
            );

            const blob = new Blob(
                [response.data],
                {
                    type:
                        response.headers["content-type"] ||
                        "application/pdf",
                }
            );

            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");

            link.href = blobUrl;

            link.download =
                `recu-paiement-${payment.id}.pdf`;

            document.body.appendChild(link);

            link.click();

            link.remove();

            window.URL.revokeObjectURL(blobUrl);

        }

        catch (error) {

            console.error(
                "Erreur lors du téléchargement du reçu :",
                error
            );

            toast.error(
                "Impossible de télécharger le reçu."
            );

        }

    }

    if (loading) {

        return (

            <div className="flex items-center justify-center py-24">

                <div className="text-center">

                    <div className="mx-auto mb-5 h-14 w-14 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>

                    <p className="font-medium text-slate-600">

                        Chargement du paiement...

                    </p>

                </div>

            </div>

        );

    }

    if (!payment) {

        return (

            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">

                <h2 className="text-2xl font-bold">

                    Paiement introuvable

                </h2>

            </div>

        );

    }

    return (

        <div className="space-y-8">

            <PaymentHeader />

            {/* ================================
                LIGNE 1
            ================================= */}

            <div className="grid gap-8 xl:grid-cols-2">

                <PaymentInformationCard

                    payment={payment}

                />

                <PaymentStudentCard

                    payment={payment}

                />

            </div>

            {/* ================================
                LIGNE 2
            ================================= */}

            <div className="grid gap-8 xl:grid-cols-2">

                <PaymentFinanceCard

                    payment={payment}

                />

                <PaymentActionsCard

                    payment={payment}

                    onPrint={handlePrint}

                    onDownload={handleDownload}

                    onDelete={handleDelete}

                />

            </div>

            {/* ================================
                HISTORIQUE
            ================================= */}

            <PaymentHistoryCard

                payments={payment.enrollment?.payments || []}

            />

            {/* ================================
                INFORMATIONS SYSTÈME
            ================================= */}

            <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 p-6">

                    <h2 className="text-xl font-bold">

                        Informations système

                    </h2>

                </div>

                <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">

                    <div>

                        <p className="text-sm text-slate-500">

                            ID Paiement

                        </p>

                        <p className="mt-1 font-semibold">

                            #{payment.id}

                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-slate-500">

                            Reçu

                        </p>

                        <p className="mt-1 font-semibold">

                            {payment.receipt_number}

                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-slate-500">

                            Créé le

                        </p>

                        <p className="mt-1 font-semibold">

                            {payment.created_at}

                        </p>

                    </div>

                    <div>

                        <p className="text-sm text-slate-500">

                            Encaisseur

                        </p>

                        <p className="mt-1 font-semibold">

                            {payment.receiver?.name || "-"}

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}