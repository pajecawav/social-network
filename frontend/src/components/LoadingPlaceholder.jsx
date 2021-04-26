import clsx from "clsx";
import { Spinner } from "../ui/Spinner";

export function LoadingPlaceholder({ className, ...props }) {
    return (
        <div className={clsx("flex h-20", className)}>
            <Spinner className="m-auto" {...props} />
        </div>
    );
}
