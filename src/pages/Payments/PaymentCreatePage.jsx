import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";
import Swal from "sweetalert2";

import api from "../../services/api";

import PaymentHeader from "./components/PaymentHeader";
import PaymentStepper from "./components/PaymentStepper";
import EnrollmentSelector from "./components/EnrollmentSelector";
import StudentSummary from "./components/StudentSummary";
import FinancialSummary from "./components/FinancialSummary";
import PaymentForm from "./components/PaymentForm";
import PaymentReceiptPreview from "./components/PaymentReceiptPreview";
import PaymentSuccessModal from "./components/PaymentSuccessModal";

export default function PaymentCreatePage() {

    const navigate = useNavigate();

    /* =====================================================
        STATES
    ===================================================== */

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [step, setStep] = useState(1);

    const [enrollments, setEnrollments] = useState([]);

    const [paymentMethods, setPaymentMethods] = useState([]);

    const [selectedEnrollment, setSelectedEnrollment] = useState(null);

    const [search, setSearch] = useState("");

    const [form, setForm] = useState({

        enrollment_id: "",

        amount: "",

        payment_method_id: "",

        payment_date: new Date()
            .toISOString()
            .substring(0, 10),

        reference: "",

        notes: "",

    });

    /* =====================================================
        LOAD INITIAL DATA
    ===================================================== */

    useEffect(() => {

        loadData();

    }, []);

    async function loadData() {

        try {

            setLoading(true);

            const [

                enrollmentsRes,

                methodsRes,

            ] = await Promise.all([

                api.get("/enrollments"),

                api.get("/payment-methods"),

            ]);

            const data = enrollmentsRes.data.data || [];

console.log("Nombre d'inscriptions :", data.length);
console.table(data);

setEnrollments(data);

            setPaymentMethods(

                methodsRes.data.data || []

            );

        }

        catch {

            toast.error(

                "Impossible de charger les données."

            );

        }

        finally {

            setLoading(false);

        }

    }

    /* =====================================================
        ENROLLMENT
    ===================================================== */

    function handleSelectEnrollment(enrollment) {

        setSelectedEnrollment(enrollment);

        setForm(prev => ({

            ...prev,

            enrollment_id: enrollment.id,

        }));

        setStep(2);

    }

    /* =====================================================
        FORM
    ===================================================== */

    function handleChange(e) {

        const {

            name,

            value,

        } = e.target;

        setForm(prev => ({

            ...prev,

            [name]: value,

        }));

    }

  /* =====================================================
    SAVE PAYMENT
===================================================== */

async function handleSubmit(e) {

    e.preventDefault();

    try {

        setSaving(true);

        const response = await api.post(
            "/payments",
            form
        );

        console.log("=== REPONSE COMPLETE API ===");
        console.log(response.data);

        // On récupère le paiement quel que soit le format renvoyé
        const payment =
            response.data.data?.payment ??
            response.data.data ??
            response.data.payment ??
            response.data;

        console.log("=== PAYMENT ===");
        console.log(payment);

        console.log("=== PAYMENT ID ===");
        console.log(payment?.id);

        if (!payment?.id) {

            toast.error("Le paiement a été créé mais son ID est introuvable.");

            return;

        }

        toast.success("Paiement enregistré avec succès.");

        navigate(`/payments/${payment.id}/receipt`);

    }

    catch (error) {

        console.error(error);

        Swal.fire({

            icon: "error",

            title: "Erreur",

            text:
                error.response?.data?.message ||
                "Impossible d'enregistrer le paiement.",

        });

    }

    finally {

        setSaving(false);

    }

}
    
    /* =====================================================
        LOADING
    ===================================================== */

    if (loading) {

        return (

            <div className="flex items-center justify-center py-24">

                <div className="text-center">

                    <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>

                    <p className="font-medium text-slate-600">

                        Chargement des données...

                    </p>

                </div>

            </div>

        );

    }

    /* =====================================================
        RENDER
    ===================================================== */

    return (

        <div className="space-y-8">

            <PaymentHeader />

            <PaymentStepper currentStep={step} />

            {step === 1 && (

                <EnrollmentSelector

                    enrollments={enrollments}

                    search={search}

                    setSearch={setSearch}

                    selectedEnrollment={selectedEnrollment}

                    onSelect={handleSelectEnrollment}

                />

            )}

            {step >= 2 && selectedEnrollment && (

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                    <StudentSummary

                        enrollment={selectedEnrollment}

                    />

                    <FinancialSummary

                        enrollment={selectedEnrollment}

                        onContinue={() => setStep(3)}

                    />

                </div>

            )}

            {step === 3 && selectedEnrollment && (

                <form

                    onSubmit={handleSubmit}

                    className="space-y-8"

                >

                    <PaymentForm

                        form={form}

                        handleChange={handleChange}

                        paymentMethods={paymentMethods}

                        enrollment={selectedEnrollment}

                        saving={saving}

                    />

                    <PaymentReceiptPreview

                        enrollment={selectedEnrollment}

                        form={form}

                        paymentMethods={paymentMethods}

                    />

                </form>

            )}

        </div>

    );

}