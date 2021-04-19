import clsx from "clsx";
import { ReactComponent as SpinnerIcon } from "../icons/spinner.svg";

export function Spinner({ className, innerRef, size = 2 }) {
    return (
        <SpinnerIcon
            className={clsx("m-auto text-purple-500 animate-spin", className)}
            style={{ width: `${size}rem`, height: `${size}rem` }}
            ref={innerRef}
        />
    );
}
