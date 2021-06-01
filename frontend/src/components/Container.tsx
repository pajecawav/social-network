import clsx from "clsx";
import { PropsWithChildren } from "react";

type ContainerProps = PropsWithChildren<{
    className?: string;
}>;

export const Container = ({ className, children }: ContainerProps) => {
    return (
        <div
            className={clsx(
                "bg-primary-800 rounded shadow-sm border border-primary-800",
                className
            )}
        >
            {children}
        </div>
    );
};
