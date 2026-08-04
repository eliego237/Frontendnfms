import { CreditCard, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function PaymentHeader() {
    return (
        <div className="flex items-center justify-between">

            <div className="flex items-center gap-5">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">

                    <CreditCard
                        className="text-blue-600"
                        size={34}
                    />

                </div>

                <div>

                    <h1 className="text-4xl font-bold">

                        Nouveau paiement

                    </h1>

                    <p className="text-slate-500 mt-1">

                        Encaissement d'un étudiant

                    </p>

                </div>

            </div>

            <Link
                to="/payments"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold hover:bg-slate-50"
            >

                <ArrowLeft size={18} />

                Retour

            </Link>

        </div>
    );
}