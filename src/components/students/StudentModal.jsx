import { useEffect, useState } from "react";

export default function StudentModal({
    isOpen,
    onClose,
    onSave,
    student = null,
}) {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        gender: "M",
        birth_date: "",
        phone: "",
        email: "",
        address: "",
        emergency_contact: "",
    });

    useEffect(() => {
        if (student) {
            setFormData({
                first_name: student.first_name || "",
                last_name: student.last_name || "",
                gender: student.gender || "M",
                birth_date: student.birth_date || "",
                phone: student.phone || "",
                email: student.email || "",
                address: student.address || "",
                emergency_contact: student.emergency_contact || "",
            });
        } else {
            setFormData({
                first_name: "",
                last_name: "",
                gender: "M",
                birth_date: "",
                phone: "",
                email: "",
                address: "",
                emergency_contact: "",
            });
        }
    }, [student, isOpen]);

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (
            !formData.first_name.trim() ||
            !formData.last_name.trim() ||
            !formData.phone.trim()
        ) {
            alert("Veuillez remplir tous les champs obligatoires.");
            return;
        }

        try {
            setLoading(true);
            await onSave(formData);
        } finally {
            setLoading(false);
        }
    }

    function handleClose() {
        if (!loading) {
            onClose();
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">

            <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">

                <div className="mb-6 flex items-center justify-between">

                    <h2 className="text-3xl font-bold">
                        {student
                            ? "Modifier l'étudiant"
                            : "Nouvel étudiant"}
                    </h2>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="text-3xl font-light text-gray-500 transition hover:text-red-600 disabled:opacity-50"
                    >
                        &times;
                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-2 gap-4"
                >

                    <input
                        type="text"
                        name="first_name"
                        placeholder="Prénom *"
                        value={formData.first_name}
                        onChange={handleChange}
                        required
                        className="rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="text"
                        name="last_name"
                        placeholder="Nom *"
                        value={formData.last_name}
                        onChange={handleChange}
                        required
                        className="rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="M">Masculin</option>
                        <option value="F">Féminin</option>
                    </select>

                    <input
                        type="date"
                        name="birth_date"
                        value={formData.birth_date}
                        onChange={handleChange}
                        className="rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="text"
                        name="phone"
                        placeholder="Téléphone *"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="text"
                        name="address"
                        placeholder="Adresse"
                        value={formData.address}
                        onChange={handleChange}
                        className="col-span-2 rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <input
                        type="text"
                        name="emergency_contact"
                        placeholder="Contact d'urgence"
                        value={formData.emergency_contact}
                        onChange={handleChange}
                        className="col-span-2 rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="col-span-2 mt-6 flex justify-end gap-3">

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={loading}
                            className="rounded-lg border px-5 py-2 hover:bg-gray-100 disabled:opacity-50"
                        >
                            Annuler
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                        >
                            {loading
                                ? "Enregistrement..."
                                : student
                                ? "Mettre à jour"
                                : "Enregistrer"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}