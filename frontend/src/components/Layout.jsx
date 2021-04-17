import { ContentRouter } from "./ContentRouter";
import { Sidebar } from "./Sidebar";

export function Layout() {
    return (
        <div className="relative flex max-w-4xl m-auto mt-4">
            <Sidebar />
            <div className="w-full">
                <ContentRouter />
            </div>
        </div>
    );
}
