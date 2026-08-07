import {
    Banknote,
    CalendarDays,
    Receipt,
    TrendingDown,
} from "lucide-react";

function formatMoney(value) {

    return `${Number(value || 0).toLocaleString("fr-FR")} FCFA`;

}

function StatCard({
    title,
    value,
    subtitle,
    icon,
    iconClass,
}) {

    return (

        <div className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

            <div className="flex items-start justify-between gap-4">

                <div>

                    <p className="text-sm font-medium text-slate-500">

                        {title}

                    </p>

                    <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">

                        {value}

                    </h2>

                    {subtitle && (

                        <p className="mt-2 text-xs text-slate-400">

                            {subtitle}

                        </p>

                    )}

                </div>

                <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${iconClass} transition group-hover:scale-105`}
                >

                    {icon}

                </div>

            </div>

        </div>

    );

}

export default function ExpenseStats({

    count = 0,

    total = 0,

    todayAmount = 0,

    monthAmount = 0,

}) {

    return (

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard

                title="Nombre de dépenses"

                value={count}

                subtitle="Dépenses enregistrées"

                icon={
                    <Receipt
                        size={25}
                    />
                }

                iconClass="bg-blue-100 text-blue-700"

            />

            <StatCard

                title="Total des dépenses"

                value={formatMoney(total)}

                subtitle="Cumul enregistré"

                icon={
                    <Banknote
                        size={25}
                    />
                }

                iconClass="bg-red-100 text-red-700"

            />

            <StatCard

                title="Dépenses du mois"

                value={formatMoney(monthAmount)}

                subtitle="Mois en cours"

                icon={
                    <CalendarDays
                        size={25}
                    />
                }

                iconClass="bg-orange-100 text-orange-700"

            />

            <StatCard

                title="Dépenses aujourd'hui"

                value={formatMoney(todayAmount)}

                subtitle="Sorties du jour"

                icon={
                    <TrendingDown
                        size={25}
                    />
                }

                iconClass="bg-purple-100 text-purple-700"

            />

        </div>

    );

}