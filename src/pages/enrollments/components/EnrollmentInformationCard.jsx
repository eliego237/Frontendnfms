import {
    Calendar,
    CalendarDays,
    FileText,
} from "lucide-react";

export default function EnrollmentInformationCard({
    enrolledAt,
    setEnrolledAt,
    academicYear,
    setAcademicYear,
    notes,
    setNotes,
}) {

    return (

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="mb-6 flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100">

                    <Calendar
                        size={24}
                        className="text-orange-600"
                    />

                </div>

                <div>

                    <h2 className="text-xl font-bold">

                        Informations complémentaires

                    </h2>

                    <p className="text-sm text-slate-500">

                        Informations générales concernant l'inscription

                    </p>

                </div>

            </div>

            <div className="grid gap-6 md:grid-cols-2">

                <div>

                    <label className="mb-2 flex items-center gap-2 font-semibold">

                        <Calendar size={18} />

                        Date d'inscription

                    </label>

                    <input
                        type="date"
                        value={enrolledAt}
                        onChange={(e) => setEnrolledAt(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                    />

                </div>

                <div>

                    <label className="mb-2 flex items-center gap-2 font-semibold">

                        <CalendarDays size={18} />

                        Année académique

                    </label>

                    <input
                        type="text"
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        placeholder="2026-2027"
                        className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                    />

                </div>

            </div>

            <div className="mt-6">

                <label className="mb-2 flex items-center gap-2 font-semibold">

                    <FileText size={18} />

                    Observations

                </label>

                <textarea
                    rows={5}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Observations éventuelles..."
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                />

            </div>

        </div>

    );

}