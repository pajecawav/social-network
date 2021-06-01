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
    }>;

export const Button = ({
    className,
    size = "normal",
    children,
    ...props
}: ButtonProps) => (
    <button
        className={clsx(
            "px-6 py-2 transition-all duration-200 rounded hover:bg-opacity-90 disabled:cursor-auto bg-secondary disabled:bg-primary-600",
            sizeClassnames[size],
            className
        )}
        {...props}
    >
        {children}
    </button>
);
