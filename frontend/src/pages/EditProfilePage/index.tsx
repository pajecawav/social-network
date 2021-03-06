import { useHistory } from "react-router-dom";
import { Container } from "../../components/Container";
import { HeaderWithCount } from "../../components/HeaderWithCount";
import { TabsBlock } from "../../components/TabsBlock";
import { Tab, TabsHeader } from "../../components/TabsHeader";
import { useIsSmallScreen } from "../../hooks/useIsSmallScreen";
import { useSearchParams } from "../../hooks/useSearchParams";
import { useTitle } from "../../hooks/useTitle";
import { buildSearchString } from "../../utils";
import { AccountInfoSubpage } from "./AccountInfoSubpage";
import { PasswordSubpage } from "./PasswordSubpage";
import { ProfilePictureSubpage } from "./ProfilePictureSubpage";
import { UserInfoSubpage } from "./UserInfoSubpage";

const TABS: Tab[] = [
    { tab: "account", title: "Account" },
    { tab: "password", title: "Password" },
    { tab: "info", title: "User information" },
    { tab: "avatar", title: "Profile picture" },
];

export function EditProfilePage() {
    const { section: selectedTab = "info" } = useSearchParams();
    const history = useHistory();
    const isSmallScreen = useIsSmallScreen();

    useTitle("Edit my profile");

    const changeTab = (tab: string) => {
        history.push({
            pathname: "/edit",
            search: buildSearchString({ section: tab }),
        });
    };

    let component;
    switch (selectedTab) {
        case "account":
            component = <AccountInfoSubpage />;
            break;
        case "password":
            component = <PasswordSubpage />;
            break;
        case "avatar":
            component = <ProfilePictureSubpage />;
            break;
        case "info":
        default:
            component = <UserInfoSubpage />;
            break;
    }

    return (
        <div className="flex gap-4">
            <Container className="flex flex-col flex-grow">
                {isSmallScreen ? (
                    <TabsHeader
                        tabs={TABS}
                        selectedTab={selectedTab}
                        onTabSelected={changeTab}
                    />
                ) : (
                    <HeaderWithCount
                        title={
                            (TABS.find((t) => t.tab === selectedTab) as Tab)
                                .title
                        }
                    />
                )}
                {component}
            </Container>

            {!isSmallScreen && (
                <TabsBlock
                    className="w-48"
                    tabs={TABS}
                    selectedTab={selectedTab}
                    onTabSelected={changeTab}
                />
            )}
        </div>
    );
}
