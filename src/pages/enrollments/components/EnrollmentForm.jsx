import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
    getStudents,
} from "../../../services/studentService";

import {
    getTrainings,
} from "../../../services/trainingService";

import {
    createEnrollment,
} from "../../../services/enrollmentService";

import EnrollmentStudentCard from "./EnrollmentStudentCard";
import EnrollmentTrainingCard from "./EnrollmentTrainingCard";
import EnrollmentModulesCard from "./EnrollmentModulesCard";
import EnrollmentFinanceCard from "./EnrollmentFinanceCard";
import EnrollmentInformationCard from "./EnrollmentInformationCard";
import EnrollmentActions from "./EnrollmentActions";

export default function EnrollmentForm() {

    const navigate = useNavigate();

    const [students, setStudents] = useState([]);

    const [trainings, setTrainings] = useState([]);

    const [loading, setLoading] = useState(false);

    const [studentId, setStudentId] = useState("");

    const [trainingId, setTrainingId] = useState("");

    const [discount, setDiscount] = useState(0);

    const [enrolledAt, setEnrolledAt] = useState(
        new Date().toISOString().slice(0, 10)
    );

    const [academicYear, setAcademicYear] = useState("2026-2027");

    const [notes, setNotes] = useState("");

    const REGISTRATION_FEE = 16500;

    useEffect(() => {

        loadData();

    }, []);

    async function loadData() {

        try {

            const [
                studentsResponse,
                trainingsResponse,
            ] = await Promise.all([

                getStudents(),

                getTrainings(),

            ]);

            setStudents(

                studentsResponse.data.data || []

            );

            setTrainings(

                trainingsResponse.data || []

            );

        }

        catch (error) {

            console.error(error);

            toast.error(
                "Impossible de charger les données."
            );

        }

    }

    const selectedTraining = useMemo(() => {

        return trainings.find(

            training =>
                Number(training.id) === Number(trainingId)

        );

    }, [

        trainings,

        trainingId,

    ]);

    const trainingFee = Number(

        selectedTraining?.price || 0

    );

    async function handleSubmit(e) {

        e.preventDefault();

        if (!studentId) {

            toast.error(
                "Sélectionnez un étudiant."
            );

            return;

        }

        if (!trainingId) {

            toast.error(
                "Sélectionnez une formation."
            );

            return;

        }

        try {

            setLoading(true);

            await createEnrollment({

                student_id: Number(studentId),

                training_id: Number(trainingId),

                discount: Number(discount),

                academic_year: academicYear,

                enrolled_at: enrolledAt,

                notes,

            });

            toast.success(
                "Inscription créée avec succès."
            );

            navigate("/enrollments");

        }

        catch (error) {

            console.error(error);

            toast.error(

                error?.response?.data?.message ||

                "Impossible de créer l'inscription."

            );

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <form
            onSubmit={handleSubmit}
            className="space-y-8"
        >

            <EnrollmentStudentCard

                students={students}

                value={studentId}

                onChange={setStudentId}

            />

            <EnrollmentTrainingCard

                trainings={trainings}

                value={trainingId}

                onChange={setTrainingId}

            />

            <EnrollmentModulesCard

                training={selectedTraining}

            />

            <EnrollmentFinanceCard

                registrationFee={REGISTRATION_FEE}

                trainingFee={trainingFee}

                discount={discount}

                setDiscount={setDiscount}

            />

            <EnrollmentInformationCard

                enrolledAt={enrolledAt}

                setEnrolledAt={setEnrolledAt}

                academicYear={academicYear}

                setAcademicYear={setAcademicYear}

                notes={notes}

                setNotes={setNotes}

            />

            <EnrollmentActions

                loading={loading}

            />

        </form>

    );

}