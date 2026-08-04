import { GraduationCap, Plus } from "lucide-react";
import { Link } from "react-router-dom";

export default function EnrollmentHeader() {

    return (

        <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 p-10 text-white shadow-lg">

            <div className="flex items-center justify-between">

                <div className="flex items-center gap-6">

                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20">

                        <GraduationCap size={42} />

                    </div>

                    <div>

                        <h1 className="text-5xl font-extrabold">

                            Gestion des inscriptions

                        </h1>

                        <p className="mt-3 text-lg text-blue-100">

                            Gérez les inscriptions des étudiants,
                            les réductions, les paiements et les
                            formations.

                        </p>

                    </div>

                </div>

                <Link
                    to="/enrollments/create"
                    className="flex items-center gap-3 rounded-2xl bg-white px-8 py-5 font-bold text-blue-700 shadow-lg transition hover:scale-105"
                >

                    <Plus size={22} />

                    Nouvelle inscription

                </Link>

            </div>

        </div>

    );

}