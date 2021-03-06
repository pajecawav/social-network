import { ChevronDownIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import { PropsWithChildren, useState } from "react";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";
import { DropdownMenuItem } from "../ui/DropdownMenuItem";
import { Dropdown } from "./Dropdown";

// TODO: move this type to a separate file
export type Tab = {
    tab: string;
    title: string;
    count?: number;
};

type TabsProps = {
    tabs: Tab[];
    selectedTab: string;
    onTabSelected: (tab: string) => void;
};

const Tabs = ({ tabs, selectedTab, onTabSelected }: TabsProps) => (
    <div className="flex gap-4">
        {tabs.map(({ title, tab, count }) => (
            <div
                className={clsx(
                    "flex items-center px-1 pb-3 border-b-2 cursor-pointer transition-colors duration-100",
                    tab === selectedTab
                        ? "border-b-2 border-secondary-700"
                        : "border-transparent hover:border-primary-600"
                )}
                onClick={() => {
                    if (tab !== selectedTab) {
                        onTabSelected(tab);
                    }
                }}
                key={tab}
            >
                <span>{title}</span>
                {Boolean(count) && (
                    <span className="ml-3 text-primary-500">{count}</span>
                )}
            </div>
        ))}
    </div>
);

type DropdownTabsProps = TabsProps;

const DropdownTabs = ({
    tabs,
    selectedTab: selectedTabId,
    onTabSelected,
}: DropdownTabsProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedTab = tabs.find((tab) => tab.tab === selectedTabId);

    if (selectedTab === undefined) {
        throw new Error(`Tab ${selectedTabId} is not in the tabs array.`);
    }

    return (
        <div className="relative w-max">
            <div
                className="flex gap-2 cursor-pointer"
                onClick={() => setIsOpen(true)}
            >
                <div>
                    {selectedTab.title}
                    {Boolean(selectedTab.count) && (
                        <span className="ml-2 text-primary-500">
                            {selectedTab.count}
                        </span>
                    )}
                </div>
                <ChevronDownIcon className="w-4 text-secondary-500" />
            </div>
            <Dropdown
                className="py-2 mt-1 text-xl border-2 rounded-md shadow-md w-max bg-primary-700 border-primary-600"
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
            >
                <div className="flex flex-col">
                    {tabs.map(({ title, tab }) => (
                        <DropdownMenuItem
                            className={clsx(
                                tab === selectedTabId && "text-secondary-500"
                            )}
                            text={title}
                            onClick={() => {
                                if (tab !== selectedTabId) {
                                    onTabSelected(tab);
                                    setIsOpen(false);
                                }
                            }}
                            key={tab}
                        />
                    ))}
                </div>
            </Dropdown>
        </div>
    );
};

type TabsHeaderProps = PropsWithChildren<{
    tabs: Tab[];
    selectedTab: string;
    onTabSelected: (tab: string) => void;
}>;

export function TabsHeader({
    tabs,
    selectedTab,
    onTabSelected,
    children,
}: TabsHeaderProps) {
    const isSmallScreen = useIsSmallScreen();

    const Component = isSmallScreen ? DropdownTabs : Tabs;

    return (
        <div className="px-4 py-3 border-b border-primary-700">
            <Component
                tabs={tabs}
                selectedTab={selectedTab}
                onTabSelected={onTabSelected}
            />

            {children}
        </div>
    );
}
