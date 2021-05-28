import { useEffect, useState } from "react";

const getArgs = () => {
    let hidden, visibilityChange;
    if (typeof document.hidden !== "undefined") {
        // Opera 12.10 and Firefox 18 and later support
        hidden = "hidden";
        visibilityChange = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
    }
    return [hidden, visibilityChange];
};

const getIsVisible = () => {
    const [hidden] = getArgs();
    if (typeof hidden !== "undefined") {
        return document[hidden];
    } else {
        return true;
    }
};

export function useIsPageVisible() {
    const [isVisible, setIsVisible] = useState(getIsVisible());

    useEffect(() => {
        const [hidden, visibilityChange] = getArgs();
        if (typeof hidden !== "undefined") {
            const listener = () => {
                setIsVisible(!document[hidden]);
            };
            document.addEventListener(visibilityChange, listener);
            return () =>
                document.removeEventListener(visibilityChange, listener);
        } else {
            setIsVisible(true);
        }
    }, []);

    return isVisible;
}
