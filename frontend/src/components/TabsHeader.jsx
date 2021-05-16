import clsx from "clsx";

export function TabsHeader({ tabs, selectedTab, onTabSelected, children }) {
    return (
        <div className="py-3 px-4 border-b border-primary-700">
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
                            <span className="ml-3 text-primary-500">
                                {count}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {children}
        </div>
    );
}
