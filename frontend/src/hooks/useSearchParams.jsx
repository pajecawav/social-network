import { useLocation } from "react-router-dom";

export function useSearchParams() {
    const location = useLocation();

    const params_ = new URLSearchParams(location.search);
    let params = {};

    params_.forEach((value, key) => {
        params[key] = value;
    });

    return params;
}
