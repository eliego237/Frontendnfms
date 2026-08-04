import { useEffect, useState } from "react";
import { BookOpen, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import Modal from "../../../components/ui/Modal";
import FormInput from "../../../components/ui/FormInput";
import FormTextarea from "../../../components/ui/FormTextarea";
import FormSwitch from "../../../components/ui/FormSwitch";
import Button from "../../../components/ui/Button";

import {
    createTraining,
    updateTraining,
} from "../../../services/trainingService";

const initialForm = {
    code: "",
    title: "",
    category: "",
    duration_months: "",
    price: "",
    certificate: "",
    description: "",
    is_active: true,
};

export default function TrainingModal({
    open,
    training,
    onClose,
    onSuccess,
}) {
    const [form, setForm] = useState(initialForm);

    const [errors, setErrors] = useState({});

    const [saving, setSaving] = useState(false);

    const isEdit = Boolean(training);

    useEffect(() => {
        if (!open) return;

        if (training) {
            setForm({
                ...initialForm,
                ...training,
                is_active: Boolean(training.is_active),
            });
        } else {
            setForm(initialForm);
        }

        setErrors({});
    }, [open, training]);

    function handleChange(e) {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function validate() {
        const e = {};

        if (!form.code.trim())
            e.code = "Le code est obligatoire.";

        if (!form.title.trim())
            e.title = "Le titre est obligatoire.";

        if (!form.category.trim())
            e.category = "La catégorie est obligatoire.";

        if (!form.duration_months)
            e.duration_months = "La durée est obligatoire.";

        if (!form.price)
            e.price = "Le prix est obligatoire.";

        setErrors(e);

        return Object.keys(e).length === 0;
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!validate()) return;

        try {
            setSaving(true);

            if (isEdit) {
                await updateTraining(training.id, form);
                toast.success("Formation modifiée.");
            } else {
                await createTraining(form);
                toast.success("Formation créée.");
            }

            onSuccess();

        } catch (error) {
            console.error(error);
            toast.error("Erreur lors de l'enregistrement.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={isEdit ? "Modifier une formation" : "Nouvelle formation"}
            subtitle="Complétez les informations de la formation."
            icon={BookOpen}
        >
            <form
                onSubmit={handleSubmit}
                className="space-y-8 p-8"
            >
                <div className="grid gap-6 md:grid-cols-2">

                    <FormInput
                        label="Code"
                        name="code"
                        value={form.code}
                        onChange={handleChange}
                        error={errors.code}
                    />

                    <FormInput
                        label="Titre"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        error={errors.title}
                    />

                    <FormInput
                        label="Catégorie"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        error={errors.category}
                    />

                    <FormInput
                        label="Durée (mois)"
                        name="duration_months"
                        type="number"
                        value={form.duration_months}
                        onChange={handleChange}
                        error={errors.duration_months}
                    />

                    <FormInput
                        label="Prix"
                        name="price"
                        type="number"
                        value={form.price}
                        onChange={handleChange}
                        error={errors.price}
                    />

                    <FormInput
                        label="Certificat"
                        name="certificate"
                        value={form.certificate}
                        onChange={handleChange}
                    />

                </div>

                <FormTextarea
                    label="Description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    maxLength={500}
                />

                <FormSwitch
                    label="Formation active"
                    description="Les étudiants pourront s'inscrire à cette formation."
                    checked={form.is_active}
                    onChange={(value) =>
                        setForm((prev) => ({
                            ...prev,
                            is_active: value,
                        }))
                    }
                />

                <div className="flex justify-end gap-4 border-t pt-6">

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                    >
                        Annuler
                    </Button>

                    <Button
                        type="submit"
                        loading={saving}
                    >
                        {saving ? (
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
                    </Button>

                </div>

            </form>
        </Modal>
    );
}