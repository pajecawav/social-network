import clsx from "clsx";
import { ReactComponent as SpinnerIcon } from "../icons/spinner.svg";

export function Spinner({ className, innerRef }) {
    return (
        <SpinnerIcon
            className={clsx("m-auto text-secondary animate-spin", className)}
            ref={innerRef}
        />
    );
}
