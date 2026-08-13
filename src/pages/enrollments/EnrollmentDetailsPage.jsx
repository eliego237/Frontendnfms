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


    /*
    |--------------------------------------------------------------------------
    | Chargement de l'inscription
    |--------------------------------------------------------------------------
    */

    const loadEnrollment = useCallback(async () => {

        try {

            setLoading(true);

            const response = await getEnrollment(id);

            console.log(
                "📚 INSCRIPTION CHARGÉE :",
                response.data.data
            );

            console.log(
                "📖 MODULES DE LA FORMATION :",
                response.data.data?.training?.modules
            );

            setEnrollment(response.data.data);

        } catch (error) {

            console.error(
                "❌ Erreur chargement inscription :",
                error
            );

            toast.error(
                "Impossible de charger cette inscription."
            );

        } finally {

            setLoading(false);

        }

    }, [id]);


    /*
    |--------------------------------------------------------------------------
    | Chargement initial
    |--------------------------------------------------------------------------
    */

    useEffect(() => {

        loadEnrollment();

    }, [loadEnrollment]);


    /*
    |--------------------------------------------------------------------------
    | Chargement
    |--------------------------------------------------------------------------
    */

    if (loading) {

        return (

            <div className="flex justify-center py-24">

                <div className="text-lg text-slate-500">

                    Chargement...

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Inscription introuvable
    |--------------------------------------------------------------------------
    */

    if (!enrollment) {

        return (

            <div className="flex justify-center py-24">

                <div className="text-lg text-red-500">

                    Inscription introuvable.

                </div>

            </div>

        );

    }


    /*
    |--------------------------------------------------------------------------
    | Données sécurisées
    |--------------------------------------------------------------------------
    */

    const training = enrollment.training ?? {};

    const modules = training.modules ?? [];

    const payments = enrollment.payments ?? [];


    /*
    |--------------------------------------------------------------------------
    | Affichage
    |--------------------------------------------------------------------------
    */

    return (

        <div className="space-y-8">

            {/* =========================================================
                EN-TÊTE
            ========================================================= */}

            <EnrollmentDetailsHeader
                enrollment={enrollment}
            />


            {/* =========================================================
                INFORMATIONS PRINCIPALES
            ========================================================= */}

            <section className="grid gap-6 xl:grid-cols-4">

                <EnrollmentStudentSummary
                    student={enrollment.student}
                />

                <EnrollmentTrainingSummary
                    training={training}
                />

                <EnrollmentFinanceSummary
                    enrollment={enrollment}
                />

                <EnrollmentProgressCard
                    enrollment={enrollment}
                />

            </section>


            {/* =========================================================
                MODULES DE LA FORMATION
            ========================================================= */}

            <EnrollmentModulesList
                training={training}
            />


            {/* =========================================================
                HISTORIQUE DES PAIEMENTS
            ========================================================= */}

            <EnrollmentPaymentsHistory
                payments={payments}
            />


            {/* =========================================================
                ACTIONS RAPIDES
            ========================================================= */}

            <EnrollmentQuickActions
                enrollment={enrollment}
                reload={loadEnrollment}
            />

        </div>

    );

}