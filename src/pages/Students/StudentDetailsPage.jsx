import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../services/api";
import {
    User,
    GraduationCap,
    Phone,
    Mail,
    MapPin,
    Cake,
    Users
} from "lucide-react";

export default function StudentDetailsPage() {

    const { id } = useParams();

    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStudent();
    }, []);

    async function loadStudent() {
        try {

            const response = await api.get(`/students/${id}`);

            setStudent(response.data.data);

        } catch (error) {

            console.error(error);

            alert("Impossible de charger cet étudiant.");

        } finally {

            setLoading(false);

        }
    }

    function calculateAge(date) {

        if (!date) return "-";

        const birth = new Date(date);
        const today = new Date();

        let age = today.getFullYear() - birth.getFullYear();

        const month = today.getMonth() - birth.getMonth();

        if (
            month < 0 ||
            (month === 0 &&
                today.getDate() < birth.getDate())
        ) {
            age--;
        }

        return age;
    }

    function formatDate(date) {

        if (!date) return "-";

        return new Date(date).toLocaleDateString(
            "fr-FR",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }
        );
    }

    function money(value) {
        return Number(value || 0).toLocaleString(
            "fr-FR"
        ) + " FCFA";
    }

    if (loading) {

        return (
            <div className="p-8 text-xl font-semibold">
                Chargement...
            </div>
        );

    }

    if (!student) {

        return (
            <div className="p-8">
                Étudiant introuvable.
            </div>
        );

    }

    const enrollment = student.enrollments?.[0];
    
    console.log("Enrollment :", enrollment);

    console.log("Training :", enrollment?.training);

    console.log("Tous les champs :", Object.keys(enrollment || {}));

    console.log("Objet complet :", JSON.stringify(enrollment, null, 2));
     
    const total = Number(
        enrollment?.total_amount || 0
    );

    const paid = Number(
        enrollment?.amount_paid || 0
    );

    const balance = Number(
        enrollment?.balance || 0
    );

    const percent =
        total > 0
            ? Math.round((paid / total) * 100)
            : 0;
    
    return (

        <div className="space-y-8">

            {/* ================= HEADER ================= */}

            <div className="flex items-center justify-between">

                <div className="flex items-center gap-6">

                    <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center text-5xl shadow">

                        👤

                    </div>

                    <div>

                        <h1 className="text-4xl font-bold">

                            {student.first_name} {student.last_name}

                        </h1>

                        <p className="text-gray-500 mt-2">

                            Matricule :
                            <strong className="ml-2">
                                {student.matricule}
                            </strong>

                        </p>

                        <div className="flex gap-3 mt-4">

                            <span
                                className={
                                    student.status
                                        ? "rounded-full bg-green-100 px-3 py-1 text-green-700 text-sm font-semibold"
                                        : "rounded-full bg-red-100 px-3 py-1 text-red-700 text-sm font-semibold"
                                }
                            >
                                {student.status
                                    ? "Actif"
                                    : "Inactif"}
                            </span>

                            <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700 text-sm">

                                {student.gender === "M"
                                    ? "Masculin"
                                    : "Féminin"}

                            </span>

                        </div>

                    </div>

                </div>

                <Link
                    to="/students"
                    className="rounded-lg bg-gray-200 px-5 py-3 hover:bg-gray-300 transition"
                >
                    ← Retour
                </Link>

            </div>

            {/* ================= CARTES ================= */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="rounded-xl bg-white shadow p-6">

                    <p className="text-gray-500">
                        Âge
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-blue-600">

                        {calculateAge(student.birth_date)} ans

                    </h2>

                </div>

                <div className="rounded-xl bg-white shadow p-6">

                    <p className="text-gray-500">
                        Téléphone
                    </p>

                    <h2 className="mt-2 text-xl font-semibold">

                        {student.phone}

                    </h2>

                </div>

                <div className="rounded-xl bg-white shadow p-6">

                    <p className="text-gray-500">
                        Email
                    </p>

                    <h2 className="mt-2 text-lg font-semibold break-all">

                        {student.email || "-"}

                    </h2>

                </div>

            </div>

            {/* ================= INFORMATIONS PERSONNELLES ================= */}

            <div className="bg-white rounded-2xl shadow p-8">

                <h2 className="text-3xl font-bold">
    👤 Informations personnelles
</h2>

<p className="text-gray-500 mt-1 mb-8">
    Coordonnées et informations générales de l'étudiant.
</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    <div className="bg-gray-50 rounded-xl p-5">
        <p className="text-gray-500 text-sm">
            👤 Nom complet
        </p>

        <p className="font-bold mt-2">
            {student.first_name} {student.last_name}
        </p>
    </div>

    <div className="bg-gray-50 rounded-xl p-5">
        <p className="text-gray-500 text-sm">
            🎓 Matricule
        </p>

        <p className="font-bold mt-2">
            {student.matricule}
        </p>
    </div>

    <div className="bg-gray-50 rounded-xl p-5">
        <p className="text-gray-500 text-sm">
            🚻 Sexe
        </p>

        <p className="font-bold mt-2">
            {student.gender === "M" ? "Masculin" : "Féminin"}
        </p>
    </div>

    <div className="bg-gray-50 rounded-xl p-5">
        <p className="text-gray-500 text-sm">
            🎂 Âge
        </p>

        <p className="font-bold mt-2">
            {calculateAge(student.birth_date)} ans
        </p>
    </div>

    <div className="bg-gray-50 rounded-xl p-5">
        <p className="text-gray-500 text-sm">
            📱 Téléphone
        </p>

        <p className="font-bold mt-2">
            {student.phone}
        </p>
    </div>

    <div className="bg-gray-50 rounded-xl p-5">
        <p className="text-gray-500 text-sm">
            📧 Email
        </p>

        <p className="font-bold mt-2 break-all">
            {student.email || "-"}
        </p>
    </div>

    <div className="bg-gray-50 rounded-xl p-5 md:col-span-2">
        <p className="text-gray-500 text-sm">
            📍 Adresse
        </p>

        <p className="font-bold mt-2">
            {student.address || "-"}
        </p>
    </div>

    <div className="bg-gray-50 rounded-xl p-5 md:col-span-2">
        <p className="text-gray-500 text-sm">
            👨 Contact d'urgence
        </p>

        <p className="font-bold mt-2">
            {student.emergency_contact || "-"}
        </p>
    </div>

</div>
            </div>

            {/* ================= FORMATION ================= */}

            <div className="bg-white rounded-2xl shadow p-8">

                <h2 className="text-2xl font-bold mb-8">

                    Formation actuelle

                </h2>

                {enrollment ? (

                    <div className="grid grid-cols-2 gap-6">

                        <div className="bg-gray-50 rounded-xl p-4">
    <p className="text-gray-500 text-sm">
        Formation
    </p>

    <p className="font-bold mt-2">
        {enrollment.training.title}
    </p>
</div>

                        <div className="bg-gray-50 rounded-xl p-4">
    <p className="text-gray-500 text-sm">
        Code
    </p>

    <p className="font-bold mt-2">
        {enrollment.training.code}
    </p>
</div>

                        <div className="bg-gray-50 rounded-xl p-4">
    <p className="text-gray-500 text-sm">
        Année académique
    </p>

    <p className="font-bold mt-2">
        {enrollment.academic_year}
    </p>
</div>

                        <div className="bg-gray-50 rounded-xl p-4">
    <p className="text-gray-500 text-sm">
        Date d'inscription
    </p>

    <p className="font-bold mt-2">
        {formatDate(enrollment.enrolled_at)}
    </p>
</div>

                        <div className="bg-gray-50 rounded-xl p-4">
    <p className="text-gray-500 text-sm">
        Durée
    </p>

    <p className="font-bold mt-2">
        {enrollment.training?.duration_months} mois    </p>
</div>

                        <div className="bg-gray-50 rounded-xl p-4">

                            <p className="text-gray-500 text-sm">
                                Statut
                            </p>

                            <span
    className={`px-3 py-1 rounded-full text-sm font-semibold ${
        enrollment.status === "completed"
            ? "bg-green-100 text-green-700"
            : enrollment.status === "partial"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-blue-100 text-blue-700"
    }`}
>
    {enrollment.status === "completed"
        ? "Validée"
        : enrollment.status === "partial"
        ? "Partielle"
        : "En attente"}
</span>
                        </div>

                    </div>

                ) : (

                    <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">

                        Aucune inscription enregistrée.

                    </div>

                )}

            </div>

            {/* ================= SITUATION FINANCIÈRE ================= */}

                        <div className="bg-white rounded-2xl shadow p-8">

                <h2 className="text-2xl font-bold mb-8">

                    Situation financière

                </h2>

                {enrollment ? (

                    <>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                            <div className="rounded-xl bg-blue-50 p-6 shadow-sm hover:shadow-md transition">
                                 
                                <p className="text-gray-500">
                                    Total à payer
                                </p>

                                <h3 className="mt-2 text-2xl font-bold text-blue-700">

                                    {money(total)}

                                </h3>

                            </div>

                            <div className="rounded-xl bg-green-50 p-6">

                                <p className="text-gray-500">
                                    Déjà payé
                                </p>

                                <h3 className="mt-2 text-2xl font-bold text-green-700">

                                    {money(paid)}

                                </h3>

                            </div>

                            <div className="rounded-xl bg-red-50 p-6">

                                <p className="text-gray-500">
                                    Solde restant
                                </p>

                                <h3 className="mt-2 text-2xl font-bold text-red-700">

                                    {money(balance)}

                                </h3>

                            </div>
                            
                        </div>

                        <div>

                            <div className="flex justify-between mb-3">

                                <span className="font-medium">
                                    Progression des paiements
                                </span>

                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold">
                                   {percent}%
                                </span>

                            </div>

                            <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden">

                               <div
    className={`h-full transition-all duration-500 ${
        percent >= 100
            ? "bg-green-600"
            : percent >= 50
            ? "bg-blue-600"
            : percent >= 25
            ? "bg-yellow-500"
            : "bg-red-500"
    }`}
    style={{
        width: `${percent}%`,
    }}
/>
                            </div>

                           <div className="mt-4 flex justify-end">
    {percent === 100 ? (
        <span className="px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold">
            ✅ Paiement terminé
        </span>
    ) : percent >= 50 ? (
        <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold">
            💳 Paiement en bonne voie
        </span>
    ) : percent >= 25 ? (
        <span className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold">
            ⏳ Paiement en cours
        </span>
    ) : (
        <span className="px-4 py-2 rounded-full bg-red-100 text-red-700 font-semibold">
            ⚠ Peu de paiements effectués
        </span>
    )}
</div>

                        </div>

                           <div className="mt-10 border-t border-gray-200 pt-8">

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">

    <div className="bg-gray-50 rounded-xl p-5">
        <p className="text-gray-500 text-sm">
            Frais d'inscription
        </p>

        <p className="text-lg font-bold mt-2">
            {money(enrollment.registration_fee)}
        </p>
    </div>

    <div className="bg-gray-50 rounded-xl p-5">
        <p className="text-gray-500 text-sm">
            Frais de formation
        </p>

        <p className="text-lg font-bold mt-2">
            {money(enrollment.training_fee)}
        </p>
    </div>

    <div className="bg-orange-50 rounded-xl p-5">
        <p className="text-gray-500 text-sm">
            Réduction
        </p>

        <p className="text-lg font-bold text-orange-600 mt-2">
            {money(enrollment.discount)}
        </p>
    </div>

    <div className="bg-gray-50 rounded-xl p-5">
        <p className="text-gray-500 text-sm">
            Date d'inscription
        </p>

        <p className="text-lg font-bold mt-2">
            {formatDate(enrollment.enrolled_at)}
        </p>
    </div>

</div>

                        </div>

                    </>

                ) : (

                    <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">

                        Aucun paiement enregistré.

                    </div>

                )}

            </div>

        </div>

    );

}