import {
    CheckCircle2,
    CreditCard,
    GraduationCap,
    Wallet,
} from "lucide-react";

export default function PaymentStepper({
    currentStep,
}) {
    const steps = [
        {
            id: 1,
            title: "Inscription",
            icon: GraduationCap,
        },
        {
            id: 2,
            title: "Vérification",
            icon: Wallet,
        },
        {
            id: 3,
            title: "Paiement",
            icon: CreditCard,
        },
    ];

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

                {steps.map((item, index) => {
                    const Icon = item.icon;

                    const active =
                        currentStep === item.id;

                    const completed =
                        currentStep > item.id;

                    return (
                        <div
                            key={item.id}
                            className="flex flex-1 items-center"
                        >

                            {/* ÉTAPE */}

                            <div className="flex min-w-[90px] flex-col items-center">

                                <div
                                    className={`
                                        flex
                                        h-14
                                        w-14
                                        items-center
                                        justify-center
                                        rounded-full
                                        transition-all
                                        duration-300
                                        ${
                                            completed
                                                ? "bg-green-600 text-white shadow-md"
                                                : active
                                                ? "bg-blue-600 text-white shadow-md"
                                                : "bg-slate-200 text-slate-500"
                                        }
                                    `}
                                >
                                    {completed ? (
                                        <CheckCircle2
                                            size={24}
                                        />
                                    ) : (
                                        <Icon
                                            size={24}
                                        />
                                    )}
                                </div>

                                <span
                                    className={`
                                        mt-3 text-sm font-semibold
                                        ${
                                            active
                                                ? "text-blue-700"
                                                : completed
                                                ? "text-green-700"
                                                : "text-slate-500"
                                        }
                                    `}
                                >
                                    {item.title}
                                </span>

                            </div>

                            {/* LIGNE */}

                            {index <
                                steps.length - 1 && (
                                <div
                                    className={`
                                        mx-4 h-1 flex-1 rounded-full
                                        transition-all
                                        duration-500
                                        ${
                                            currentStep >
                                            item.id
                                                ? "bg-green-500"
                                                : "bg-slate-200"
                                        }
                                    `}
                                />
                            )}

                        </div>
                    );
                })}

            </div>

        </div>
    );
}