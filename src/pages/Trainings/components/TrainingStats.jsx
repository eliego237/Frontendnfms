import {
    BookOpen,
    CheckCircle2,
    Layers3,
    Wallet,
} from "lucide-react";

export default function TrainingStats({
    trainings,
}) {

    const total = trainings.length;

    const active = trainings.filter(
        t => t.is_active
    ).length;

    const modules = trainings.reduce(
        (sum, t) => sum + (t.modules?.length || 0),
        0
    );

    const average =
        total === 0
            ? 0
            : Math.round(
                  trainings.reduce(
                      (sum, t) => sum + Number(t.price),
                      0
                  ) / total
              );

    const cards = [

        {
            title: "Total formations",
            value: total,
            icon: BookOpen,
            color: "blue",
        },

        {
            title: "Formations actives",
            value: active,
            icon: CheckCircle2,
            color: "green",
        },

        {
            title: "Modules",
            value: modules,
            icon: Layers3,
            color: "purple",
        },

        {
            title: "Prix moyen",
            value: `${average.toLocaleString()} FCFA`,
            icon: Wallet,
            color: "orange",
        },

    ];

    const colors = {

        blue: {
            bg: "bg-blue-100",
            text: "text-blue-600",
        },

        green: {
            bg: "bg-green-100",
            text: "text-green-600",
        },

        purple: {
            bg: "bg-purple-100",
            text: "text-purple-600",
        },

        orange: {
            bg: "bg-orange-100",
            text: "text-orange-600",
        },

    };

    return (

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            {cards.map((card) => {

                const Icon = card.icon;

                return (

                    <div
                        key={card.title}
                        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm text-slate-500">

                                    {card.title}

                                </p>

                                <h2 className="mt-2 text-4xl font-bold text-slate-800">

                                    {card.value}

                                </h2>

                            </div>

                            <div
                                className={`flex h-16 w-16 items-center justify-center rounded-2xl ${colors[card.color].bg}`}
                            >

                                <Icon
                                    size={30}
                                    className={colors[card.color].text}
                                />

                            </div>

                        </div>

                    </div>

                );

            })}

        </div>

    );

}