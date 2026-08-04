import {
    BookOpen,
    Clock3,
    Layers3,
    CheckCircle2,
} from "lucide-react";

export default function EnrollmentModulesList({ training }) {

    const modules = training?.modules ?? [];

    return (

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

            <div className="mb-8 flex items-center justify-between">

                <div className="flex items-center gap-4">

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100">

                        <Layers3
                            size={28}
                            className="text-indigo-600"
                        />

                    </div>

                    <div>

                        <h2 className="text-2xl font-bold">

                            Modules de la formation

                        </h2>

                        <p className="text-slate-500">

                            Programme pédagogique suivi par l'étudiant

                        </p>

                    </div>

                </div>

                <div className="rounded-xl bg-slate-100 px-4 py-2 font-semibold">

                    {modules.length} module(s)

                </div>

            </div>

            {

                modules.length === 0 ? (

                    <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center">

                        <BookOpen
                            size={42}
                            className="mx-auto mb-4 text-slate-300"
                        />

                        <h3 className="text-lg font-semibold text-slate-700">

                            Aucun module disponible

                        </h3>

                        <p className="mt-2 text-slate-500">

                            Cette formation ne possède encore aucun module.

                        </p>

                    </div>

                ) : (

                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                        {

                            modules.map((module, index) => (

                                <div
                                    key={module.id}
                                    className="rounded-2xl border border-slate-200 p-6 transition hover:border-blue-300 hover:shadow-md"
                                >

                                    <div className="mb-5 flex items-center justify-between">

                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">

                                            <BookOpen
                                                size={20}
                                                className="text-blue-600"
                                            />

                                        </div>

                                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">

                                            Module {index + 1}

                                        </span>

                                    </div>

                                    <h3 className="text-lg font-bold text-slate-800">

                                        {module.title}

                                    </h3>

                                    <p className="mt-2 line-clamp-3 text-sm text-slate-500">

                                        {module.description || "Aucune description."}

                                    </p>

                                    <div className="mt-6 space-y-3">

                                        <div className="flex items-center justify-between">

                                            <span className="text-slate-500">

                                                Durée

                                            </span>

                                            <span className="flex items-center gap-2 font-semibold">

                                                <Clock3 size={16} />

                                                {module.duration_hours} h

                                            </span>

                                        </div>

                                        <div className="flex items-center justify-between">

                                            <span className="text-slate-500">

                                                Statut

                                            </span>

                                            <span className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">

                                                <CheckCircle2 size={15} />

                                                Inclus

                                            </span>

                                        </div>

                                    </div>

                                </div>

                            ))

                        }

                    </div>

                )

            }

        </div>

    );

}