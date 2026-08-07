import { Search } from "lucide-react";

export default function FinancialFilters({

    dateFrom,
    dateTo,
    onDateFromChange,
    onDateToChange,
    onFilter,

}) {

    return (

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">

                <div>

                    <label className="mb-2 block text-sm font-medium">

                        Date début

                    </label>

                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e)=>onDateFromChange(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3"
                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">

                        Date fin

                    </label>

                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e)=>onDateToChange(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3"
                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">

                        Recherche

                    </label>

                    <div className="relative">

                        <Search
                            size={18}
                            className="absolute left-3 top-3 text-slate-400"
                        />

                        <input
                            placeholder="Rechercher..."
                            className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4"
                        />

                    </div>

                </div>

                <div className="flex items-end">

                    <button
                        onClick={onFilter}
                        className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >

                        Filtrer

                    </button>

                </div>

            </div>

        </div>

    );

}