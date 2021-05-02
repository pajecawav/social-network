import clsx from "clsx";

export function HeaderWithCount({ title, count, className, children }) {
    return (
        <div
            className={clsx("py-3 px-4 border-b border-primary-700", className)}
        >
            <div className="flex items-center">
                <span>{title}</span>
                {Boolean(count) && (
                    <span className="ml-3 text-primary-500">{count}</span>
                )}
            </div>

            {children}
        </div>
    );
}
