import {
    BookOpen,
    Clock3,
    CheckCircle2,
    ListOrdered,
} from "lucide-react";

export default function EnrollmentModulesCard({
    training,
}) {

    const modules = training?.modules || [];

    return (

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100">

                    <BookOpen
                        size={24}
                        className="text-violet-600"
                    />

                </div>

                <div>

                    <h2 className="text-xl font-bold">

                        Modules de la formation

                    </h2>

                    <p className="text-sm text-slate-500">

                        Programme qui sera suivi par l'étudiant

                    </p>

                </div>

            </div>

            {!training && (

                <div className="rounded-2xl border border-dashed border-slate-300 py-10 text-center">

                    <BookOpen
                        size={40}
                        className="mx-auto mb-3 text-slate-300"
                    />

                    <p className="font-medium text-slate-500">

                        Sélectionnez une formation pour afficher ses modules.

                    </p>

                </div>

            )}

            {training && modules.length === 0 && (

                <div className="rounded-2xl border border-amber-200 bg-amber-50 py-8 text-center">

                    <BookOpen
                        size={40}
                        className="mx-auto mb-3 text-amber-500"
                    />

                    <p className="font-semibold text-amber-700">

                        Cette formation ne possède encore aucun module.

                    </p>

                </div>

            )}

            {modules.length > 0 && (

                <div className="space-y-4">

                    {modules
                        .sort((a, b) => a.position - b.position)
                        .map((module) => (

                            <div
                                key={module.id}
                                className="rounded-2xl border border-slate-200 p-4 transition hover:border-violet-300 hover:bg-violet-50"
                            >

                                <div className="flex items-start justify-between">

                                    <div>

                                        <div className="flex items-center gap-2">

                                            <CheckCircle2
                                                size={18}
                                                className="text-violet-600"
                                            />

                                            <h3 className="font-semibold">

                                                {module.title}

                                            </h3>

                                        </div>

                                        <p className="mt-2 text-sm text-slate-500">

                                            {module.description || "Aucune description"}

                                        </p>

                                    </div>

                                    <div className="text-right">

                                        <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700">

                                            <ListOrdered size={14} />

                                            Module {module.position}

                                        </div>

                                    </div>

                                </div>

                                <div className="mt-4 flex items-center gap-6 border-t pt-3 text-sm text-slate-600">

                                    <div className="flex items-center gap-2">

                                        <BookOpen size={16} />

                                        {module.code}

                                    </div>

                                    <div className="flex items-center gap-2">

                                        <Clock3 size={16} />

                                        {module.duration_hours} heures

                                    </div>

                                </div>

                            </div>

                        ))}

                </div>

            )}

        </div>

    );

}