
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";

const number = (value) => {
    const result = Number(value);
    return Number.isFinite(result) ? Math.max(0, result) : 0;
};

const money = (value) =>
    `${number(value).toLocaleString("fr-FR")} FCFA`;

const firstValue = (...values) =>
    values.find((value) => value !== null && value !== undefined && value !== "");

const formatDate = (value) => {
    if (!value) return "-";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";

    return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
    });
};

const calculateAge = (value) => {
    if (!value) return "-";

    const birth = new Date(value);
    if (Number.isNaN(birth.getTime())) return "-";

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();

    if (
        today.getMonth() < birth.getMonth() ||
        (today.getMonth() === birth.getMonth() &&
            today.getDate() < birth.getDate())
    ) {
        age--;
    }

    return age >= 0 ? age : "-";
};

const getTrainingName = (training) =>
    firstValue(training.title, training.name, training.label) ||
    "Formation sans nom";

const getTrainingPrice = (training) =>
    number(
        firstValue(
            training.pivot?.training_fee,
            training.pivot?.price,
            training.price,
            training.fee
        )
    );

const getTrainingDuration = (training) =>
    firstValue(
        training.pivot?.duration_months,
        training.duration_months,
        training.duration,
        training.pivot?.duration
    );

const getStatus = (status) => {
    const value = String(status || "").toLowerCase();

    if (["paid", "completed", "complete"].includes(value)) {
        return { label: "Payée", style: "bg-green-100 text-green-700" };
    }

    if (["partial", "partielle"].includes(value)) {
        return { label: "Partielle", style: "bg-yellow-100 text-yellow-700" };
    }

    if (["cancelled", "canceled", "annulee", "annulée"].includes(value)) {
        return { label: "Annulée", style: "bg-red-100 text-red-700" };
    }

    return { label: "En attente", style: "bg-gray-100 text-gray-700" };
};

function InfoCard({ label, children }) {
    return (
        <div className="rounded-xl bg-gray-50 border border-gray-100 p-5 min-w-0">
            <p className="text-sm text-gray-500">{label}</p>
            <div className="mt-2 font-semibold break-words">{children}</div>
        </div>
    );
}

function AmountCard({ label, amount, color }) {
    const colors = {
        blue: "bg-blue-50 text-blue-700",
        green: "bg-green-50 text-green-700",
        red: "bg-red-50 text-red-700",
    };

    return (
        <div className={`rounded-2xl p-6 ${colors[color]}`}>
            <p className="text-sm opacity-80">{label}</p>
            <p className="mt-3 text-2xl font-bold break-words">
                {money(amount)}
            </p>
        </div>
    );
}

export default function StudentDetailsPage() {
    const { id } = useParams();

    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function loadStudent() {
            setLoading(true);
            setError("");

            try {
                const response = await api.get(`/students/${id}`);

                if (active) {
                    setStudent(response.data?.data ?? null);
                }
            } catch (err) {
                console.error("Erreur chargement étudiant :", err);

                if (active) {
                    setStudent(null);
                    setError("Impossible de charger cet étudiant.");
                }
            } finally {
                if (active) setLoading(false);
            }
        }

        loadStudent();

        return () => {
            active = false;
        };
    }, [id]);

    if (loading) {
        return (
            <div className="p-8 text-gray-500">
                Chargement de la fiche étudiant...
            </div>
        );
    }

    if (!student) {
        return (
            <div className="rounded-xl bg-white p-8 shadow">
                <p className="text-red-600">
                    {error || "Étudiant introuvable."}
                </p>
                <Link
                    to="/students"
                    className="inline-block mt-4 text-blue-600 hover:underline"
                >
                    ← Retour aux étudiants
                </Link>
            </div>
        );
    }

    // Sélection de l'inscription la plus récente.
    const enrollments = [...(student.enrollments || [])].sort((a, b) => {
        const dateA = new Date(
            firstValue(a.enrolled_at, a.created_at, 0)
        ).getTime();

        const dateB = new Date(
            firstValue(b.enrolled_at, b.created_at, 0)
        ).getTime();

        return dateB - dateA;
    });

    const enrollment = enrollments[0] || null;
    const trainings = enrollment?.trainings || [];

    // Frais d'inscription.
    const registrationFee = number(
        firstValue(
            enrollment?.registration_total,
            enrollment?.registration_fee,
            0
        )
    );

    // Montant brut des formations.
    const calculatedTrainingTotal = trainings.reduce(
        (sum, training) => sum + getTrainingPrice(training),
        0
    );

    const trainingTotal = number(
        firstValue(
            enrollment?.training_total,
            calculatedTrainingTotal
        )
    );

    const trainingDiscount = Math.min(
        trainingTotal,
        number(
            firstValue(
                enrollment?.training_discount,
                enrollment?.discount,
                0
            )
        )
    );

    const trainingNetTotal = Math.max(
        0,
        trainingTotal - trainingDiscount
    );

    // Le total dû doit correspondre aux frais après remise.
    const total = registrationFee + trainingNetTotal;

    // Le montant payé global est prioritaire s'il est fourni par l'API.
    const paid = Math.min(
        total,
        number(
            firstValue(
                enrollment?.total_paid,
                enrollment?.amount_paid,
                enrollment?.paid_amount,
                0
            )
        )
    );

    // Le solde est calculé à partir des deux montants précédents.
    const balance = Math.max(0, total - paid);

    const percent =
        total > 0 ? Math.round((paid / total) * 100) : 0;

    // Ne pas inventer la répartition des paiements par catégorie.
    const hasRegistrationPaid =
        enrollment?.registration_paid != null;

    const hasTrainingPaid =
        enrollment?.training_paid != null;

    const registrationPaid = hasRegistrationPaid
        ? Math.min(registrationFee, number(enrollment.registration_paid))
        : null;

    const registrationBalance = hasRegistrationPaid
        ? Math.max(0, registrationFee - registrationPaid)
        : null;

    const trainingPaid = hasTrainingPaid
        ? Math.min(trainingNetTotal, number(enrollment.training_paid))
        : null;

    const trainingBalance = hasTrainingPaid
        ? Math.max(0, trainingNetTotal - trainingPaid)
        : null;

    // Le statut affiché suit la situation financière réelle.
    const financialStatus =
        total === 0 || balance === 0
            ? { label: "Soldée", style: "bg-green-100 text-green-700" }
            : paid > 0
              ? { label: "Paiement partiel", style: "bg-yellow-100 text-yellow-700" }
              : { label: "Non réglée", style: "bg-red-100 text-red-700" };

    const academicYear =
        firstValue(enrollment?.academic_year, "-");

    const enrollmentDate = firstValue(
        enrollment?.enrolled_at,
        enrollment?.created_at
    );

    return (
        <div className="space-y-8 pb-10">
            {/* EN-TÊTE */}
            <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4 min-w-0">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-4xl">
                        👤
                    </div>

                    <div className="min-w-0">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 break-words">
                            {student.first_name} {student.last_name}
                        </h1>
                        <p className="mt-2 text-gray-500">
                            Matricule :{" "}
                            <span className="font-semibold text-gray-800">
                                {student.matricule || "-"}
                            </span>
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                            <span
                                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                                    student.status
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                            >
                                {student.status ? "Actif" : "Inactif"}
                            </span>

                            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                                {student.gender === "M"
                                    ? "Masculin"
                                    : student.gender === "F"
                                      ? "Féminin"
                                      : "Non renseigné"}
                            </span>
                        </div>
                    </div>
                </div>

                <Link
                    to="/students"
                    className="self-start rounded-lg bg-white border border-gray-200 px-5 py-3 font-medium hover:bg-gray-50"
                >
                    ← Retour
                </Link>
            </header>

            {/* RÉSUMÉ PERSONNEL */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                <InfoCard label="Âge">
                    {calculateAge(student.birth_date)}
                    {typeof calculateAge(student.birth_date) === "number"
                        ? " ans"
                        : ""}
                </InfoCard>

                <InfoCard label="Téléphone">
                    {student.phone || "-"}
                </InfoCard>

                <InfoCard label="Email">
                    {student.email || "-"}
                </InfoCard>
            </section>

            {/* INFORMATIONS PERSONNELLES */}
            <section className="rounded-2xl bg-white p-5 md:p-8 shadow-sm border border-gray-100">
                <h2 className="text-xl md:text-2xl font-bold">
                    Informations personnelles
                </h2>
                <p className="mt-1 mb-6 text-sm text-gray-500">
                    Coordonnées et informations générales.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InfoCard label="Nom complet">
                        {student.first_name} {student.last_name}
                    </InfoCard>

                    <InfoCard label="Matricule">
                        {student.matricule || "-"}
                    </InfoCard>

                    <InfoCard label="Date de naissance">
                        {formatDate(student.birth_date)}
                    </InfoCard>

                    <InfoCard label="Sexe">
                        {student.gender === "M"
                            ? "Masculin"
                            : student.gender === "F"
                              ? "Féminin"
                              : "Non renseigné"}
                    </InfoCard>

                    <InfoCard label="Téléphone">
                        {student.phone || "-"}
                    </InfoCard>

                    <InfoCard label="Email">
                        {student.email || "-"}
                    </InfoCard>

                    <div className="sm:col-span-2">
                        <InfoCard label="Adresse">
                            {student.address || "-"}
                        </InfoCard>
                    </div>

                    <div className="sm:col-span-2">
                        <InfoCard label="Contact d'urgence">
                            {student.emergency_contact || "-"}
                        </InfoCard>
                    </div>
                </div>
            </section>

            {/* INSCRIPTION ET FORMATIONS */}
            <section className="rounded-2xl bg-white p-5 md:p-8 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold">
                            Inscription et formations
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Détail des formations liées à l'inscription.
                        </p>
                    </div>

                    <span className="self-start rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                        {trainings.length} formation
                        {trainings.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {!enrollment ? (
                    <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
                        Aucune inscription enregistrée.
                    </div>
                ) : (
                    <>
                        {trainings.length === 0 ? (
                            <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
                                Aucune formation associée à cette inscription.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                {trainings.map((training, index) => {
                                    const duration = getTrainingDuration(training);

                                    return (
                                        <article
                                            key={training.id ?? index}
                                            className="rounded-xl border border-gray-200 p-5"
                                        >
                                            <div className="flex flex-wrap items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-xs uppercase tracking-wide text-gray-500">
                                                        Formation {index + 1}
                                                    </p>
                                                    <h3 className="mt-1 text-lg font-bold">
                                                        {getTrainingName(training)}
                                                    </h3>
                                                </div>

                                                <span className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700">
                                                    {firstValue(
                                                        training.code,
                                                        training.reference,
                                                        training.pivot?.code
                                                    ) || "Code non renseigné"}
                                                </span>
                                            </div>

                                            <div className="mt-5 grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Tarif
                                                    </p>
                                                    <p className="mt-1 font-bold">
                                                        {money(getTrainingPrice(training))}
                                                    </p>
                                                </div>

                                                <div>
                                                    <p className="text-sm text-gray-500">
                                                        Durée
                                                    </p>
                                                    <p className="mt-1 font-semibold">
                                                        {duration != null
                                                            ? typeof duration === "number" ||
                                                              /^\d+(\.\d+)?$/.test(String(duration))
                                                                ? `${duration} mois`
                                                                : duration
                                                            : "Non renseignée"}
                                                    </p>
                                                </div>
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}

                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <InfoCard label="Année académique">
                                {academicYear}
                            </InfoCard>

                            <InfoCard label="Date d'inscription">
                                {formatDate(enrollmentDate)}
                            </InfoCard>

                            <InfoCard label="Situation financière">
                                <span
                                    className={`inline-block rounded-full px-3 py-1 text-sm ${financialStatus.style}`}
                                >
                                    {financialStatus.label}
                                </span>
                            </InfoCard>
                        </div>
                    </>
                )}
            </section>

            {/* SITUATION FINANCIÈRE */}
            <section className="rounded-2xl bg-white p-5 md:p-8 shadow-sm border border-gray-100">
                <div className="mb-6">
                    <h2 className="text-xl md:text-2xl font-bold">
                        Situation financière
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Synthèse des sommes dues, encaissées et restantes.
                    </p>
                </div>

                {!enrollment ? (
                    <div className="rounded-xl border border-dashed p-8 text-center text-gray-500">
                        Aucune inscription permettant d'établir une situation financière.
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <AmountCard
                                label="Total à payer"
                                amount={total}
                                color="blue"
                            />

                            <AmountCard
                                label="Déjà payé"
                                amount={paid}
                                color="green"
                            />

                            <AmountCard
                                label="Solde restant"
                                amount={balance}
                                color="red"
                            />
                        </div>

                        {/* PROGRESSION */}
                        <div className="mt-8">
                            <div className="flex flex-wrap justify-between items-center gap-3 mb-3">
                                <span className="font-semibold">
                                    Progression des paiements
                                </span>
                                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
                                    {percent} %
                                </span>
                            </div>

                            <div
                                className="h-4 w-full overflow-hidden rounded-full bg-gray-100"
                                role="progressbar"
                                aria-valuenow={percent}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label="Progression des paiements"
                            >
                                <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                        percent === 100
                                            ? "bg-green-500"
                                            : "bg-blue-600"
                                    }`}
                                    style={{ width: `${percent}%` }}
                                />
                            </div>

                            <div className="mt-4">
                                <span
                                    className={`inline-block rounded-full px-4 py-2 text-sm font-semibold ${financialStatus.style}`}
                                >
                                    {percent === 100
                                        ? "✓ Paiement terminé"
                                        : paid > 0
                                          ? "⏳ Paiement en cours"
                                          : "⚠ En attente de paiement"}
                                </span>
                            </div>
                        </div>

                        {/* DÉTAIL FINANCIER */}
                        <div className="mt-8 border-t border-gray-100 pt-6">
                            <h3 className="mb-5 text-lg font-bold">
                                Détail des frais
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                                <InfoCard label="Frais d'inscription">
                                    <p>{money(registrationFee)}</p>
                                    <p className="mt-3 text-xs font-normal text-gray-500">
                                        Payé :{" "}
                                        {registrationPaid === null
                                            ? "Non ventilé"
                                            : money(registrationPaid)}
                                    </p>
                                    <p className="mt-1 text-xs font-normal text-gray-500">
                                        Reste :{" "}
                                        {registrationBalance === null
                                            ? "Non ventilé"
                                            : money(registrationBalance)}
                                    </p>
                                </InfoCard>

                                <InfoCard label="Formations — tarif brut">
                                    <p>{money(trainingTotal)}</p>
                                    <p className="mt-3 text-xs font-normal text-gray-500">
                                        {trainings.length} formation
                                        {trainings.length !== 1 ? "s" : ""}
                                    </p>
                                </InfoCard>

                                <InfoCard label="Remise sur formations">
                                    <p className="text-orange-600">
                                        −{money(trainingDiscount)}
                                    </p>
                                    <p className="mt-3 text-xs font-normal text-gray-500">
                                        Net après remise
                                    </p>
                                    <p className="mt-1">
                                        {money(trainingNetTotal)}
                                    </p>
                                </InfoCard>

                                <InfoCard label="Paiements des formations">
                                    <p className="text-green-700">
                                        {trainingPaid === null
                                            ? "Non ventilé"
                                            : money(trainingPaid)}
                                    </p>
                                    <p className="mt-3 text-xs font-normal text-gray-500">
                                        Reste :{" "}
                                        {trainingBalance === null
                                            ? "Non ventilé"
                                            : money(trainingBalance)}
                                    </p>
                                </InfoCard>
                            </div>
                        </div>

                        <p className="mt-5 text-xs text-gray-500">
                            Le montant payé global provient des données de
                            l'inscription. La ventilation par catégorie
                            nécessite que les paiements soient correctement
                            affectés aux frais d'inscription ou aux formations
                            dans l'API.
                        </p>
                    </>
                )}
            </section>
        </div>
    );
}
