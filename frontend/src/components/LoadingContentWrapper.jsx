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
        <div className={clsx("flex", className, isLoading && loadingClassName)}>
            <Spinner className="m-auto" {...props} />
        </div>
    ) : (
        children
    );
}
