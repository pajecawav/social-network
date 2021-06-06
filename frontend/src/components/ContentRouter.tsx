import { useContext } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router";
import { UserContext } from "../contexts/UserContext";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";
import { ChatListPage } from "../pages/ChatListPage";
import { ChatPage } from "../pages/ChatPage";
import { CreateGroupPage } from "../pages/CreateGroupPage";
import { EditProfilePage } from "../pages/EditProfilePage";
import { FriendsPage } from "../pages/FriendsPage";
import { GroupListPage } from "../pages/GroupListPage";
import { GroupPage } from "../pages/GroupPage";
import { JoinChatPage } from "../pages/JoinChatPage";
import { UserProfilePage } from "../pages/UserProfilePage";
import { UsersSearchPage } from "../pages/UsersSearchPage";
import { NavigationBar } from "./NavigationBar";

export const ContentRouter = () => {
    const { loggedIn, user } = useContext(UserContext);
    const isSmallScreen = useIsSmallScreen();
    const location = useLocation();

    return (
        <Switch>
            {loggedIn && [
                // HACK: can't use Fragment because Switch expects Route as children
                <Route path="/me" key="/me">
                    <UserProfilePage userId={user!.userId} />
                </Route>,
                <Route path="/edit" component={EditProfilePage} key="/edit" />,
                <Route
                    path="/friends"
                    component={FriendsPage}
                    key="/friends"
                />,
                <Route
                    exact
                    path="/chats"
                    component={ChatListPage}
                    key="/chats"
                />,
                <Route
                    path="/join/:inviteCode"
                    component={JoinChatPage}
                    key="/chats/join"
                />,
                <Route
                    path="/chats/:id"
                    render={(props) => (
                        <ChatPage chatId={+props.match.params.id} />
                    )}
                    key="/chats/id"
                />,
                <Route
                    exact
                    path="/groups/create"
                    component={CreateGroupPage}
                    key="/groups/create"
                />,
                <Route
                    exact
                    path="/groups"
                    component={GroupListPage}
                    key="/groups"
                />,
                <Route
                    path="/groups/:groupId"
                    component={GroupPage}
                    key="/groups/id"
                />,
                // routes only present on devices with small screen
                ...(isSmallScreen
                    ? [
                          <Route
                              exact
                              path="/menu"
                              render={() => <NavigationBar isFullPage={true} />}
                              key="/menu"
                          />,
                      ]
                    : []),
            ]}
            <Route path="/users/search" component={UsersSearchPage} />
            <Route
                path="/users/:id"
                render={(props) => (
                    <UserProfilePage userId={+props.match.params.id} />
                )}
            />
            {loggedIn ? (
                <Redirect to="/me" />
            ) : (
                <Redirect
                    to={{
                        pathname: "/login",
                        state: { next: location.pathname + location.search },
                    }}
                />
            )}
        </Switch>
    );
};
