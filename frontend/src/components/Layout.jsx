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
                "flex m-auto px-3 mt-4 max-w-5xl mb-4",
                isSmallScreen && "flex-col pb-12"
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
