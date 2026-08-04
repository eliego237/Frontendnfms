import {
    Printer,
    Download,
    Mail,
    Pencil,
    Trash2,
    Copy,
    ArrowLeft,
} from "lucide-react";

import { Link } from "react-router-dom";

export default function PaymentActionsCard({

    payment,

    onPrint,

    onDownload,

    onDelete,

}) {

    return (

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">

            {/* Header */}

            <div className="border-b border-slate-200 p-6">

                <h2 className="text-xl font-bold">

                    Actions disponibles

                </h2>

                <p className="text-slate-500">

                    Gérez ce paiement

                </p>

            </div>

            <div className="grid gap-4 p-6">

                <button

                    onClick={onPrint}

                    className="flex items-center justify-center gap-3 rounded-2xl bg-green-600 px-5 py-4 font-semibold text-white transition hover:bg-green-700"

                >

                    <Printer size={20} />

                    Imprimer le reçu

                </button>

                <button

                    onClick={onDownload}

                    className="flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-5 py-4 font-semibold text-white transition hover:bg-blue-700"

                >

                    <Download size={20} />

                    Télécharger PDF

                </button>

                <button

                    className="flex items-center justify-center gap-3 rounded-2xl border border-slate-300 px-5 py-4 font-semibold transition hover:bg-slate-100"

                >

                    <Mail size={20} />

                    Envoyer par e-mail

                </button>

                <Link

                    to={`/payments/${payment?.id}/edit`}

                    className="flex items-center justify-center gap-3 rounded-2xl border border-orange-300 px-5 py-4 font-semibold text-orange-700 transition hover:bg-orange-50"

                >

                    <Pencil size={20} />

                    Modifier

                </Link>

                <button

                    className="flex items-center justify-center gap-3 rounded-2xl border border-indigo-300 px-5 py-4 font-semibold text-indigo-700 transition hover:bg-indigo-50"

                >

                    <Copy size={20} />

                    Dupliquer

                </button>

                <button

                    onClick={onDelete}

                    className="flex items-center justify-center gap-3 rounded-2xl border border-red-300 px-5 py-4 font-semibold text-red-700 transition hover:bg-red-50"

                >

                    <Trash2 size={20} />

                    Supprimer

                </button>

                <Link

                    to="/payments"

                    className="flex items-center justify-center gap-3 rounded-2xl bg-slate-100 px-5 py-4 font-semibold transition hover:bg-slate-200"

                >

                    <ArrowLeft size={20} />

                    Retour à la liste

                </Link>

            </div>

        </div>

    );

}