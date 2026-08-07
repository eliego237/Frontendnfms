import { Award } from "lucide-react";

const money = (value) =>
    Number(value).toLocaleString("fr-FR") + " FCFA";

export default function TopTrainings({ trainings = [] }) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center gap-3">

                <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
                    <Award size={22} />
                </div>

                <div>

                    <h2 className="text-xl font-bold">
                        Formations les plus rentables
                    </h2>

                    <p className="text-sm text-slate-500">
                        Classement des meilleures recettes
                    </p>

                </div>

            </div>

            <div className="space-y-4">

                {trainings.map((item, index) => (

                    <div
                        key={index}
                        className="flex items-center justify-between rounded-xl border p-4 hover:bg-slate-50"
                    >

                        <div>

                            <p className="font-semibold">

                                {item.name}

                            </p>

                            <p className="text-sm text-slate-500">

                                {item.students} étudiants

                            </p>

                        </div>

                        <div className="font-bold text-green-600">

                            {money(item.amount)}

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
}