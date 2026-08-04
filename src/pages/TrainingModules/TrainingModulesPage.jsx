import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

import {
    getTrainingModules,
    deleteTrainingModule,
} from "../../services/trainingModuleService";

import TrainingModuleHeader from "./components/TrainingModuleHeader";
import TrainingModuleStats from "./components/TrainingModuleStats";
import TrainingModuleFilters from "./components/TrainingModuleFilters";
import TrainingModuleTable from "./components/TrainingModuleTable";
import TrainingModuleModal from "./components/TrainingModuleModal";
import TrainingModuleDetailsDrawer from "./components/TrainingModuleDetailsDrawer";

export default function TrainingModulesPage() {

    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [training, setTraining] = useState("");
    const [status, setStatus] = useState("");

    const [modal, setModal] = useState({
        open: false,
        module: null,
    });

    const [drawer, setDrawer] = useState({
        open: false,
        module: null,
    });

    useEffect(() => {
        loadModules();
    }, []);

    async function loadModules() {

        try {

            setLoading(true);

            const response = await getTrainingModules();

            setModules(response.data || []);

        } catch (error) {

            console.error(error);

            toast.error("Impossible de charger les modules.");

        } finally {

            setLoading(false);

        }

    }

    function handleCreate() {

        setModal({
            open: true,
            module: null,
        });

    }

    function handleEdit(module) {

        setDrawer({
            open: false,
            module: null,
        });

        setModal({
            open: true,
            module,
        });

    }

    function handleView(module) {

        setDrawer({
            open: true,
            module,
        });

    }

    async function handleDelete(module) {

        const result = await Swal.fire({

            title: "Supprimer ce module ?",

            text: module.title,

            icon: "warning",

            showCancelButton: true,

            confirmButtonText: "Oui",

            cancelButtonText: "Annuler",

        });

        if (!result.isConfirmed) return;

        try {

            await deleteTrainingModule(module.id);

            toast.success("Module supprimé.");

            setDrawer({
                open: false,
                module: null,
            });

            loadModules();

        } catch {

            toast.error("Impossible de supprimer.");

        }

    }

    const filteredModules = useMemo(() => {

        return modules.filter((module) => {

            const keyword = search.toLowerCase();

            const matchSearch =

                module.title?.toLowerCase().includes(keyword)

                ||

                module.code?.toLowerCase().includes(keyword)

                ||

                module.training?.title?.toLowerCase().includes(keyword);

            const matchTraining =

                !training ||

                module.training_id == training;

            const matchStatus =

                status === ""

                ||

                Number(module.is_active) === Number(status);

            return (

                matchSearch

                &&

                matchTraining

                &&

                matchStatus

            );

        });

    }, [

        modules,

        search,

        training,

        status,

    ]);

    if (loading) {

        return (

            <div className="flex justify-center py-24">

                <div className="text-center">

                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>

                    <p className="mt-5 font-semibold">

                        Chargement des modules...

                    </p>

                </div>

            </div>

        );

    }

    return (

        <>

            <div className="space-y-8">

                <TrainingModuleHeader
                    onCreate={handleCreate}
                />

                <TrainingModuleStats
                    modules={modules}
                />

                <TrainingModuleFilters
                    modules={modules}
                    search={search}
                    setSearch={setSearch}
                    training={training}
                    setTraining={setTraining}
                    status={status}
                    setStatus={setStatus}
                />

                <TrainingModuleTable
                    modules={filteredModules}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />

            </div>

            <TrainingModuleModal
                open={modal.open}
                module={modal.module}
                onClose={() =>
                    setModal({
                        open: false,
                        module: null,
                    })
                }
                onSuccess={() => {

                    setModal({
                        open: false,
                        module: null,
                    });

                    loadModules();

                }}
            />

            <TrainingModuleDetailsDrawer
                open={drawer.open}
                module={drawer.module}
                onClose={() =>
                    setDrawer({
                        open: false,
                        module: null,
                    })
                }
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

        </>

    );

}