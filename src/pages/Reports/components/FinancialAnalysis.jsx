import TopTrainings from "./TopTrainings";
import RecentPayments from "./RecentPayments";
import FinancialIndicators from "./FinancialIndicators";
import FinancialSummary from "./FinancialSummary";

export default function FinancialAnalysis({

    stats,

    topTrainings,

    recentPayments,

}) {

    return (

        <div className="space-y-6">

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

                <TopTrainings
                    trainings={topTrainings}
                />

                <RecentPayments
                    payments={recentPayments}
                />

            </div>

            <FinancialIndicators
                stats={stats}
            />

            <FinancialSummary
                stats={stats}
            />

        </div>

    );

}