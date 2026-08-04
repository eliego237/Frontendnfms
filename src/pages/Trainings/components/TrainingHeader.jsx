import {
    BookOpen,
    Plus,
} from "lucide-react";

export default function TrainingHeader({
    onCreate,
}) {
    return (
        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-xl">

            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-center gap-6">

                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">

                        <BookOpen size={42} />

                    </div>

                    <div>

                        <h1 className="text-4xl font-extrabold tracking-tight">

                            Gestion des formations

                        </h1>

                        <p className="mt-2 text-lg text-blue-100">

                            Consultez, ajoutez, modifiez et gérez toutes les formations proposées par votre établissement.

                        </p>

                    </div>

                </div>

                <button
                    onClick={onCreate}
                    className="inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-4 font-semibold text-blue-700 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-blue-50"
                >
                    <Plus size={22} />

                    Nouvelle formation
                </button>

            </div>

        </div>
    );
}