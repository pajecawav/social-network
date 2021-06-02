import clsx from "clsx";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";
import { ContentRouter } from "./ContentRouter";
import { MobileNavigationBar } from "./MobileNavigationBar";
import { NavigationBar } from "./NavigationBar";

export const Layout = () => {
    const isSmallScreen = useIsSmallScreen();

    return (
        <div
            className={clsx(
                "w-full flex flex-grow max-w-5xl pb-12 m-auto md:pb-4 md:flex-row",
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
};
