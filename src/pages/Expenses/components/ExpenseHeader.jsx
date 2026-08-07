import { Link } from "react-router-dom";
import {
    ArrowLeft,
    Plus,
    ReceiptText,
} from "lucide-react";

export default function ExpenseHeader() {

    return (

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-fuchsia-600 p-8 text-white shadow-xl">

            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                <div className="flex items-start gap-5">

                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur">

                        <ReceiptText
                            size={32}
                        />

                    </div>

                    <div>

                        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-100">

                            <span>
                                Gestion financière
                            </span>

                            <span className="h-1 w-1 rounded-full bg-blue-200" />

                            <span>
                                Dépenses
                            </span>

                        </div>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">

                            Gestion des dépenses

                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/85 sm:text-base">

                            Enregistrez, suivez et contrôlez les sorties
                            de caisse de votre centre de formation.

                        </p>

                    </div>

                </div>

                <div className="flex flex-wrap gap-3">

                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 font-semibold text-white backdrop-blur transition hover:bg-white/20"
                    >

                        <ArrowLeft size={18} />

                        Retour

                    </Link>

                    <Link
                        to="/expenses/create"
                        className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100"
                    >

                        <Plus size={19} />

                        Nouvelle dépense

                    </Link>

                </div>

            </div>

        </div>

    );

}