export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <img src="/Ngologo.png" alt="Loading" className="w-10 h-10 object-contain animate-pulse" />
                </div>
            </div>
        </div>
    );
}
