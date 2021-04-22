import { useContext } from "react";
import { Redirect, Route, Switch } from "react-router";
import { UserContext } from "../contexts/UserContext";
import { EditProfilePage } from "../pages/EditProfilePage";
import { FriendsPage } from "../pages/FriendsPage";
import { UserProfilePage } from "../pages/UserProfilePage";
import { UsersSearchPage } from "../pages/UsersSearchPage";

export function ContentRouter() {
    const { loggedIn, user } = useContext(UserContext);

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
