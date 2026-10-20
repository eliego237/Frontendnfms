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

export default function PaymentCreatePage() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [step, setStep] = useState(1);

    const [enrollments, setEnrollments] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);

    const [selectedEnrollments, setSelectedEnrollments] =
        useState([]);

    const [search, setSearch] = useState("");

    const [form, setForm] = useState({
        enrollment_id: "",
        payment_type: "training",
        amount: "",
        payment_method_id: "",
        payment_date: new Date()
            .toISOString()
            .substring(0, 10),
        reference: "",
        notes: "",
    });

    /*
    |--------------------------------------------------------------------------
    | CHARGEMENT
    |--------------------------------------------------------------------------
    */

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

            const enrollmentData =
                enrollmentsRes.data.data || [];

            const methodData =
                methodsRes.data.data || [];

            console.log(
                "Nombre d'inscriptions :",
                enrollmentData.length
            );

            console.table(enrollmentData);

            setEnrollments(enrollmentData);
            setPaymentMethods(methodData);
        } catch (error) {
            console.error(
                "Erreur chargement paiements :",
                error
            );

            toast.error(
                "Impossible de charger les données."
            );
        } finally {
            setLoading(false);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | INSCRIPTION SÉLECTIONNÉE
    |--------------------------------------------------------------------------
    */

    const selectedEnrollment =
        selectedEnrollments.length > 0
            ? selectedEnrollments[0]
            : null;

    /*
    |--------------------------------------------------------------------------
    | CALCULS FINANCIERS
    |--------------------------------------------------------------------------
    |
    | RÈGLE IMPORTANTE :
    |
    | INSCRIPTION
    | = registration_fee
    |
    | FORMATIONS
    | = somme des formations - remise
    |
    | Le paiement de l'inscription ne doit JAMAIS être
    | déduit du solde des formations.
    |
    */

    function getFinancialData(enrollment) {
        if (!enrollment) {
            return {
                registrationFee: 0,
                registrationPaid: 0,
                registrationBalance: 0,

                trainingTotal: 0,
                trainingDiscount: 0,
                trainingNetTotal: 0,
                trainingPaid: 0,
                trainingBalance: 0,

                total: 0,
                paid: 0,
                balance: 0,
            };
        }

        /*
        |--------------------------------------------------------------------------
        | FRAIS D'INSCRIPTION
        |--------------------------------------------------------------------------
        */

        const registrationFee = Number(
            enrollment.registration_total ??
                enrollment.registration_fee ??
                0
        );

        /*
        |--------------------------------------------------------------------------
        | MONTANT GLOBAL DÉJÀ PAYÉ
        |--------------------------------------------------------------------------
        |
        | On l'utilise comme valeur de secours si l'API ne fournit
        | pas registration_paid / training_paid.
        |
        */

        const globalPaidFromApi = Number(
            enrollment.total_paid ??
                enrollment.amount_paid ??
                0
        );

        /*
        |--------------------------------------------------------------------------
        | INSCRIPTION PAYÉE
        |--------------------------------------------------------------------------
        |
        | Priorité :
        | 1. registration_paid fourni par l'API
        | 2. Sinon, on considère que les premiers paiements couvrent
        |    les frais d'inscription.
        |
        */

        const registrationPaid =
            enrollment.registration_paid !==
            undefined &&
            enrollment.registration_paid !== null
                ? Number(
                      enrollment.registration_paid
                  )
                : Math.min(
                      globalPaidFromApi,
                      registrationFee
                  );

        const registrationBalance =
            Math.max(
                registrationFee -
                    registrationPaid,
                0
            );

        /*
        |--------------------------------------------------------------------------
        | FORMATIONS
        |--------------------------------------------------------------------------
        */

        const trainings = Array.isArray(
            enrollment.trainings
        )
            ? enrollment.trainings
            : [];

        const trainingTotal = Number(
            enrollment.training_total ??
                trainings.reduce(
                    (sum, training) => {
                        return (
                            sum +
                            Number(
                                training?.pivot
                                    ?.training_fee ??
                                    training?.price ??
                                    0
                            )
                        );
                    },
                    0
                )
        );

        /*
        |--------------------------------------------------------------------------
        | REMISE UNIQUEMENT SUR LES FORMATIONS
        |--------------------------------------------------------------------------
        */

        const trainingDiscount =
            Math.min(
                trainingTotal,
                Math.max(
                    0,
                    Number(
                        enrollment.training_discount ??
                            enrollment.discount ??
                            0
                    )
                )
            );

        const trainingNetTotal =
            Math.max(
                trainingTotal -
                    trainingDiscount,
                0
            );

        /*
        |--------------------------------------------------------------------------
        | FORMATIONS DÉJÀ PAYÉES
        |--------------------------------------------------------------------------
        |
        | Priorité :
        | 1. training_paid fourni par l'API
        | 2. Sinon :
        |    paiement global - paiement inscription
        |
        | Ainsi, si :
        |
        | inscription = 16 500
        | amount_paid = 16 500
        |
        | alors :
        |
        | registrationPaid = 16 500
        | trainingPaid = 0
        |
        | et le solde formation reste 350 000.
        |
        */

        const trainingPaid =
            enrollment.training_paid !==
                undefined &&
            enrollment.training_paid !== null
                ? Number(
                      enrollment.training_paid
                  )
                : Math.max(
                      globalPaidFromApi -
                          registrationPaid,
                      0
                  );

        /*
        |--------------------------------------------------------------------------
        | SOLDE FORMATIONS
        |--------------------------------------------------------------------------
        |
        | IMPORTANT :
        | On NE FAIT PLUS :
        |
        | globalBalance - registrationBalance
        |
        | Le calcul est directement basé sur :
        |
        | formations nettes - paiements formations
        |
        */

        const trainingBalance =
            Math.max(
                trainingNetTotal -
                    trainingPaid,
                0
            );

        /*
        |--------------------------------------------------------------------------
        | TOTAL GLOBAL
        |--------------------------------------------------------------------------
        */

        const total =
            Number(
                enrollment.net_total ??
                    enrollment.total_amount ??
                    registrationFee +
                        trainingNetTotal
            );

        /*
        |--------------------------------------------------------------------------
        | TOTAL PAYÉ
        |--------------------------------------------------------------------------
        */

        const paid =
            globalPaidFromApi ||
            registrationPaid +
                trainingPaid;

        /*
        |--------------------------------------------------------------------------
        | SOLDE GLOBAL
        |--------------------------------------------------------------------------
        |
        | On recalcule toujours le solde global afin d'éviter
        | les anciennes valeurs éventuellement présentes dans
        | enrollment.balance.
        |
        */

        const balance =
            Math.max(
                total - paid,
                0
            );

        const financialData = {
            registrationFee,
            registrationPaid,
            registrationBalance,

            trainingTotal,
            trainingDiscount,
            trainingNetTotal,
            trainingPaid,
            trainingBalance,

            total,
            paid,
            balance,
        };

        console.log(
            "=== CALCUL FINANCIER ==="
        );

        console.log(
            "Frais inscription :",
            registrationFee
        );

        console.log(
            "Inscription payée :",
            registrationPaid
        );

        console.log(
            "Solde inscription :",
            registrationBalance
        );

        console.log(
            "Total formations :",
            trainingTotal
        );

        console.log(
            "Remise formations :",
            trainingDiscount
        );

        console.log(
            "Net formations :",
            trainingNetTotal
        );

        console.log(
            "Formations payées :",
            trainingPaid
        );

        console.log(
            "Solde formations :",
            trainingBalance
        );

        console.log(
            "Total global :",
            total
        );

        console.log(
            "Total payé :",
            paid
        );

        console.log(
            "Solde global :",
            balance
        );

        return financialData;
    }

    const financial = getFinancialData(
        selectedEnrollment
    );

    /*
    |--------------------------------------------------------------------------
    | SOLDE UTILISÉ PAR LE FORMULAIRE
    |--------------------------------------------------------------------------
    */

    const totalBalance =
        form.payment_type ===
        "registration"
            ? financial.registrationBalance
            : financial.trainingBalance;

    /*
    |--------------------------------------------------------------------------
    | SÉLECTION D'UNE INSCRIPTION
    |--------------------------------------------------------------------------
    */

    function handleToggleEnrollment(
        enrollment
    ) {
        if (!enrollment) {
            setSelectedEnrollments([]);

            setForm((prev) => ({
                ...prev,
                enrollment_id: "",
                amount: "",
            }));

            setStep(1);

            return;
        }

        const alreadySelected =
            selectedEnrollments.some(
                (item) =>
                    Number(item.id) ===
                    Number(enrollment.id)
            );

        if (alreadySelected) {
            setSelectedEnrollments([]);

            setForm((prev) => ({
                ...prev,
                enrollment_id: "",
                amount: "",
            }));

            setStep(1);

            return;
        }

        setSelectedEnrollments([
            enrollment,
        ]);

        setForm((prev) => ({
            ...prev,
            enrollment_id: enrollment.id,
            amount: "",
            payment_type: "training",
        }));

        setStep(1);
    }

    /*
    |--------------------------------------------------------------------------
    | PASSER À L'ÉTAPE 2
    |--------------------------------------------------------------------------
    */

    function handleContinue() {
        if (
            selectedEnrollments.length ===
            0
        ) {
            toast.error(
                "Sélectionnez une inscription."
            );

            return;
        }

        const enrollment =
            selectedEnrollments[0];

        setForm((prev) => ({
            ...prev,
            enrollment_id:
                enrollment.id,
        }));

        setStep(2);
    }

    /*
    |--------------------------------------------------------------------------
    | MODIFICATION DU FORMULAIRE
    |--------------------------------------------------------------------------
    */

    function handleChange(e) {
        const {
            name,
            value,
        } = e.target;

        setForm((prev) => {
            const next = {
                ...prev,
                [name]: value,
            };

            if (
                name ===
                "payment_type"
            ) {
                next.amount = "";
            }

            return next;
        });
    }

    /*
    |--------------------------------------------------------------------------
    | ENREGISTREMENT DU PAIEMENT
    |--------------------------------------------------------------------------
    */

    async function handleSubmit(e) {
        e.preventDefault();

        if (!selectedEnrollment) {
            toast.error(
                "Sélectionnez une inscription."
            );

            return;
        }

        const amount = Number(
            form.amount || 0
        );

        /*
        |--------------------------------------------------------------------------
        | TYPE DE PAIEMENT
        |--------------------------------------------------------------------------
        */

        if (
            form.payment_type !==
                "registration" &&
            form.payment_type !==
                "training"
        ) {
            toast.error(
                "Choisissez un type de paiement."
            );

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | MONTANT
        |--------------------------------------------------------------------------
        */

        if (amount <= 0) {
            toast.error(
                "Le montant doit être supérieur à 0."
            );

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | SOLDE EXACT DU TYPE DE PAIEMENT
        |--------------------------------------------------------------------------
        */

        const maximumAmount =
            form.payment_type ===
            "registration"
                ? financial.registrationBalance
                : financial.trainingBalance;

        /*
        |--------------------------------------------------------------------------
        | VÉRIFICATION DU SOLDE
        |--------------------------------------------------------------------------
        */

        if (maximumAmount <= 0) {
            toast.error(
                form.payment_type ===
                    "registration"
                    ? "Les frais d'inscription sont déjà réglés."
                    : "Aucun solde de formation à régler."
            );

            return;
        }

        if (
            amount >
            maximumAmount
        ) {
            toast.error(
                `Le montant dépasse le solde restant de ${maximumAmount.toLocaleString(
                    "fr-FR"
                )} FCFA.`
            );

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | MÉTHODE DE PAIEMENT
        |--------------------------------------------------------------------------
        */

        if (
            !form.payment_method_id
        ) {
            toast.error(
                "Choisissez une méthode de paiement."
            );

            return;
        }

        try {
            setSaving(true);

            const payload = {
                enrollment_id:
                    selectedEnrollment.id,

                payment_type:
                    form.payment_type,

                amount,

                payment_method_id:
                    form.payment_method_id,

                payment_date:
                    form.payment_date,

                reference:
                    form.reference || "",

                notes:
                    form.notes || "",
            };

            console.log(
                "=== PAYLOAD PAIEMENT ==="
            );

            console.log(payload);

            console.log(
                "=== TYPE DE PAIEMENT ==="
            );

            console.log(
                form.payment_type
            );

            console.log(
                "=== SOLDE INSCRIPTION ==="
            );

            console.log(
                financial.registrationBalance
            );

            console.log(
                "=== SOLDE FORMATION ==="
            );

            console.log(
                financial.trainingBalance
            );

            const response =
                await api.post(
                    "/payments",
                    payload
                );

            console.log(
                "=== RÉPONSE API ==="
            );

            console.log(
                response.data
            );

            const payment =
                response.data?.data
                    ?.payment ??
                response.data?.payment ??
                response.data?.data ??
                response.data;

            if (!payment?.id) {
                toast.error(
                    "Le paiement a été créé mais son ID est introuvable."
                );

                return;
            }

            toast.success(
                "Paiement enregistré avec succès."
            );

            navigate(
                `/payments/${payment.id}/receipt`
            );
        } catch (error) {
            console.error(
                "Erreur paiement :",
                error
            );

            console.error(
    "RÉPONSE API 422 :",
    JSON.stringify(
        error.response?.data,
        null,
        2
    )
);

            const apiData =
                error.response?.data;

            let message =
                apiData?.message ||
                apiData?.error ||
                "Impossible d'enregistrer le paiement.";

            /*
            |--------------------------------------------------------------------------
            | AFFICHER LES ERREURS DE VALIDATION LARAVEL
            |--------------------------------------------------------------------------
            */

            if (
                apiData?.errors &&
                typeof apiData.errors ===
                    "object"
            ) {
                const validationMessages =
                    Object.values(
                        apiData.errors
                    )
                        .flat()
                        .filter(Boolean);

                if (
                    validationMessages.length >
                    0
                ) {
                    message =
                        validationMessages.join(
                            "\n"
                        );
                }
            }

            Swal.fire({
                icon: "error",
                title: "Erreur",
                text: message,
            });
        } finally {
            setSaving(false);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | LOADING
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div className="text-center">
                    <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

                    <p className="font-medium text-slate-600">
                        Chargement des données...
                    </p>
                </div>
            </div>
        );
    }

    /*
    |--------------------------------------------------------------------------
    | RENDU
    |--------------------------------------------------------------------------
    */

    return (
        <div className="space-y-8">

            <PaymentHeader />

            <PaymentStepper
                currentStep={step}
            />

            {/*
            =========================================================
            ÉTAPE 1 : SÉLECTION
            =========================================================
            */}

            {step === 1 && (
                <>
                    <EnrollmentSelector
                        enrollments={
                            enrollments
                        }
                        search={search}
                        setSearch={
                            setSearch
                        }
                        selectedEnrollments={
                            selectedEnrollments
                        }
                        onToggle={
                            handleToggleEnrollment
                        }
                    />

                    {selectedEnrollment && (
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={
                                    handleContinue
                                }
                                className="rounded-2xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-blue-700"
                            >
                                Continuer avec cette inscription
                            </button>
                        </div>
                    )}
                </>
            )}

            {/*
            =========================================================
            ÉTAPE 2 : RÉSUMÉ
            =========================================================
            */}

            {step === 2 &&
                selectedEnrollment && (
                    <div className="space-y-8">

                        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">

                            <StudentSummary
                                enrollment={
                                    selectedEnrollment
                                }
                            />

                            <FinancialSummary
                                enrollment={
                                    selectedEnrollment
                                }
                                onContinue={() =>
                                    setStep(3)
                                }
                            />

                        </div>

                        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">

                            <h3 className="mb-4 text-xl font-bold text-blue-900">
                                Formations de l'inscription
                            </h3>

                            <div className="space-y-3">

                                {Array.isArray(
                                    selectedEnrollment.trainings
                                ) &&
                                selectedEnrollment
                                    .trainings.length >
                                    0 ? (
                                    selectedEnrollment.trainings.map(
                                        (
                                            training
                                        ) => {
                                            const price =
                                                Number(
                                                    training
                                                        ?.pivot
                                                        ?.training_fee ??
                                                        training?.price ??
                                                        0
                                                );

                                            return (
                                                <div
                                                    key={
                                                        training.id
                                                    }
                                                    className="flex items-center justify-between rounded-xl bg-white p-4"
                                                >
                                                    <div>
                                                        <p className="font-semibold">
                                                            {
                                                                training.title
                                                            }
                                                        </p>

                                                        {training.code && (
                                                            <p className="text-sm text-slate-500">
                                                                {
                                                                    training.code
                                                                }
                                                            </p>
                                                        )}
                                                    </div>

                                                    <span className="font-bold text-blue-700">
                                                        {price.toLocaleString(
                                                            "fr-FR"
                                                        )}{" "}
                                                        FCFA
                                                    </span>
                                                </div>
                                            );
                                        }
                                    )
                                ) : (
                                    <p className="text-sm text-slate-500">
                                        Aucune formation trouvée
                                        pour cette inscription.
                                    </p>
                                )}

                                <div className="mt-4 space-y-2 border-t border-blue-200 pt-4">

                                    <div className="flex justify-between">
                                        <span>
                                            Frais d'inscription
                                        </span>

                                        <span className="font-semibold">
                                            {financial.registrationFee.toLocaleString(
                                                "fr-FR"
                                            )}{" "}
                                            FCFA
                                        </span>
                                    </div>

                                    <div className="flex justify-between">
                                        <span>
                                            Total formations
                                        </span>

                                        <span className="font-semibold">
                                            {financial.trainingTotal.toLocaleString(
                                                "fr-FR"
                                            )}{" "}
                                            FCFA
                                        </span>
                                    </div>

                                    {financial.trainingDiscount >
                                        0 && (
                                        <div className="flex justify-between text-orange-600">
                                            <span>
                                                Remise formations
                                            </span>

                                            <span className="font-semibold">
                                                -
                                                {financial.trainingDiscount.toLocaleString(
                                                    "fr-FR"
                                                )}{" "}
                                                FCFA
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex justify-between font-bold">
                                        <span>
                                            Net formations
                                        </span>

                                        <span>
                                            {financial.trainingNetTotal.toLocaleString(
                                                "fr-FR"
                                            )}{" "}
                                            FCFA
                                        </span>
                                    </div>

                                    <div className="flex justify-between border-t border-blue-200 pt-3 text-lg font-bold">
                                        <span>
                                            Solde global
                                        </span>

                                        <span className="text-red-600">
                                            {financial.balance.toLocaleString(
                                                "fr-FR"
                                            )}{" "}
                                            FCFA
                                        </span>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                )}

            {/*
            =========================================================
            ÉTAPE 3 : PAIEMENT
            =========================================================
            */}

            {step === 3 &&
                selectedEnrollment && (
                    <form
                        onSubmit={
                            handleSubmit
                        }
                        className="space-y-8"
                    >

                        <PaymentForm
                            form={form}
                            handleChange={
                                handleChange
                            }
                            paymentMethods={
                                paymentMethods
                            }
                            enrollment={
                                selectedEnrollment
                            }
                            totalBalance={
                                totalBalance
                            }
                            saving={saving}
                        />

                        <PaymentReceiptPreview
                            enrollment={
                                selectedEnrollment
                            }
                            form={form}
                            paymentMethods={
                                paymentMethods
                            }
                        />

                    </form>
                )}
        </div>
    );
}