import React from "react";
import { useHistory } from "react-router";
import { Container } from "../../components/Container";
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
        <Container className="flex flex-col min-h-full md:min-h-0">
            <TabsHeader
                tabs={TABS}
                selectedTab={selectedTab}
                onTabSelected={changeTab}
            />

            {component}
        </Container>
    );
};
