import {
    User,
    GraduationCap,
    Phone,
    Mail,
    BadgeCheck,
    Calendar,
} from "lucide-react";

export default function PaymentStudentCard({ payment }) {

    const enrollment = payment?.enrollment || {};

    const student = enrollment.student || {};

    const initials = (
        `${student.first_name?.[0] || ""}${student.last_name?.[0] || ""}`
    ).toUpperCase() || "ET";

    return (

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

            {/* ================= HEADER ================= */}

            <div className="border-b border-slate-200 p-6">

                <div className="flex items-center gap-4">

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">

                        <User
                            size={30}
                            className="text-blue-600"
                        />

                    </div>

                    <div>

                        <h2 className="text-xl font-bold">

                            Étudiant

                        </h2>

                        <p className="text-slate-500">

                            Informations de l'inscription

                        </p>

                    </div>

                </div>

            </div>

            {/* ================= BODY ================= */}

            <div className="p-6">

                <div className="mb-8 flex items-center gap-5">

                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-3xl font-bold text-blue-700">

                        {initials}

                    </div>

                    <div>

                        <h3 className="text-2xl font-bold text-slate-900">

                            {student.full_name || "-"}

                        </h3>

                        <p className="mt-1 text-slate-500">

                            {student.matricule || "-"}

                        </p>

                    </div>

                </div>

                <div className="grid gap-6">

                    <div className="flex items-center gap-3">

                        <Phone
                            size={20}
                            className="text-green-600"
                        />

                        <div>

                            <p className="text-sm text-slate-500">

                                Téléphone

                            </p>

                            <p className="font-semibold">

                                {student.phone ?? "-"}

                            </p>

                        </div>

                    </div>

                    <div className="flex items-center gap-3">

                        <Mail
                            size={20}
                            className="text-red-500"
                        />

                        <div>

                            <p className="text-sm text-slate-500">

                                Email

                            </p>

                            <p className="font-semibold">

                                {student.email ?? "-"}

                            </p>

                        </div>

                    </div>

                    <div className="flex items-center gap-3">

                        <GraduationCap
                            size={20}
                            className="text-indigo-600"
                        />

                        <div>

                            <p className="text-sm text-slate-500">

                                Formation

                            </p>

                            <p className="font-semibold">

                                {enrollment.training?.title || "-"}

                            </p>

                        </div>

                    </div>

                    <div className="flex items-center gap-3">

                        <Calendar
                            size={20}
                            className="text-orange-500"
                        />

                        <div>

                            <p className="text-sm text-slate-500">

                                Année académique

                            </p>

                            <p className="font-semibold">

                                {enrollment.academic_year || "-"}

                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* ================= FOOTER ================= */}

            <div className="border-t border-slate-200 bg-slate-50 p-6">

                <div className="flex items-center justify-between">

                    <span className="font-semibold">

                        Statut

                    </span>

                    <span className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 font-semibold text-green-700">

                        <BadgeCheck size={18} />

                        {enrollment.formatted_status || "Inscription active"}

                    </span>

                </div>

            </div>

        </div>

    );

}