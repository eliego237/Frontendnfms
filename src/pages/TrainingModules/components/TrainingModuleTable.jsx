import {
    Boxes,
    Eye,
    Pencil,
    Trash2,
    Clock3,
    Hash,
    GraduationCap,
} from "lucide-react";

export default function TrainingModuleTable({

    modules,

    onView,

    onEdit,

    onDelete,

}) {

    if (modules.length === 0) {

        return (

            <div className="rounded-3xl border border-slate-200 bg-white p-16 text-center shadow-sm">

                <Boxes
                    size={72}
                    className="mx-auto mb-5 text-slate-300"
                />

                <h3 className="text-2xl font-bold text-slate-700">

                    Aucun module

                </h3>

                <p className="mt-2 text-slate-500">

                    Aucun module ne correspond aux critères sélectionnés.

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

                                Module

                            </th>

                            <th className="px-6 py-5 text-left font-bold text-slate-700">

                                Formation

                            </th>

                            <th className="px-6 py-5 text-center font-bold text-slate-700">

                                Position

                            </th>

                            <th className="px-6 py-5 text-center font-bold text-slate-700">

                                Durée

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

                        {modules.map((module) => (

                            <tr
                                key={module.id}
                                className="border-t transition-all duration-200 hover:bg-slate-50"
                            >

                                {/* MODULE */}

                                <td className="px-6 py-5">

                                    <div className="flex items-center gap-4">

                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100">

                                            <Boxes
                                                size={26}
                                                className="text-violet-600"
                                            />

                                        </div>

                                        <div>

                                            <h3 className="font-bold text-slate-800">

                                                {module.title}

                                            </h3>

                                            <p className="text-sm text-slate-500">

                                                {module.code}

                                            </p>

                                        </div>

                                    </div>

                                </td>

                                {/* FORMATION */}

                                <td className="px-6 py-5">

                                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-blue-700">

                                        <GraduationCap size={16} />

                                        {module.training?.title}

                                    </div>

                                </td>

                                {/* POSITION */}

                                <td className="px-6 py-5 text-center">

                                    <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 font-semibold text-indigo-700">

                                        <Hash size={16} />

                                        {module.position}

                                    </div>

                                </td>

                                {/* DUREE */}

                                <td className="px-6 py-5 text-center">

                                    <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-2 font-semibold text-purple-700">

                                        <Clock3 size={16} />

                                        {module.duration_hours} h

                                    </div>

                                </td>

                                {/* STATUT */}

                                <td className="px-6 py-5 text-center">

                                    {module.is_active ? (

                                        <span className="rounded-full bg-green-100 px-4 py-2 font-semibold text-green-700">

                                            Active

                                        </span>

                                    ) : (

                                        <span className="rounded-full bg-red-100 px-4 py-2 font-semibold text-red-700">

                                            Inactive

                                        </span>

                                    )}

                                </td>

                                {/* ACTIONS */}

                                <td className="px-6 py-5">

                                    <div className="flex justify-center gap-3">

                                        <button
                                            onClick={() => onView(module)}
                                            className="rounded-xl bg-blue-100 p-3 text-blue-600 transition-all hover:scale-105 hover:bg-blue-600 hover:text-white"
                                        >

                                            <Eye size={18} />

                                        </button>

                                        <button
                                            onClick={() => onEdit(module)}
                                            className="rounded-xl bg-amber-100 p-3 text-amber-600 transition-all hover:scale-105 hover:bg-amber-500 hover:text-white"
                                        >

                                            <Pencil size={18} />

                                        </button>

                                        <button
                                            onClick={() => onDelete(module)}
                                            className="rounded-xl bg-red-100 p-3 text-red-600 transition-all hover:scale-105 hover:bg-red-600 hover:text-white"
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