import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

// Auth
import LoginPage from "../pages/auth/LoginPage";

// Dashboard
import DashboardPage from "../pages/Dashboard/DashboardPage";

// Étudiants
import StudentsPage from "../pages/Students/StudentsPage";
import StudentDetailsPage from "../pages/Students/StudentDetailsPage";

// Formations
import TrainingsPage from "../pages/Trainings/TrainingsPage";

// Modules
import TrainingModulesPage from "../pages/TrainingModules/TrainingModulesPage";

// Inscriptions
import EnrollmentsPage from "../pages/enrollments/EnrollmentsPage";
import EnrollmentCreatePage from "../pages/enrollments/EnrollmentCreatePage";
import EnrollmentDetailsPage from "../pages/enrollments/EnrollmentDetailsPage";
import EnrollmentEditPage from "../pages/enrollments/EnrollmentEditPage";

// Paiements
import PaymentsPage from "../pages/Payments/PaymentsPage";
import PaymentCreatePage from "../pages/Payments/PaymentCreatePage";
import PaymentDetailsPage from "../pages/Payments/PaymentDetailsPage";
import PaymentEditPage from "../pages/Payments/PaymentEditPage";
import PaymentReceiptPage from "../pages/Payments/PaymentReceiptPage";

// Rapports
import ReportsPage from "../pages/Reports/ReportsPage";

export default function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =========================
                    Route publique
                ========================== */}

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                {/* =========================
                    Routes protégées
                ========================== */}

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >

                    {/* Dashboard */}

                    <Route
                        index
                        element={<DashboardPage />}
                    />

                    {/* Étudiants */}

                    <Route
                        path="students"
                        element={<StudentsPage />}
                    />

                    <Route
                        path="students/:id"
                        element={<StudentDetailsPage />}
                    />

                    {/* Formations */}

                    <Route
                        path="trainings"
                        element={<TrainingsPage />}
                    />

                    {/* Modules */}

                    <Route
                        path="training-modules"
                        element={<TrainingModulesPage />}
                    />

                    {/* Inscriptions */}

                    <Route
                        path="enrollments"
                        element={<EnrollmentsPage />}
                    />

                    <Route
                        path="enrollments/create"
                        element={<EnrollmentCreatePage />}
                    />

                    <Route
                        path="enrollments/:id"
                        element={<EnrollmentDetailsPage />}
                    />

                    <Route
                        path="enrollments/:id/edit"
                        element={<EnrollmentEditPage />}
                    />

                    {/* Paiements */}

                    <Route
                        path="payments"
                        element={<PaymentsPage />}
                    />

                    <Route
                        path="payments/create"
                        element={<PaymentCreatePage />}
                    />

                    <Route
                        path="payments/:id"
                        element={<PaymentDetailsPage />}
                    />

                    <Route
                        path="payments/:id/edit"
                        element={<PaymentEditPage />}
                    />

                    <Route
                        path="payments/:id/receipt"
                        element={<PaymentReceiptPage />}
                    />

                    {/* Dépenses */}

                    <Route
                        path="expenses"
                        element={
                            <h1 className="p-8 text-2xl">
                                Dépenses (à venir)
                            </h1>
                        }
                    />

                    {/* Rapports */}

                    <Route
                        path="reports"
                        element={<ReportsPage />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>

    );

}