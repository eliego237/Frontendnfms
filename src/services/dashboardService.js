import api from "../api/axios";

/**
 * Récupère les données complètes du Dashboard.
 */
export async function getDashboard() {
    const response = await api.get("/dashboard");

    console.log("API Dashboard :", response.data);

    if (!response.data?.success) {
        throw new Error(
            response.data?.message ||
            "Impossible de charger le tableau de bord."
        );
    }

    return response.data.data;
}

/**
 * Récupère les données du graphique des paiements.
 */
export async function getPaymentsChart() {
    const response = await api.get("/dashboard/charts/payments");

    return response.data?.data ?? response.data;
}