import clsx from "clsx";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";
import { ContentRouter } from "./ContentRouter";
import { MobileNavigationBar } from "./MobileNavigationBar";
import { NavigationBar } from "./NavigationBar";

export function Layout() {
    const isSmallScreen = useIsSmallScreen();

    return (
        <div
            className={clsx(
                "flex m-auto px-3 py-4 max-w-5xl",
                isSmallScreen && "flex-col pb-14 height-full"
            )}
        >
            {!isSmallScreen && <NavigationBar />}
            <div className="flex-grow min-w-0">
                <ContentRouter />
            </div>
            {isSmallScreen && <MobileNavigationBar />}
        </div>
    );
}
