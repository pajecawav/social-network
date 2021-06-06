import { useHistory } from "react-router";
import { Container } from "../../components/Container";
import { RecommendedFriendsBlock } from "../../components/RecommendedFriendsBlock";
import { TabsBlock } from "../../components/TabsBlock";
import { Tab, TabsHeader } from "../../components/TabsHeader";
import { useIsSmallScreen } from "../../hooks/useIsSmallScreen";
import { useSearchParams } from "../../hooks/useSearchParams";
import { buildSearchString } from "../../utils";
import { FriendRequestsSubpage } from "./FriendRequestsSubpage";
import { MyFriendsSubpage } from "./MyFriendsSubpage";

// TODO: figure out how to implement counts for tabs in subpages
// TODO: better organization of tabs (without repeating data)
const MY_FRIENDS_TABS: Tab[] = [
    {
        tab: "all",
        title: "All friends",
    },
    {
        tab: "online",
        title: "Friends online",
    },
];
const FRIEND_REQUESTS_TABS: Tab[] = [
    {
        tab: "requests_incoming",
        title: "Incoming requests",
    },
    {
        tab: "requests_sent",
        title: "Sent requests",
    },
];
const SIDEBAR_TABS: Tab[] = [
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
export const FriendsPage = () => {
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
    let tabsBlockSelectedTab = "all";
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

    const handleTabSelected = (newTab: string) => {
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
        <div className="flex min-h-full gap-4 md:min-h-0">
            <Container className="flex flex-col flex-grow">
                <TabsHeader
                    tabs={tabs}
                    selectedTab={selectedTab}
                    onTabSelected={handleTabSelected}
                />
                {subpage}
            </Container>

            {!isSmallScreen && (
                <div className="flex flex-col gap-4 w-52">
                    <TabsBlock
                        className="w-full"
                        tabs={SIDEBAR_TABS}
                        selectedTab={tabsBlockSelectedTab}
                        onTabSelected={handleTabSelected}
                    />
                    <RecommendedFriendsBlock className="w-full" />
                </div>
            )}
        </div>
    );
};
