import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
    getEnrollments,
    deleteEnrollment,
} from "../../services/enrollmentService";

import EnrollmentHeader from "./components/EnrollmentHeader";
import EnrollmentStats from "./components/EnrollmentStats";
import EnrollmentFilters from "./components/EnrollmentFilters";
import EnrollmentTable from "./components/EnrollmentTable";

export default function EnrollmentsPage() {

    const [enrollments, setEnrollments] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("");

    useEffect(() => {

        loadEnrollments();

    }, []);

    async function loadEnrollments() {

        try {

            setLoading(true);

            const response = await getEnrollments();

            setEnrollments(
                response.data.data ?? []
            );

        } catch (error) {

            console.error(error);

            toast.error(
                "Impossible de charger les inscriptions."
            );

        } finally {

            setLoading(false);

        }

    }

    /**
     * Supprimer une inscription.
     */
    async function handleDelete(enrollment) {

        const studentName =
            `${enrollment.student?.first_name ?? ""} ${enrollment.student?.last_name ?? ""}`
                .trim();

        const displayName =
            studentName ||
            enrollment.enrollment_number ||
            "cette inscription";

        const confirmed = window.confirm(
            `Voulez-vous vraiment supprimer l'inscription de ${displayName} ?`
        );

        if (!confirmed) {
            return;
        }

        try {

            await deleteEnrollment(
                enrollment.id
            );

            toast.success(
                "Inscription supprimée avec succès."
            );

            await loadEnrollments();

        } catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                "Impossible de supprimer l'inscription."
            );

        }

    }

    const filteredEnrollments = useMemo(() => {

        return enrollments.filter((item) => {

            const fullname =
                `${item.student?.first_name ?? ""} ${item.student?.last_name ?? ""}`
                    .toLowerCase();

            const searchValue =
                search.toLowerCase();

            const matchesSearch =
                fullname.includes(searchValue) ||
                item.enrollment_number
                    ?.toLowerCase()
                    .includes(searchValue);

            const matchesStatus =
                !status ||
                item.status === status;

            return (
                matchesSearch &&
                matchesStatus
            );

        });

    }, [
        enrollments,
        search,
        status,
    ]);

    const stats = useMemo(() => ({

        total: enrollments.length,

        pending: enrollments.filter(
            (e) => e.status === "pending"
        ).length,

        partial: enrollments.filter(
            (e) => e.status === "partial"
        ).length,

        paid: enrollments.filter(
            (e) => e.status === "paid"
        ).length,

    }), [enrollments]);

    if (loading) {

        return (

            <div className="p-12 text-center">

                Chargement...

            </div>

        );

    }

    return (

        <div className="space-y-8">

            <EnrollmentHeader />

            <EnrollmentStats
                total={stats.total}
                pending={stats.pending}
                partial={stats.partial}
                paid={stats.paid}
            />

            <EnrollmentFilters
                search={search}
                setSearch={setSearch}
                status={status}
                setStatus={setStatus}
            />

            <EnrollmentTable
                enrollments={filteredEnrollments}
                onDelete={handleDelete}
            />

        </div>

    );

}