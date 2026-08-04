import {
    Search,
    GraduationCap,
    CheckCircle,
} from "lucide-react";

export default function EnrollmentSelector({

    enrollments,

    search,

    setSearch,

    selectedEnrollment,

    onSelect,

}) {

    return (

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

            {/* Header */}

            <div className="mb-8 flex items-center gap-4">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">

                    <GraduationCap
                        className="text-blue-600"
                        size={30}
                    />

                </div>

                <div>

                    <h2 className="text-2xl font-bold">

                        Choisir une inscription

                    </h2>

                    <p className="text-slate-500">

                        Recherchez un étudiant par son nom, son matricule
                        ou sa formation.

                    </p>

                </div>

            </div>

            {/* Recherche */}

            <div className="relative mb-8">

                <Search
                    className="absolute left-4 top-4 text-slate-400"
                    size={18}
                />

                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Nom, matricule ou formation..."
                    className="w-full rounded-xl border border-slate-300 py-3 pl-12 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />

            </div>

            {/* Liste */}

            <div className="max-h-[500px] space-y-4 overflow-y-auto">

                {enrollments.length === 0 && (

                    <div className="rounded-xl bg-slate-50 py-10 text-center text-slate-500">

                        Aucune inscription trouvée.

                    </div>

                )}

                {enrollments.map((item) => {

                    const selected =
                        selectedEnrollment?.id === item.id;

                    return (

                        <button

                            key={item.id}

                            type="button"

                            onClick={() => onSelect(item)}

                            className={`

                                w-full

                                rounded-2xl

                                border

                                p-5

                                text-left

                                transition-all

                                duration-200

                                hover:border-blue-500

                                hover:bg-blue-50

                                ${selected
                                    ? "border-blue-600 bg-blue-50 shadow-sm"
                                    : "border-slate-200"}

                            `}

                        >

                            <div className="flex items-start justify-between">

                                <div>

                                    <h3 className="text-lg font-bold text-slate-800">

                                        {item.student?.full_name}

                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">

                                        Matricule :

                                        {" "}

                                        {item.student?.matricule}

                                    </p>

                                    <p className="mt-2 font-medium text-blue-700">

                                        {item.training?.title}

                                    </p>

                                </div>

                                {selected && (

                                    <CheckCircle
                                        size={28}
                                        className="text-blue-600"
                                    />

                                )}

                            </div>

                        </button>

                    );

                })}

            </div>

        </div>

    );

}