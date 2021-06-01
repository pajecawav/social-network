import clsx from "clsx";
import { Container } from "./Container";
import { Tab } from "./TabsHeader";

type TabsBlockProps = {
    tabs: Tab[];
    selectedTab: string;
    onTabSelected: (tab: string) => void;
    className?: string;
};

export const TabsBlock = ({
    tabs,
    selectedTab: selectedTabId,
    onTabSelected,
    className,
}: TabsBlockProps) => (
    <Container
        className={clsx("flex flex-col self-start flex-shrink py-3", className)}
    >
        {tabs.map((tab) => (
            <div
                className={clsx(
                    "px-2 py-1 transition-colors duration-100 border-l-2 border-transparent cursor-pointer hover:bg-primary-700",
                    tab.tab === selectedTabId &&
                        "text-secondary-500 bg-primary-700 border-secondary-900"
                )}
                onClick={() => onTabSelected(tab.tab)}
                key={tab.tab}
            >
                {tab.title}
            </div>
        ))}
    </Container>
);
