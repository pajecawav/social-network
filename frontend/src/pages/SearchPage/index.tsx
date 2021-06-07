import React from "react";
import { useHistory } from "react-router";
import { Tab, TabsHeader } from "../../components/TabsHeader";
import { useSearchParams } from "../../hooks/useSearchParams";
import { buildSearchString } from "../../utils";
import { SearchGroupsTab } from "./SearchGroupsTab";
import { SearchUsersTab } from "./SearchUsersTab";

const TABS: Tab[] = [
    { tab: "users", title: "People" },
    { tab: "groups", title: "Groups" },
];

export const SearchPage = () => {
    const { section: selectedTab = "users" } = useSearchParams();
    const history = useHistory();

    const changeTab = (tab: string) => {
        history.push({
            pathname: "/search",
            search: buildSearchString({ section: tab }),
        });
    };

    let component;
    switch (selectedTab) {
        case "groups":
            component = <SearchGroupsTab />;
            break;
        case "users":
        default:
            component = <SearchUsersTab />;
            break;
    }

    return (
        <div className="flex flex-col">
            <TabsHeader
                tabs={TABS}
                selectedTab={selectedTab}
                onTabSelected={changeTab}
            />

            {component}
        </div>
    );
};
