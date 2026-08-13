import { useEffect, useState } from "react";
import {
    User,
    Mail,
    Phone,
    ShieldCheck,
    LockKeyhole,
    LogOut,
    Save,
    Eye,
    EyeOff,
    Clock,
    Loader2,
} from "lucide-react";

import api from "../../services/api";

export default function ConnectionSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    const [user, setUser] = useState(null);

    const [profile, setProfile] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
    });

    const [passwords, setPasswords] = useState({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const [showCurrent, setShowCurrent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const [message, setMessage] = useState({
        type: "",
        text: "",
    });

    /*
    |--------------------------------------------------------------------------
    | Charger l'utilisateur connecté
    |--------------------------------------------------------------------------
    */

    useEffect(() => {
        loadUser();
    }, []);

    async function loadUser() {
        try {
            setLoading(true);

            const response = await api.get("/me");

            const currentUser =
                response.data?.data ?? response.data;

            setUser(currentUser);

            setProfile({
                first_name: currentUser?.first_name ?? "",
                last_name: currentUser?.last_name ?? "",
                email: currentUser?.email ?? "",
                phone: currentUser?.phone ?? "",
            });

        } catch (error) {
            console.error(
                "❌ Erreur récupération utilisateur :",
                error
            );

            setMessage({
                type: "error",
                text:
                    error.response?.data?.message ??
                    "Impossible de récupérer votre profil.",
            });

        } finally {
            setLoading(false);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Profil
    |--------------------------------------------------------------------------
    */

    function handleProfileChange(event) {
        const { name, value } = event.target;

        setProfile((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function handleProfileSubmit(event) {
        event.preventDefault();

        setMessage({
            type: "",
            text: "",
        });

        try {
            setSavingProfile(true);

            const response = await api.put(
                "/profile",
                profile
            );

            const updatedUser =
                response.data?.data ?? response.data;

            setUser(updatedUser);

            setMessage({
                type: "success",
                text:
                    response.data?.message ??
                    "Profil mis à jour avec succès.",
            });

        } catch (error) {
            console.error(
                "❌ Erreur modification profil :",
                error
            );

            setMessage({
                type: "error",
                text:
                    error.response?.data?.message ??
                    "Impossible de modifier le profil.",
            });

        } finally {
            setSavingProfile(false);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Mot de passe
    |--------------------------------------------------------------------------
    */

    function handlePasswordChange(event) {
        const { name, value } = event.target;

        setPasswords((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function handlePasswordSubmit(event) {
        event.preventDefault();

        setMessage({
            type: "",
            text: "",
        });

        if (
            passwords.password !==
            passwords.password_confirmation
        ) {
            setMessage({
                type: "error",
                text:
                    "La confirmation du nouveau mot de passe ne correspond pas.",
            });

            return;
        }

        try {
            setSavingPassword(true);

            const response = await api.put(
                "/password",
                passwords
            );

            /*
            |--------------------------------------------------------------
            | Le backend retourne un nouveau token
            |--------------------------------------------------------------
            */

            const newToken =
                response.data?.data?.token;

            if (newToken) {
                localStorage.setItem(
                    "token",
                    newToken
                );
            }

            const updatedUser =
                response.data?.data?.user;

            if (updatedUser) {
                setUser(updatedUser);
            }

            setPasswords({
                current_password: "",
                password: "",
                password_confirmation: "",
            });

            setMessage({
                type: "success",
                text:
                    response.data?.message ??
                    "Mot de passe modifié avec succès.",
            });

        } catch (error) {
            console.error(
                "❌ Erreur modification mot de passe :",
                error
            );

            setMessage({
                type: "error",
                text:
                    error.response?.data?.message ??
                    "Impossible de modifier le mot de passe.",
            });

        } finally {
            setSavingPassword(false);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Déconnexion
    |--------------------------------------------------------------------------
    */

    async function handleLogout() {
        try {
            await api.post("/logout");
        } catch (error) {
            console.error(
                "Erreur déconnexion :",
                error
            );
        } finally {
            localStorage.removeItem("token");

            window.location.href = "/login";
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Loading
    |--------------------------------------------------------------------------
    */

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <Loader2 className="mx-auto h-10 w-10 animate-spin text-blue-600" />

                    <p className="mt-4 text-sm text-slate-500">
                        Chargement de votre espace connexion...
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
        <div className="space-y-6">

            {/* Header */}
            <div>
                <p className="text-sm font-medium text-blue-600">
                    PARAMÈTRES
                </p>

                <h1 className="mt-1 text-3xl font-bold text-slate-900">
                    Connexion
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Gérez votre profil et les paramètres de sécurité
                    de votre compte.
                </p>
            </div>

            {/* Message */}
            {message.text && (
                <div
                    className={`rounded-xl border px-4 py-3 text-sm ${
                        message.type === "success"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-red-200 bg-red-50 text-red-700"
                    }`}
                >
                    {message.text}
                </div>
            )}

            {/* Profil + sécurité */}
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                {/* Profil */}
                <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-100 px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <User size={22} />
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
                    </div>

                    <form
                        onSubmit={handleProfileSubmit}
                        className="space-y-5 p-6"
                    >

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Prénom
                                </label>

                                <div className="relative">
                                    <User
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="text"
                                        name="first_name"
                                        value={profile.first_name}
                                        onChange={handleProfileChange}
                                        className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Nom
                                </label>

                                <div className="relative">
                                    <User
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="text"
                                        name="last_name"
                                        value={profile.last_name}
                                        onChange={handleProfileChange}
                                        className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Email
                                </label>

                                <div className="relative">
                                    <Mail
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="email"
                                        name="email"
                                        value={profile.email}
                                        onChange={handleProfileChange}
                                        className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Téléphone
                                </label>

                                <div className="relative">
                                    <Phone
                                        size={18}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="text"
                                        name="phone"
                                        value={profile.phone}
                                        onChange={handleProfileChange}
                                        className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="flex justify-end border-t border-slate-100 pt-5">

                            <button
                                type="submit"
                                disabled={savingProfile}
                                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {savingProfile ? (
                                    <>
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />
                                        Enregistrement...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Enregistrer
                                    </>
                                )}
                            </button>

                        </div>
                    </form>
                </div>

                {/* Résumé compte */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-100 px-6 py-5">
                        <div className="flex items-center gap-3">

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <ShieldCheck size={22} />
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
                    </div>

                    <div className="space-y-5 p-6">

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Utilisateur
                            </p>

                            <p className="mt-1 font-semibold text-slate-900">
                                {user?.name ?? "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Rôle
                            </p>

                            <div className="mt-2 flex flex-wrap gap-2">
                                {user?.roles?.length ? (
                                    user.roles.map((role) => (
                                        <span
                                            key={role.id ?? role.name}
                                            className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                                        >
                                            {role.name}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-sm text-slate-500">
                                        Aucun rôle
                                    </span>
                                )}
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Statut
                            </p>

                            <span
                                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                    user?.status
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-red-50 text-red-700"
                                }`}
                            >
                                {user?.status
                                    ? "Compte actif"
                                    : "Compte désactivé"}
                            </span>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Dernière connexion
                            </p>

                            <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                                <Clock size={16} />

                                {user?.last_login_at
                                    ? new Date(
                                          user.last_login_at
                                      ).toLocaleString("fr-FR")
                                    : "—"}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Sécurité */}
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-100 px-6 py-5">
                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <LockKeyhole size={22} />
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
                </div>

                <form
                    onSubmit={handlePasswordSubmit}
                    className="space-y-5 p-6"
                >

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                        {/* Ancien mot de passe */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Mot de passe actuel
                            </label>

                            <div className="relative">
                                <input
                                    type={
                                        showCurrent
                                            ? "text"
                                            : "password"
                                    }
                                    name="current_password"
                                    value={
                                        passwords.current_password
                                    }
                                    onChange={
                                        handlePasswordChange
                                    }
                                    className="w-full rounded-xl border border-slate-200 py-3 pl-4 pr-11 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowCurrent(
                                            (value) => !value
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showCurrent ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Nouveau */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Nouveau mot de passe
                            </label>

                            <div className="relative">
                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    value={
                                        passwords.password
                                    }
                                    onChange={
                                        handlePasswordChange
                                    }
                                    className="w-full rounded-xl border border-slate-200 py-3 pl-4 pr-11 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            (value) => !value
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirmation */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Confirmer le mot de passe
                            </label>

                            <div className="relative">
                                <input
                                    type={
                                        showConfirmation
                                            ? "text"
                                            : "password"
                                    }
                                    name="password_confirmation"
                                    value={
                                        passwords.password_confirmation
                                    }
                                    onChange={
                                        handlePasswordChange
                                    }
                                    className="w-full rounded-xl border border-slate-200 py-3 pl-4 pr-11 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmation(
                                            (value) => !value
                                        )
                                    }
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showConfirmation ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                    </div>

                    <div className="flex justify-end border-t border-slate-100 pt-5">

                        <button
                            type="submit"
                            disabled={savingPassword}
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {savingPassword ? (
                                <>
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />
                                    Modification...
                                </>
                            ) : (
                                <>
                                    <LockKeyhole size={18} />
                                    Modifier le mot de passe
                                </>
                            )}
                        </button>

                    </div>

                </form>
            </div>

            {/* Déconnexion */}
            <div className="flex flex-col gap-4 rounded-2xl border border-red-200 bg-red-50 p-6 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h2 className="font-semibold text-red-900">
                        Déconnexion
                    </h2>

                    <p className="mt-1 text-sm text-red-700">
                        Fermer votre session actuelle sur NFMS.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                    <LogOut size={18} />
                    Se déconnecter
                </button>

            </div>

        </div>
    );
}