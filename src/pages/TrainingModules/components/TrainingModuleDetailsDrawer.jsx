import {
    X,
    Boxes,
    GraduationCap,
    Clock3,
    Hash,
    FileText,
    CheckCircle2,
    XCircle,
    Pencil,
    Trash2,
} from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";

export default function TrainingModuleDetailsDrawer({

    open,

    module,

    onClose,

    onEdit,

    onDelete,

}) {

    return (

        <AnimatePresence>

            {open && module && (

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

                        initial={{ x: 500 }}

                        animate={{ x: 0 }}

                        exit={{ x: 500 }}

                        transition={{ duration: .25 }}

                        className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-xl flex-col bg-white shadow-2xl"

                    >

                        {/* HEADER */}

                        <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 p-8 text-white">

                            <div className="flex items-start justify-between">

                                <div className="flex items-center gap-5">

                                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20">

                                        <Boxes size={32} />

                                    </div>

                                    <div>

                                        <h2 className="text-3xl font-bold">

                                            {module.title}

                                        </h2>

                                        <p className="mt-1 text-violet-100">

                                            {module.code}

                                        </p>

                                    </div>

                                </div>

                                <button

                                    onClick={onClose}

                                    className="rounded-xl p-2 transition hover:bg-white/20"

                                >

                                    <X size={24} />

                                </button>

                            </div>

                        </div>

                        {/* CONTENT */}

                        <div className="flex-1 space-y-8 overflow-y-auto p-8">

                            {/* Formation */}

                            <div className="rounded-2xl border border-slate-200 p-5">

                                <div className="mb-3 flex items-center gap-3">

                                    <GraduationCap className="text-blue-600" />

                                    <h3 className="font-bold">

                                        Formation

                                    </h3>

                                </div>

                                <p className="text-lg font-semibold">

                                    {module.training?.title}

                                </p>

                            </div>

                            {/* Infos */}

                            <div className="grid gap-5 md:grid-cols-2">

                                <div className="rounded-2xl border p-5">

                                    <div className="mb-2 flex items-center gap-2">

                                        <Hash
                                            size={18}
                                            className="text-indigo-600"
                                        />

                                        Position

                                    </div>

                                    <div className="text-3xl font-bold">

                                        {module.position}

                                    </div>

                                </div>

                                <div className="rounded-2xl border p-5">

                                    <div className="mb-2 flex items-center gap-2">

                                        <Clock3
                                            size={18}
                                            className="text-purple-600"
                                        />

                                        Durée

                                    </div>

                                    <div className="text-3xl font-bold">

                                        {module.duration_hours} h

                                    </div>

                                </div>

                            </div>

                            {/* Statut */}

                            <div className="rounded-2xl border border-slate-200 p-5">

                                <h3 className="mb-4 font-bold">

                                    Statut

                                </h3>

                                {module.is_active ? (

                                    <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-5 py-3 font-semibold text-green-700">

                                        <CheckCircle2 size={18} />

                                        Module actif

                                    </div>

                                ) : (

                                    <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-5 py-3 font-semibold text-red-700">

                                        <XCircle size={18} />

                                        Module inactif

                                    </div>

                                )}

                            </div>

                            {/* Description */}

                            <div className="rounded-2xl border border-slate-200 p-5">

                                <div className="mb-4 flex items-center gap-3">

                                    <FileText className="text-slate-600" />

                                    <h3 className="font-bold">

                                        Description

                                    </h3>

                                </div>

                                <p className="leading-7 text-slate-600">

                                    {module.description ||

                                        "Aucune description."}

                                </p>

                            </div>

                        </div>

                        {/* FOOTER */}

                        <div className="border-t border-slate-200 p-6">

                            <div className="flex gap-4">

                                <button

                                    onClick={() => onEdit(module)}

                                    className="flex-1 rounded-2xl bg-amber-500 px-5 py-4 font-semibold text-white transition hover:bg-amber-600"

                                >

                                    <span className="flex items-center justify-center gap-2">

                                        <Pencil size={18} />

                                        Modifier

                                    </span>

                                </button>

                                <button

                                    onClick={() => onDelete(module)}

                                    className="flex-1 rounded-2xl bg-red-600 px-5 py-4 font-semibold text-white transition hover:bg-red-700"

                                >

                                    <span className="flex items-center justify-center gap-2">

                                        <Trash2 size={18} />

                                        Supprimer

                                    </span>

                                </button>

                            </div>

                        </div>

                    </motion.div>

                </>

            )}

        </AnimatePresence>

    );

}