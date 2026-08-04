import {
    User,
    Phone,
    Mail,
    MapPin,
    Calendar,
    BadgeCheck,
} from "lucide-react";

export default function EnrollmentStudentSummary({

    student,

}) {

    return (

        <div className="rounded-3xl bg-white p-6 shadow-sm border">

            <div className="flex items-center gap-4 mb-6">

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">

                    {student.first_name?.charAt(0)}

                    {student.last_name?.charAt(0)}

                </div>

                <div>

                    <h2 className="text-xl font-bold">

                        {student.first_name} {student.last_name}

                    </h2>

                    <p className="text-slate-500">

                        {student.matricule}

                    </p>

                </div>

            </div>

            <div className="space-y-4">

                <div className="flex items-center gap-3">

                    <Phone
                        size={18}
                        className="text-blue-600"
                    />

                    <span>

                        {student.phone || "--"}

                    </span>

                </div>

                <div className="flex items-center gap-3">

                    <Mail
                        size={18}
                        className="text-emerald-600"
                    />

                    <span>

                        {student.email || "--"}

                    </span>

                </div>

                <div className="flex items-center gap-3">

                    <MapPin
                        size={18}
                        className="text-orange-500"
                    />

                    <span>

                        {student.address || "--"}

                    </span>

                </div>

                <div className="flex items-center gap-3">

                    <Calendar
                        size={18}
                        className="text-violet-600"
                    />

                    <span>

                        {student.birth_date || "--"}

                    </span>

                </div>

                <div className="flex items-center gap-3">

                    <BadgeCheck
                        size={18}
                        className="text-green-600"
                    />

                    <span>

                        {student.status
                            ? "Étudiant actif"
                            : "Étudiant inactif"}

                    </span>

                </div>

            </div>

        </div>

    );

}