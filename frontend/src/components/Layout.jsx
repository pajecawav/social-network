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
                "flex max-w-5xl pb-12 m-auto mb-4 md:flex-row md:pb-0",
                !isSmallScreen && "px-3 mt-4"
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
