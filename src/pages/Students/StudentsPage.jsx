
import { useEffect, useMemo, useState } from "react";

import {
    getAllStudents,
    createStudent,
    updateStudent,
    deleteStudent,
} from "../../services/studentService";

import StudentModal from "../../components/students/StudentModal";

import StudentHeader from "./components/StudentHeader";
import StudentStats from "./components/StudentStats";
import StudentFilters from "./components/StudentFilters";
import StudentsTable from "./components/StudentsTable";

const PAGE_SIZE = 10;

export default function StudentsPage() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [gender, setGender] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        loadStudents();
    }, []);

    async function loadStudents() {
        try {
            setLoading(true);

            const data = await getAllStudents();
            setStudents(data);
        } catch (error) {
            console.error("Erreur de chargement :", error);

            alert(
                error.response?.data?.message ||
                error.message ||
                "Impossible de charger les étudiants."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(formData) {
        try {
            if (selectedStudent) {
                await updateStudent(selectedStudent.id, formData);
            } else {
                await createStudent(formData);
            }

            setModalOpen(false);
            setSelectedStudent(null);

            await loadStudents();
        } catch (error) {
            console.error("Erreur d'enregistrement :", error);

            alert(
                error.response?.data?.message ||
                JSON.stringify(
                    error.response?.data || error.message,
                    null,
                    2
                )
            );
        }
    }

    async function handleDelete(student) {
        const confirmation = window.confirm(
            `Supprimer ${student.first_name} ${student.last_name} ?`
        );

        if (!confirmation) return;

        try {
            await deleteStudent(student.id);
            await loadStudents();
        } catch (error) {
            console.error("Erreur de suppression :", error);

            alert(
                error.response?.data?.message ||
                JSON.stringify(
                    error.response?.data || error.message,
                    null,
                    2
                )
            );
        }
    }

    function calculateAge(date) {
        if (!date) return "-";

        const birth = new Date(date);

        if (Number.isNaN(birth.getTime())) return "-";

        const today = new Date();

        let age = today.getFullYear() - birth.getFullYear();

        const month = today.getMonth() - birth.getMonth();

        if (
            month < 0 ||
            (month === 0 && today.getDate() < birth.getDate())
        ) {
            age--;
        }

        return age;
    }

    // Recherche globale : la liste contient tous les étudiants.
    const filteredStudents = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        return students.filter((student) => {
            const searchableFields = [
                student.matricule,
                student.first_name,
                student.last_name,
                student.phone,
                student.email,
            ];

            const matchSearch =
                keyword === "" ||
                searchableFields.some((value) =>
                    String(value ?? "")
                        .toLowerCase()
                        .includes(keyword)
                );

            const matchStatus =
                status === "" ||
                String(student.status) === String(status);

            const matchGender =
                gender === "" ||
                String(student.gender ?? "").toLowerCase() ===
                    gender.toLowerCase();

            return matchSearch && matchStatus && matchGender;
        });
    }, [students, search, status, gender]);

    // Nombre de pages calculé APRÈS la recherche et les filtres.
    const lastPage = Math.max(
        1,
        Math.ceil(filteredStudents.length / PAGE_SIZE)
    );

    // Évite de rester sur une page inexistante après un filtrage.
    useEffect(() => {
        if (currentPage > lastPage) {
            setCurrentPage(lastPage);
        }
    }, [currentPage, lastPage]);

    // Seule la table est paginée. Les statistiques utilisent tous les étudiants.
    const displayedStudents = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;

        return filteredStudents.slice(start, start + PAGE_SIZE);
    }, [filteredStudents, currentPage]);

    function handleSearchChange(value) {
        setSearch(value);
        setCurrentPage(1);
    }

    function handleStatusChange(value) {
        setStatus(value);
        setCurrentPage(1);
    }

    function handleGenderChange(value) {
        setGender(value);
        setCurrentPage(1);
    }

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

                    <h2 className="text-xl font-bold text-slate-700">
                        Chargement des étudiants...
                    </h2>

                    <p className="mt-2 text-slate-500">
                        Veuillez patienter quelques instants.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-8">
                <StudentHeader
                    onAdd={() => {
                        setSelectedStudent(null);
                        setModalOpen(true);
                    }}
                />

                {/* Statistiques calculées sur TOUS les étudiants */}
                <StudentStats students={students} />

                <StudentFilters
                    search={search}
                    setSearch={handleSearchChange}
                    status={status}
                    setStatus={handleStatusChange}
                    gender={gender}
                    setGender={handleGenderChange}
                    total={filteredStudents.length}
                />

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <StudentsTable
                        students={displayedStudents}
                        calculateAge={calculateAge}
                        onEdit={(student) => {
                            setSelectedStudent(student);
                            setModalOpen(true);
                        }}
                        onDelete={handleDelete}
                    />

                    <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 px-6 py-4 md:flex-row">
                        <p className="text-sm text-slate-600">
                            Affichage de{" "}
                            <span className="font-bold text-slate-800">
                                {displayedStudents.length}
                            </span>{" "}
                            étudiant(s) sur{" "}
                            <span className="font-bold text-blue-600">
                                {filteredStudents.length}
                            </span>{" "}
                            résultat(s) filtré(s) —{" "}
                            <span className="font-bold text-slate-800">
                                {students.length}
                            </span>{" "}
                            étudiant(s) au total.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-2">
                            <button
                                type="button"
                                onClick={() =>
                                    setCurrentPage((page) =>
                                        Math.max(1, page - 1)
                                    )
                                }
                                disabled={currentPage <= 1}
                                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Précédent
                            </button>

                            <span className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white">
                                Page {currentPage} / {lastPage}
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    setCurrentPage((page) =>
                                        Math.min(lastPage, page + 1)
                                    )
                                }
                                disabled={currentPage >= lastPage}
                                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Suivant
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <StudentModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    setSelectedStudent(null);
                }}
                onSave={handleSave}
                student={selectedStudent}
            />
        </>
    );
}
