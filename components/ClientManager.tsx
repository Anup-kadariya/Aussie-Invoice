import React, { useState, useEffect } from 'react';
import type { Client } from '../types';
import { X } from 'lucide-react';

interface ClientManagerProps {
    client: Client | null;
    onSave: (client: Client) => void;
    onClose: () => void;
    onDelete: (clientId: string) => void;
}

const ClientManager: React.FC<ClientManagerProps> = ({ client, onSave, onClose, onDelete }) => {
    const [formData, setFormData] = useState<Omit<Client, 'id'>>({
        name: '',
        abn: '',
        address: '',
        phone: '',
        email: '',
    });

    useEffect(() => {
        if (client) {
            setFormData(client);
        } else {
            setFormData({ name: '', abn: '', address: '', phone: '', email: '' });
        }
    }, [client]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: client?.id || '' });
    };

    const handleDelete = () => {
        if (client?.id) {
            onDelete(client.id);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-6">{client ? 'Edit Client' : 'Add New Client'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Business Name</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"/>
                    </div>
                     <div>
                        <label htmlFor="abn" className="block text-sm font-medium text-gray-700">ABN</label>
                        <input type="text" name="abn" id="abn" value={formData.abn} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"/>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"/>
                    </div>
                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                        <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"/>
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                        <textarea name="address" id="address" value={formData.address} onChange={handleChange} rows={3} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"></textarea>
                    </div>
                    <div className="flex justify-between items-center pt-4">
                        <div>
                             {client && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Delete Client
                                </button>
                            )}
                        </div>
                        <div className="flex justify-end gap-4">
                            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Cancel</button>
                            <button type="submit" className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                                {client ? 'Save Changes' : 'Save Client'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClientManager;