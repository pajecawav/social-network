import { ContentRouter } from "./ContentRouter";
import { Sidebar } from "./Sidebar";

export function Layout() {
    return (
        <div className="flex m-auto px-3 mt-4 max-w-4xl h-auto mb-4">
            <Sidebar />
            <div className="w-full">
                <ContentRouter />
            </div>
        </div>
    );
}
