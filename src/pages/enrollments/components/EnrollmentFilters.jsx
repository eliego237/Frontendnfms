import { Search, Filter } from "lucide-react";

export default function EnrollmentFilters({
    search,
    setSearch,
    status,
    setStatus,
}) {

    return (

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

            <div className="flex items-center gap-4 mb-6">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">

                    <Filter
                        className="text-blue-600"
                        size={26}
                    />

                </div>

                <div>

                    <h2 className="text-3xl font-bold">

                        Recherche & Filtres

                    </h2>

                    <p className="text-slate-500">

                        Retrouvez rapidement une inscription.

                    </p>

                </div>

            </div>

            <div className="grid gap-4 lg:grid-cols-2">

                <div className="relative">

                    <Search
                        size={18}
                        className="absolute left-4 top-4 text-slate-400"
                    />

                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Numéro, étudiant..."
                        className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 outline-none focus:border-blue-500"
                    />

                </div>

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                >

                    <option value="">

                        Tous les statuts

                    </option>

                    <option value="pending">

                        En attente

                    </option>

                    <option value="partial">

                        Partiellement payé

                    </option>

                    <option value="paid">

                        Soldé

                    </option>

                </select>

            </div>

        </section>

    );

}