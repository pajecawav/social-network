import clsx from "clsx";
import { ReactComponent as SpinnerIcon } from "../icons/spinner.svg";

export function LoadingContentWrapper({ isLoading, className, children }) {
    if (Boolean(isLoading)) {
        return (
            <SpinnerIcon
                className={clsx(
                    "m-auto text-purple-500 animate-spin",
                    className
                )}
            />
        );
    }

    return children;
}
