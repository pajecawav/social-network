import { BrowserRouter as Router } from "react-router-dom";
import { Root } from "./components/Root";
import { UserProvider } from "./contexts/UserContext";

export function App() {
    return (
        <Router>
            <UserProvider>
                <div className="flex min-h-screen min-w-screen bg-primary-900 text-primary-200">
                    <Root />
                </div>
            </UserProvider>
        </Router>
    );
}
