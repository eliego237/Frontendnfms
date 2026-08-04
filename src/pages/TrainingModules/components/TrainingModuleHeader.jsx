import {
    Boxes,
    Plus,
} from "lucide-react";

export default function TrainingModuleHeader({
    onCreate,
}) {

    return (

        <div className="overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 p-8 text-white shadow-xl">

            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-center gap-6">

                    <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">

                        <Boxes size={42} />

                    </div>

                    <div>

                        <h1 className="text-4xl font-extrabold tracking-tight">

                            Gestion des modules

                        </h1>

                        <p className="mt-2 text-lg text-violet-100">

                            Organisez les différents modules composant chacune
                            de vos formations professionnelles.

                        </p>

                    </div>

                </div>

                <button
                    onClick={onCreate}
                    className="inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-4 font-semibold text-violet-700 shadow-lg transition-all duration-300 hover:scale-105 hover:bg-violet-50"
                >

                    <Plus size={22} />

                    Nouveau module

                </button>

            </div>

        </div>

    );

}