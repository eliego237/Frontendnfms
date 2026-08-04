import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
    Boxes,
    BookOpen,
    Clock3,
    Hash,
    FileText,
} from "lucide-react";

import Modal from "../../../components/ui/Modal";
import FormInput from "../../../components/ui/FormInput";
import FormTextarea from "../../../components/ui/FormTextarea";
import FormSwitch from "../../../components/ui/FormSwitch";
import Button from "../../../components/ui/Button";

import {
    createTrainingModule,
    updateTrainingModule,
} from "../../../services/trainingModuleService";

import { getTrainings } from "../../../services/trainingService";

export default function TrainingModuleModal({

    open,

    module,

    onClose,

    onSuccess,

}) {

    const editing = Boolean(module);

    const [saving, setSaving] = useState(false);

    const [trainings, setTrainings] = useState([]);

    const [form, setForm] = useState({

        training_id: "",

        code: "",

        title: "",

        duration_hours: "",

        position: "",

        description: "",

        is_active: true,

    });

    useEffect(() => {

        if (!open) return;

        loadTrainings();

    }, [open]);

    useEffect(() => {

        if (!module) {

            setForm({

                training_id: "",

                code: "",

                title: "",

                duration_hours: "",

                position: "",

                description: "",

                is_active: true,

            });

            return;

        }

        setForm({

            training_id: module.training_id,

            code: module.code,

            title: module.title,

            duration_hours: module.duration_hours,

            position: module.position,

            description: module.description || "",

            is_active: Boolean(module.is_active),

        });

    }, [module]);

    async function loadTrainings() {

        try {

            const response = await getTrainings();

            setTrainings(response.data || []);

        }

        catch {

            toast.error("Impossible de charger les formations.");

        }

    }

    function handleChange(e) {

        const { name, value, type, checked } = e.target;

        setForm((prev) => ({

            ...prev,

            [name]:

                type === "checkbox"

                    ? checked

                    : value,

        }));

    }

    async function handleSubmit(e) {

        e.preventDefault();

        try {

            setSaving(true);

            if (editing) {

                await updateTrainingModule(

                    module.id,

                    form

                );

                toast.success("Module modifié.");

            }

            else {

                await createTrainingModule(form);

                toast.success("Module créé.");

            }

            onSuccess();

        }

        catch (error) {

            console.error(error);

            toast.error("Impossible d'enregistrer.");

        }

        finally {

            setSaving(false);

        }

    }

    return (

        <Modal

            open={open}

            onClose={onClose}

            title={

                editing

                    ? "Modifier le module"

                    : "Nouveau module"

            }

            size="2xl"

        >

            <form

                onSubmit={handleSubmit}

                className="space-y-6"

            >

                <div className="grid gap-5 md:grid-cols-2">

                    <div>

                        <label className="mb-2 block font-semibold">

                            Formation

                        </label>

                        <select

                            name="training_id"

                            value={form.training_id}

                            onChange={handleChange}

                            required

                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"

                        >

                            <option value="">

                                Sélectionner...

                            </option>

                            {trainings.map((training) => (

                                <option

                                    key={training.id}

                                    value={training.id}

                                >

                                    {training.title}

                                </option>

                            ))}

                        </select>

                    </div>

                    <FormInput

                        label="Code"

                        icon={Hash}

                        name="code"

                        value={form.code}

                        onChange={handleChange}

                        placeholder="MOD001"

                        required

                    />

                    <FormInput

                        label="Titre"

                        icon={Boxes}

                        name="title"

                        value={form.title}

                        onChange={handleChange}

                        placeholder="Introduction..."

                        required

                    />

                    <FormInput

                        label="Durée (heures)"

                        icon={Clock3}

                        type="number"

                        name="duration_hours"

                        value={form.duration_hours}

                        onChange={handleChange}

                        required

                    />

                    <FormInput

                        label="Position"

                        icon={BookOpen}

                        type="number"

                        name="position"

                        value={form.position}

                        onChange={handleChange}

                        required

                    />

                    <div className="md:col-span-2">

                        <FormTextarea

                            label="Description"

                            icon={FileText}

                            rows={5}

                            name="description"

                            value={form.description}

                            onChange={handleChange}

                            placeholder="Description du module..."

                        />

                    </div>

                    <div className="md:col-span-2">

                        <FormSwitch

                            label="Module actif"

                            checked={form.is_active}

                            onChange={(value) =>

                                setForm((prev) => ({

                                    ...prev,

                                    is_active: value,

                                }))

                            }

                        />

                    </div>

                </div>

                                <div className="flex items-center justify-end gap-4 border-t border-slate-200 pt-6">

                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={saving}
                    >
                        Annuler
                    </Button>

                    <Button
                        type="submit"
                        loading={saving}
                    >
                        {editing
                            ? "Enregistrer les modifications"
                            : "Créer le module"}
                    </Button>

                </div>

            </form>

        </Modal>

    );

}