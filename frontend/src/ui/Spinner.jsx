import clsx from "clsx";
import { ReactComponent as SpinnerIcon } from "../icons/spinner.svg";

export function Spinner({ className, innerRef, scale = 2 }) {
    return (
        <SpinnerIcon
            className={clsx("m-auto text-secondary animate-spin", className)}
            style={{ width: `${scale}rem`, height: `${scale}rem` }}
            ref={innerRef}
        />
    );
}
