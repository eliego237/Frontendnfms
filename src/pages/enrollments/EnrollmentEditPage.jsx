
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
    getEnrollment,
    updateEnrollment,
} from "../../services/enrollmentService";

export default function EnrollmentEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [enrollment, setEnrollment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [notes, setNotes] = useState("");

    useEffect(() => {
        let active = true;

        async function loadEnrollment() {
            try {
                setLoading(true);

                const response = await getEnrollment(id);

                const data =
                    response.data?.data ?? response.data;

                if (active) {
                    setEnrollment(data);
                    setNotes(data.notes ?? "");
                }
            } catch (error) {
                console.error(error);

                if (active) {
                    toast.error(
                        error?.response?.data?.message ||
                        "Impossible de charger l'inscription."
                    );
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadEnrollment();

        return () => {
            active = false;
        };
    }, [id]);

    async function handleSubmit(e) {
        e.preventDefault();

        if (!enrollment || saving) return;

        try {
            setSaving(true);

            // Seules les observations sont envoyées.
            await updateEnrollment(id, {
                notes: notes.trim(),
            });

            toast.success(
                "Observations mises à jour avec succès."
            );

            navigate("/enrollments");
        } catch (error) {
            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                "Impossible de modifier les observations."
            );
        } finally {
            setSaving(false);
        }
    }

    const money = (value) =>
        `${Number(value || 0).toLocaleString("fr-FR")} FCFA`;

    if (loading) {
        return (
            <div className="p-8">
                <p className="text-gray-500">
                    Chargement de l'inscription...
                </p>
            </div>
        );
    }

    if (!enrollment) {
        return (
            <div className="p-8">
                <p className="text-red-600">
                    Inscription introuvable.
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/enrollments")}
                    className="mt-4 rounded-lg border px-4 py-2"
                >
                    ← Retour aux inscriptions
                </button>
            </div>
        );
    }

    const student = enrollment.student;

    // Compatibilité avec les inscriptions utilisant
    // une formation unique ou plusieurs formations.
    const trainings =
        enrollment.trainings?.length > 0
            ? enrollment.trainings
            : enrollment.training
              ? [enrollment.training]
              : [];

    const registrationFee = Number(
        enrollment.registration_total ??
        enrollment.registration_fee ??
        0
    );

    const trainingTotal = Number(
        enrollment.training_total ??
        trainings.reduce(
            (sum, training) =>
                sum +
                Number(
                    training.pivot?.training_fee ??
                    training.price ??
                    0
                ),
            0
        )
    );

    const discount = Number(
        enrollment.training_discount ??
        enrollment.discount ??
        0
    );

    const netTrainingTotal = Math.max(
        0,
        trainingTotal - discount
    );

    const total = registrationFee + netTrainingTotal;

    return (
        <div className="space-y-6 p-5 md:p-8">
            {/* EN-TÊTE */}
            <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Consulter une inscription
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Référence :{" "}
                        <span className="font-semibold text-gray-800">
                            {enrollment.enrollment_number || `#${id}`}
                        </span>
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/enrollments")}
                    className="self-start rounded-xl border bg-white px-5 py-3 hover:bg-gray-50"
                >
                    ← Retour
                </button>
            </header>

            {/* INFORMATIONS DE L'ÉTUDIANT */}
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-xl font-bold">
                    Étudiant
                </h2>

                <div className="rounded-xl bg-gray-50 p-5">
                    <p className="font-semibold text-gray-900">
                        {student?.first_name || ""}{" "}
                        {student?.last_name || ""}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        Matricule : {student?.matricule || "-"}
                    </p>

                    <p className="mt-3 text-xs text-gray-400">
                        Information non modifiable après l'inscription.
                    </p>
                </div>
            </section>

            {/* FORMATIONS */}
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-xl font-bold">
                    Formation(s)
                </h2>

                {trainings.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {trainings.map((training, index) => (
                            <div
                                key={training.id ?? index}
                                className="rounded-xl border border-gray-100 bg-gray-50 p-5"
                            >
                                <p className="font-semibold text-gray-900">
                                    {training.title ||
                                        training.name ||
                                        "Formation"}
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    Code : {training.code || "-"}
                                </p>

                                <p className="mt-4 text-sm text-gray-600">
                                    Tarif
                                </p>

                                <p className="font-bold">
                                    {money(
                                        training.pivot?.training_fee ??
                                        training.price ??
                                        0
                                    )}
                                </p>

                                <p className="mt-3 text-sm text-gray-600">
                                    Durée
                                </p>

                                <p className="font-medium">
                                    {training.pivot?.duration_months ??
                                        training.duration_months ??
                                        training.duration ??
                                        "Non renseignée"}
                                    {(training.pivot?.duration_months ??
                                        training.duration_months) != null
                                        ? " mois"
                                        : ""}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">
                        Aucune formation renseignée.
                    </p>
                )}

                <p className="mt-4 text-xs text-gray-400">
                    Les formations associées à cette inscription ne sont pas modifiables.
                </p>
            </section>

            {/* INFORMATIONS FINANCIÈRES */}
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-xl font-bold">
                    Informations financières
                </h2>

                <div className="space-y-3">
                    <div className="flex flex-col gap-2 rounded-xl bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-gray-600">
                            Frais d'inscription
                        </span>

                        <strong>{money(registrationFee)}</strong>
                    </div>

                    <div className="flex flex-col gap-2 rounded-xl bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-gray-600">
                            Tarif brut des formations
                        </span>

                        <strong>{money(trainingTotal)}</strong>
                    </div>

                    <div className="flex flex-col gap-2 rounded-xl bg-orange-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-gray-600">
                            Remise sur formations
                        </span>

                        <strong className="text-orange-600">
                            −{money(discount)}
                        </strong>
                    </div>

                    <div className="flex flex-col gap-2 rounded-xl bg-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                        <span className="font-semibold text-blue-800">
                            Total après remise
                        </span>

                        <strong className="text-xl text-blue-700">
                            {money(total)}
                        </strong>
                    </div>
                </div>

                <p className="mt-4 text-xs text-gray-400">
                    Les montants financiers sont consultables uniquement sur cette page.
                </p>
            </section>

            {/* INFORMATIONS ADMINISTRATIVES */}
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-xl font-bold">
                    Informations administratives
                </h2>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">
                            Date d'inscription
                        </p>

                        <p className="mt-2 font-semibold">
                            {enrollment.enrolled_at
                                ? new Date(
                                      enrollment.enrolled_at
                                  ).toLocaleDateString("fr-FR", {
                                      timeZone: "UTC",
                                  })
                                : "-"}
                        </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-4">
                        <p className="text-sm text-gray-500">
                            Année académique
                        </p>

                        <p className="mt-2 font-semibold">
                            {enrollment.academic_year || "-"}
                        </p>
                    </div>
                </div>

                <p className="mt-4 text-xs text-gray-400">
                    Ces informations ne peuvent pas être modifiées depuis cette page.
                </p>
            </section>

            {/* SEULE SECTION MODIFIABLE */}
            <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-blue-200 bg-white p-6 shadow-sm"
            >
                <div className="mb-5">
                    <h2 className="text-xl font-bold text-gray-900">
                        Observations
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Tu peux ajouter ou modifier les remarques concernant cette inscription.
                    </p>
                </div>

                <label
                    htmlFor="notes"
                    className="mb-2 block font-medium text-gray-700"
                >
                    Notes et observations
                </label>

                <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={5}
                    maxLength={5000}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    placeholder="Saisir les observations concernant cet étudiant..."
                />

                <p className="mt-2 text-right text-xs text-gray-400">
                    {notes.length}/5000 caractères
                </p>

                <div className="mt-6 flex flex-col-reverse justify-end gap-3 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => navigate("/enrollments")}
                        disabled={saving}
                        className="rounded-xl border px-6 py-3 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Annuler
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving
                            ? "Enregistrement..."
                            : "Enregistrer les observations"}
                    </button>
                </div>
            </form>
        </div>
    );
}
