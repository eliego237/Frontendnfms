import {
    CheckCircle2,
    Plus,
    List,
} from "lucide-react";

import ReceiptSummary from "./ReceiptSummary";
import ReceiptActions from "./ReceiptActions";

export default function PaymentSuccessModal({

    open,

    payment,

    onNew,

    onClose,

}) {

    if (!open || !payment) return null;

    return (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6">

            <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">

                {/* Header */}

                <div className="bg-gradient-to-r from-green-600 to-emerald-500 px-8 py-8 text-center text-white">

                    <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/20">

                        <CheckCircle2 size={54} />

                    </div>

                    <h2 className="text-3xl font-bold">

                        Paiement enregistré

                    </h2>

                    <p className="mt-2 text-green-100">

                        Le paiement a été enregistré avec succès.

                    </p>

                </div>

                {/* Corps */}

                <div className="space-y-8 p-8">

                    <ReceiptSummary

                        payment={payment}

                    />

                    <ReceiptActions

                        payment={payment}

                    />

                </div>

                {/* Footer */}

                <div className="border-t border-slate-200 bg-slate-50 p-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <button

                            type="button"

                            onClick={onNew}

                            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"

                        >

                            <Plus size={18}/>

                            Nouveau paiement

                        </button>

                        <button

                            type="button"

                            onClick={onClose}

                            className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-3 font-semibold transition hover:bg-slate-100"

                        >

                            <List size={18}/>

                            Retour à la liste

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}