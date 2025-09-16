import React, { useState } from 'react';
import { X } from 'lucide-react';

interface LoginModalProps {
    onLogin: (email: string, password: string) => void;
    onClose: () => void;
    onSwitchToSignup: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose, onSwitchToSignup }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }
        onLogin(email, password);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div>
                        <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="login-email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="login-password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="login-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                            Log In
                        </button>
                    </div>
                </form>
                <p className="text-sm text-center text-gray-600 mt-4">
                    Don't have an account?{' '}
                    <button onClick={onSwitchToSignup} className="font-medium text-primary hover:underline">
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginModal;
