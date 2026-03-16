import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaChartPie, FaClipboardList, FaHamburger, FaHome } from 'react-icons/fa';

const Layout = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-slate-100 flex font-sans">
            <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full">
                <div className="p-6 text-2xl font-bold text-orange-500 border-b border-slate-700">
                    Admin Panel
                </div>
                <nav className="flex flex-col gap-2 p-4 flex-grow">
                    <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/admin') ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                        <FaChartPie /> Analytics
                    </Link>
                    <Link to="/admin/orders" className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/admin/orders') ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                        <FaClipboardList /> Orders
                    </Link>
                    <Link to="/admin/menu" className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive('/admin/menu') ? 'bg-orange-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
                        <FaHamburger /> Menu
                    </Link>
                </nav>
                <div className="p-4 border-t border-slate-700">
                     <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white">
                        <FaHome /> Back to Site
                    </Link>
                </div>
            </aside>
            <div className="ml-64 flex-1 p-8">
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;