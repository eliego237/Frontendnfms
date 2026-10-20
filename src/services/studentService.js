
import api from "./api";

/**
 * Récupère les informations de pagination Laravel,
 * même si la réponse est enveloppée dans une propriété data.
 */
function normalizeResponse(response) {
    let result = response.data;

    // Prend en charge une éventuelle réponse imbriquée.
    if (
        result &&
        !Array.isArray(result.data) &&
        result.data &&
        typeof result.data === "object"
    ) {
        result = result.data;
    }

    if (Array.isArray(result)) {
        return {
            data: result,
            current_page: 1,
            last_page: 1,
            total: result.length,
        };
    }

    return {
        data: Array.isArray(result?.data) ? result.data : [],
        current_page: Number(result?.current_page || 1),
        last_page: Number(result?.last_page || 1),
        total: Number(result?.total ?? result?.data?.length ?? 0),
    };
}

/**
 * Récupère une page de résultats.
 */
export async function getStudents(page = 1) {
    const response = await api.get("/students", {
        params: { page },
    });

    return normalizeResponse(response);
}

/**
 * Récupère TOUS les étudiants, page après page.
 * La recherche et les statistiques React pourront ainsi
 * porter sur la liste complète.
 */
export async function getAllStudents() {
    const firstPage = await getStudents(1);

    let allStudents = [...firstPage.data];

    for (let page = 2; page <= firstPage.last_page; page++) {
        const result = await getStudents(page);
        allStudents.push(...result.data);
    }

    return allStudents;
}

export async function createStudent(data) {
    const response = await api.post("/students", data);
    return response.data;
}

export async function updateStudent(id, data) {
    const response = await api.put(`/students/${id}`, data);
    return response.data;
}

export async function deleteStudent(id) {
    const response = await api.delete(`/students/${id}`);
    return response.data;
}
