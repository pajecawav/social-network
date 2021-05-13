import { BrowserRouter as Router } from "react-router-dom";
import { Root } from "./components/Root";
import { ChatsProvider } from "./contexts/ChatsContext";
import { UserProvider } from "./contexts/UserContext";

export function App() {
    return (
        <Router>
            <UserProvider>
                <ChatsProvider>
                    <div className="flex max-h-screen min-w-screen overflow-y-auto bg-primary-900 text-primary-200">
                        <Root />
                    </div>
                </ChatsProvider>
            </UserProvider>
        </Router>
    );
}
