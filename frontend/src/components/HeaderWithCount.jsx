import clsx from "clsx";

export function HeaderWithCount({ title, count, className, children }) {
    return (
        <div className={clsx("py-3 px-4", className)}>
            <div className="flex items-center">
                <span>{title}</span>
                {Boolean(count) && (
                    <span className="ml-3 text-gray-300">{count}</span>
                )}
            </div>

            {children}
        </div>
    );
}
