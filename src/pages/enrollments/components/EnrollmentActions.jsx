import { Save, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function EnrollmentActions({
    loading,
}) {

    return (

        <div className="flex justify-end gap-4">

            <Link
                to="/enrollments"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold hover:bg-slate-50"
            >
                <div className="flex items-center gap-2">
                    <X size={18} />
                    Annuler
                </div>
            </Link>

            <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
                <div className="flex items-center gap-2">

                    <Save size={18} />

                    {loading
                        ? "Enregistrement..."
                        : "Enregistrer l'inscription"}

                </div>

            </button>

        </div>

    );

}