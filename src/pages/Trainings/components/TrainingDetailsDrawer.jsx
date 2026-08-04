import { AnimatePresence, motion } from "framer-motion";
import {
    X,
    BookOpen,
    Wallet,
    Clock3,
    Tag,
    CheckCircle2,
    XCircle,
    FileText,
    Pencil,
    Trash2,
} from "lucide-react";

export default function TrainingDetailsDrawer({
    open,
    training,
    onClose,
    onEdit,
    onDelete,
}) {
    return (
        <AnimatePresence>

            {open && training && (

                <>
                    {/* Overlay */}

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Drawer */}

                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{
                            type: "spring",
                            damping: 25,
                            stiffness: 220,
                        }}
                        className="fixed right-0 top-0 z-50 h-screen w-full max-w-xl overflow-y-auto bg-white shadow-2xl"
                    >

                        {/* HEADER */}

                        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">

                            <div className="flex items-start justify-between">

                                <div className="flex gap-4">

                                    <div className="rounded-3xl bg-white/20 p-4">

                                        <BookOpen size={34} />

                                    </div>

                                    <div>

                                        <h2 className="text-3xl font-bold">

                                            {training.title}

                                        </h2>

                                        <p className="mt-1 text-blue-100">

                                            {training.code}

                                        </p>

                                    </div>

                                </div>

                                <button
                                    onClick={onClose}
                                    className="rounded-xl p-2 hover:bg-white/20"
                                >
                                    <X />
                                </button>

                            </div>

                        </div>

                        {/* CONTENT */}

                        <div className="space-y-8 p-8">

                            <InfoCard
                                icon={Tag}
                                label="Catégorie"
                                value={training.category}
                            />

                            <InfoCard
                                icon={Clock3}
                                label="Durée"
                                value={`${training.duration_months} mois`}
                            />

                            <InfoCard
                                icon={Wallet}
                                label="Prix"
                                value={`${Number(
                                    training.price
                                ).toLocaleString()} FCFA`}
                            />

                            <InfoCard
                                icon={FileText}
                                label="Description"
                                value={
                                    training.description ||
                                    "Aucune description."
                                }
                            />

                            <div>

                                <h3 className="mb-4 font-bold text-slate-700">

                                    Statut

                                </h3>

                                {training.is_active ? (

                                    <span className="inline-flex items-center gap-2 rounded-full bg-green-100 px-5 py-3 font-semibold text-green-700">

                                        <CheckCircle2 size={18} />

                                        Formation active

                                    </span>

                                ) : (

                                    <span className="inline-flex items-center gap-2 rounded-full bg-red-100 px-5 py-3 font-semibold text-red-700">

                                        <XCircle size={18} />

                                        Formation inactive

                                    </span>

                                )}

                            </div>

                            {/* Modules */}

                            <div>

                                <h3 className="mb-4 text-lg font-bold">

                                    Modules

                                </h3>

                                <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-400">

                                    Les modules seront disponibles dans la
                                    prochaine étape.

                                </div>

                            </div>

                        </div>

                        {/* FOOTER */}

                        <div className="sticky bottom-0 flex gap-4 border-t bg-white p-6">

                            <button
                                onClick={() => onEdit(training)}
                                className="flex-1 rounded-2xl bg-amber-500 py-3 font-semibold text-white transition hover:bg-amber-600"
                            >
                                <div className="flex items-center justify-center gap-2">

                                    <Pencil size={18} />

                                    Modifier

                                </div>

                            </button>

                            <button
                                onClick={() => onDelete(training)}
                                className="flex-1 rounded-2xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700"
                            >
                                <div className="flex items-center justify-center gap-2">

                                    <Trash2 size={18} />

                                    Supprimer

                                </div>

                            </button>

                        </div>

                    </motion.div>

                </>

            )}

        </AnimatePresence>
    );
}

function InfoCard({
    icon: Icon,
    label,
    value,
}) {
    return (
        <div className="rounded-3xl border bg-slate-50 p-5">

            <div className="mb-3 flex items-center gap-3">

                <div className="rounded-xl bg-blue-100 p-2">

                    <Icon
                        size={18}
                        className="text-blue-600"
                    />

                </div>

                <span className="font-semibold text-slate-600">

                    {label}

                </span>

            </div>

            <p className="text-lg font-bold text-slate-800">

                {value}

            </p>

        </div>
    );
}