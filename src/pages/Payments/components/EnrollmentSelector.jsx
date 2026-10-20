import {
    Search,
    GraduationCap,
    CheckCircle,
    User,
    CalendarDays,
    Wallet,
} from "lucide-react";

export default function EnrollmentSelector({
    enrollments,
    search,
    setSearch,
    selectedEnrollments,
    onToggle,
}) {
    function money(value) {
        return Number(value || 0).toLocaleString("fr-FR", {
            style: "currency",
            currency: "XAF",
            minimumFractionDigits: 0,
        });
    }

    /*
     * Une seule inscription peut être sélectionnée.
     */
    const selectedId =
        selectedEnrollments[0]?.id ?? null;

    /*
     * Recherche :
     * - étudiant
     * - matricule
     * - année académique
     * - numéro d'inscription
     * - formations
     */
    const filteredEnrollments = (
        enrollments || []
    ).filter((item) => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return true;
        }

        const studentName =
            item.student?.full_name || "";

        const matricule =
            item.student?.matricule || "";

        const academicYear =
            item.academic_year || "";

        const enrollmentNumber =
            item.enrollment_number || "";

        const trainingNames = (
            item.trainings || []
        )
            .map(
                (training) =>
                    training.title || ""
            )
            .join(" ");

        const text = [
            studentName,
            matricule,
            academicYear,
            enrollmentNumber,
            trainingNames,
        ]
            .join(" ")
            .toLowerCase();

        return text.includes(query);
    });

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <div className="mb-8 flex items-center gap-4">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                    <GraduationCap
                        className="text-blue-600"
                        size={30}
                    />
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                        Choisir une inscription
                    </h2>

                    <p className="text-slate-500">
                        Sélectionnez l'inscription concernée
                        par le paiement.
                    </p>
                </div>

            </div>

            {/* =====================================================
                RECHERCHE
            ===================================================== */}

            <div className="relative mb-8">

                <Search
                    className="absolute left-4 top-4 text-slate-400"
                    size={18}
                />

                <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                    placeholder="Nom, matricule, année ou formation..."
                    className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />

            </div>

            {/* =====================================================
                INSCRIPTION SÉLECTIONNÉE
            ===================================================== */}

            {selectedEnrollments.length > 0 && (
                <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-5">

                    <div className="flex flex-wrap items-center justify-between gap-4">

                        <div>

                            <div className="flex items-center gap-2 text-blue-700">

                                <CheckCircle
                                    size={18}
                                />

                                <p className="text-sm font-medium">
                                    Inscription sélectionnée
                                </p>

                            </div>

                            <p className="mt-1 text-lg font-bold text-blue-900">
                                {selectedEnrollments[0]
                                    ?.enrollment_number ||
                                    `Inscription #${selectedEnrollments[0]?.id}`}
                            </p>

                            <p className="mt-1 text-sm text-blue-700">
                                {selectedEnrollments[0]
                                    ?.student?.full_name ||
                                    "Étudiant"}
                            </p>

                        </div>

                        <div className="text-right">

                            <div className="flex items-center justify-end gap-2 text-blue-700">

                                <Wallet
                                    size={17}
                                />

                                <p className="text-sm">
                                    Solde
                                </p>

                            </div>

                            <p className="mt-1 text-xl font-bold text-blue-900">
                                {money(
                                    selectedEnrollments[0]
                                        ?.balance
                                )}
                            </p>

                        </div>

                    </div>

                </div>
            )}

            {/* =====================================================
                LISTE DES INSCRIPTIONS
            ===================================================== */}

            <div className="max-h-[600px] space-y-4 overflow-y-auto">

                {filteredEnrollments.length === 0 && (
                    <div className="rounded-xl bg-slate-50 py-10 text-center text-slate-500">
                        Aucune inscription trouvée.
                    </div>
                )}

                {filteredEnrollments.map(
                    (item) => {
                        const selected =
                            Number(selectedId) ===
                            Number(item.id);

                        const trainings =
                            Array.isArray(
                                item.trainings
                            )
                                ? item.trainings
                                : [];

                        /*
                         * Total des formations
                         */
                        const trainingTotal =
                            trainings.reduce(
                                (
                                    total,
                                    training
                                ) => {
                                    const price =
                                        Number(
                                            training
                                                .pivot
                                                ?.training_fee ??
                                                training.price ??
                                                0
                                        );

                                    return (
                                        total + price
                                    );
                                },
                                0
                            );

                        return (
                            <button
                                key={item.id}
                                type="button"
                                onClick={() =>
                                    onToggle(item)
                                }
                                className={
                                    "w-full rounded-2xl border p-5 text-left transition-all duration-200 " +
                                    (
                                        selected
                                            ? "border-blue-600 bg-blue-50 shadow-sm"
                                            : "border-slate-200 hover:border-blue-400 hover:bg-blue-50"
                                    )
                                }
                            >

                                <div className="flex items-start justify-between gap-4">

                                    <div className="min-w-0 flex-1">

                                        {/* =================================================
                                            ÉTUDIANT
                                        ================================================= */}

                                        <div className="flex items-start gap-3">

                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100">

                                                <User
                                                    size={20}
                                                    className="text-slate-600"
                                                />

                                            </div>

                                            <div>

                                                <h3 className="text-lg font-bold text-slate-800">
                                                    {item.student
                                                        ?.full_name ||
                                                        "Étudiant non renseigné"}
                                                </h3>

                                                <p className="mt-1 text-sm text-slate-500">
                                                    Matricule :{" "}
                                                    {item.student
                                                        ?.matricule ||
                                                        "-"}
                                                </p>

                                            </div>

                                        </div>

                                        {/* =================================================
                                            INFORMATIONS INSCRIPTION
                                        ================================================= */}

                                        <div className="mt-4 flex flex-wrap gap-2">

                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                                                {item.enrollment_number ||
                                                    `Inscription #${item.id}`}
                                            </span>

                                            {item.academic_year && (
                                                <span className="flex items-center gap-1 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">

                                                    <CalendarDays
                                                        size={13}
                                                    />

                                                    {item.academic_year}

                                                </span>
                                            )}

                                        </div>

                                        {/* =================================================
                                            FORMATIONS
                                        ================================================= */}

                                        <div className="mt-5">

                                            <div className="mb-3 flex items-center justify-between">

                                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                    Formations
                                                </p>

                                                <span className="text-xs font-semibold text-blue-600">
                                                    {trainings.length}{" "}
                                                    formation
                                                    {trainings.length >
                                                    1
                                                        ? "s"
                                                        : ""}
                                                </span>

                                            </div>

                                            <div className="space-y-2">

                                                {trainings.length >
                                                0 ? (
                                                    trainings.map(
                                                        (
                                                            training
                                                        ) => {
                                                            const price =
                                                                Number(
                                                                    training
                                                                        .pivot
                                                                        ?.training_fee ??
                                                                        training.price ??
                                                                        0
                                                                );

                                                            return (
                                                                <div
                                                                    key={
                                                                        training.id
                                                                    }
                                                                    className="flex items-center justify-between gap-4 rounded-xl bg-white px-4 py-3"
                                                                >

                                                                    <div className="flex min-w-0 items-center gap-2">

                                                                        <GraduationCap
                                                                            size={
                                                                                17
                                                                            }
                                                                            className="shrink-0 text-blue-600"
                                                                        />

                                                                        <span className="truncate font-semibold text-slate-700">
                                                                            {
                                                                                training.title
                                                                            }
                                                                        </span>

                                                                    </div>

                                                                    <span className="shrink-0 text-sm font-bold text-slate-600">
                                                                        {money(
                                                                            price
                                                                        )}
                                                                    </span>

                                                                </div>
                                                            );
                                                        }
                                                    )
                                                ) : (
                                                    <p className="rounded-xl bg-orange-50 p-3 text-sm text-orange-600">
                                                        Aucune formation
                                                        associée à cette
                                                        inscription.
                                                    </p>
                                                )}

                                            </div>

                                        </div>

                                        {/* =================================================
                                            TOTAL FORMATIONS
                                        ================================================= */}

                                        {trainings.length >
                                            0 && (
                                            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">

                                                <span className="text-sm font-medium text-slate-500">
                                                    Total formations
                                                </span>

                                                <span className="font-bold text-blue-700">
                                                    {money(
                                                        trainingTotal
                                                    )}
                                                </span>

                                            </div>
                                        )}

                                        {/* =================================================
                                            SOLDE
                                        ================================================= */}

                                        <div className="mt-4 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">

                                            <span className="text-sm font-medium text-slate-500">
                                                Solde restant
                                            </span>

                                            <span className="font-bold text-red-600">
                                                {money(
                                                    item.balance
                                                )}
                                            </span>

                                        </div>

                                    </div>

                                    {/* =================================================
                                        SÉLECTION
                                    ================================================= */}

                                    {selected && (
                                        <CheckCircle
                                            size={28}
                                            className="shrink-0 text-blue-600"
                                        />
                                    )}

                                </div>

                            </button>
                        );
                    }
                )}

            </div>

            {/* =====================================================
                RÉINITIALISER
            ===================================================== */}

            {selectedEnrollments.length > 0 && (
                <div className="mt-6 flex justify-end">

                    <button
                        type="button"
                        onClick={() =>
                            onToggle(null)
                        }
                        className="rounded-xl border border-slate-300 px-5 py-2 font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                        Réinitialiser la sélection
                    </button>

                </div>
            )}

        </div>
    );
}