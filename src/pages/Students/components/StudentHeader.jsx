import { Users, Plus } from "lucide-react";

export default function StudentHeader({ onAdd }) {

    return (

        <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 p-8 shadow-lg">

            <div className="flex items-center justify-between">

                <div>

                    <h1 className="text-5xl font-extrabold text-white">

                        Gestion des étudiants

                    </h1>

                    <p className="mt-3 text-lg text-blue-100">

                        Consultez, recherchez, ajoutez et gérez tous les étudiants de votre établissement.

                    </p>

                </div>

                <button
                    onClick={onAdd}
                    className="rounded-2xl bg-white px-8 py-4 font-semibold text-blue-600 shadow-lg transition hover:scale-105"
                >
                    + Nouvel étudiant
                </button>

            </div>

        </div>

    );

}