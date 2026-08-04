import {
    Eye,
    Pencil,
    Trash2,
    Phone,
    Mail,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function StudentsTable({

    students,

    calculateAge,

    onEdit,

    onDelete,

}) {

    function initials(student) {

        return `${student.first_name?.[0] || ""}${student.last_name?.[0] || ""}`;

    }

    return (

        <div className="overflow-x-auto">

            <table className="min-w-full">

                <thead className="bg-slate-50">

                    <tr className="border-b">

                        <th className="px-6 py-4 text-left font-semibold text-slate-600">

                            Étudiant

                        </th>

                        <th className="px-6 py-4 text-center font-semibold text-slate-600">

                            Sexe

                        </th>

                        <th className="px-6 py-4 text-center font-semibold text-slate-600">

                            Âge

                        </th>

                        <th className="px-6 py-4 text-left font-semibold text-slate-600">

                            Téléphone

                        </th>

                        <th className="px-6 py-4 text-left font-semibold text-slate-600">

                            Email

                        </th>

                        <th className="px-6 py-4 text-center font-semibold text-slate-600">

                            Statut

                        </th>

                        <th className="px-6 py-4 text-center font-semibold text-slate-600">

                            Actions

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {students.length === 0 ? (

                        <tr>

                            <td

                                colSpan="7"

                                className="py-14 text-center text-slate-500"

                            >

                                Aucun étudiant trouvé.

                            </td>

                        </tr>

                    ) : (

                        students.map((student) => (

                            <tr

                                key={student.id}

                                className="border-b transition hover:bg-blue-50"

                            >

                                <td className="px-6 py-5">

                                    <div className="flex items-center gap-4">

                                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-white">

                                            {initials(student)}

                                        </div>

                                        <div>

                                            <h3 className="font-bold text-slate-800">

                                                {student.first_name} {student.last_name}

                                            </h3>

                                            <p className="text-sm text-slate-500">

                                                {student.matricule}

                                            </p>

                                        </div>

                                    </div>

                                </td>

                                <td className="text-center">

                                    {student.gender}

                                </td>

                                <td className="text-center">

                                    {calculateAge(student.birth_date)} ans

                                </td>

                                <td>

                                    <div className="flex items-center gap-2">

                                        <Phone

                                            size={16}

                                            className="text-blue-600"

                                        />

                                        {student.phone}

                                    </div>

                                </td>

                                <td>

                                    <div className="flex items-center gap-2">

                                        <Mail

                                            size={16}

                                            className="text-slate-500"

                                        />

                                        {student.email || "-"}

                                    </div>

                                </td>

                                <td className="text-center">

                                    <span

                                        className={`inline-flex rounded-full px-4 py-1 text-sm font-semibold ${
                                            student.status
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}

                                    >

                                        {student.status

                                            ? "Actif"

                                            : "Inactif"}

                                    </span>

                                </td>

                                <td>

                                    <div className="flex justify-center gap-2">

                                        <Link

                                            to={`/students/${student.id}`}

                                            className="rounded-xl bg-emerald-100 p-2 text-emerald-700 transition hover:scale-110"

                                        >

                                            <Eye size={18} />

                                        </Link>

                                        <button

                                            onClick={() => onEdit(student)}

                                            className="rounded-xl bg-blue-100 p-2 text-blue-700 transition hover:scale-110"

                                        >

                                            <Pencil size={18} />

                                        </button>

                                        <button

                                            onClick={() => onDelete(student)}

                                            className="rounded-xl bg-red-100 p-2 text-red-700 transition hover:scale-110"

                                        >

                                            <Trash2 size={18} />

                                        </button>

                                    </div>

                                </td>

                            </tr>

                        ))

                    )}

                </tbody>

            </table>

        </div>

    );

}