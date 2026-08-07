import api from "./api";

/**
 * Liste des inscriptions
 */
export function getEnrollments(params = {}) {
    return api.get("/enrollments", {
        params,
    });
}

/**
 * Une inscription
 */
export function getEnrollment(id) {
    return api.get(`/enrollments/${id}`);
}

/**
 * Créer une inscription
 */
export function createEnrollment(data) {
    return api.post("/enrollments", data);
}

/**
 * Modifier une inscription
 */
export function updateEnrollment(id, data) {
    return api.put(`/enrollments/${id}`, data);
}

/**
 * Supprimer une inscription
 */
export function deleteEnrollment(id) {
    return api.delete(`/enrollments/${id}`);
}