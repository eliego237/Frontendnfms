import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getStudents } from "../../../services/studentService";
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
    const [trainingId, setTrainingId] = useState("");

    const [discount, setDiscount] = useState(0);

    const [enrolledAt, setEnrolledAt] = useState(
        new Date().toISOString().slice(0, 10)
    );

    const [academicYear, setAcademicYear] = useState("2026-2027");
    const [notes, setNotes] = useState("");

    const REGISTRATION_FEE = 16500;

    /*
    |--------------------------------------------------------------------------
    | Chargement des étudiants et formations
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            setLoadingData(true);

            const [studentsResponse, trainingsResponse] =
                await Promise.all([
                    getStudents(),
                    getTrainings(),
                ]);

            console.log("Étudiants reçus :", studentsResponse);
            console.log("Formations reçues :", trainingsResponse);

            /*
            |--------------------------------------------------------------------------
            | Normalisation des étudiants
            |--------------------------------------------------------------------------
            |
            | Accepte plusieurs structures :
            |
            | response.data.data
            | response.data
            | data.data
            | data
            |
            */

            const studentsData =
                studentsResponse?.data?.data ??
                studentsResponse?.data ??
                studentsResponse ??
                [];

            /*
            |--------------------------------------------------------------------------
            | Normalisation des formations
            |--------------------------------------------------------------------------
            */

            const trainingsData =
                trainingsResponse?.data?.data ??
                trainingsResponse?.data ??
                trainingsResponse ??
                [];

            /*
            |--------------------------------------------------------------------------
            | Pagination Laravel
            |--------------------------------------------------------------------------
            |
            | Si Laravel renvoie :
            |
            | {
            |   data: [...],
            |   current_page: 1,
            |   ...
            | }
            |
            | on récupère uniquement le tableau data.
            |
            */

            const normalizedStudents = Array.isArray(studentsData)
                ? studentsData
                : Array.isArray(studentsData?.data)
                    ? studentsData.data
                    : [];

            const normalizedTrainings = Array.isArray(trainingsData)
                ? trainingsData
                : Array.isArray(trainingsData?.data)
                    ? trainingsData.data
                    : [];

            console.log(
                "Étudiants normalisés :",
                normalizedStudents
            );

            console.log(
                "Formations normalisées :",
                normalizedTrainings
            );

            setStudents(normalizedStudents);
            setTrainings(normalizedTrainings);

        } catch (error) {
            console.error(
                "Erreur chargement inscription :",
                error
            );

            console.error(
                "Réponse serveur :",
                error?.response?.data
            );

            toast.error(
                "Impossible de charger les étudiants et les formations."
            );

            setStudents([]);
            setTrainings([]);

        } finally {
            setLoadingData(false);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Formation sélectionnée
    |--------------------------------------------------------------------------
    */

    const selectedTraining = useMemo(() => {
        return trainings.find(
            (training) =>
                Number(training.id) === Number(trainingId)
        );
    }, [trainings, trainingId]);

    /*
    |--------------------------------------------------------------------------
    | Prix de la formation
    |--------------------------------------------------------------------------
    */

    const trainingFee = Number(
        selectedTraining?.price ?? 0
    );

    /*
    |--------------------------------------------------------------------------
    | Total à payer
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
    | Soumission
    |--------------------------------------------------------------------------
    */

    async function handleSubmit(e) {
        e.preventDefault();

        if (!studentId) {
            toast.error("Sélectionnez un étudiant.");
            return;
        }

        if (!trainingId) {
            toast.error("Sélectionnez une formation.");
            return;
        }

        if (!selectedTraining) {
            toast.error(
                "La formation sélectionnée est introuvable."
            );
            return;
        }

        if (trainingFee < 0) {
            toast.error(
                "Le prix de la formation est invalide."
            );
            return;
        }

        if (Number(discount) < 0) {
            toast.error(
                "La réduction ne peut pas être négative."
            );
            return;
        }

        if (Number(discount) > REGISTRATION_FEE + trainingFee) {
            toast.error(
                "La réduction ne peut pas dépasser le montant total."
            );
            return;
        }

        try {
            setLoading(true);

            const payload = {
                student_id: Number(studentId),

                training_id: Number(trainingId),

                discount: Number(discount || 0),

                academic_year: academicYear,

                enrolled_at: enrolledAt,

                notes: notes?.trim() || null,
            };

            console.log(
                "Création inscription :",
                payload
            );

            console.log(
                "Total calculé :",
                totalAmount
            );

            await createEnrollment(payload);

            toast.success(
                "Inscription créée avec succès."
            );

            navigate("/enrollments");

        } catch (error) {
            console.error(
                "Erreur création inscription :",
                error
            );

            console.error(
                "Réponse serveur :",
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
    | Formulaire
    |--------------------------------------------------------------------------
    */

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-8"
        >
            {/* Étudiant */}

            <EnrollmentStudentCard
                students={students}
                value={studentId}
                onChange={setStudentId}
            />

            {/* Formation */}

            <EnrollmentTrainingCard
                trainings={trainings}
                value={trainingId}
                onChange={setTrainingId}
            />

            {/* Modules */}

            <EnrollmentModulesCard
                training={selectedTraining}
            />

            {/* Finance */}

            <EnrollmentFinanceCard
                registrationFee={REGISTRATION_FEE}
                trainingFee={trainingFee}
                discount={discount}
                setDiscount={setDiscount}
            />

            {/* Informations */}

            <EnrollmentInformationCard
                enrolledAt={enrolledAt}
                setEnrolledAt={setEnrolledAt}
                academicYear={academicYear}
                setAcademicYear={setAcademicYear}
                notes={notes}
                setNotes={setNotes}
            />

            {/* Actions */}

            <EnrollmentActions
                loading={loading}
            />
        </form>
    );
}