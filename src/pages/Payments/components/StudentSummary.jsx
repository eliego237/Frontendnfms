import {
    User,
    GraduationCap,
    Phone,
    Mail,
    BadgeCheck,
    CalendarDays,
    Hash,
} from "lucide-react";

export default function StudentSummary({
    enrollment,
}) {
    if (!enrollment) {
        return null;
    }

    const student =
        enrollment.student || {};

    const trainings = Array.isArray(
        enrollment.trainings
    )
        ? enrollment.trainings
        : [];

    function money(value) {
        return Number(value || 0).toLocaleString(
            "fr-FR",
            {
                style: "currency",
                currency: "XAF",
                minimumFractionDigits: 0,
            }
        );
    }

    function getTrainingPrice(training) {
        return Number(
            training.pivot?.training_fee ??
                training.price ??
                0
        );
    }

    const trainingTotal =
        trainings.reduce(
            (total, training) =>
                total +
                getTrainingPrice(training),
            0
        );

    const studentName =
        student.full_name ||
        `${student.first_name || ""} ${
            student.last_name || ""
        }`.trim() ||
        "Étudiant";

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

            {/* =========================================================
                HEADER
            ========================================================= */}

            <div className="mb-8 flex items-center gap-5">

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-100">

                    <User
                        className="text-blue-600"
                        size={30}
                    />

                </div>

                <div className="min-w-0">

                    <h2 className="truncate text-2xl font-bold text-slate-800">
                        {studentName}
                    </h2>

                    <p className="mt-1 text-slate-500">
                        Matricule :{" "}
                        <strong className="text-slate-700">
                            {student.matricule || "-"}
                        </strong>
                    </p>

                </div>

            </div>

            {/* =========================================================
                INFORMATIONS
            ========================================================= */}

            <div className="grid gap-6 md:grid-cols-2">

                {/* =====================================================
                    FORMATIONS
                ===================================================== */}

                <div className="md:col-span-2">

                    <div className="flex items-center justify-between gap-4">

                        <div>

                            <p className="text-sm text-slate-500">
                                Formations
                            </p>

                            <p className="mt-1 font-semibold text-slate-700">
                                {trainings.length} formation
                                {trainings.length > 1
                                    ? "s"
                                    : ""}
                            </p>

                        </div>

                        <div className="text-right">

                            <p className="text-sm text-slate-500">
                                Total formations
                            </p>

                            <p className="mt-1 font-bold text-blue-700">
                                {money(
                                    trainingTotal
                                )}
                            </p>

                        </div>

                    </div>

                    <div className="mt-4 space-y-2">

                        {trainings.length > 0 ? (
                            trainings.map(
                                (training) => {
                                    const price =
                                        getTrainingPrice(
                                            training
                                        );

                                    return (
                                        <div
                                            key={
                                                training.id
                                            }
                                            className="flex items-center justify-between gap-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3"
                                        >

                                            <div className="flex min-w-0 items-center gap-3">

                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">

                                                    <GraduationCap
                                                        size={
                                                            18
                                                        }
                                                        className="text-blue-600"
                                                    />

                                                </div>

                                                <div className="min-w-0">

                                                    <p className="truncate font-semibold text-slate-700">
                                                        {
                                                            training.title
                                                        }
                                                    </p>

                                                    {training.code && (
                                                        <p className="text-xs text-slate-500">
                                                            {
                                                                training.code
                                                            }
                                                        </p>
                                                    )}

                                                </div>

                                            </div>

                                            <span className="shrink-0 font-semibold text-blue-700">
                                                {money(
                                                    price
                                                )}
                                            </span>

                                        </div>
                                    );
                                }
                            )
                        ) : (
                            <p className="rounded-xl bg-orange-50 p-4 text-sm text-orange-600">
                                Aucune formation
                                renseignée.
                            </p>
                        )}

                    </div>

                </div>

                {/* =====================================================
                    ANNÉE ACADÉMIQUE
                ===================================================== */}

                <div className="rounded-xl bg-slate-50 p-4">

                    <div className="flex items-center gap-3">

                        <CalendarDays
                            size={19}
                            className="text-purple-600"
                        />

                        <div>

                            <p className="text-sm text-slate-500">
                                Année académique
                            </p>

                            <p className="mt-1 font-semibold text-slate-700">
                                {enrollment.academic_year ||
                                    "-"}
                            </p>

                        </div>

                    </div>

                </div>

                {/* =====================================================
                    NUMÉRO D'INSCRIPTION
                ===================================================== */}

                <div className="rounded-xl bg-slate-50 p-4">

                    <div className="flex items-center gap-3">

                        <Hash
                            size={19}
                            className="text-blue-600"
                        />

                        <div>

                            <p className="text-sm text-slate-500">
                                Numéro d'inscription
                            </p>

                            <p className="mt-1 font-semibold text-slate-700">
                                {enrollment.enrollment_number ||
                                    `#${enrollment.id}`}
                            </p>

                        </div>

                    </div>

                </div>

                {/* =====================================================
                    TÉLÉPHONE
                ===================================================== */}

                <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-sm text-slate-500">
                        Téléphone
                    </p>

                    <div className="mt-2 flex items-center gap-2">

                        <Phone
                            size={18}
                            className="text-green-600"
                        />

                        <span className="font-medium text-slate-700">
                            {student.phone || "-"}
                        </span>

                    </div>

                </div>

                {/* =====================================================
                    EMAIL
                ===================================================== */}

                <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-sm text-slate-500">
                        Email
                    </p>

                    <div className="mt-2 flex items-center gap-2">

                        <Mail
                            size={18}
                            className="text-purple-600"
                        />

                        <span className="break-all font-medium text-slate-700">
                            {student.email || "-"}
                        </span>

                    </div>

                </div>

            </div>

            {/* =========================================================
                STATUT
            ========================================================= */}

            <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-5">

                <div className="flex items-start gap-3">

                    <BadgeCheck
                        className="mt-0.5 shrink-0 text-green-600"
                        size={24}
                    />

                    <div>

                        <p className="font-semibold text-green-700">
                            Inscription valide
                        </p>

                        <p className="mt-1 text-sm text-green-600">

                            {trainings.length} formation
                            {trainings.length > 1
                                ? "s"
                                : ""}{" "}
                            associée
                            {trainings.length > 1
                                ? "s"
                                : ""}{" "}
                            à cette inscription.

                        </p>

                    </div>

                </div>

            </div>

        </div>
    );
}