import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getUserProfile } from "../api/api";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, LayoutDashboard, LogOut, Menu, User, X, Clock, Plus, Trophy, BarChart2, Target, Settings } from "lucide-react";
import Button from "./Button";
import { useTranslation } from "react-i18next";

const SidebarLink = ({ to, icon: Icon, label, active, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active
            ? "bg-indigo-50 text-indigo-700 font-medium"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
    >
        <Icon className="w-5 h-5" />
        <span>{label}</span>
    </Link>
);

const Layout = ({ children, transparentMain = false }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        getUserProfile()
            .then(data => setUser(data))
            .catch(err => {
                console.error("Failed to fetch user", err);
                // Optional: redirect to login if explicitly unauthorized, 
                // but usually handled by protected routes. here just allow fallback
            });
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const navItems = [
        { path: "/dashboard", label: t('sidebar.dashboard', "Dashboard"), icon: LayoutDashboard },
        { path: "/analytics", label: t('sidebar.focusTimer', "Focus Timer"), icon: Target },
        { path: "/add-record", label: t('sidebar.addSession', "Add Session"), icon: Plus },
        { path: "/history", label: t('sidebar.history', "History"), icon: Clock },
        { path: "/charts", label: t('sidebar.chartAnalysis', "Chart Analysis"), icon: BarChart2 },
        { path: "/leaderboard", label: t('sidebar.leaderboard', "Leaderboard"), icon: Trophy },
        { path: "/profile", label: t('sidebar.profile', "Profile"), icon: User },
        { path: "/settings", label: t('sidebar.settings', "Settings"), icon: Settings },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
                <div className="flex items-center gap-3 px-2">
                    <div className="p-2 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl shadow-lg ring-1 ring-white/50 border border-indigo-200">
                        <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-indigo-500">
                            StudyTrack
                        </h1>
                        <p className="text-xs font-medium text-indigo-600 tracking-wider uppercase">Golden Edition</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <SidebarLink
                            key={item.path}
                            to={item.path}
                            icon={item.icon}
                            label={item.label}
                            active={location.pathname === item.path}
                        />
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold overflow-hidden border border-indigo-200">
                            {user?.profile_picture ? (
                                <img src={`http://localhost:3001${user.profile_picture}`} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                user?.name?.[0] || "U"
                            )}
                        </div>
                        <div className="text-sm">
                            <p className="font-medium text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500">Free Plan</p>
                        </div>
                    </div>
                    <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-gray-500 hover:text-red-600">
                        <LogOut className="w-4 h-4 mr-2" />
                        {t('common.logout', "Logout")}
                    </Button>
                </div>
            </aside>

            {/* Mobile Header & Overlay */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="md:hidden bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sticky top-0 z-20">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-600 rounded-md">
                            <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-gray-900">StudyTrack</span>
                    </div>
                    <button onClick={() => setIsMobileOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                        <Menu className="w-6 h-6" />
                    </button>
                </header>

                <AnimatePresence>
                    {isMobileOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMobileOpen(false)}
                                className="fixed inset-0 bg-black/50 z-30 md:hidden"
                            />
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed inset-y-0 left-0 w-64 bg-white z-40 md:hidden flex flex-col shadow-xl"
                            >
                                <div className="p-4 flex items-center justify-between border-b border-gray-100">
                                    <span className="font-bold text-lg text-gray-900">Menu</span>
                                    <button onClick={() => setIsMobileOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <nav className="flex-1 p-4 space-y-2">
                                    {navItems.map((item) => (
                                        <SidebarLink
                                            key={item.path}
                                            to={item.path}
                                            icon={item.icon}
                                            label={item.label}
                                            active={location.pathname === item.path}
                                            onClick={() => setIsMobileOpen(false)}
                                        />
                                    ))}
                                </nav>
                                <div className="p-4 border-t border-gray-100">
                                    <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-red-600 hover:bg-red-50">
                                        <LogOut className="w-4 h-4 mr-2" />
                                        {t('common.logout', "Logout")}
                                    </Button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Main Content */}
                <main className={`flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto ${transparentMain ? 'bg-transparent' : 'bg-gray-50'}`}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
