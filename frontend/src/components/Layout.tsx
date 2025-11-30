import React, { useState } from "react";
import Navigation from "./Navigation";
import DashboardSidebar from "./DashboardSidebar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [openSidebar, setOpenSidebar] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            <div className="flex">

                {/* Desktop Sidebar */}
                <DashboardSidebar />

                {/* Page Content */}
                <main className="flex-1 responsive-container py-6">
                    {children}
                </main>
            </div>

            {/* Mobile Sidebar Drawer */}
            {openSidebar && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setOpenSidebar(false)} />

                    <div className="absolute left-0 top-0 bottom-0 w-64 bg-white p-5 shadow-lg">
                        <button
                            onClick={() => setOpenSidebar(false)}
                            className="mb-4 px-2 py-1 border rounded"
                        >
                            Close
                        </button>
                        <DashboardSidebar className="block md:hidden" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Layout;
