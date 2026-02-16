export default function Loader({ size = 'medium', color = 'border-mars-orange' }) {
    const sizeClasses = {
        small: 'w-5 h-5 border-2',
        medium: 'w-8 h-8 border-2',
        large: 'w-12 h-12 border-4'
    };

    return (
        <div className={`animate-spin ${sizeClasses[size]} border-t-transparent ${color} rounded-full`} />
    );
}
