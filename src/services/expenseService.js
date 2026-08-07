import api from "../api/axios";

/**
 * Liste des dépenses
 */
export async function getExpenses() {
    return await api.get("/expenses");
}

/**
 * Détail d'une dépense
 */
export async function getExpense(id) {
    return await api.get(`/expenses/${id}`);
}

/**
 * Créer une dépense
 */
export async function createExpense(data) {
    return await api.post("/expenses", data);
}

/**
 * Modifier une dépense
 */
export async function updateExpense(id, data) {
    return await api.put(`/expenses/${id}`, data);
}

/**
 * Supprimer une dépense
 */
export async function deleteExpense(id) {
    return await api.delete(`/expenses/${id}`);
}