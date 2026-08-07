import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

const COLORS = [
    "#2563EB",
    "#7C3AED",
    "#10B981",
    "#F59E0B",
    "#EF4444",
];

export default function FinancialCharts({

    monthlyData,

    revenueSources,

}) {

    return (

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

            {/* Graphique Evolution */}

            <div className="xl:col-span-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                <h2 className="text-xl font-bold text-slate-800">

                    Evolution financière

                </h2>

                <p className="mb-6 text-sm text-slate-500">

                    Recettes et dépenses mensuelles

                </p>

                <div className="h-96">

                    <ResponsiveContainer>

                        <LineChart data={monthlyData}>

                            <CartesianGrid strokeDasharray="4 4"/>

                            <XAxis dataKey="month"/>

                            <YAxis/>

                            <Tooltip/>

                            <Line
                                type="monotone"
                                dataKey="income"
                                stroke="#2563EB"
                                strokeWidth={3}
                            />

                            <Line
                                type="monotone"
                                dataKey="expense"
                                stroke="#EF4444"
                                strokeWidth={3}
                            />

                        </LineChart>

                    </ResponsiveContainer>

                </div>

            </div>

            {/* Pie */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                <h2 className="text-xl font-bold">

                    Répartition des recettes

                </h2>

                <p className="mb-6 text-sm text-slate-500">

                    Sources de revenus

                </p>

                <div className="h-96">

                    <ResponsiveContainer>

                        <PieChart>

                            <Pie
                                data={revenueSources}
                                dataKey="value"
                                nameKey="name"
                                outerRadius={100}
                                label
                            >

                                {

                                    revenueSources.map(

                                        (entry,index)=>(

                                            <Cell

                                                key={index}

                                                fill={COLORS[index%COLORS.length]}

                                            />

                                        )

                                    )

                                }

                            </Pie>

                            <Tooltip/>

                            <Legend/>

                        </PieChart>

                    </ResponsiveContainer>

                </div>

            </div>

        </div>

    );

}