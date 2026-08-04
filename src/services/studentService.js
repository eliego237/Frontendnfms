import api from "./api";

export async function getStudents(page = 1) {
    const response = await api.get(`/students?page=${page}`);
    return response.data.data;
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