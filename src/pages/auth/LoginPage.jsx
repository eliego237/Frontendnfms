import { useState } from "react";
import { Navigate } from "react-router-dom";
import { LogIn, Mail, Lock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {

    const { login, isAuthenticated } = useAuth();

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    async function handleSubmit(e) {

        e.preventDefault();

        setLoading(true);

        setError("");

        try {

            await login(form);

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Email ou mot de passe incorrect."
            );

        } finally {

            setLoading(false);

        }

    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">

            <div className="w-full max-w-md rounded-3xl bg-white shadow-xl p-8">

                <div className="text-center mb-8">

                    <div className="mx-auto w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">

                        <LogIn
                            className="text-blue-600"
                            size={36}
                        />

                    </div>

                    <h1 className="mt-6 text-3xl font-bold">
                        Connexion
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Connectez-vous à votre espace.
                    </p>

                </div>

                {error && (

                    <div className="mb-5 rounded-xl bg-red-100 text-red-700 p-3">

                        {error}

                    </div>

                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <div>

                        <label className="font-medium">
                            Email
                        </label>

                        <div className="relative mt-2">

                            <Mail
                                className="absolute left-3 top-3.5 text-gray-400"
                                size={18}
                            />

                            <input
                                type="email"
                                required
                                value={form.email}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        email: e.target.value,
                                    })
                                }
                                className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                            />

                        </div>

                    </div>

                    <div>

                        <label className="font-medium">
                            Mot de passe
                        </label>

                        <div className="relative mt-2">

                            <Lock
                                className="absolute left-3 top-3.5 text-gray-400"
                                size={18}
                            />

                            <input
                                type="password"
                                required
                                value={form.password}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        password: e.target.value,
                                    })
                                }
                                className="w-full rounded-xl border border-gray-300 pl-10 pr-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                            />

                        </div>

                    </div>

                    <button
                        disabled={loading}
                        className="w-full rounded-xl bg-blue-600 py-3 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    >

                        {loading
                            ? "Connexion..."
                            : "Se connecter"}

                    </button>

                </form>

            </div>

        </div>
    );

}