import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

import api from "../../../services/api";

export default function usePayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPayments();
    }, []);

    async function loadPayments() {
        try {
            setLoading(true);

            const response = await api.get("/payments");

            setPayments(response.data.data || []);
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                    "Impossible de charger les paiements."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id) {
        const result = await Swal.fire({
            title: "Supprimer ce paiement ?",
            text: "Cette action est irréversible.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Supprimer",
            cancelButtonText: "Annuler",
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
        });

        if (!result.isConfirmed) return;

        try {
            await api.delete(`/payments/${id}`);

            toast.success("Paiement supprimé avec succès.");

            loadPayments();
        } catch (error) {
            console.error(error);

            toast.error(
                error.response?.data?.message ||
                    "Impossible de supprimer ce paiement."
            );
        }
    }

    return {
        payments,
        loading,
        loadPayments,
        handleDelete,
    };
}