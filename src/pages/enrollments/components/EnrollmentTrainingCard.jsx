import {
    GraduationCap,
    BookOpen,
    Clock3,
    Award,
    Banknote,
} from "lucide-react";

export default function EnrollmentTrainingCard({
    trainings = [],
    value,
    onChange,
}) {

    const training = trainings.find(
        (item) => Number(item.id) === Number(value)
    );

    const money = (amount) =>
        Number(amount || 0).toLocaleString("fr-FR") + " FCFA";

    return (

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100">

                    <GraduationCap
                        size={24}
                        className="text-emerald-600"
                    />

                </div>

                <div>

                    <h2 className="text-xl font-bold">
                        Formation
                    </h2>

                    <p className="text-sm text-slate-500">
                        Choisissez la formation
                    </p>

                </div>

            </div>

            <label className="mb-2 block text-sm font-semibold">

                Formation

            </label>

            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-emerald-500 focus:outline-none"
            >

                <option value="">
                    Sélectionner une formation
                </option>

                {trainings.map((training) => (

                    <option
                        key={training.id}
                        value={training.id}
                    >

                        {training.code} — {training.title}

                    </option>

                ))}

            </select>

            {training && (

                <div className="mt-6 rounded-2xl bg-slate-50 p-5">

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        <div>

                            <p className="mb-1 text-xs font-semibold uppercase text-slate-500">

                                Code

                            </p>

                            <div className="flex items-center gap-2">

                                <BookOpen
                                    size={18}
                                    className="text-emerald-600"
                                />

                                <span className="font-semibold">

                                    {training.code}

                                </span>

                            </div>

                        </div>

                        <div>

                            <p className="mb-1 text-xs font-semibold uppercase text-slate-500">

                                Catégorie

                            </p>

                            <div className="flex items-center gap-2">

                                <GraduationCap
                                    size={18}
                                    className="text-emerald-600"
                                />

                                <span>

                                    {training.category}

                                </span>

                            </div>

                        </div>

                        <div>

                            <p className="mb-1 text-xs font-semibold uppercase text-slate-500">

                                Durée

                            </p>

                            <div className="flex items-center gap-2">

                                <Clock3
                                    size={18}
                                    className="text-emerald-600"
                                />

                                <span>

                                    {training.duration_months} mois

                                </span>

                            </div>

                        </div>

                        <div>

                            <p className="mb-1 text-xs font-semibold uppercase text-slate-500">

                                Certificat

                            </p>

                            <div className="flex items-center gap-2">

                                <Award
                                    size={18}
                                    className="text-emerald-600"
                                />

                                <span>

                                    {training.certificate}

                                </span>

                            </div>

                        </div>

                    </div>

                    <div className="mt-6 rounded-xl bg-emerald-50 p-4">

                        <div className="flex items-center justify-between">

                            <div className="flex items-center gap-2">

                                <Banknote
                                    size={20}
                                    className="text-emerald-700"
                                />

                                <span className="font-semibold">

                                    Prix de la formation

                                </span>

                            </div>

                            <span className="text-xl font-bold text-emerald-700">

                                {money(training.price)}

                            </span>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}