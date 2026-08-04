import clsx from "clsx";

export default function FormTextarea({
    label,
    error,
    maxLength = 500,
    value = "",
    className = "",
    ...props
}) {
    return (
        <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
                {label}
            </label>

            <textarea
                {...props}
                value={value}
                className={clsx(
                    "w-full rounded-2xl border bg-slate-50 px-4 py-3 outline-none transition-all",
                    "focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100",
                    error
                        ? "border-red-400"
                        : "border-slate-200",
                    className
                )}
            />

            <div className="mt-2 flex justify-between">

                {error ? (
                    <p className="text-sm text-red-500">
                        {error}
                    </p>
                ) : (
                    <span />
                )}

                <p className="text-xs text-slate-400">
                    {value.length}/{maxLength}
                </p>

            </div>

        </div>
    );
}