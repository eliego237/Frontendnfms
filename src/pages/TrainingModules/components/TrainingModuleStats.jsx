import {
    Boxes,
    CheckCircle2,
    Clock3,
    GraduationCap,
} from "lucide-react";

export default function TrainingModuleStats({
    modules,
}) {

    const totalModules = modules.length;

    const activeModules = modules.filter(
        (m) => Number(m.is_active) === 1
    ).length;

    const totalHours = modules.reduce(
        (sum, m) => sum + Number(m.duration_hours || 0),
        0
    );

    const trainings = new Set(
        modules.map((m) => m.training?.id)
    ).size;

    const cards = [
        {
            title: "Total modules",
            value: totalModules,
            icon: Boxes,
            bg: "bg-blue-100",
            color: "text-blue-600",
        },
        {
            title: "Modules actifs",
            value: activeModules,
            icon: CheckCircle2,
            bg: "bg-green-100",
            color: "text-green-600",
        },
        {
            title: "Durée totale",
            value: `${totalHours} h`,
            icon: Clock3,
            bg: "bg-purple-100",
            color: "text-purple-600",
        },
        {
            title: "Formations",
            value: trainings,
            icon: GraduationCap,
            bg: "bg-orange-100",
            color: "text-orange-600",
        },
    ];

    return (

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            {cards.map((card) => {

                const Icon = card.icon;

                return (

                    <div
                        key={card.title}
                        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >

                        <div className="flex items-start justify-between">

                            <div>

                                <p className="text-slate-500">

                                    {card.title}

                                </p>

                                <h2 className="mt-3 text-5xl font-extrabold text-slate-800">

                                    {card.value}

                                </h2>

                            </div>

                            <div
                                className={`flex h-16 w-16 items-center justify-center rounded-2xl ${card.bg}`}
                            >

                                <Icon
                                    size={30}
                                    className={card.color}
                                />

                            </div>

                        </div>

                    </div>

                );

            })}

        </div>

    );

}