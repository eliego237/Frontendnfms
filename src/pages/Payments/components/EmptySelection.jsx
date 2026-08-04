import { GraduationCap } from "lucide-react";

export default function EmptySelection() {

    return (

        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center">

            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-100">

                <GraduationCap
                    className="text-blue-600"
                    size={42}
                />

            </div>

            <h2 className="mt-6 text-2xl font-bold">

                Sélectionnez une inscription

            </h2>

            <p className="mt-2 text-slate-500">

                Recherchez puis choisissez un étudiant afin
                d'afficher automatiquement ses informations
                et sa situation financière.

            </p>

        </div>

    );

}