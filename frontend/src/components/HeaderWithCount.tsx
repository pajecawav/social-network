import clsx from "clsx";
import { PropsWithChildren } from "react";

type HeaderWithCountProps = PropsWithChildren<{
    title: string;
    count?: number | null;
    className?: string;
}>;

export const HeaderWithCount = ({
    title,
    count,
    className,
    children,
}: HeaderWithCountProps) => (
    <div className={clsx("py-3 px-4 border-b border-primary-700", className)}>
        <div className="flex items-center">
            <span>{title}</span>
            {Number.isInteger(count) && (
                <span className="ml-3 text-primary-500">{count}</span>
            )}
        </div>

        {children}
    </div>
);
