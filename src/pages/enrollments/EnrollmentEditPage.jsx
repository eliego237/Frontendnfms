import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
    getEnrollment,
    updateEnrollment,
} from "../../services/enrollmentService";

import {
    getTrainings,
} from "../../services/trainingService";

export default function EnrollmentEditPage() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [enrollment, setEnrollment] = useState(null);
    const [trainings, setTrainings] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [discount, setDiscount] = useState(0);
    const [academicYear, setAcademicYear] = useState("");
    const [enrolledAt, setEnrolledAt] = useState("");
    const [notes, setNotes] = useState("");

    useEffect(() => {
        loadData();
    }, [id]);

    async function loadData() {

        try {

            setLoading(true);

            const [
                enrollmentResponse,
                trainingsResponse,
            ] = await Promise.all([
                getEnrollment(id),
                getTrainings(),
            ]);

            const enrollmentData =
                enrollmentResponse.data?.data ||
                enrollmentResponse.data;

            setEnrollment(enrollmentData);

            setTrainings(
                trainingsResponse.data?.data ||
                trainingsResponse.data ||
                []
            );

            setDiscount(
                Number(enrollmentData.discount || 0)
            );

            setAcademicYear(
                enrollmentData.academic_year || "2026-2027"
            );

            setEnrolledAt(
                enrollmentData.enrolled_at
                    ? enrollmentData.enrolled_at.substring(0, 10)
                    : ""
            );

            setNotes(
                enrollmentData.notes || ""
            );

        } catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                "Impossible de charger l'inscription."
            );

        } finally {

            setLoading(false);

        }
    }

    async function handleSubmit(e) {

    e.preventDefault();

    try {

        setSaving(true);

        await updateEnrollment(id, {

            student_id: Number(enrollment.student_id),

            training_id: Number(enrollment.training_id),

            discount: Number(discount),

            academic_year: academicYear,

            enrolled_at: enrolledAt,

            notes,

        });

        toast.success(
            "Inscription modifiée avec succès."
        );

        navigate("/enrollments");

    } catch (error) {

        console.error(error);

        toast.error(
            error?.response?.data?.message ||
            "Impossible de modifier l'inscription."
        );

    } finally {

        setSaving(false);

    }
}

    if (loading) {

        return (
            <div className="p-10">
                <p className="text-gray-500">
                    Chargement de l'inscription...
                </p>
            </div>
        );

    }

    if (!enrollment) {

        return (
            <div className="p-10">
                <p className="text-red-500">
                    Inscription introuvable.
                </p>
            </div>
        );

    }

    const student = enrollment.student;
    const training = enrollment.training;

    const registrationFee =
        Number(enrollment.registration_fee || 0);

    const trainingFee =
        Number(enrollment.training_fee || training?.price || 0);

    const total =
        registrationFee +
        trainingFee -
        Number(discount || 0);

    return (

        <div className="p-6 md:p-10">

            <div className="flex items-center justify-between mb-8">

                <div>

                    <h1 className="text-3xl font-bold">
                        Modifier une inscription
                    </h1>

                    <p className="text-gray-500 mt-1">
                        {enrollment.enrollment_number}
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() => navigate("/enrollments")}
                    className="px-5 py-3 border rounded-xl bg-white hover:bg-gray-50"
                >
                    ← Retour
                </button>

            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                {/* Étudiant */}

                <div className="bg-white rounded-2xl p-6 shadow-sm border">

                    <h2 className="text-xl font-bold mb-5">
                        Étudiant
                    </h2>

                    <div className="p-4 bg-gray-50 rounded-xl">

                        <p className="font-semibold">
                            {student?.first_name} {student?.last_name}
                        </p>

                        <p className="text-sm text-gray-500">
                            {student?.matricule}
                        </p>

                    </div>

                </div>


                {/* Formation */}

                <div className="bg-white rounded-2xl p-6 shadow-sm border">

                    <h2 className="text-xl font-bold mb-5">
                        Formation
                    </h2>

                    <div className="p-4 bg-gray-50 rounded-xl">

                        <p className="font-semibold">
                            {training?.title}
                        </p>

                        <p className="text-sm text-gray-500">
                            {training?.code}
                        </p>

                    </div>

                </div>


                {/* Finances */}

                <div className="bg-white rounded-2xl p-6 shadow-sm border">

                    <h2 className="text-xl font-bold mb-5">
                        Informations financières
                    </h2>

                    <div className="space-y-3 mb-5">

                        <div className="flex justify-between p-4 bg-gray-50 rounded-xl">

                            <span>
                                Frais d'inscription
                            </span>

                            <strong>
                                {registrationFee.toLocaleString("fr-FR")} FCFA
                            </strong>

                        </div>

                        <div className="flex justify-between p-4 bg-gray-50 rounded-xl">

                            <span>
                                Prix de la formation
                            </span>

                            <strong>
                                {trainingFee.toLocaleString("fr-FR")} FCFA
                            </strong>

                        </div>

                    </div>

                    <label className="block font-medium mb-2">
                        Réduction
                    </label>

                    <input
                        type="number"
                        min="0"
                        value={discount}
                        onChange={(e) =>
                            setDiscount(e.target.value)
                        }
                        className="w-full border rounded-xl px-4 py-3"
                    />

                    <div className="mt-5 bg-blue-600 text-white rounded-xl p-5">

                        <p className="text-sm opacity-80">
                            Nouveau total à payer
                        </p>

                        <p className="text-2xl font-bold">
                            {Math.max(0, total).toLocaleString("fr-FR")} FCFA
                        </p>

                    </div>

                </div>


                {/* Informations */}

                <div className="bg-white rounded-2xl p-6 shadow-sm border">

                    <h2 className="text-xl font-bold mb-5">
                        Informations complémentaires
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                        <div>

                            <label className="block font-medium mb-2">
                                Date d'inscription
                            </label>

                            <input
                                type="date"
                                value={enrolledAt}
                                onChange={(e) =>
                                    setEnrolledAt(e.target.value)
                                }
                                className="w-full border rounded-xl px-4 py-3"
                            />

                        </div>

                        <div>

                            <label className="block font-medium mb-2">
                                Année académique
                            </label>

                            <input
                                type="text"
                                value={academicYear}
                                onChange={(e) =>
                                    setAcademicYear(e.target.value)
                                }
                                className="w-full border rounded-xl px-4 py-3"
                            />

                        </div>

                    </div>

                    <div className="mt-5">

                        <label className="block font-medium mb-2">
                            Observations
                        </label>

                        <textarea
                            value={notes}
                            onChange={(e) =>
                                setNotes(e.target.value)
                            }
                            rows={5}
                            className="w-full border rounded-xl px-4 py-3"
                            placeholder="Observations éventuelles..."
                        />

                    </div>

                </div>


                {/* Actions */}

                <div className="flex justify-end gap-3">

                    <button
                        type="button"
                        onClick={() => navigate("/enrollments")}
                        className="px-6 py-3 border rounded-xl bg-white"
                    >
                        Annuler
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold disabled:opacity-50"
                    >
                        {saving
                            ? "Enregistrement..."
                            : "Enregistrer les modifications"
                        }
                    </button>

                </div>

            </form>

        </div>

    );
}