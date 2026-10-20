
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getAllStudents } from "../../../services/studentService";
import { getTrainings } from "../../../services/trainingService";
import { createEnrollment } from "../../../services/enrollmentService";

import EnrollmentStudentCard from "./EnrollmentStudentCard";
import EnrollmentTrainingCard from "./EnrollmentTrainingCard";
import EnrollmentModulesCard from "./EnrollmentModulesCard";
import EnrollmentFinanceCard from "./EnrollmentFinanceCard";
import EnrollmentInformationCard from "./EnrollmentInformationCard";
import EnrollmentActions from "./EnrollmentActions";

export default function EnrollmentForm() {
    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [trainings, setTrainings] = useState([]);

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    const [studentId, setStudentId] = useState("");
    const [trainingIds, setTrainingIds] = useState([]);

    const [discount, setDiscount] = useState(0);

    const [enrolledAt, setEnrolledAt] = useState(
        new Date().toISOString().slice(0, 10)
    );

    const [academicYear, setAcademicYear] = useState("2026-2027");
    const [notes, setNotes] = useState("");

    const REGISTRATION_FEE = 16500;

    /*
    |--------------------------------------------------------------------------
    | Chargement de tous les étudiants et des formations
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        let cancelled = false;

        async function loadData() {
            try {
                setLoadingData(true);

                const [studentsResponse, trainingsResponse] =
                    await Promise.all([
                        getAllStudents(),
                        getTrainings(),
                    ]);

                if (cancelled) return;

                // getAllStudents() doit renvoyer un tableau complet.
                const studentsData = Array.isArray(studentsResponse)
                    ? studentsResponse
                    : [];

                // Normalisation de la réponse des formations.
                let trainingsData = trainingsResponse;

                if (trainingsData?.data !== undefined) {
                    trainingsData = trainingsData.data;
                }

                if (trainingsData?.data !== undefined) {
                    trainingsData = trainingsData.data;
                }

                if (!Array.isArray(trainingsData)) {
                    trainingsData = [];
                }

                setStudents(studentsData);
                setTrainings(trainingsData);

                console.log(
                    "Nombre total d'étudiants chargés :",
                    studentsData.length
                );

                console.log("Étudiants :", studentsData);
                console.log("Formations :", trainingsData);
            } catch (error) {
                if (cancelled) return;

                console.error(
                    "Erreur de chargement des données d'inscription :",
                    error
                );

                console.error(
                    "Réponse du serveur :",
                    error?.response?.data
                );

                toast.error(
                    "Impossible de charger les étudiants et les formations."
                );

                setStudents([]);
                setTrainings([]);
            } finally {
                if (!cancelled) {
                    setLoadingData(false);
                }
            }
        }

        loadData();

        return () => {
            cancelled = true;
        };
    }, []);

    /*
    |--------------------------------------------------------------------------
    | Formations sélectionnées
    |--------------------------------------------------------------------------
    */

    const selectedTrainings = useMemo(() => {
        return trainings.filter((training) =>
            trainingIds.includes(Number(training.id))
        );
    }, [trainings, trainingIds]);

    /*
    |--------------------------------------------------------------------------
    | Frais des formations
    |--------------------------------------------------------------------------
    */

    const trainingFee = useMemo(() => {
        return selectedTrainings.reduce(
            (total, training) =>
                total + Number(training.price ?? 0),
            0
        );
    }, [selectedTrainings]);

    /*
    |--------------------------------------------------------------------------
    | Calcul du montant total
    |--------------------------------------------------------------------------
    */

    const totalAmount = Math.max(
        0,
        REGISTRATION_FEE +
            trainingFee -
            Number(discount || 0)
    );

    /*
    |--------------------------------------------------------------------------
    | Sélection multiple des formations
    |--------------------------------------------------------------------------
    */

    function handleTrainingChange(value) {
        const id = Number(value);

        if (!Number.isFinite(id) || id <= 0) {
            return;
        }

        setTrainingIds((currentIds) => {
            if (currentIds.includes(id)) {
                return currentIds.filter(
                    (trainingId) => trainingId !== id
                );
            }

            return [...currentIds, id];
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Création de l'inscription
    |--------------------------------------------------------------------------
    */

    async function handleSubmit(event) {
        event.preventDefault();

        if (!studentId) {
            toast.error("Sélectionnez un étudiant.");
            return;
        }

        if (trainingIds.length === 0) {
            toast.error("Sélectionnez au moins une formation.");
            return;
        }

        if (selectedTrainings.length !== trainingIds.length) {
            toast.error(
                "Une ou plusieurs formations sélectionnées sont introuvables."
            );
            return;
        }

        if (!enrolledAt) {
            toast.error("Sélectionnez la date d'inscription.");
            return;
        }

        if (!academicYear.trim()) {
            toast.error("Renseignez l'année académique.");
            return;
        }

        const discountAmount = Number(discount || 0);

        if (!Number.isFinite(discountAmount) || discountAmount < 0) {
            toast.error("La réduction doit être un montant valide.");
            return;
        }

        if (discountAmount > REGISTRATION_FEE + trainingFee) {
            toast.error(
                "La réduction ne peut pas dépasser le montant total."
            );
            return;
        }

        try {
            setLoading(true);

            const payload = {
                student_id: Number(studentId),
                training_ids: trainingIds,
                discount: discountAmount,
                academic_year: academicYear.trim(),
                enrolled_at: enrolledAt,
                notes: notes.trim() || null,
            };

            console.log("Données de l'inscription :", payload);
            console.log("Montant calculé :", totalAmount);

            await createEnrollment(payload);

            toast.success("Inscription créée avec succès.");

            navigate("/enrollments");
        } catch (error) {
            console.error(
                "Erreur lors de la création de l'inscription :",
                error
            );

            console.error(
                "Réponse du serveur :",
                error?.response?.data
            );

            const message =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Impossible de créer l'inscription.";

            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Chargement initial
    |--------------------------------------------------------------------------
    */

    if (loadingData) {
        return (
            <div className="rounded-3xl border border-slate-200 bg-white p-12 shadow-sm">
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                    <p className="text-sm font-medium text-slate-500">
                        Chargement des étudiants et des formations...
                    </p>
                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Formation principale pour les modules
    |--------------------------------------------------------------------------
    */

    const selectedTraining = selectedTrainings[0] ?? null;

    /*
    |--------------------------------------------------------------------------
    | Affichage du formulaire
    |--------------------------------------------------------------------------
    */

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-8"
        >
            <EnrollmentStudentCard
                students={students}
                value={studentId}
                onChange={setStudentId}
            />

            <EnrollmentTrainingCard
                trainings={trainings}
                value={trainingIds}
                onChange={handleTrainingChange}
                selectedTrainings={selectedTrainings}
            />

            <EnrollmentModulesCard
                training={selectedTraining}
            />

            <EnrollmentFinanceCard
                registrationFee={REGISTRATION_FEE}
                trainingFee={trainingFee}
                discount={discount}
                setDiscount={setDiscount}
            />

            <EnrollmentInformationCard
                enrolledAt={enrolledAt}
                setEnrolledAt={setEnrolledAt}
                academicYear={academicYear}
                setAcademicYear={setAcademicYear}
                notes={notes}
                setNotes={setNotes}
            />

            <EnrollmentActions
                loading={loading}
            />
        </form>
    );
}
