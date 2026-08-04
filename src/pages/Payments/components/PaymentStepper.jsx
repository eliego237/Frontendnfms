import {
    CheckCircle2,
    CreditCard,
    GraduationCap,
    Wallet,
} from "lucide-react";

export default function PaymentStepper({

    step,

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

        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-6">

            <div className="flex justify-between items-center">

                {steps.map((item,index)=>{

                    const Icon=item.icon;

                    const active=step===item.id;

                    const completed=step>item.id;

                    return(

                        <div

                            key={item.id}

                            className="flex items-center flex-1"

                        >

                            <div className="flex flex-col items-center">

                                <div

                                    className={`

                                        flex

                                        h-14

                                        w-14

                                        items-center

                                        justify-center

                                        rounded-full

                                        transition

                                        ${completed

                                            ?"bg-green-600 text-white"

                                            :active

                                            ?"bg-blue-600 text-white"

                                            :"bg-slate-200 text-slate-500"}

                                    `}

                                >

                                    {completed ? (

                                        <CheckCircle2 size={24}/>

                                    ) : (

                                        <Icon size={24}/>

                                    )}

                                </div>

                                <span className="mt-3 font-semibold text-sm">

                                    {item.title}

                                </span>

                            </div>

                            {index<steps.length-1 && (

                                <div

                                    className={`

                                        h-1

                                        flex-1

                                        mx-4

                                        rounded

                                        ${completed

                                            ?"bg-green-500"

                                            :"bg-slate-200"}

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