import {
    CalendarDays,
    Filter,
    Search,
    X,
} from "lucide-react";

export default function ExpenseFilters({

    search = "",

    setSearch,

    category = "",

    setCategory,

    dateFilter = "",

    setDateFilter,

    categories = [],

    resultCount = 0,

}) {

    const hasFilters =
        search ||
        category ||
        dateFilter;

    function resetFilters() {

        setSearch("");

        setCategory("");

        setDateFilter("");

    }

    return (

        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">

                        <Filter size={19} />

                    </div>

                    <div>

                        <h2 className="font-bold text-slate-900">

                            Rechercher et filtrer

                        </h2>

                        <p className="text-sm text-slate-500">

                            {resultCount} résultat
                            {resultCount > 1 ? "s" : ""}

                        </p>

                    </div>

                </div>

                {hasFilters && (

                    <button
                        type="button"
                        onClick={resetFilters}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
                    >

                        <X size={16} />

                        Réinitialiser

                    </button>

                )}

            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">

                {/* Recherche */}

                <div className="relative">

                    <Search
                        size={19}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        placeholder="Numéro, libellé, catégorie..."
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />

                </div>

                {/* Catégorie */}

                <select
                    value={category}
                    onChange={(e) =>
                        setCategory(e.target.value)
                    }
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                >

                    <option value="">
                        Toutes les catégories
                    </option>

                    {categories.map((item) => (

                        <option
                            key={item}
                            value={item}
                        >
                            {item}
                        </option>

                    ))}

                </select>

                {/* Date */}

                <div className="relative">

                    <CalendarDays
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                        type="date"
                        value={dateFilter}
                        onChange={(e) =>
                            setDateFilter(e.target.value)
                        }
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm font-medium text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                    />

                </div>

            </div>

        </div>

    );

}