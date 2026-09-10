import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
    // 1. On vérifie si l'utilisateur est connecté (présence du token et des infos)
    const token = localStorage.getItem('auth_token');
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    // Si aucun token n'est trouvé, on le renvoie directement à la page de connexion
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Vérification des rôles (Si la page exige d'être 'administrateur' par exemple)
    // Si l'utilisateur n'a pas le rôle requis, on le renvoie vers le Dashboard
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    // 3. Si tout est bon, on affiche la page demandée (<Outlet /> représente les composants enfants)
    return <Outlet />;
}