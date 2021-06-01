import { useEffect, useState } from "react";

const getArgs = () => {
    let hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") {
        // Opera 12.10 and Firefox 18 and later support
        hidden = "hidden";
        visibilityChange = "visibilitychange";
    } else if ("msHidden" in document) {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
    } else if ("webkinHidden" in document) {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
    }
    return [hidden, visibilityChange] as [string, string];
};

const getIsVisible = () => {
    const [hidden] = getArgs();
    if (typeof hidden !== "undefined") {
        return (document as any)[hidden] as boolean;
    } else {
        return true;
    }
};

export const useIsPageVisible = () => {
    const [isVisible, setIsVisible] = useState(getIsVisible());

    useEffect(() => {
        const [hidden, visibilityChange] = getArgs();
        if (typeof hidden !== "undefined") {
            const listener = () => {
                setIsVisible(!(document as any)[hidden]);
            };
            document.addEventListener(visibilityChange, listener);
            return () =>
                document.removeEventListener(visibilityChange, listener);
        } else {
            setIsVisible(true);
        }
    }, []);

    return isVisible;
};
