import { useContext } from "react";
import { Redirect, Route, Switch } from "react-router";
import { UserContext } from "../contexts/UserContext";
import { UserProfilePage } from "../pages/UserProfilePage";

export function ContentRouter() {
    const { user } = useContext(UserContext);

    return (
        <Switch>
            <Route path="/me">
                <UserProfilePage userId={user.userId} />
            </Route>
            <Route
                path="/users/:id"
                render={(props) => (
                    <UserProfilePage userId={props.match.params.id} />
                )}
            />
            <Redirect to="/me" />
        </Switch>
    );
}
