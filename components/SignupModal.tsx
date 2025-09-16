import React, { useState } from 'react';
import { X } from 'lucide-react';

interface SignupModalProps {
    onSignup: (name: string, email: string, password: string) => void;
    onClose: () => void;
    onSwitchToLogin: () => void;
}

const SignupModal: React.FC<SignupModalProps> = ({ onSignup, onClose, onSwitchToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!name || !email || !password) {
            setError('Please fill in all fields.');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        onSignup(name, email, password);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <div>
                        <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            id="signup-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="signup-email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div>
                        <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="signup-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        />
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                            Sign Up
                        </button>
                    </div>
                </form>
                 <p className="text-sm text-center text-gray-600 mt-4">
                    Already have an account?{' '}
                    <button onClick={onSwitchToLogin} className="font-medium text-primary hover:underline">
                        Log In
                    </button>
                </p>
            </div>
        </div>
    );
};

export default SignupModal;
