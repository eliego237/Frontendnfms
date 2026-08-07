import {
    Search,
    FileSpreadsheet,
    FileText,
    Printer,
} from "lucide-react";

export default function FinancialTableToolbar({

    search,

    setSearch,

}) {

    return (

        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">

            <div className="relative w-full lg:w-96">

                <Search
                    size={18}
                    className="absolute left-3 top-3 text-slate-400"
                />

                <input
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                    placeholder="Rechercher..."
                    className="w-full rounded-xl border py-3 pl-10 pr-4"
                />

            </div>

            <div className="flex gap-3">

                <button className="btn-export">

                    <FileText size={18}/>

                    PDF

                </button>

                <button className="btn-export">

                    <FileSpreadsheet size={18}/>

                    Excel

                </button>

                <button className="btn-export">

                    <Printer size={18}/>

                    Imprimer

                </button>

            </div>

        </div>

    );

}