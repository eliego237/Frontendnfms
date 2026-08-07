import api from "./api";

/**
 * Rapport des étudiants
 */
export async function getStudentsReport(params = {}) {
    const response = await api.get("/reports/students", {
        params,
    });

    return response.data;
}

/**
 * Rapport des inscriptions
 */
export async function getEnrollmentsReport(params = {}) {
    const response = await api.get("/reports/enrollments", {
        params,
    });

    return response.data;
}

/**
 * Rapport des paiements
 */
export async function getPaymentsReport(params = {}) {
    const response = await api.get("/reports/payments", {
        params,
    });

    return response.data;
}

/**
 * Rapport des dépenses
 */
export async function getExpensesReport(params = {}) {
    const response = await api.get("/reports/expenses", {
        params,
    });

    return response.data;
}

/**
 * Rapport financier
 */
export async function getFinancialSummaryReport(params = {}) {
    const response = await api.get("/reports/financial-summary", {
        params,
    });

    return response.data;
}

/**
 * Livre de caisse
 */
export async function getCashBookReport(params = {}) {
    const response = await api.get("/reports/cash-book", {
        params,
    });

    return response.data;
}