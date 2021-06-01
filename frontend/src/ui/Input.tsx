import clsx from "clsx";
import {
    DetailedHTMLProps,
    forwardRef,
    InputHTMLAttributes,
    PropsWithChildren,
} from "react";

export type InputProps = Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    "onChange"
> &
    PropsWithChildren<{
        className?: string;
        flat?: boolean;
        onChange?: (value: string) => void;
        onEnterPressed?: (event: KeyboardEvent) => void;
    }>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            flat = false,
            onChange,
            onEnterPressed,
            children,
            ...props
        },
        ref
    ) => {
        return (
            <input
                className={clsx(
                    "px-2 py-1 bg-primary-700 placeholder-primary-400 transition-colors duration-100 border-primary-600 rounded outline-none appearance-none font-sm text-primary-200 focus:border-secondary",
                    !flat && "border-2",
                    className
                )}
                size={1}
                onChange={(event) => onChange?.(event.target.value)}
                onKeyPress={(event) => {
                    if (event.key === "Enter") {
                        onEnterPressed?.(event as any);
                    }
                }}
                {...props}
                ref={ref}
            />
        );
    }
);
