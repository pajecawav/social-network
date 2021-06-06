import clsx from "clsx";
import {
    ButtonHTMLAttributes,
    DetailedHTMLProps,
    PropsWithChildren,
} from "react";

const sizeClassnames = {
    normal: "py-2",
    thin: "py-1",
};

export type ButtonProps = DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
> &
    PropsWithChildren<{
        size?: keyof typeof sizeClassnames;
        className?: string;
        secondary?: boolean;
    }>;

export const Button = ({
    className,
    size = "normal",
    secondary = false,
    children,
    ...props
}: ButtonProps) => (
    <button
        className={clsx(
            "px-6 py-2 transition-all duration-200 rounded disabled:cursor-auto hover:bg-opacity-90 disabled:bg-primary-600",
            secondary ? "bg-primary-700 bg-opacity-90" : "bg-secondary ",
            sizeClassnames[size],
            className
        )}
        {...props}
    >
        {children}
    </button>
);
