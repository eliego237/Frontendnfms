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

// Dépenses
import ExpensesPage from "../pages/Expenses/ExpensesPage";
import ExpenseCreatePage from "../pages/Expenses/ExpenseCreatePage";
import ExpenseDetailsPage from "../pages/Expenses/ExpenseDetailsPage";
import ExpenseEditPage from "../pages/Expenses/ExpenseEditPage";
import StudentsReportPage from "../pages/Reports/StudentsReportPage";

// Rapports
import ReportsPage from "../pages/Reports/ReportsPage";
import EnrollmentsReportPage from "../pages/Reports/EnrollmentsReportPage";
import PaymentsReportPage from "../pages/reports/PaymentsReportPage";
import ExpensesReportPage from "../pages/Reports/ExpensesReportPage";
import FinancialReportPage from "../pages//Reports/FinancialReportPage";
import CashBookReportPage from "../pages/Reports/CashBookReportPage";

export default function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =====================================================
                    ROUTE PUBLIQUE
                ====================================================== */}

                <Route
                    path="/login"
                    element={<LoginPage />}
                />

                {/* =====================================================
                    ROUTES PROTÉGÉES
                ====================================================== */}

                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >

                    {/* =================================================
                        DASHBOARD
                    ================================================= */}

                    <Route
                        index
                        element={<DashboardPage />}
                    />

                    {/* =================================================
                        ÉTUDIANTS
                    ================================================= */}

                    <Route
                        path="students"
                        element={<StudentsPage />}
                    />
                        
                    <Route
    path="reports/students"
    element={<StudentsReportPage />}
/>

<Route
    path="/reports/enrollments"
    element={<EnrollmentsReportPage />}
/>

<Route
    path="/reports/payments"
    element={<PaymentsReportPage />}
/>

<Route
    path="reports/expenses"
    element={<ExpensesReportPage />}
/>

<Route
    path="/reports/financial-summary"
    element={<FinancialReportPage />}
/>

<Route
  path="/reports/cash-book"
  element={<CashBookReportPage />}
/>

                    <Route
                        path="students/:id"
                        element={<StudentDetailsPage />}
                    />

                    {/* =================================================
                        FORMATIONS
                    ================================================= */}

                    <Route
                        path="trainings"
                        element={<TrainingsPage />}
                    />

                    {/* =================================================
                        MODULES DE FORMATION
                    ================================================= */}

                    <Route
                        path="training-modules"
                        element={<TrainingModulesPage />}
                    />

                    {/* =================================================
                        INSCRIPTIONS
                    ================================================= */}

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

                    {/* =================================================
                        PAIEMENTS
                    ================================================= */}

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

                    {/* =================================================
                        DÉPENSES
                    ================================================= */}

                    <Route
                        path="expenses"
                        element={<ExpensesPage />}
                    />

                    <Route
                        path="expenses/create"
                        element={<ExpenseCreatePage />}
                    />

                    <Route
                        path="expenses/:id"
                        element={<ExpenseDetailsPage />}
                    />

                    <Route
                        path="expenses/:id/edit"
                        element={<ExpenseEditPage />}
                    />

                    {/* =================================================
                        RAPPORTS
                    ================================================= */}

                    <Route
                        path="reports"
                        element={<ReportsPage />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>

    );

}