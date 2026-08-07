import {
    Search,
    FileSpreadsheet,
    FileText,
    Printer,
    TrendingUp,
    TrendingDown,
} from "lucide-react";

const data = [
    {
        month: "Janvier",
        income: 2450000,
        expense: 900000,
    },
    {
        month: "Février",
        income: 2900000,
        expense: 850000,
    },
    {
        month: "Mars",
        income: 3250000,
        expense: 1100000,
    },
    {
        month: "Avril",
        income: 2100000,
        expense: 950000,
    },
    {
        month: "Mai",
        income: 3800000,
        expense: 1200000,
    },
];

const money = (value) =>
    new Intl.NumberFormat("fr-FR").format(value) + " FCFA";

export default function MonthlyFinancialTable() {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

            {/* Header */}
            <div className="flex flex-col gap-4 border-b p-6 lg:flex-row lg:items-center lg:justify-between">

                <div>
                    <h2 className="text-xl font-bold text-slate-800">
                        Rapport financier mensuel
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Résumé des performances financières
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">

                    <button className="btn-export">
                        <FileText size={18} />
                        PDF
                    </button>

                    <button className="btn-export">
                        <FileSpreadsheet size={18} />
                        Excel
                    </button>

                    <button className="btn-export">
                        <Printer size={18} />
                        Imprimer
                    </button>

                </div>

            </div>

            {/* Filtres */}
            <div className="border-b p-6">

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

                    <div className="relative">

                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                        />

                    </div>

                    <select className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500">

                        <option>Toute l'année</option>
                        <option>2026</option>
                        <option>2025</option>

                    </select>

                    <select className="rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500">

                        <option>Tous les mois</option>
                        <option>Janvier</option>
                        <option>Février</option>
                        <option>Mars</option>
                        <option>Avril</option>
                        <option>Mai</option>

                    </select>

                </div>

            </div>

            {/* Tableau */}

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead className="bg-slate-50">

                        <tr className="text-left">

                            <th className="px-6 py-4 font-semibold text-slate-600">
                                Mois
                            </th>

                            <th className="px-6 py-4 font-semibold text-slate-600">
                                Recettes
                            </th>

                            <th className="px-6 py-4 font-semibold text-slate-600">
                                Dépenses
                            </th>

                            <th className="px-6 py-4 font-semibold text-slate-600">
                                Bénéfice
                            </th>

                            <th className="px-6 py-4 font-semibold text-slate-600">
                                Évolution
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {data.map((row, index) => {

                            const benefit = row.income - row.expense;

                            return (

                                <tr
                                    key={index}
                                    className="border-b transition hover:bg-slate-50"
                                >

                                    <td className="px-6 py-4 font-medium text-slate-700">
                                        {row.month}
                                    </td>

                                    <td className="px-6 py-4 font-semibold text-emerald-600">
                                        {money(row.income)}
                                    </td>

                                    <td className="px-6 py-4 font-semibold text-red-600">
                                        {money(row.expense)}
                                    </td>

                                    <td className="px-6 py-4 font-bold text-slate-800">
                                        {money(benefit)}
                                    </td>

                                    <td className="px-6 py-4">

                                        {benefit > 1500000 ? (

                                            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">

                                                <TrendingUp size={16} />

                                                Hausse

                                            </span>

                                        ) : (

                                            <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">

                                                <TrendingDown size={16} />

                                                Baisse

                                            </span>

                                        )}

                                    </td>

                                </tr>

                            );

                        })}

                    </tbody>

                </table>

            </div>

        </div>
    );
}