import { useContext } from "react";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";
import { LandingPage } from "../pages/LandingPage";
import { Layout } from "./Layout";
import { LoadingPlaceholder } from "./LoadingPlaceholder";
import { Topbar } from "./Topbar";

export function Root() {
    const { loggedIn } = useContext(UserContext);
    const isSmallScreen = useIsSmallScreen();
    const location = useLocation();

    return loggedIn === null ? (
        <div className="flex items-center justify-center w-screen h-screen">
            <LoadingPlaceholder className="w-24 h-24 sm:w-32 sm:h-32" />
        </div>
    ) : (
        <>
            {!isSmallScreen && <Topbar />}
            <Switch>
                <Route exact path="/">
                    <Redirect push to={loggedIn ? "/me" : "/login"} />
                </Route>
                <Route exact path="/login">
                    {loggedIn ? (
                        <Redirect to={location.state?.next || "/me"} />
                    ) : (
                        <LandingPage />
                    )}
                </Route>
                <Route component={Layout} />
            </Switch>
        </>
    );
}
