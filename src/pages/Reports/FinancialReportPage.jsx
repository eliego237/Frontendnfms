import { useCallback, useEffect, useState } from "react";

import api from "../../services/api";

import FinancialHeader from "./components/FinancialHeader";
import FinancialFilters from "./components/FinancialFilters";
import FinancialStats from "./components/FinancialStats";
import FinancialCharts from "./components/FinancialCharts";
import FinancialTable from "./components/FinancialTable";
import FinancialAnalysis from "./components/FinancialAnalysis";

export default function FinancialReportPage() {

    /*
    |--------------------------------------------------------------------------
    | Etats
    |--------------------------------------------------------------------------
    */

    const [loading, setLoading] = useState(false);

    const [dateFrom, setDateFrom] = useState("");

    const [dateTo, setDateTo] = useState("");

    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);

    const [lastPage, setLastPage] = useState(1);

    /*
    |--------------------------------------------------------------------------
    | Statistiques
    |--------------------------------------------------------------------------
    */

    const [stats, setStats] = useState({

        totalIncome: 0,

        totalExpense: 0,

        balance: 0,

        netIncome: 0,

        paymentCount: 0,

        expenseCount: 0,

        averagePayment: 0,

        averageExpense: 0,

        recoveryRate: 0,

    });

    /*
    |--------------------------------------------------------------------------
    | Données graphiques
    |--------------------------------------------------------------------------
    */

    const [monthlyData, setMonthlyData] = useState([]);

    const [revenueSources, setRevenueSources] = useState([]);

    /*
    |--------------------------------------------------------------------------
    | Tableau financier
    |--------------------------------------------------------------------------
    */

    const [transactions, setTransactions] = useState([]);

    /*
    |--------------------------------------------------------------------------
    | Analyse
    |--------------------------------------------------------------------------
    */

    const [topTrainings, setTopTrainings] = useState([]);

    const [recentPayments, setRecentPayments] = useState([]);

    /*
    |--------------------------------------------------------------------------
    | Chargement Dashboard
    |--------------------------------------------------------------------------
    */

    const loadFinancialDashboard = useCallback(async () => {

        try {

            setLoading(true);

            const params = {
                page,
            };

            if (dateFrom) {
                params.start_date = dateFrom;
            }

            if (dateTo) {
                params.end_date = dateTo;
            }

            const { data } = await api.get(
    "/reports/financial-summary",
    {
        params,
    }
);

            const report = data.data;

            /*
            |--------------------------------------------------------------------------
            | Statistiques
            |--------------------------------------------------------------------------
            */

            setStats({

                totalIncome: Number(
                    report.total_income ?? 0
                ),

                totalExpense: Number(
                    report.total_expense ?? 0
                ),

                balance: Number(
                    report.balance ?? 0
                ),

                netIncome: Number(
                    report.net_income ?? 0
                ),

                paymentCount: Number(
                    report.payment_count ?? 0
                ),

                expenseCount: Number(
                    report.expense_count ?? 0
                ),

                averagePayment: Number(
                    report.average_payment ?? 0
                ),

                averageExpense: Number(
                    report.average_expense ?? 0
                ),

                recoveryRate: Number(
                    report.recovery_rate ?? 0
                ),

            });

            /*
            |--------------------------------------------------------------------------
            | Graphiques
            |--------------------------------------------------------------------------
            */

            setMonthlyData(
                report.monthly ?? []
            );

            setRevenueSources(
                report.revenue_sources ?? []
            );

            /*
            |--------------------------------------------------------------------------
            | Tableau
            |--------------------------------------------------------------------------
            */

            setTransactions(
                report.transactions ?? []
            );

            setLastPage(
                Number(report.last_page ?? 1)
            );

            /*
            |--------------------------------------------------------------------------
            | Analyse
            |--------------------------------------------------------------------------
            */

            setTopTrainings(
                report.top_trainings ?? []
            );

            setRecentPayments(
                report.recent_payments ?? []
            );

        } catch (error) {

            console.error(
                "Erreur lors du chargement du rapport financier :",
                error
            );

        } finally {

            setLoading(false);

        }

    }, [
        dateFrom,
        dateTo,
        page,
    ]);

        /*
    |--------------------------------------------------------------------------
    | Initialisation
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadFinancialDashboard();

    }, [
        loadFinancialDashboard,
    ]);

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="flex min-h-[60vh] items-center justify-center">

                <div className="text-center">

                    <div
                        className="
                            mx-auto
                            h-12
                            w-12
                            animate-spin
                            rounded-full
                            border-4
                            border-slate-200
                            border-t-blue-600
                        "
                    />

                    <p className="mt-4 text-slate-600">

                        Chargement du rapport financier...

                    </p>

                </div>

            </div>

        );

    }

    /*
    |--------------------------------------------------------------------------
    | Render
    |--------------------------------------------------------------------------
    */

    return (

        <div className="space-y-8">

            {/* Header */}

            <FinancialHeader
                onRefresh={loadFinancialDashboard}
            />

            {/* Filtres */}

            <FinancialFilters

                dateFrom={dateFrom}

                dateTo={dateTo}

                onDateFromChange={setDateFrom}

                onDateToChange={setDateTo}

                onFilter={loadFinancialDashboard}

            />

            {/* Cartes */}

            <FinancialStats
                stats={stats}
            />

            {/* Graphiques */}

            <FinancialCharts

                monthlyData={monthlyData}

                revenueSources={revenueSources}

            />

            {/* Tableau */}

            <FinancialTable

                transactions={transactions}

                search={search}

                setSearch={setSearch}

                page={page}

                lastPage={lastPage}

                setPage={setPage}

            />

            {/* Analyse */}

            <FinancialAnalysis

                stats={stats}

                topTrainings={topTrainings}

                recentPayments={recentPayments}

            />

        </div>

    );

}