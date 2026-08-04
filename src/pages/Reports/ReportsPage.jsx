export default function ReportsPage() {

    return (

        <div>

            <h1 className="text-3xl font-bold mb-8">
                Rapports
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold">
                        Rapport des étudiants
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Liste complète des étudiants.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold">
                        Rapport des inscriptions
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Historique des inscriptions.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold">
                        Rapport des paiements
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Historique des paiements.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold">
                        Rapport des dépenses
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Historique des dépenses.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold">
                        Rapport financier
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Situation financière.
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold">
                        Livre de caisse
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Toutes les opérations de caisse.
                    </p>
                </div>

            </div>

        </div>

    );

}