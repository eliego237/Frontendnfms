import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

export default function Modal({
    open,
    onClose,
    title,
    subtitle,
    icon: Icon,
    children,
    maxWidth = "max-w-5xl",
}) {

    useEffect(() => {

        const handler = (e) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handler);

        return () => window.removeEventListener("keydown", handler);

    }, [onClose]);

    return (

        <Transition appear show={open} as={Fragment}>

            <Dialog
                as="div"
                className="relative z-50"
                onClose={onClose}
            >

                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >

                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm"/>

                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto p-4">

                    <div className="flex min-h-full items-center justify-center">

                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >

                            <Dialog.Panel className={`w-full ${maxWidth}`}>

                                <motion.div
                                    initial={{ opacity:0, y:20 }}
                                    animate={{ opacity:1, y:0 }}
                                    className="overflow-hidden rounded-3xl bg-white shadow-2xl"
                                >

                                    <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">

                                        <div className="flex items-center justify-between">

                                            <div className="flex items-center gap-5">

                                                {Icon && (

                                                    <div className="rounded-2xl bg-white/15 p-4">

                                                        <Icon size={34}/>

                                                    </div>

                                                )}

                                                <div>

                                                    <h2 className="text-3xl font-bold">

                                                        {title}

                                                    </h2>

                                                    <p className="mt-1 text-blue-100">

                                                        {subtitle}

                                                    </p>

                                                </div>

                                            </div>

                                            <button
                                                onClick={onClose}
                                                className="rounded-xl p-2 transition hover:bg-white/20"
                                            >
                                                <X/>
                                            </button>

                                        </div>

                                    </div>

                                    {children}

                                </motion.div>

                            </Dialog.Panel>

                        </Transition.Child>

                    </div>

                </div>

            </Dialog>

        </Transition>

    );

}