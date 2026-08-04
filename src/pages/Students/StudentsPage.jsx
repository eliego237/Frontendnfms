import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getStudents,
    createStudent,
    updateStudent,
    deleteStudent,
} from "../../services/studentService";

import StudentModal from "../../components/students/StudentModal";

import StudentHeader from "./components/StudentHeader";
import StudentStats from "./components/StudentStats";
import StudentFilters from "./components/StudentFilters";
import StudentsTable from "./components/StudentsTable";

export default function StudentsPage() {

    const [students, setStudents] = useState([]);

    const [loading, setLoading] = useState(true);

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

            const data = await getStudents();

            setStudents(data.data || []);

        } catch (error) {

            console.error(error);

            if (error.response) {

                console.log(error.response.data);

                alert(
                    JSON.stringify(
                        error.response.data,
                        null,
                        2
                    )
                );

            } else {

                alert(error.message);

            }

        } finally {

            setLoading(false);

        }

    }

    async function handleSave(formData) {

        try {

            if (selectedStudent) {

                await updateStudent(
                    selectedStudent.id,
                    formData
                );

            } else {

                await createStudent(formData);

            }

            setModalOpen(false);

            setSelectedStudent(null);

            await loadStudents();

        } catch (error) {

            console.error(error);

            if (error.response) {

                console.log(error.response.data);

                alert(
                    JSON.stringify(
                        error.response.data,
                        null,
                        2
                    )
                );

            } else {

                alert(error.message);

            }

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

            console.error(error);

            if (error.response) {

                alert(

                    JSON.stringify(
                        error.response.data,
                        null,
                        2
                    )

                );

            } else {

                alert(error.message);

            }

        }

    }

    function calculateAge(date) {

        if (!date) return "-";

        const birth = new Date(date);

        const today = new Date();

        let age =

            today.getFullYear() -

            birth.getFullYear();

        const month =

            today.getMonth() -

            birth.getMonth();

        if (

            month < 0 ||

            (
                month === 0 &&
                today.getDate() < birth.getDate()
            )

        ) {

            age--;

        }

        return age;

    }

    const filteredStudents = students.filter((student) => {

        const keyword = search.toLowerCase();

        const matchSearch =

            student.matricule?.toLowerCase().includes(keyword) ||

            student.first_name?.toLowerCase().includes(keyword) ||

            student.last_name?.toLowerCase().includes(keyword) ||

            student.phone?.toLowerCase().includes(keyword) ||

            student.email?.toLowerCase().includes(keyword);

        const matchStatus =

            status === ""

                ? true

                : Number(student.status) === Number(status);

        const matchGender =

            gender === ""

                ? true

                : student.gender === gender;

        return (

            matchSearch &&

            matchStatus &&

            matchGender

        );

    });

        /* =====================================================
        LOADING
    ===================================================== */

    if (loading) {

        return (

            <div className="flex min-h-[70vh] items-center justify-center">

                <div className="text-center">

                    <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>

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

    /* =====================================================
        PAGE
    ===================================================== */

    return (

        <>

            <div className="space-y-8">

                <StudentHeader

                    onAdd={() => {

                        setSelectedStudent(null);

                        setModalOpen(true);

                    }}

                />

                <StudentStats

                    students={students}

                />

                <StudentFilters

                    search={search}

                    setSearch={setSearch}

                    status={status}

                    setStatus={setStatus}

                    gender={gender}

                    setGender={setGender}

                    total={filteredStudents.length}

                />

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                    <StudentsTable

                        students={filteredStudents}

                        calculateAge={calculateAge}

                        onEdit={(student) => {

                            setSelectedStudent(student);

                            setModalOpen(true);

                        }}

                        onDelete={handleDelete}

                    />

                    <div className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 bg-slate-50 px-6 py-4 md:flex-row">

                        <p className="text-sm text-slate-600">

                            Affichage de

                            <span className="mx-1 font-bold text-slate-800">

                                {filteredStudents.length}

                            </span>

                            étudiant(s) sur

                            <span className="mx-1 font-bold text-blue-600">

                                {students.length}

                            </span>

                        </p>

                        <div className="flex gap-2">

                            <button

                                disabled

                                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-400"

                            >

                                Précédent

                            </button>

                            <button

                                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white"

                            >

                                1

                            </button>

                            <button

                                disabled

                                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm text-slate-400"

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