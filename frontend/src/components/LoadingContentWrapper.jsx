import { Spinner } from "../ui/Spinner";

export function LoadingContentWrapper({ isLoading, children, ...props }) {
    return Boolean(isLoading) ? <Spinner {...props} /> : children;
}
