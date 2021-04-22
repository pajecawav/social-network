import { useEffect } from "react";

export function useTitle(title = "Social Network", dependencies = []) {
    useEffect(() => {
        document.title = title;

        // eslint-disable-next-line
    }, [title, ...dependencies]);
}
