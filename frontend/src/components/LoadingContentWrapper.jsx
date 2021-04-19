import clsx from "clsx";
import { Spinner } from "../ui/Spinner";

export function LoadingContentWrapper({
    isLoading,
    className,
    loadingClassName,
    children,
    ...props
}) {
    return isLoading ? (
        <Spinner
            className={clsx(className, isLoading && loadingClassName)}
            {...props}
        />
    ) : (
        children
    );
}
