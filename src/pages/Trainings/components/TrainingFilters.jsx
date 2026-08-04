import {
    Search,
    Filter,
} from "lucide-react";

export default function TrainingFilters({

    search,
    setSearch,

    category,
    setCategory,

    status,
    setStatus,

    trainings,

}) {

    const categories = [

        ...new Set(
            trainings.map(
                training => training.category
            )
        ),

    ];

    return (

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">

            <div className="mb-6 flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">

                    <Filter
                        className="text-blue-600"
                        size={28}
                    />

                </div>

                <div>

                    <h2 className="text-2xl font-bold">

                        Recherche & Filtres

                    </h2>

                    <p className="text-slate-500">

                        Retrouvez rapidement une formation.

                    </p>

                </div>

            </div>

            <div className="grid gap-5 lg:grid-cols-3">

                {/* Recherche */}

                <div className="relative">

                    <Search
                        className="absolute left-4 top-4 text-slate-400"
                        size={20}
                    />

                    <input

                        type="text"

                        value={search}

                        onChange={(e) =>
                            setSearch(e.target.value)
                        }

                        placeholder="Code, titre, catégorie..."

                        className="w-full rounded-2xl border border-slate-300 py-3 pl-12 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"

                    />

                </div>

                {/* Catégorie */}

                <select

                    value={category}

                    onChange={(e) =>
                        setCategory(e.target.value)
                    }

                    className="rounded-2xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"

                >

                    <option value="">

                        Toutes les catégories

                    </option>

                    {categories.map(cat => (

                        <option
                            key={cat}
                            value={cat}
                        >
                            {cat}
                        </option>

                    ))}

                </select>

                {/* Statut */}

                <select

                    value={status}

                    onChange={(e) =>
                        setStatus(e.target.value)
                    }

                    className="rounded-2xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"

                >

                    <option value="">

                        Tous les statuts

                    </option>

                    <option value="1">

                        Active

                    </option>

                    <option value="0">

                        Inactive

                    </option>

                </select>

            </div>

        </div>

    );

}