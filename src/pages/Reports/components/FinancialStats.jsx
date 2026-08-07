import {
    Wallet,
    Receipt,
    TrendingUp,
    Target,
    ArrowUpRight,
} from "lucide-react";

const money = (value) =>
    Number(value ?? 0).toLocaleString("fr-FR") + " FCFA";

export default function FinancialStats({ stats }) {

    const recoveryRate = Number(stats?.recoveryRate ?? 0);

    const cards = [
        {
            title: "Recettes totales",
            value: money(stats?.totalIncome),
            icon: Wallet,
            color: "bg-emerald-100 text-emerald-600",
        },
        {
            title: "Dépenses totales",
            value: money(stats?.totalExpense),
            icon: Receipt,
            color: "bg-red-100 text-red-600",
        },
        {
            title: "Bénéfice net",
            value: money(stats?.netIncome),
            icon: TrendingUp,
            color: "bg-blue-100 text-blue-600",
        },
        {
            title: "Taux de recouvrement",
            value: `${recoveryRate}%`,
            icon: Target,
            color: "bg-purple-100 text-purple-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">

            {cards.map((item, index) => {

                const Icon = item.icon;

                return (

                    <div
                        key={index}
                        className="
                            rounded-3xl
                            border
                            border-slate-200
                            bg-white
                            p-6
                            shadow-sm
                            transition-all
                            duration-300
                            hover:-translate-y-1
                            hover:shadow-xl
                        "
                    >

                        <div className="flex items-center justify-between">

                            <div
                                className={`
                                    flex
                                    h-14
                                    w-14
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    ${item.color}
                                `}
                            >
                                <Icon size={28} />
                            </div>

                        </div>

                        <div className="mt-6">

                            <p className="text-sm text-slate-500">
                                {item.title}
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-slate-800">
                                {item.value}
                            </h2>

                        </div>

                    </div>

                );

            })}

        </div>
    );
}