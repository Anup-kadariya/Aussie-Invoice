
import React from 'react';
import { LogIn } from 'lucide-react';

const Header: React.FC = () => {
    return (
        <header className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <h1 className="text-2xl font-bold text-primary">Aussie Invoice Pro</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-gray-600 hover:text-primary transition-colors">
                            Log In
                        </button>
                        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors">
                            <LogIn size={18} /> Sign Up
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
