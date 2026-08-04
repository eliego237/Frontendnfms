import { User, Phone, Mail, BadgeCheck } from "lucide-react";

export default function EnrollmentStudentCard({
    students = [],
    value,
    onChange,
}) {
    const student = students.find(
        (item) => Number(item.id) === Number(value)
    );

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100">

                    <User
                        size={24}
                        className="text-blue-600"
                    />

                </div>

                <div>

                    <h2 className="text-xl font-bold">

                        Étudiant

                    </h2>

                    <p className="text-sm text-slate-500">

                        Sélectionnez l'étudiant à inscrire

                    </p>

                </div>

            </div>

            <div>

                <label className="mb-2 block text-sm font-semibold">

                    Étudiant

                </label>

                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                >

                    <option value="">

                        Sélectionner un étudiant

                    </option>

                    {students.map((student) => (

                        <option
                            key={student.id}
                            value={student.id}
                        >

                            {student.matricule} — {student.first_name} {student.last_name}

                        </option>

                    ))}

                </select>

            </div>

            {student && (

                <div className="mt-6 rounded-2xl bg-slate-50 p-5">

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        <div>

                            <p className="mb-1 text-xs font-semibold uppercase text-slate-500">

                                Matricule

                            </p>

                            <div className="flex items-center gap-2">

                                <BadgeCheck
                                    size={18}
                                    className="text-blue-600"
                                />

                                <span className="font-semibold">

                                    {student.matricule}

                                </span>

                            </div>

                        </div>

                        <div>

                            <p className="mb-1 text-xs font-semibold uppercase text-slate-500">

                                Nom complet

                            </p>

                            <div className="flex items-center gap-2">

                                <User
                                    size={18}
                                    className="text-blue-600"
                                />

                                <span className="font-semibold">

                                    {student.first_name} {student.last_name}

                                </span>

                            </div>

                        </div>

                        <div>

                            <p className="mb-1 text-xs font-semibold uppercase text-slate-500">

                                Téléphone

                            </p>

                            <div className="flex items-center gap-2">

                                <Phone
                                    size={18}
                                    className="text-blue-600"
                                />

                                <span>

                                    {student.phone || "-"}

                                </span>

                            </div>

                        </div>

                        <div>

                            <p className="mb-1 text-xs font-semibold uppercase text-slate-500">

                                Email

                            </p>

                            <div className="flex items-center gap-2">

                                <Mail
                                    size={18}
                                    className="text-blue-600"
                                />

                                <span>

                                    {student.email || "-"}

                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}