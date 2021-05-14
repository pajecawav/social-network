import { useContext } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useIsSmallScreen } from "../hooks/useIsSmallScreen";
import { LandingPage } from "../pages/LandingPage";
import { Layout } from "./Layout";
import { LoadingPlaceholder } from "./LoadingPlaceholder";
import { Topbar } from "./Topbar";

export function Root() {
    const { loggedIn } = useContext(UserContext);
    const isSmallScreen = useIsSmallScreen();

    return loggedIn === null ? (
        <div className="flex h-screen w-screen items-center justify-center">
            <LoadingPlaceholder className="sm:w-32 sm:h-32" scale={6} />
        </div>
    ) : (
        <>
            {!isSmallScreen && <Topbar />}
            <Switch>
                <Route exact path="/">
                    <Redirect push to={loggedIn ? "/me" : "/login"} />
                </Route>
                <Route exact path="/login">
                    {loggedIn ? <Redirect to="/me" /> : <LandingPage />}
                </Route>
                <Route component={Layout} />
            </Switch>
        </>
    );
}
