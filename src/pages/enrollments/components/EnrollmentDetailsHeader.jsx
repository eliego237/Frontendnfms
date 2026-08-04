import {
    ArrowLeft,
    Pencil,
    BookOpen
} from "lucide-react";

import { Link } from "react-router-dom";

export default function EnrollmentDetailsHeader({

    enrollment,

}) {

    return (

        <section className="rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 p-8 text-white shadow-xl">

            <div className="flex items-center justify-between">

                <div className="flex items-center gap-6">

                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15">

                        <BookOpen size={42} />

                    </div>

                    <div>

                        <p className="uppercase tracking-widest text-blue-100">

                            Numéro d'inscription

                        </p>

                        <h1 className="mt-2 text-4xl font-black">

                            {enrollment.enrollment_number}

                        </h1>

                        <p className="mt-2 text-lg text-blue-100">

                            {enrollment.student.first_name}{" "}
                            {enrollment.student.last_name}

                        </p>

                    </div>

                </div>

                <div className="flex gap-4">

                    <Link

                        to="/enrollments"

                        className="rounded-2xl bg-white/15 px-6 py-4 font-semibold backdrop-blur hover:bg-white/25"

                    >

                        <ArrowLeft
                            size={18}
                            className="inline mr-2"
                        />

                        Retour

                    </Link>

                    <Link

                        to={`/enrollments/${enrollment.id}/edit`}

                        className="rounded-2xl bg-white px-6 py-4 font-bold text-blue-700 hover:bg-blue-50"

                    >

                        <Pencil
                            size={18}
                            className="inline mr-2"
                        />

                        Modifier

                    </Link>

                </div>

            </div>

        </section>

    );

}