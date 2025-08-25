/**
 * Plus Icon
 *
 * @example
 * <Plus size={20} />
 * <Plus size={16} className="text-slate-500" />
 */


type Props = {
    size?: number;
    color?: string;
    className?: string;
};

export default function Plus({
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
            <path d="M3 12H21M12 3V21" stroke={color} strokeWidth="3" strokeLinecap="round" />
        </svg>
    );
}