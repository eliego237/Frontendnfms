import {
    BookOpen,
    Clock3,
    Layers3,
    CheckCircle2,
    Hash,
} from "lucide-react";

export default function EnrollmentModulesList({ training }) {

    // Les modules appartiennent à la formation
    const modules = training?.modules ?? [];

    return (

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

            {/* =========================================================
                EN-TÊTE
            ========================================================= */}

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-4">

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-100">

                        <Layers3
                            size={28}
                            className="text-indigo-600"
                        />

                    </div>

                    <div>

                        <h2 className="text-2xl font-bold text-slate-900">
                            Modules de la formation
                        </h2>

                        <p className="text-slate-500">
                            Programme pédagogique suivi par l'étudiant
                        </p>

                    </div>

                </div>

                <div className="w-fit rounded-xl bg-slate-100 px-4 py-2 font-semibold text-slate-700">

                    {modules.length} module
                    {modules.length > 1 ? "s" : ""}

                </div>

            </div>


            {/* =========================================================
                AUCUN MODULE
            ========================================================= */}

            {modules.length === 0 ? (

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

                /* =====================================================
                   LISTE DES MODULES
                ===================================================== */

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                    {modules.map((module, index) => {

                        const isActive =
                            module.is_active === true ||
                            module.is_active === 1;

                        return (

                            <div
                                key={module.id}
                                className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-lg"
                            >

                                {/* -------------------------------------------------
                                    HAUT DE LA CARTE
                                ------------------------------------------------- */}

                                <div className="mb-5 flex items-center justify-between">

                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100">

                                        <BookOpen
                                            size={20}
                                            className="text-blue-600"
                                        />

                                    </div>

                                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">

                                        Module {module.position ?? index + 1}

                                    </span>

                                </div>


                                {/* -------------------------------------------------
                                    TITRE
                                ------------------------------------------------- */}

                                <h3 className="text-lg font-bold text-slate-800">

                                    {module.title || "Module sans titre"}

                                </h3>


                                {/* -------------------------------------------------
                                    CODE
                                ------------------------------------------------- */}

                                <div className="mt-2 flex items-center gap-2 text-sm text-indigo-600">

                                    <Hash size={15} />

                                    <span className="font-semibold">
                                        {module.code || "—"}
                                    </span>

                                </div>


                                {/* -------------------------------------------------
                                    DESCRIPTION
                                ------------------------------------------------- */}

                                <p className="mt-3 line-clamp-3 min-h-[60px] text-sm leading-6 text-slate-500">

                                    {module.description ||
                                        "Aucune description disponible pour ce module."}

                                </p>


                                {/* -------------------------------------------------
                                    INFORMATIONS
                                ------------------------------------------------- */}

                                <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">

                                    {/* Durée */}

                                    <div className="flex items-center justify-between">

                                        <span className="text-sm text-slate-500">
                                            Durée
                                        </span>

                                        <span className="flex items-center gap-2 font-semibold text-slate-700">

                                            <Clock3
                                                size={16}
                                                className="text-indigo-500"
                                            />

                                            {module.duration_hours ?? 0} h

                                        </span>

                                    </div>


                                    {/* Position */}

                                    <div className="flex items-center justify-between">

                                        <span className="text-sm text-slate-500">
                                            Position
                                        </span>

                                        <span className="font-semibold text-slate-700">
                                            #{module.position ?? index + 1}
                                        </span>

                                    </div>


                                    {/* Statut */}

                                    <div className="flex items-center justify-between">

                                        <span className="text-sm text-slate-500">
                                            Statut
                                        </span>

                                        {isActive ? (

                                            <span className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">

                                                <CheckCircle2 size={15} />

                                                Actif

                                            </span>

                                        ) : (

                                            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-500">

                                                Inactif

                                            </span>

                                        )}

                                    </div>

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}

        </div>

    );
}