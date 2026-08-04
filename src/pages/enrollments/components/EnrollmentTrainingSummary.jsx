import {
    BookOpen,
    Clock3,
    GraduationCap,
    BadgeCheck,
} from "lucide-react";

export default function EnrollmentTrainingSummary({ training }) {

    if (!training) {

        return (

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                <p className="text-slate-500">

                    Aucune formation sélectionnée.

                </p>

            </div>

        );

    }

    return (

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100">

                    <GraduationCap
                        className="text-indigo-600"
                        size={28}
                    />

                </div>

                <div>

                    <h2 className="text-xl font-bold text-slate-800">

                        Formation

                    </h2>

                    <p className="text-sm text-slate-500">

                        Informations générales

                    </p>

                </div>

            </div>

            <div className="space-y-5">

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                        <BookOpen
                            size={18}
                            className="text-slate-500"
                        />

                        <span className="text-slate-600">

                            Intitulé

                        </span>

                    </div>

                    <span className="font-semibold text-slate-800">

                        {training.title}

                    </span>

                </div>

                <div className="flex items-center justify-between">

                    <span className="text-slate-600">

                        Code

                    </span>

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">

                        {training.code}

                    </span>

                </div>

                <div className="flex items-center justify-between">

                    <span className="text-slate-600">

                        Catégorie

                    </span>

                    <span>

                        {training.category}

                    </span>

                </div>

                <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">

                        <Clock3
                            size={18}
                            className="text-purple-500"
                        />

                        <span>

                            Durée

                        </span>

                    </div>

                    <span className="font-semibold">

                        {training.duration_months} mois

                    </span>

                </div>

                <div className="flex items-center justify-between">

                    <span>

                        Prix

                    </span>

                    <span className="rounded-xl bg-green-100 px-3 py-1 font-bold text-green-700">

                        {Number(training.price).toLocaleString()} FCFA

                    </span>

                </div>

                <div className="border-t pt-5">

                    <div className="flex items-start gap-3">

                        <BadgeCheck
                            size={20}
                            className="mt-1 text-amber-500"
                        />

                        <div>

                            <p className="text-sm text-slate-500">

                                Certificat

                            </p>

                            <p className="font-medium text-slate-700">

                                {training.certificate}

                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}