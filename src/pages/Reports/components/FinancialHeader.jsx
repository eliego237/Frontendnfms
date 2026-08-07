import { RefreshCw, BarChart3 } from "lucide-react";

export default function FinancialHeader() {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 shadow-xl">

            {/* Décor */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white"></div>
                <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-white"></div>
            </div>

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between p-8">

                {/* Partie gauche */}
                <div className="flex items-start gap-5">

                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20">

                        <BarChart3
                            size={34}
                            className="text-white"
                        />

                    </div>

                    <div>

                        <p className="text-sm text-blue-100 mb-2">

                            Analyse & statistiques • Rapports

                        </p>

                        <h1 className="text-4xl font-bold text-white">

                            Rapport financier

                        </h1>

                        <p className="mt-2 text-blue-100 max-w-2xl">

                            Consultez les recettes, les dépenses, les bénéfices
                            et les indicateurs financiers de votre centre de
                            formation.

                        </p>

                    </div>

                </div>

                {/* Partie droite */}

                <div className="mt-6 lg:mt-0">

                    <button
                        className="
                        flex
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-white/20
                        bg-white/10
                        px-5
                        py-3
                        text-white
                        backdrop-blur-sm
                        transition-all
                        hover:bg-white/20
                        "
                    >

                        <RefreshCw size={18} />

                        Actualiser

                    </button>

                </div>

            </div>

        </div>
    );
}