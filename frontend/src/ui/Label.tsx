import clsx from "clsx";
import { DetailedHTMLProps, LabelHTMLAttributes } from "react";

type LabelProps = DetailedHTMLProps<
    LabelHTMLAttributes<HTMLLabelElement>,
    HTMLLabelElement
> & {
    text: string;
};

export const Label = ({ text, className, ...props }: LabelProps) => {
    return (
        <label
            className={clsx(
                "block -mb-2 text-justify max-w-36 text-primary-500 sm:mb-0 sm:text-right",
                className
            )}
            {...props}
        >
            {text}
        </label>
    );
};
