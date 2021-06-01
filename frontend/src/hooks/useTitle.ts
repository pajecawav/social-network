import { useEffect } from "react";

export const useTitle = (title = "Social Network") => {
    useEffect(() => {
        document.title = title;
    }, [title]);
};
