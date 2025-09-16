import React from 'react';
import { LogIn, LogOut, User } from 'lucide-react';
import type { AuthUser } from '../types';

interface HeaderProps {
    authUser: AuthUser | null;
    onLoginClick: () => void;
    onSignupClick: () => void;
    onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ authUser, onLoginClick, onSignupClick, onLogout }) => {
    return (
        <header className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <h1 className="text-2xl font-bold text-primary">Aussie Invoice Pro</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        {authUser ? (
                            <>
                                <span className="flex items-center gap-2 text-gray-700">
                                    <User size={18} />
                                    Welcome, {authUser.name}
                                </span>
                                <button
                                    onClick={onLogout}
                                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg shadow hover:bg-red-600 transition-colors"
                                >
                                    <LogOut size={18} /> Log Out
                                </button>
                            </>
                        ) : (
                            <>
                                <button onClick={onLoginClick} className="text-gray-600 hover:text-primary transition-colors">
                                    Log In
                                </button>
                                <button onClick={onSignupClick} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors">
                                    <LogIn size={18} /> Sign Up
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
