import clsx from "clsx";
import { Spinner, SpinnerProps } from "../ui/Spinner";

type LoadingPlaceholderProps = SpinnerProps;

export const LoadingPlaceholder = ({
    className,
    ...props
}: LoadingPlaceholderProps) => {
    return (
        <div className={clsx("flex h-20", className)}>
            <Spinner className="w-1/2 m-auto h-1/2" {...props} />
        </div>
    );
};
