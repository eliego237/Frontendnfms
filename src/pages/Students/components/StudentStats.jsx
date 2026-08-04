import {
    Users,
    UserCheck,
    Mars,
    Venus,
} from "lucide-react";

export default function StudentStats({ students = [] }) {

    const total = students.length;

    const active = students.filter(
        (student) => student.status
    ).length;

    const men = students.filter(
        (student) =>
            student.gender?.toUpperCase() === "M"
    ).length;

    const women = students.filter(
        (student) =>
            student.gender?.toUpperCase() === "F"
    ).length;

    const cards = [
        {
            title: "Total étudiants",
            value: total,
            icon: Users,
            bg: "bg-blue-100",
            color: "text-blue-600",
        },
        {
            title: "Étudiants actifs",
            value: active,
            icon: UserCheck,
            bg: "bg-green-100",
            color: "text-green-600",
        },
        {
            title: "Hommes",
            value: men,
            icon: Mars,
            bg: "bg-indigo-100",
            color: "text-indigo-600",
        },
        {
            title: "Femmes",
            value: women,
            icon: Venus,
            bg: "bg-pink-100",
            color: "text-pink-600",
        },
    ];

    return (

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

            {cards.map((card) => {

                const Icon = card.icon;

                return (

                    <div
                        key={card.title}
                        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                    >

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-sm font-medium text-slate-500">

                                    {card.title}

                                </p>

                                <h2 className="mt-2 text-4xl font-bold text-slate-800">

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