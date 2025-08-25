/**
 * Check Icon
 *
 * @example
 * <Check size={20} />
 * <Check size={16} className="text-slate-500" />
 */


type Props = {
    size?: number;
    color?: string;
    className?: string;
};

export default function Check({
    size = 24,
    color = 'currentColor',
    className = '',
}: Props) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            className={className}
        >
            <path
                d="M3 10.5L9.75 17.25L21 6"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}