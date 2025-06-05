export default function LoadingPage() {
    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-[999] min-h-screen bg-gradient-to-tr from-[#149e94] via-[#17c2b1] to-[#1ad7cb] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-t-4 border-white border-t-pink-500 rounded-full animate-spin"></div>
                <p className="text-white text-lg font-semibold">Đang xử lý...</p>
            </div>

            <style>{`
                .animate-spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    0% {
                        transform: rotate(0deg);
                    }
                    100% {
                        transform: rotate(360deg);
                    }
                }
            `}</style>
        </div>
    );
}