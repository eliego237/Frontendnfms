import api from "./api";

export async function getTrainingModules() {
    const response = await api.get("/training-modules");
    return response.data;
}

export async function createTrainingModule(data) {
    const response = await api.post("/training-modules", data);
    return response.data;
}

export async function updateTrainingModule(id, data) {
    const response = await api.put(`/training-modules/${id}`, data);
    return response.data;
}

export async function deleteTrainingModule(id) {
    const response = await api.delete(`/training-modules/${id}`);
    return response.data;
}