'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Heart, LayoutDashboard, FileText, Image, Users,
    CreditCard, UserCheck, FolderKanban, Settings,
    Search, LogOut, Menu, X, Bell, ChevronDown, Video
} from 'lucide-react';

const sidebarLinks = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/dashboard/hero', icon: Video, label: 'Hero Manager' },
    { href: '/dashboard/blogs', icon: FileText, label: 'Blog Manager' },
    { href: '/dashboard/gallery', icon: Image, label: 'Gallery' },
    { href: '/dashboard/programs', icon: FolderKanban, label: 'Programs' },
    { href: '/dashboard/donors', icon: Users, label: 'Donor CRM' },
    { href: '/dashboard/donations', icon: CreditCard, label: 'Donations' },
    { href: '/dashboard/volunteers', icon: UserCheck, label: 'Volunteers' },
    { href: '/dashboard/seo', icon: Search, label: 'SEO Control' },
    { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export default function DashboardLayout({ children }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className={`fixed left-0 top-0 h-full bg-mars-dark border-r border-white/10 transition-all duration-300 z-50 ${sidebarOpen ? 'w-64' : 'w-20'
                }`}>
                {/* Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mars-orange to-mars-red flex items-center justify-center">
                            <Heart className="w-5 h-5 text-white" />
                        </div>
                        {sidebarOpen && (
                            <span className="font-heading font-bold text-white">Mars Care</span>
                        )}
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg hover:bg-white/10 text-white/60"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-1">
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-gradient-to-r from-mars-orange to-mars-red text-white'
                                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <link.icon className="w-5 h-5 flex-shrink-0" />
                                {sidebarOpen && <span className="font-medium">{link.label}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="absolute bottom-4 left-0 right-0 px-4">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-red-500/20 hover:text-red-400 transition-all"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {sidebarOpen && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Top Header */}
                <header className="h-16 bg-mars-dark/50 backdrop-blur border-b border-white/10 flex items-center justify-between px-6 sticky top-0 z-40">
                    <div>
                        <h1 className="text-white font-heading font-semibold">
                            {sidebarLinks.find(l => l.href === pathname || pathname.startsWith(l.href + '/'))?.label || 'Dashboard'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 rounded-lg hover:bg-white/10 text-white/60 relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-mars-orange rounded-full"></span>
                        </button>

                        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-semibold">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            {user && (
                                <div className="hidden sm:block">
                                    <p className="text-white text-sm font-medium">{user.name}</p>
                                    <p className="text-white/40 text-xs">{user.role}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
