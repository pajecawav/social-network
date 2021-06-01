import clsx from "clsx";
import { ReactComponent as SpinnerIcon } from "../icons/spinner.svg";

export type SpinnerProps = {
    className?: string;
};

export const Spinner = ({ className }: SpinnerProps) => (
    <SpinnerIcon
        className={clsx("m-auto text-secondary animate-spin", className)}
    />
);
