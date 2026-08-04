import { Search, Filter } from "lucide-react";

export default function TrainingModuleFilters({
    modules,
    search,
    setSearch,
    training,
    setTraining,
    status,
    setStatus,
}) {

    const trainings = [
        ...new Map(
            modules
                .filter((m) => m.training)
                .map((m) => [m.training.id, m.training])
        ).values(),
    ];

    return (

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

            <div className="mb-6 flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">

                    <Filter
                        size={28}
                        className="text-blue-600"
                    />

                </div>

                <div>

                    <h2 className="text-3xl font-bold">

                        Recherche & Filtres

                    </h2>

                    <p className="text-slate-500">

                        Retrouvez rapidement un module de formation.

                    </p>

                </div>

            </div>

            <div className="grid gap-5 lg:grid-cols-3">

                {/* Recherche */}

                <div className="relative">

                    <Search
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Code, titre, formation..."
                        className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />

                </div>

                {/* Formation */}

                <select
                    value={training}
                    onChange={(e) => setTraining(e.target.value)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >

                    <option value="">

                        Toutes les formations

                    </option>

                    {trainings.map((item) => (

                        <option
                            key={item.id}
                            value={item.id}
                        >

                            {item.title}

                        </option>

                    ))}

                </select>

                {/* Statut */}

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                >

                    <option value="">

                        Tous les statuts

                    </option>

                    <option value="1">

                        Actifs

                    </option>

                    <option value="0">

                        Inactifs

                    </option>

                </select>

            </div>

        </div>

    );

}