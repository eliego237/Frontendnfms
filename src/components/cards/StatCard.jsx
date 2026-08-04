import React from "react";

export default function StatCard({
    title,
    value,
    icon: Icon,
    color = "bg-blue-600",
}) {
    return (
        <div className="rounded-xl bg-white p-5 shadow-md transition hover:shadow-lg">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm text-gray-500">
                        {title}
                    </p>

                    <h2 className="mt-2 text-3xl font-bold">
                        {value}
                    </h2>

                </div>

                <div
                    className={`${color} flex h-16 w-16 items-center justify-center rounded-xl text-white`}
                >

                    <Icon size={28} />

                </div>

            </div>

        </div>
    );
}