import { useContext } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { LandingPage } from "../pages/LandingPage";
import { Layout } from "./Layout";
import { LoadingContentWrapper } from "./LoadingContentWrapper";
import { Topbar } from "./Topbar";

export function Root() {
    const { loggedIn } = useContext(UserContext);

    return (
        <LoadingContentWrapper
            isLoading={loggedIn === null}
            className="w-24 h-24 sm:w-32 sm:h-32"
        >
            <div className="flex-grow">
                <Topbar />
                <Switch>
                    <Route exact path="/login">
                        {loggedIn ? <Redirect to="/me" /> : <LandingPage />}
                    </Route>
                    {!loggedIn && <Redirect to="/login" />}
                    <Route component={Layout} />
                </Switch>
            </div>
        </LoadingContentWrapper>
    );
}
