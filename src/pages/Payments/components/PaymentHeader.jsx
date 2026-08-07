import {
    CreditCard,
    Plus,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function PaymentHeader() {

    return (

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 p-8 text-white shadow-xl">

            {/* Effets lumineux */}

            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

            <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-purple-300/10 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                {/* =====================================================
                    CONTENU
                ====================================================== */}

                <div className="flex items-start gap-5">

                    {/* Icône */}

                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 backdrop-blur">

                        <CreditCard
                            size={32}
                        />

                    </div>

                    {/* Texte */}

                    <div>

                        <div className="mb-2 flex items-center gap-2">

                            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90 backdrop-blur">

                                Gestion financière

                            </span>

                        </div>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">

                            Gestion des paiements

                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/80 sm:text-base">

                            Consultez, recherchez, filtrez et gérez tous
                            les paiements enregistrés dans votre établissement.

                        </p>

                    </div>

                </div>

                {/* =====================================================
                    ACTION
                ====================================================== */}

                <Link
                    to="/payments/create"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 font-semibold text-blue-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-50"
                >

                    <Plus size={20} />

                    Nouveau paiement

                </Link>

            </div>

        </div>

    );

}