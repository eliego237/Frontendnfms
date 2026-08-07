import api from "./api";

/**
 * Récupérer les moyens de paiement
 */
export function getPaymentMethods() {
    return api.get("/payment-methods");
}