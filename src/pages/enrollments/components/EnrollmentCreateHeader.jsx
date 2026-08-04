import { GraduationCap, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function EnrollmentCreateHeader() {
    return (
        <div className="flex items-center justify-between">

            <div className="flex items-center gap-5">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">

                    <GraduationCap
                        className="text-blue-600"
                        size={34}
                    />

                </div>

                <div>

                    <h1 className="text-4xl font-bold">

                        Nouvelle inscription

                    </h1>

                    <p className="mt-1 text-slate-500">

                        Inscrire un étudiant à une formation

                    </p>

                </div>

            </div>

            <Link
                to="/enrollments"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold hover:bg-slate-50"
            >

                <ArrowLeft size={18} />

                Retour

            </Link>

        </div>
    );
}