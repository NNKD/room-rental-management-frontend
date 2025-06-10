import { useLoading } from "../contexts/LoadingContext.tsx";

const LoadingApi = () => {
    const { isApiLoading } = useLoading();

    if (!isApiLoading) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-lightGreen"></div>
                <p className="mt-4 text-white text-lg">Đang tải...</p>
            </div>
        </div>
    );
};

export default LoadingApi;