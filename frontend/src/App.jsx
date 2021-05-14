import { BrowserRouter as Router } from "react-router-dom";
import { Root } from "./components/Root";
import { ChatsProvider } from "./contexts/ChatsContext";
import { UserProvider } from "./contexts/UserContext";

export function App() {
    return (
        <Router>
            <UserProvider>
                <ChatsProvider>
                    <Root />
                </ChatsProvider>
            </UserProvider>
        </Router>
    );
}
