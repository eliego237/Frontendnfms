import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import {
    getTrainings,
    deleteTraining,
} from "../../services/trainingService";

import TrainingHeader from "./components/TrainingHeader";
import TrainingStats from "./components/TrainingStats";
import TrainingFilters from "./components/TrainingFilters";
import TrainingTable from "./components/TrainingTable";
import TrainingModal from "./components/TrainingModal";
import TrainingDetailsDrawer from "./components/TrainingDetailsDrawer";

export default function TrainingsPage() {

    const [trainings, setTrainings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [status, setStatus] = useState("");

    // Modal
    const [modal, setModal] = useState({
        open: false,
        training: null,
    });

    // Drawer
    const [drawer, setDrawer] = useState({
        open: false,
        training: null,
    });

    useEffect(() => {
        loadTrainings();
    }, []);

    async function loadTrainings() {

        try {

            setLoading(true);

            const response = await getTrainings();

            setTrainings(response.data || []);

        } catch (error) {

            console.error(error);

            toast.error("Impossible de charger les formations.");

        } finally {

            setLoading(false);

        }

    }

    async function handleDelete(training) {

        const result = await Swal.fire({

            title: "Supprimer cette formation ?",

            text: training.title,

            icon: "warning",

            showCancelButton: true,

            confirmButtonText: "Oui",

            cancelButtonText: "Annuler",

            confirmButtonColor: "#dc2626",

        });

        if (!result.isConfirmed) return;

        try {

            await deleteTraining(training.id);

            toast.success("Formation supprimée.");

            // ferme le drawer si la formation affichée est supprimée
            setDrawer({
                open: false,
                training: null,
            });

            loadTrainings();

        } catch {

            toast.error("Impossible de supprimer.");

        }

    }

    function handleCreate() {

        setModal({

            open: true,

            training: null,

        });

    }

    function handleEdit(training) {

        setDrawer({
            open: false,
            training: null,
        });

        setModal({

            open: true,

            training,

        });

    }

    function handleView(training) {

        setDrawer({

            open: true,

            training,

        });

    }

    const filteredTrainings = useMemo(() => {

        return trainings.filter((training) => {

            const keyword = search.toLowerCase();

            const matchSearch =

                training.title?.toLowerCase().includes(keyword) ||

                training.code?.toLowerCase().includes(keyword) ||

                training.category?.toLowerCase().includes(keyword);

            const matchCategory =

                !category ||

                training.category === category;

            const matchStatus =

                status === "" ||

                Number(training.is_active) === Number(status);

            return (

                matchSearch &&

                matchCategory &&

                matchStatus

            );

        });

    }, [

        trainings,

        search,

        category,

        status,

    ]);

    if (loading) {

        return (

            <div className="flex justify-center py-24">

                <div className="text-center">

                    <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>

                    <p className="font-semibold">

                        Chargement des formations...

                    </p>

                </div>

            </div>

        );

    }

    return (

        <>

            <div className="space-y-8">

                <TrainingHeader
                    onCreate={handleCreate}
                />

                <TrainingStats
                    trainings={trainings}
                />

                <TrainingFilters
                    trainings={trainings}
                    search={search}
                    setSearch={setSearch}
                    category={category}
                    setCategory={setCategory}
                    status={status}
                    setStatus={setStatus}
                />

                <TrainingTable
                    trainings={filteredTrainings}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

            </div>

            {/* Modal Création / Modification */}

            <TrainingModal
                open={modal.open}
                training={modal.training}
                onClose={() =>
                    setModal({
                        open: false,
                        training: null,
                    })
                }
                onSuccess={() => {

                    setModal({
                        open: false,
                        training: null,
                    });

                    loadTrainings();

                }}
            />

            {/* Drawer Détails */}

            <TrainingDetailsDrawer
                open={drawer.open}
                training={drawer.training}
                onClose={() =>
                    setDrawer({
                        open: false,
                        training: null,
                    })
                }
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

        </>

    );

}