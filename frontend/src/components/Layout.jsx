import { useIsSmallScreen } from "../hooks/useIsSmallScreen";
import { ContentRouter } from "./ContentRouter";
import { MobileNavigationBar } from "./MobileNavigationBar";
import { NavigationBar } from "./NavigationBar";

export function Layout() {
    const isSmallScreen = useIsSmallScreen();

    return (
        <div className="flex max-w-5xl px-3 pb-12 m-auto mt-4 mb-4 md:flex-row md:pb-0">
            {!isSmallScreen && <NavigationBar />}
            <div className="flex-grow min-w-0">
                <ContentRouter />
            </div>
            {isSmallScreen && <MobileNavigationBar />}
        </div>
    );
}
