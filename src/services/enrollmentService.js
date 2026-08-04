import api from "./api";

export function getEnrollments() {

    return api.get("/enrollments");

}

export function getEnrollment(id) {

    return api.get(`/enrollments/${id}`);

}

export function createEnrollment(data) {

    return api.post("/enrollments", data);

}

export function updateEnrollment(id, data) {

    return api.put(`/enrollments/${id}`, data);

}

export function deleteEnrollment(id) {

    return api.delete(`/enrollments/${id}`);

}