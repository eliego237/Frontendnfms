import {
    GraduationCap,
    BookOpen,
    Clock3,
    Award,
    Banknote,
    Check,
} from "lucide-react";

export default function EnrollmentTrainingCard({
    trainings = [],
    value = [],
    onChange,
    selectedTrainings = [],
}) {
    const selectedIds = Array.isArray(value)
        ? value.map(Number)
        : [];

    const money = (amount) =>
        Number(amount || 0).toLocaleString("fr-FR") + " FCFA";

    const toggleTraining = (trainingId) => {
        onChange(trainingId);
    };

    const totalSelected = selectedTrainings.reduce(
        (total, training) =>
            total + Number(training.price || 0),
        0
    );

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            {/* En-tête */}

            <div className="mb-6 flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">

                    <GraduationCap
                        size={24}
                        className="text-emerald-600"
                    />

                </div>

                <div>

                    <h2 className="text-xl font-bold">
                        Formations
                    </h2>

                    <p className="text-sm text-slate-500">
                        Sélectionnez une ou plusieurs formations
                    </p>

                </div>

            </div>


            {/* Liste des formations */}

            <div className="space-y-3">

                {trainings.map((training) => {

                    const isSelected =
                        selectedIds.includes(
                            Number(training.id)
                        );

                    return (
                        <button
                            key={training.id}
                            type="button"
                            onClick={() =>
                                toggleTraining(training.id)
                            }
                            className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${
                                isSelected
                                    ? "border-emerald-500 bg-emerald-50"
                                    : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50"
                            }`}
                        >

                            <div className="flex items-start gap-4">

                                {/* Checkbox visuelle */}

                                <div
                                    className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 ${
                                        isSelected
                                            ? "border-emerald-600 bg-emerald-600 text-white"
                                            : "border-slate-300 bg-white"
                                    }`}
                                >

                                    {isSelected && (
                                        <Check
                                            size={16}
                                            strokeWidth={3}
                                        />
                                    )}

                                </div>


                                {/* Informations */}

                                <div className="min-w-0 flex-1">

                                    <div className="flex flex-col justify-between gap-2 md:flex-row">

                                        <div>

                                            <p className="font-bold text-slate-900">

                                                {training.title}

                                            </p>

                                            <p className="text-sm text-slate-500">

                                                {training.code}

                                                {training.category &&
                                                    ` • ${training.category}`
                                                }

                                            </p>

                                        </div>

                                        <div className="text-left md:text-right">

                                            <p className="font-bold text-emerald-700">

                                                {money(training.price)}

                                            </p>

                                            <p className="text-xs text-slate-500">

                                                {training.duration_months ?? 0} mois

                                            </p>

                                        </div>

                                    </div>


                                    {/* Détails */}

                                    <div className="mt-4 grid grid-cols-1 gap-3 text-sm md:grid-cols-3">

                                        <div className="flex items-center gap-2 text-slate-600">

                                            <BookOpen
                                                size={16}
                                                className="text-emerald-600"
                                            />

                                            <span>
                                                {training.code}
                                            </span>

                                        </div>

                                        <div className="flex items-center gap-2 text-slate-600">

                                            <Clock3
                                                size={16}
                                                className="text-emerald-600"
                                            />

                                            <span>
                                                {training.duration_months ?? 0} mois
                                            </span>

                                        </div>

                                        <div className="flex items-center gap-2 text-slate-600">

                                            <Award
                                                size={16}
                                                className="text-emerald-600"
                                            />

                                            <span className="truncate">

                                                {training.certificate ||
                                                    "Certificat de formation"
                                                }

                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </button>
                    );
                })}

            </div>


            {/* Résumé de la sélection */}

            {selectedTrainings.length > 0 && (

                <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">

                    <div className="mb-4 flex items-center justify-between">

                        <div>

                            <p className="text-sm font-semibold text-emerald-800">

                                Formations sélectionnées

                            </p>

                            <p className="text-xs text-emerald-700">

                                {selectedTrainings.length} formation
                                {selectedTrainings.length > 1
                                    ? "s"
                                    : ""
                                }

                            </p>

                        </div>

                        <GraduationCap
                            size={22}
                            className="text-emerald-700"
                        />

                    </div>


                    <div className="space-y-2">

                        {selectedTrainings.map((training) => (

                            <div
                                key={training.id}
                                className="flex items-center justify-between rounded-xl bg-white px-4 py-3"
                            >

                                <div className="flex items-center gap-3">

                                    <Check
                                        size={17}
                                        className="text-emerald-600"
                                    />

                                    <div>

                                        <p className="font-semibold text-slate-800">

                                            {training.title}

                                        </p>

                                        <p className="text-xs text-slate-500">

                                            {training.code}
                                            {" • "}
                                            {training.duration_months ?? 0} mois

                                        </p>

                                    </div>

                                </div>

                                <span className="font-semibold text-slate-700">

                                    {money(training.price)}

                                </span>

                            </div>

                        ))}

                    </div>


                    {/* Total formations */}

                    <div className="mt-4 flex items-center justify-between border-t border-emerald-200 pt-4">

                        <div className="flex items-center gap-2">

                            <Banknote
                                size={20}
                                className="text-emerald-700"
                            />

                            <span className="font-bold text-emerald-900">

                                Total formations

                            </span>

                        </div>

                        <span className="text-xl font-bold text-emerald-700">

                            {money(totalSelected)}

                        </span>

                    </div>

                </div>

            )}

        </div>
    );
}