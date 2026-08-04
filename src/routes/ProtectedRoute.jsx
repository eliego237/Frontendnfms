import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {

    const {
        loading,
        isAuthenticated,
    } = useAuth();

    if (loading) {

        return (
            <div className="flex h-screen items-center justify-center">

                <div className="text-lg font-semibold">

                    Chargement...

                </div>

            </div>
        );

    }

    if (!isAuthenticated) {

        return <Navigate to="/login" replace />;

    }

    return children;

}