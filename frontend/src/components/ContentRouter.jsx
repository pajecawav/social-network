import { useContext } from "react";
import { Redirect, Route, Switch } from "react-router";
import { UserContext } from "../contexts/UserContext";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";
import { ChatListPage } from "../pages/ChatListPage";
import { ChatPage } from "../pages/ChatPage";
import { EditProfilePage } from "../pages/EditProfilePage";
import { FriendsPage } from "../pages/FriendsPage";
import { JoinChatPage } from "../pages/JoinChatPage";
import { UserProfilePage } from "../pages/UserProfilePage";
import { UsersSearchPage } from "../pages/UsersSearchPage";
import { NavigationBar } from "./NavigationBar";

export function ContentRouter() {
    const { loggedIn, user } = useContext(UserContext);
    const isSmallScreen = useIsSmallScreen();

    return (
        <Switch>
            {loggedIn && [
                // HACK: can't use Fragment because Switch expects Route as children
                <Route path="/me" key="/me">
                    <UserProfilePage userId={user.userId} />
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
                        <ChatPage chatId={props.match.params.id} />
                    )}
                    key="/chats/id"
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
                    <UserProfilePage userId={props.match.params.id} />
                )}
            />
            <Redirect to="/login" />
        </Switch>
    );
}
