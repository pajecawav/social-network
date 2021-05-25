import { useHistory } from "react-router";
import { Container } from "../../components/Container";
import { TabsBlock } from "../../components/TabsBlock";
import { TabsHeader } from "../../components/TabsHeader";
import { useIsSmallScreen } from "../../hooks/useIsSmallScreen";
import { useSearchParams } from "../../hooks/useSearchParams";
import { buildSearchString } from "../../utils";
import { FriendRequestsSubpage } from "./FriendRequestsSubpage";
import { MyFriendsSubpage } from "./MyFriendsSubpage";

// TODO: figure out how to implement counts for tabs in subpages
// TODO: better organization of tabs (without repeating data)
const MY_FRIENDS_TABS = [
    {
        tab: "all",
        title: "All friends",
    },
    {
        tab: "online",
        title: "Friends online",
    },
];
const FRIEND_REQUESTS_TABS = [
    {
        tab: "requests_incoming",
        title: "Incoming requests",
    },
    {
        tab: "requests_sent",
        title: "Sent requests",
    },
];
const SIDEBAR_TABS = [
    {
        tab: "all",
        title: "My friends",
    },
    {
        tab: "requests_incoming",
        title: "Friend requests",
    },
];

// TODO: handle invalid section from url params
export function FriendsPage() {
    const { id: userId = null, section: selectedTab = "all" } =
        useSearchParams();
    const history = useHistory();
    const isSmallScreen = useIsSmallScreen();

    let subpage;
    if (selectedTab === "all" || selectedTab === "online") {
        subpage = <MyFriendsSubpage />;
    } else {
        subpage = <FriendRequestsSubpage />;
    }

    let tabs;
    let tabsBlockSelectedTab;
    if (isSmallScreen) {
        tabs = [...MY_FRIENDS_TABS, ...FRIEND_REQUESTS_TABS];
    } else {
        if (["all", "online"].includes(selectedTab)) {
            tabs = MY_FRIENDS_TABS;
            tabsBlockSelectedTab = "all";
        } else {
            tabs = FRIEND_REQUESTS_TABS;
            tabsBlockSelectedTab = "requests_incoming";
        }
    }

    const handleTabSelected = (newTab) => {
        if (newTab !== selectedTab) {
            history.push({
                pathname: "/friends",
                search: buildSearchString({
                    id: userId,
                    section: newTab,
                }),
            });
        }
    };

    return (
        <div className="flex gap-4">
            <Container className="flex flex-col flex-grow">
                <TabsHeader
                    tabs={tabs}
                    selectedTab={selectedTab}
                    onTabSelected={handleTabSelected}
                />
                {subpage}
            </Container>

            {!isSmallScreen && (
                <TabsBlock
                    className="w-48"
                    tabs={SIDEBAR_TABS}
                    selectedTab={tabsBlockSelectedTab}
                    onTabSelected={handleTabSelected}
                />
            )}
        </div>
    );
}
