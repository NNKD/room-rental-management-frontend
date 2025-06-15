import {ReactNode} from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useAuth} from "../hook/useAuth.ts";
import {useNotice} from "../hook/useNotice.ts";
import {NoticeType} from "../types/Context.ts";

const ProtectedRoute = ({ children }: {children: ReactNode}) => {
    const { isAuthenticated, loading, isLogout } = useAuth();
    const location = useLocation();
    const {setMessage, setType} = useNotice();

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        if (isLogout) {
            return <Navigate to="/home" replace />;
        }
        setMessage("Đăng nhập để tiếp tục");
        setType(NoticeType.WARNING);
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;