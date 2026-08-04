import clsx from "clsx";

export default function FormInput({
    label,
    icon: Icon,
    error,
    className = "",
    ...props
}) {
    return (
        <div>

            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">

                {Icon && (
                    <Icon
                        size={16}
                        className="text-blue-600"
                    />
                )}

                {label}

            </label>

            <input
                {...props}
                className={clsx(
                    "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all",
                    "focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100",
                    error &&
                        "border-red-500 focus:ring-red-100",
                    className
                )}
            />

            {error && (
                <p className="mt-2 text-sm text-red-500">
                    {error}
                </p>
            )}

        </div>
    );
}