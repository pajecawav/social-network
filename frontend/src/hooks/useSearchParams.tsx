import { useLocation } from "react-router-dom";

export const useSearchParams = () => {
    const location = useLocation();

    const params_ = new URLSearchParams(location.search);
    let params: Record<string, string> = {};

    params_.forEach((value, key) => {
        params[key] = value;
    });

    return params;
};
