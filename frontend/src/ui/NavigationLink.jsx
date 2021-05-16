import clsx from "clsx";
import { Link } from "react-router-dom";

export function NavigationLink({
    className,
    activeClassName,
    icon: Icon,
    text,
    isBigIcon = false,
    ...props
}) {
    return (
        <Link
            className={clsx(
                "flex items-center px-1 py-2 gap-2 hover:bg-primary-600 hover:bg-opacity-40 rounded transition-colors duration-100",
                className
            )}
            {...props}
        >
            {Icon && (
                <Icon className="text-secondary stroke-current stroke-1 w-7 h-7 md:w-5 md:h-5" />
            )}
            <div className="text-xl md:text-base">{text}</div>
        </Link>
    );
}
