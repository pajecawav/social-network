import { ContentRouter } from "./ContentRouter";
import { Sidebar } from "./Sidebar";

export function Layout() {
    return (
        <div className="flex relative m-auto mt-4 max-w-4xl">
            <Sidebar />
            <div className="flex w-full">
                <ContentRouter />
            </div>
        </div>
    );
}
