import clsx from "clsx";

export default function Button({

    children,

    loading,

    variant="primary",

    className="",

    ...props

}){

    return(

        <button

            {...props}

            className={clsx(

                "rounded-2xl px-6 py-3 font-semibold transition-all duration-300",

                "hover:scale-105",

                variant==="primary"

                    &&

                "bg-blue-600 text-white hover:bg-blue-700",

                variant==="secondary"

                    &&

                "border bg-white hover:bg-slate-100",

                loading && "opacity-50",

                className

            )}

        >

            {children}

        </button>

    )

}