import clsx from "clsx";
import { HorizontalSeparator } from "../ui/HorizontalSeparator";

export function Container({ className, children, header }) {
    return (
        <div className={clsx("bg-white rounded shadow-sm", className)}>
            {header && (
                <>
                    <div className="flex items-center px-4 py-3">{header}</div>
                    <HorizontalSeparator />
                </>
            )}
            {children}
        </div>
    );
}
