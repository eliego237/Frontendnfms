import {
    User,
    GraduationCap,
    Phone,
    Mail,
    BadgeCheck,
} from "lucide-react";

export default function StudentSummary({ payment }) {

    if (!payment) return null;

    const enrollment = payment.enrollment || {};

    const student = enrollment.student || {};

    const training = enrollment.training || {};

    return (

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

            <div className="mb-8 flex items-center gap-5">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">

                    <User
                        className="text-blue-600"
                        size={30}
                    />

                </div>

                <div>

                    <h2 className="text-2xl font-bold text-slate-800">

                        {student.full_name}

                    </h2>

                    <p className="mt-1 text-slate-500">

                        Matricule : {student.matricule}

                    </p>

                </div>

            </div>

            <div className="grid gap-6 md:grid-cols-2">

                <div>

                    <p className="text-sm text-slate-500">

                        Formation

                    </p>

                    <div className="mt-2 flex items-center gap-2">

                        <GraduationCap
                            size={18}
                            className="text-blue-600"
                        />

                        <span className="font-semibold text-slate-700">

                            {training.title}

                        </span>

                    </div>

                </div>

                <div>

                    <p className="text-sm text-slate-500">

                        Année académique

                    </p>

                    <p className="mt-2 font-semibold text-slate-700">

                        {enrollment.academic_year}

                    </p>

                </div>

                <div>

                    <p className="text-sm text-slate-500">

                        Téléphone

                    </p>

                    <div className="mt-2 flex items-center gap-2">

                        <Phone
                            size={18}
                            className="text-green-600"
                        />

                        <span>

                            {student.phone || "-"}

                        </span>

                    </div>

                </div>

                <div>

                    <p className="text-sm text-slate-500">

                        Email

                    </p>

                    <div className="mt-2 flex items-center gap-2">

                        <Mail
                            size={18}
                            className="text-purple-600"
                        />

                        <span>

                            {student.email || "-"}

                        </span>

                    </div>

                </div>

            </div>

            <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-5">

                <div className="flex items-center gap-3">

                    <BadgeCheck
                        className="text-green-600"
                        size={24}
                    />

                    <div>

                        <p className="font-semibold text-green-700">

                            Inscription valide

                        </p>

                        <p className="text-sm text-green-600">

                            Paiement enregistré pour cette inscription.

                        </p>

                    </div>

                </div>

            </div>

        </div>

    );

}