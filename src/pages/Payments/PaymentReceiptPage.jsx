import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../../services/api";

import PaymentHeader from "./components/PaymentHeader";
import ReceiptSummary from "./components/ReceiptSummary";
import StudentSummary from "./components/StudentSummary";
import PaymentFinanceCard from "./components/PaymentFinanceCard";
import PaymentInformationCard from "./components/PaymentInformationCard";
import ReceiptActions from "./components/ReceiptActions";

export default function PaymentReceiptPage() {

    const navigate = useNavigate();

    const { id } = useParams();

    const [payment, setPayment] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(false);

    useEffect(() => {

        if (!id) {

            setLoading(false);

            setError(true);

            return;

        }

        loadPayment();

    }, [id]);

    async function loadPayment() {

        try {

            setLoading(true);

            setError(false);

            const response = await api.get(`/payments/${id}`);

            console.log("=== PAYMENT ===");

            console.log(response.data);

            setPayment(response.data.data);

        }

        catch (error) {

            console.error(error);

            setError(true);

        }

        finally {

            setLoading(false);

        }

    }

    /* ==========================================
        LOADING
    ========================================== */

    if (loading) {

        return (

            <div className="flex min-h-screen items-center justify-center">

                <div className="text-center">

                    <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>

                    <h2 className="text-xl font-semibold text-slate-700">

                        Chargement du reçu...

                    </h2>

                    <p className="mt-2 text-slate-500">

                        Veuillez patienter quelques secondes.

                    </p>

                </div>

            </div>

        );

    }

    /* ==========================================
        ERROR
    ========================================== */

    if (error || !payment) {

        return (

            <div className="flex min-h-screen items-center justify-center">

                <div className="rounded-3xl border bg-white p-10 text-center shadow-lg">

                    <h2 className="mb-3 text-2xl font-bold text-red-600">

                        Paiement introuvable

                    </h2>

                    <p className="mb-8 text-slate-500">

                        Impossible de récupérer les informations du reçu.

                    </p>

                    <button

                        onClick={() => navigate("/payments")}

                        className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"

                    >

                        Retour aux paiements

                    </button>

                </div>

            </div>

        );

    }

    /* ==========================================
        PAGE
    ========================================== */

    return (

        <div className="mx-auto max-w-6xl space-y-8 p-6">

            <PaymentHeader />

            <ReceiptSummary payment={payment} />

            <StudentSummary

                enrollment={payment.enrollment}

            />

            <PaymentFinanceCard

                payment={payment}

            />

            <PaymentInformationCard

                payment={payment}

            />

            <ReceiptActions

                payment={payment}

            />

        </div>

    );

}