import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import FFooter from "../components/FFooter";

// App layout wrapper with navbar
export default function AppLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-brand.white text-brand.black">
            {/* Header */}
            <Navbar />

            {/* Main content */}
            <main className="flex-1 w-full">
                <Outlet />
            </main>

            <FFooter />
        </div>
    );
}
