import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

export default function FinancialPagination({

    page,

    lastPage,

    onChange,

}) {

    return (

        <div className="flex items-center justify-between border-t p-6">

            <button
                disabled={page <= 1}
                onClick={() => onChange(page - 1)}
                className="rounded-lg border px-4 py-2 disabled:opacity-40"
            >

                <ChevronLeft size={18} />

            </button>

            <span className="font-medium">

                Page {page} / {lastPage}

            </span>

            <button
                disabled={page >= lastPage}
                onClick={() => onChange(page + 1)}
                className="rounded-lg border px-4 py-2 disabled:opacity-40"
            >

                <ChevronRight size={18} />

            </button>

        </div>

    );

}