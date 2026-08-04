import {
    Printer,
    Download,
    Mail,
    ArrowLeft,
    Plus,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ReceiptActions({ payment }) {

    const navigate = useNavigate();

    function printReceipt() {

    if (!payment?.id) {
        return toast.error("Reçu introuvable.");
    }

    const printWindow = window.open(
        `http://127.0.0.1:8000/api/payments/${payment.id}/receipt`,
        "_blank"
    );

    if (!printWindow) {
        return toast.error("Impossible d'ouvrir la fenêtre d'impression.");
    }

    printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
    };

}

    function downloadPdf() {

    if (!payment?.id) {
        return toast.error("Reçu introuvable.");
    }

    window.open(
        `http://127.0.0.1:8000/api/payments/${payment.id}/receipt`,
        "_blank"
    );
}

    function sendReceipt() {

        toast(

            "L'envoi du reçu sera disponible prochainement.",

            {

                icon: "📨",

            }

        );

    }

    return (

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="mb-6 text-xl font-bold text-slate-800">

                Actions

            </h2>

            <div className="grid gap-4 md:grid-cols-2">

                <button

                    type="button"

                    onClick={printReceipt}

                    className="flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-5 py-4 font-semibold text-white transition hover:bg-blue-700"

                >

                    <Printer size={20} />

                    Imprimer

                </button>

                <button
    type="button"
    onClick={downloadPdf}
    className="flex items-center justify-center gap-3 rounded-2xl bg-gray-700 px-5 py-4 font-semibold text-white hover:bg-gray-800"
>
    <Download size={20}/>
    Télécharger PDF
</button>

                <button

                    type="button"

                    onClick={sendReceipt}

                    className="flex items-center justify-center gap-3 rounded-2xl border border-green-300 bg-green-50 px-5 py-4 font-semibold text-green-700 transition hover:bg-green-100"

                >

                    <Mail size={20} />

                    Envoyer

                </button>

                <button

                    type="button"

                    onClick={() => navigate("/payments")}

                    className="flex items-center justify-center gap-3 rounded-2xl border border-slate-300 bg-white px-5 py-4 font-semibold text-slate-700 transition hover:bg-slate-100"

                >

                    <ArrowLeft size={20} />

                    Retour aux paiements

                </button>

            </div>

            <button

                type="button"

                onClick={() => navigate("/payments/create")}

                className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-600 px-5 py-4 font-semibold text-white transition hover:bg-emerald-700"

            >

                <Plus size={20} />

                Enregistrer un nouveau paiement

            </button>

        </div>

    );

}