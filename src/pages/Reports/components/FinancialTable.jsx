import FinancialTableToolbar from "./FinancialTableToolbar";
import FinancialPagination from "./FinancialPagination";

const money = (value) =>
    Number(value).toLocaleString("fr-FR") + " FCFA";

export default function FinancialTable({

    transactions,

    search,

    setSearch,

    page,

    lastPage,

    setPage,

}) {

    const filtered = transactions.filter((item) => {

        const text = (
            item.reference +
            item.label +
            item.status
        ).toLowerCase();

        return text.includes(search.toLowerCase());

    });

    return (

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

            <FinancialTableToolbar
                search={search}
                setSearch={setSearch}
            />

            <div className="overflow-x-auto">

                <table className="w-full">

                    <thead className="bg-slate-50">

                        <tr>

                            <th className="px-6 py-4 text-left">
                                Date
                            </th>

                            <th className="px-6 py-4 text-left">
                                Référence
                            </th>

                            <th className="px-6 py-4 text-left">
                                Libellé
                            </th>

                            <th className="px-6 py-4 text-right">
                                Recettes
                            </th>

                            <th className="px-6 py-4 text-right">
                                Dépenses
                            </th>

                            <th className="px-6 py-4 text-right">
                                Solde
                            </th>

                            <th className="px-6 py-4 text-center">
                                Statut
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {filtered.map((row) => (

                            <tr
                                key={row.reference}
                                className="border-b hover:bg-slate-50"
                            >

                                <td className="px-6 py-4">
                                    {row.date}
                                </td>

                                <td className="px-6 py-4 font-semibold">
                                    {row.reference}
                                </td>

                                <td className="px-6 py-4">
                                    {row.label}
                                </td>

                                <td className="px-6 py-4 text-right text-green-600 font-semibold">

                                    {row.income > 0
                                        ? money(row.income)
                                        : "-"}

                                </td>

                                <td className="px-6 py-4 text-right text-red-600 font-semibold">

                                    {row.expense > 0
                                        ? money(row.expense)
                                        : "-"}

                                </td>

                                <td className="px-6 py-4 text-right font-bold">

                                    {money(row.balance)}

                                </td>

                                <td className="px-6 py-4 text-center">

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                            row.status === "Entrée"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {row.status}
                                    </span>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            <FinancialPagination
                page={page}
                lastPage={lastPage}
                onChange={setPage}
            />

        </div>

    );

}