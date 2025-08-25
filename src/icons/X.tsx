/**
 * X Icon
 *
 * @example
 * <X size={20} />
 */

type Props = {
    size?: number;
    color?: string;
    className?: string;
};

export default function X({
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
                d="M6 6L18 18M18 6L6 18"
                stroke={color}
                strokeWidth={3}
                strokeLinecap="round"
            />
        </svg>
    );
}