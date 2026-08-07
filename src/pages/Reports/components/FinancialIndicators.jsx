import {
    Wallet,
    PiggyBank,
    TrendingUp,
    TrendingDown,
} from "lucide-react";

const money = (value) =>
    Number(value).toLocaleString("fr-FR") + " FCFA";

export default function FinancialIndicators({ stats }) {

    const margin =
        stats.totalIncome > 0
            ? (
                (stats.netIncome /
                    stats.totalIncome) *
                100
            ).toFixed(1)
            : 0;

    const expenseRate =
        stats.totalIncome > 0
            ? (
                (stats.totalExpense /
                    stats.totalIncome) *
                100
            ).toFixed(1)
            : 0;

    const cards = [

        {
            title: "Taux de rentabilité",
            value: `${margin}%`,
            icon: TrendingUp,
            color: "green",
        },

        {
            title: "Taux de dépenses",
            value: `${expenseRate}%`,
            icon: TrendingDown,
            color: "red",
        },

        {
            title: "Paiement moyen",
            value: money(stats.averagePayment),
            icon: Wallet,
            color: "blue",
        },

        {
            title: "Dépense moyenne",
            value: money(stats.averageExpense),
            icon: PiggyBank,
            color: "purple",
        },

    ];

    return (

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

            {cards.map((card) => {

                const Icon = card.icon;

                return (

                    <div
                        key={card.title}
                        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                    >

                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">

                            <Icon size={28} />

                        </div>

                        <p className="text-sm text-slate-500">

                            {card.title}

                        </p>

                        <h2 className="mt-2 text-2xl font-bold">

                            {card.value}

                        </h2>

                    </div>

                );

            })}

        </div>

    );

}