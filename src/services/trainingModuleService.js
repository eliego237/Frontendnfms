import api from "./api";

export async function getTrainingModules() {
    const response = await api.get("/training-modules");
    return response.data;
}

export async function createTrainingModule(data) {

    console.log("📦 MODULE ENVOYÉ AU BACKEND :", data);

    try {

        const response = await api.post(
            "/training-modules",
            data
        );

        console.log(
            "✅ RÉPONSE CRÉATION MODULE :",
            response.data
        );

        return response.data;

    } catch (error) {

        console.error(
            "❌ ERREUR CRÉATION MODULE"
        );

        console.error(
            "STATUS :",
            error?.response?.status
        );

        console.error(
            "DATA :",
            error?.response?.data
        );

        console.error(
            "VALIDATION :",
            error?.response?.data?.errors
        );

        throw error;
    }
}

export async function updateTrainingModule(id, data) {
    const response = await api.put(`/training-modules/${id}`, data);
    return response.data;
}

export async function deleteTrainingModule(id) {
    const response = await api.delete(`/training-modules/${id}`);
    return response.data;
}