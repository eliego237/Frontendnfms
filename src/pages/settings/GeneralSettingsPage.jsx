import { useEffect, useState } from "react";
import {
    Settings,
    GraduationCap,
    Wallet,
    Hash,
    Save,
} from "lucide-react";

import api from "../../services/api";

export default function GeneralSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [form, setForm] = useState({
        academic_year: "",
        registration_fee: "",
        enrollment_prefix: "",
    });

    useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/settings");

            console.log("========== PARAMÈTRES ==========");
            console.log("Response :", response);
            console.log("Response data :", response.data);

            const data = response.data?.data;

            console.log("Settings data :", data);

            /*
             * Supporte les deux formats possibles :
             *
             * data = {
             *    academic_year: "...",
             *    registration_fee: "...",
             *    enrollment_prefix: "..."
             * }
             *
             * ou
             *
             * data = [
             *    { key: "academic_year", value: "2026-2027" },
             *    ...
             * ]
             */

            let settings = {};

            if (Array.isArray(data)) {
                data.forEach((setting) => {
                    if (setting.key) {
                        settings[setting.key] = setting.value;
                    }
                });
            } else {
                settings = data || {};
            }

            setForm({
                academic_year:
                    settings.academic_year || "2026-2027",

                registration_fee:
                    settings.registration_fee || "16500",

                enrollment_prefix:
                    settings.enrollment_prefix || "INS",
            });
        } catch (err) {
            console.error("Erreur chargement paramètres :", err);

            setError(
                err.response?.data?.message ||
                "Impossible de récupérer les paramètres."
            );
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e) {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setMessage("");
        setError("");
        setSaving(true);

        try {
            const payload = {
                academic_year: form.academic_year,
                registration_fee: Number(form.registration_fee),
                enrollment_prefix: form.enrollment_prefix,
            };

            console.log("========== SAUVEGARDE PARAMÈTRES ==========");
            console.log("Payload :", payload);

            const response = await api.put(
                "/settings",
                payload
            );

            console.log("Réponse sauvegarde :", response);

            setMessage(
                response.data?.message ||
                "Paramètres enregistrés avec succès."
            );
        } catch (err) {
            console.error(
                "Erreur sauvegarde paramètres :",
                err
            );

            setError(
                err.response?.data?.message ||
                "Impossible d'enregistrer les paramètres."
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center bg-slate-100">
                <p className="text-slate-500">
                    Chargement des paramètres...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 p-8">

            {/* HEADER */}

            <div className="mb-7">
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                    Paramètres
                </p>

                <h1 className="mt-1 text-3xl font-bold text-slate-900">
                    Paramètres généraux
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Configurez les paramètres principaux de votre centre.
                </p>
            </div>

            {/* MESSAGE */}

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

            <form onSubmit={handleSubmit}>

                {/* PARAMÈTRES ACADÉMIQUES */}

                <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="flex items-center gap-4 border-b border-slate-200 px-6 py-5">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                            <GraduationCap
                                size={23}
                                className="text-blue-600"
                            />
                        </div>

                        <div>
                            <h2 className="font-semibold text-slate-900">
                                Paramètres académiques
                            </h2>

                            <p className="text-sm text-slate-500">
                                Configuration de l'année académique
                            </p>
                        </div>

                    </div>

                    <div className="p-6">

                        <div className="max-w-xl">

                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Année académique
                            </label>

                            <div className="relative">

                                <GraduationCap
                                    size={18}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    name="academic_year"
                                    value={form.academic_year}
                                    onChange={handleChange}
                                    placeholder="2026-2027"
                                    className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    required
                                />

                            </div>

                            <p className="mt-2 text-xs text-slate-400">
                                Exemple : 2026-2027
                            </p>

                        </div>

                    </div>

                </div>

                {/* PARAMÈTRES FINANCIERS */}

                <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                    <div className="flex items-center gap-4 border-b border-slate-200 px-6 py-5">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50">
                            <Wallet
                                size={23}
                                className="text-green-600"
                            />
                        </div>

                        <div>
                            <h2 className="font-semibold text-slate-900">
                                Paramètres financiers
                            </h2>

                            <p className="text-sm text-slate-500">
                                Configuration des frais et des inscriptions
                            </p>
                        </div>

                    </div>

                    <div className="p-6">

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                            {/* FRAIS INSCRIPTION */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Frais d'inscription
                                </label>

                                <div className="relative">

                                    <Wallet
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="number"
                                        min="0"
                                        name="registration_fee"
                                        value={form.registration_fee}
                                        onChange={handleChange}
                                        className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-16 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        required
                                    />

                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                                        FCFA
                                    </span>

                                </div>

                                <p className="mt-2 text-xs text-slate-400">
                                    Montant appliqué automatiquement aux nouvelles inscriptions.
                                </p>

                            </div>

                            {/* PREFIXE */}

                            <div>

                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Préfixe des inscriptions
                                </label>

                                <div className="relative">

                                    <Hash
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                    />

                                    <input
                                        type="text"
                                        name="enrollment_prefix"
                                        value={form.enrollment_prefix}
                                        onChange={handleChange}
                                        placeholder="INS"
                                        maxLength={10}
                                        className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 uppercase outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        required
                                    />

                                </div>

                                <p className="mt-2 text-xs text-slate-400">
                                    Exemple : INS → INS202600001
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

                {/* BOUTON */}

                <div className="flex justify-end">

                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >

                        <Save size={18} />

                        {saving
                            ? "Enregistrement..."
                            : "Enregistrer les paramètres"}

                    </button>

                </div>

            </form>

        </div>
    );
}