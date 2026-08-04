import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { getEnrollment } from "../../services/enrollmentService";

import EnrollmentDetailsHeader from "./components/EnrollmentDetailsHeader";
import EnrollmentStudentSummary from "./components/EnrollmentStudentSummary";
import EnrollmentTrainingSummary from "./components/EnrollmentTrainingSummary";
import EnrollmentFinanceSummary from "./components/EnrollmentFinanceSummary";
import EnrollmentProgressCard from "./components/EnrollmentProgressCard";
import EnrollmentModulesList from "./components/EnrollmentModulesList";
import EnrollmentPaymentsHistory from "./components/EnrollmentPaymentsHistory";
import EnrollmentQuickActions from "./components/EnrollmentQuickActions";

export default function EnrollmentDetailsPage() {

    const { id } = useParams();

    const [loading, setLoading] = useState(true);

    const [enrollment, setEnrollment] = useState(null);

    const loadEnrollment = useCallback(async () => {

        try {

            setLoading(true);

            const response = await getEnrollment(id);

            setEnrollment(response.data.data);

        }

        catch (error) {

            console.error(error);

            toast.error("Impossible de charger cette inscription.");

        }

        finally {

            setLoading(false);

        }

    }, [id]);

    useEffect(() => {

        loadEnrollment();

    }, [loadEnrollment]);

    if (loading) {

        return (

            <div className="flex justify-center py-24">

                <div className="text-slate-500 text-lg">

                    Chargement...

                </div>

            </div>

        );

    }

    if (!enrollment) {

        return (

            <div className="flex justify-center py-24">

                <div className="text-red-500 text-lg">

                    Inscription introuvable.

                </div>

            </div>

        );

    }

    return (

        <div className="space-y-8">

            <EnrollmentDetailsHeader
                enrollment={enrollment}
            />

            <section className="grid gap-6 xl:grid-cols-4">

                <EnrollmentStudentSummary
                    student={enrollment.student}
                />

                <EnrollmentTrainingSummary
                    training={enrollment.training}
                />

                <EnrollmentFinanceSummary
                    enrollment={enrollment}
                />

                <EnrollmentProgressCard
                    enrollment={enrollment}
                />

            </section>

            <EnrollmentModulesList
                training={enrollment.training}
            />

            <EnrollmentPaymentsHistory
                payments={enrollment.payments || []}
            />

            <EnrollmentQuickActions
                enrollment={enrollment}
                reload={loadEnrollment}
            />

        </div>

    );

}