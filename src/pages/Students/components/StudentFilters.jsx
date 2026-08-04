import { Search, Filter } from "lucide-react";

export default function StudentFilters({

    search,

    setSearch,

    status,

    setStatus,

    gender,

    setGender,

    total,

}) {

    return (

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">

                    <Filter
                        className="text-blue-600"
                        size={22}
                    />

                </div>

                <div>

                    <h2 className="text-xl font-bold text-slate-800">

                        Recherche & Filtres

                    </h2>

                    <p className="text-sm text-slate-500">

                        Recherchez rapidement un étudiant.

                    </p>

                </div>

            </div>

            <div className="grid gap-4 lg:grid-cols-4">

                <div className="relative lg:col-span-2">

                    <Search
                        size={18}
                        className="absolute left-4 top-4 text-slate-400"
                    />

                    <input

                        type="text"

                        value={search}

                        onChange={(e) =>
                            setSearch(e.target.value)
                        }

                        placeholder="Nom, matricule, téléphone..."

                        className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"

                    />

                </div>

                <select

                    value={status}

                    onChange={(e) =>
                        setStatus(e.target.value)
                    }

                    className="rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"

                >

                    <option value="">Tous les statuts</option>

                    <option value="1">Actifs</option>

                    <option value="0">Inactifs</option>

                </select>

                <select

                    value={gender}

                    onChange={(e) =>
                        setGender(e.target.value)
                    }

                    className="rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"

                >

                    <option value="">Tous les sexes</option>

                    <option value="M">Hommes</option>

                    <option value="F">Femmes</option>

                </select>

            </div>

            <div className="mt-5 rounded-2xl bg-slate-50 px-5 py-3 text-sm text-slate-600">

                <span className="font-semibold text-slate-800">

                    {total}

                </span>

                {" "}étudiant(s) affiché(s)

            </div>

        </div>

    );

}