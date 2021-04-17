import clsx from "clsx";
import { Link } from "react-router-dom";

export function NavigationLink({
    className,
    activeClassName,
    icon: Icon,
    text,
    ...props
}) {
    return (
        <Link
            className={clsx(
                "flex items-center p-1 gap-2 hover:bg-gray-300 hover:bg-opacity-40 rounded transition-colors duration-100",
                className
            )}
            {...props}
        >
            {Icon && (
                <Icon className="w-5 h-5 text-purple-500 stroke-current stroke-1" />
            )}
            <div className="text-sm">{text}</div>
        </Link>
    );
}
