import {
    BookOpen,
    Eye,
    Pencil,
    Trash2,
    Clock3,
    Wallet,
} from "lucide-react";

export default function TrainingTable({

    trainings,

    onEdit,

    onDelete,

    onView,

}) {

    if (trainings.length === 0) {

        return (

            <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">

                <BookOpen
                    size={70}
                    className="mx-auto mb-5 text-slate-300"
                />

                <h3 className="text-2xl font-bold text-slate-700">

                    Aucune formation

                </h3>

                <p className="mt-2 text-slate-500">

                    Aucune formation ne correspond aux critères.

                </p>

            </div>

        );

    }

    return (

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="overflow-x-auto">

                <table className="min-w-full">

                    <thead className="bg-slate-100">

                        <tr>

                            <th className="px-6 py-5 text-left font-bold text-slate-700">

                                Formation

                            </th>

                            <th className="px-6 py-5 text-left font-bold text-slate-700">

                                Catégorie

                            </th>

                            <th className="px-6 py-5 text-center font-bold text-slate-700">

                                Durée

                            </th>

                            <th className="px-6 py-5 text-center font-bold text-slate-700">

                                Prix

                            </th>

                            <th className="px-6 py-5 text-center font-bold text-slate-700">

                                Statut

                            </th>

                            <th className="px-6 py-5 text-center font-bold text-slate-700">

                                Actions

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {trainings.map((training) => (

                            <tr
                                key={training.id}
                                className="border-t transition hover:bg-slate-50"
                            >

                                <td className="px-6 py-5">

                                    <div className="flex items-center gap-4">

                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100">

                                            <BookOpen
                                                className="text-blue-600"
                                                size={26}
                                            />

                                        </div>

                                        <div>

                                            <h3 className="font-bold text-slate-800">

                                                {training.title}

                                            </h3>

                                            <p className="text-sm text-slate-500">

                                                {training.code}

                                            </p>

                                        </div>

                                    </div>

                                </td>

                                <td className="px-6 py-5">

                                    {training.category}

                                </td>

                                <td className="px-6 py-5 text-center">

                                    <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-indigo-700">

                                        <Clock3 size={16} />

                                        {training.duration_months} mois

                                    </div>

                                </td>

                                <td className="px-6 py-5 text-center">

                                    <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 font-bold text-green-700">

                                        <Wallet size={16} />

                                        {Number(training.price).toLocaleString()} FCFA

                                    </div>

                                </td>

                                <td className="px-6 py-5 text-center">

                                    {training.is_active ? (

                                        <span className="rounded-full bg-green-100 px-4 py-2 font-semibold text-green-700">

                                            Active

                                        </span>

                                    ) : (

                                        <span className="rounded-full bg-red-100 px-4 py-2 font-semibold text-red-700">

                                            Inactive

                                        </span>

                                    )}

                                </td>

                                <td className="px-6 py-5">

                                    <div className="flex justify-center gap-3">

                                        <button
                                            onClick={() => onView(training)}
                                            className="rounded-xl bg-blue-100 p-3 text-blue-600 transition hover:bg-blue-600 hover:text-white"
                                        >
                                            <Eye size={18} />
                                        </button>

                                        <button
                                            onClick={() => onEdit(training)}
                                            className="rounded-xl bg-amber-100 p-3 text-amber-600 transition hover:bg-amber-500 hover:text-white"
                                        >
                                            <Pencil size={18} />
                                        </button>

                                        <button
                                            onClick={() => onDelete(training)}
                                            className="rounded-xl bg-red-100 p-3 text-red-600 transition hover:bg-red-600 hover:text-white"
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}