import api from "./api";

export async function getTrainings() {
    const response = await api.get("/trainings");
    return response.data;
}

export async function createTraining(data) {
    const response = await api.post("/trainings", data);
    return response.data;
}

export async function updateTraining(id, data) {
    const response = await api.put(`/trainings/${id}`, data);
    return response.data;
}

export async function deleteTraining(id) {
    const response = await api.delete(`/trainings/${id}`);
    return response.data;
}