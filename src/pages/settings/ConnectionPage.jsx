import { useEffect, useState } from "react";
import {
    User,
    ShieldCheck,
    LockKeyhole,
    Mail,
    Phone,
    Save,
    Eye,
    EyeOff,
    Clock,
} from "lucide-react";

import api from "../../services/api";

export default function ConnectionPage() {
    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [profile, setProfile] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
    });

    const [password, setPassword] = useState({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
    });

    useEffect(() => {
        loadUser();
    }, []);

    async function loadUser() {
        try {
            setLoading(true);

            const response = await api.get("/me");

            const data = response.data?.data;

            setUser(data);

            setProfile({
                first_name: data?.first_name || "",
                last_name: data?.last_name || "",
                email: data?.email || "",
                phone: data?.phone || "",
            });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Impossible de récupérer votre profil."
            );
        } finally {
            setLoading(false);
        }
    }

    function clearMessages() {
        setMessage("");
        setError("");
    }

    async function handleProfileSubmit(e) {
        e.preventDefault();

        clearMessages();
        setSavingProfile(true);

        try {
            const response = await api.put("/profile", profile);

            const updatedUser = response.data?.data;

            setUser(updatedUser);

            setProfile({
                first_name: updatedUser?.first_name || "",
                last_name: updatedUser?.last_name || "",
                email: updatedUser?.email || "",
                phone: updatedUser?.phone || "",
            });

            setMessage("Votre profil a été enregistré avec succès.");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Impossible de modifier votre profil."
            );
        } finally {
            setSavingProfile(false);
        }
    }

    async function handlePasswordSubmit(e) {
        e.preventDefault();

        clearMessages();

        if (
            password.new_password !==
            password.new_password_confirmation
        ) {
            setError(
                "La confirmation du nouveau mot de passe ne correspond pas."
            );
            return;
        }

        setSavingPassword(true);

        try {
            await api.put("/profile/password", password);

            setPassword({
                current_password: "",
                new_password: "",
                new_password_confirmation: "",
            });

            setMessage("Votre mot de passe a été modifié avec succès.");

            // Le backend invalide les anciens tokens.
            // On redirige vers la connexion après modification.
            setTimeout(() => {
                window.location.href = "/login";
            }, 1200);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Impossible de modifier le mot de passe."
            );
        } finally {
            setSavingPassword(false);
        }
    }

    function formatDate(date) {
        if (!date) return "Jamais";

        return new Date(date).toLocaleString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    }

    function getRole() {
        if (!user?.roles?.length) {
            return "Aucun rôle";
        }

        return user.roles.join(", ");
    }

    if (loading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center">
                <div className="text-slate-500">
                    Chargement de votre profil...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 p-8">

            {/* En-tête */}

            <div className="mb-7">
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                    Paramètres
                </p>

                <h1 className="mt-1 text-3xl font-bold text-slate-900">
                    Connexion
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Gérez votre profil et les paramètres de sécurité de votre compte.
                </p>
            </div>

            {/* Messages */}

            {message && (
                <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    {message}
                </div>
            )}

            {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                </div>
            )}

            {/* PROFIL + COMPTE */}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                {/* Mon profil */}

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">

                    <div className="flex items-center gap-4 border-b border-slate-200 px-6 py-5">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                            <User
                                size={23}
                                className="text-blue-600"
                            />
                        </div>

                        <div>
                            <h2 className="font-semibold text-slate-900">
                                Mon profil
                            </h2>

                            <p className="text-sm text-slate-500">
                                Informations de votre compte
                            </p>
                        </div>

                    </div>

                    <form
                        onSubmit={handleProfileSubmit}
                        className="p-6"
                    >

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            {/* Prénom */}

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Prénom
                                </label>

                                <div className="relative">
                                    <User
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="text"
                                        value={profile.first_name}
                                        onChange={(e) =>
                                            setProfile({
                                                ...profile,
                                                first_name: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Nom */}

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Nom
                                </label>

                                <div className="relative">
                                    <User
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="text"
                                        value={profile.last_name}
                                        onChange={(e) =>
                                            setProfile({
                                                ...profile,
                                                last_name: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Email
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) =>
                                            setProfile({
                                                ...profile,
                                                email: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Téléphone */}

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Téléphone
                                </label>

                                <div className="relative">
                                    <Phone
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="text"
                                        value={profile.phone}
                                        onChange={(e) =>
                                            setProfile({
                                                ...profile,
                                                phone: e.target.value,
                                            })
                                        }
                                        className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">

                            <button
                                type="submit"
                                disabled={savingProfile}
                                className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Save size={18} />

                                {savingProfile
                                    ? "Enregistrement..."
                                    : "Enregistrer"}
                            </button>

                        </div>

                    </form>

                </div>

                {/* Compte */}

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="flex items-center gap-4 border-b border-slate-200 px-6 py-5">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                            <ShieldCheck
                                size={23}
                                className="text-green-600"
                            />
                        </div>

                        <div>
                            <h2 className="font-semibold text-slate-900">
                                Compte
                            </h2>

                            <p className="text-sm text-slate-500">
                                État de votre compte
                            </p>
                        </div>

                    </div>

                    <div className="space-y-6 p-6">

                        <div>
                            <p className="text-xs font-medium uppercase text-slate-400">
                                Utilisateur
                            </p>

                            <p className="mt-1 font-semibold text-slate-900">
                                {user?.name || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase text-slate-400">
                                Rôle
                            </p>

                            <p className="mt-1 font-semibold text-slate-900">
                                {getRole()}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase text-slate-400">
                                Statut
                            </p>

                            <span
                                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                    user?.status
                                        ? "bg-green-50 text-green-700"
                                        : "bg-red-50 text-red-700"
                                }`}
                            >
                                {user?.status
                                    ? "Compte actif"
                                    : "Compte désactivé"}
                            </span>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase text-slate-400">
                                Dernière connexion
                            </p>

                            <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                                <Clock size={17} />

                                {formatDate(user?.last_login_at)}
                            </div>
                        </div>

                    </div>

                </div>

            </div>

            {/* SECURITE */}

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="flex items-center gap-4 border-b border-slate-200 px-6 py-5">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
                        <LockKeyhole
                            size={23}
                            className="text-orange-500"
                        />
                    </div>

                    <div>
                        <h2 className="font-semibold text-slate-900">
                            Sécurité
                        </h2>

                        <p className="text-sm text-slate-500">
                            Modifier le mot de passe de votre compte
                        </p>
                    </div>

                </div>

                <form
                    onSubmit={handlePasswordSubmit}
                    className="p-6"
                >

                    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">

                        {/* Ancien mot de passe */}

                        <PasswordInput
                            label="Mot de passe actuel"
                            value={password.current_password}
                            onChange={(value) =>
                                setPassword({
                                    ...password,
                                    current_password: value,
                                })
                            }
                            show={showCurrent}
                            setShow={setShowCurrent}
                        />

                        {/* Nouveau */}

                        <PasswordInput
                            label="Nouveau mot de passe"
                            value={password.new_password}
                            onChange={(value) =>
                                setPassword({
                                    ...password,
                                    new_password: value,
                                })
                            }
                            show={showNew}
                            setShow={setShowNew}
                        />

                        {/* Confirmation */}

                        <PasswordInput
                            label="Confirmer le mot de passe"
                            value={password.new_password_confirmation}
                            onChange={(value) =>
                                setPassword({
                                    ...password,
                                    new_password_confirmation: value,
                                })
                            }
                            show={showConfirm}
                            setShow={setShowConfirm}
                        />

                    </div>

                    <div className="mt-6 flex justify-end border-t border-slate-100 pt-5">

                        <button
                            type="submit"
                            disabled={savingPassword}
                            className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <LockKeyhole size={18} />

                            {savingPassword
                                ? "Modification..."
                                : "Modifier le mot de passe"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}


function PasswordInput({
    label,
    value,
    onChange,
    show,
    setShow,
}) {
    return (
        <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
                {label}
            </label>

            <div className="relative">

                <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-12 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                />

                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 hover:text-slate-700"
                >
                    {show ? (
                        <EyeOff size={18} />
                    ) : (
                        <Eye size={18} />
                    )}
                </button>

            </div>
        </div>
    );
}