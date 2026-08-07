const money = (value) =>
    Number(value).toLocaleString("fr-FR") + " FCFA";

export default function FinancialSummary({ stats }) {

    return (

        <div className="rounded-3xl bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-white shadow-xl">

            <h2 className="mb-8 text-2xl font-bold">

                Résumé financier

            </h2>

            <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">

                <SummaryItem
                    title="Recettes"
                    value={money(stats.totalIncome)}
                />

                <SummaryItem
                    title="Dépenses"
                    value={money(stats.totalExpense)}
                />

                <SummaryItem
                    title="Bénéfice"
                    value={money(stats.netIncome)}
                />

                <SummaryItem
                    title="Solde"
                    value={money(stats.balance)}
                />

            </div>

        </div>

    );

}

function SummaryItem({

    title,

    value,

}) {

    return (

        <div>

            <p className="text-slate-400">

                {title}

            </p>

            <h3 className="mt-2 text-2xl font-bold">

                {value}

            </h3>

        </div>

    );

}