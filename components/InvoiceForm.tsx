import React from 'react';
import type { Invoice, Client } from '../types';
import { TemplateId } from '../types';
import { Plus, Trash2, UserPlus, Pencil } from 'lucide-react';

interface InvoiceFormProps {
    invoice: Invoice;
    onInvoiceChange: (invoice: Invoice) => void;
    clients: Client[];
    onClientSelect: (clientId: string) => void;
    onAddNewClient: () => void;
    onEditClient: (client: Client) => void;
    subTotal: number;
    totalGst: number;
    grandTotal: number;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ invoice, onInvoiceChange, clients, onClientSelect, onAddNewClient, onEditClient, subTotal, totalGst, grandTotal }) => {

    const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name.startsWith('user.')) {
            const userField = name.split('.')[1];
            onInvoiceChange({ ...invoice, user: { ...invoice.user, [userField]: value } });
        } else if (name.startsWith('paymentDetails.')) {
            const paymentField = name.split('.')[1];
            onInvoiceChange({ ...invoice, paymentDetails: { ...invoice.paymentDetails, [paymentField]: value } });
        } else {
            onInvoiceChange({ ...invoice, [name]: value });
        }
    };

    const handleItemChange = (index: number, field: string, value: string | number | boolean) => {
        const newItems = [...invoice.items];
        newItems[index] = { ...newItems[index], [field]: value };
        onInvoiceChange({ ...invoice, items: newItems });
    };

    const addItem = () => {
        onInvoiceChange({ ...invoice, items: [...invoice.items, { description: '', quantity: 1, rate: 0, gstApplicable: false }] });
    };

    const removeItem = (index: number) => {
        const newItems = invoice.items.filter((_, i) => i !== index);
        onInvoiceChange({ ...invoice, items: newItems });
    };

    const handleBillToSettingChange = (field: keyof Invoice['billToSettings'], value: boolean) => {
        onInvoiceChange({
            ...invoice,
            billToSettings: {
                ...invoice.billToSettings,
                [field]: value,
            },
        });
    };
    
    const handleUserDisplaySettingChange = (field: keyof Invoice['userDisplaySettings'], value: boolean) => {
        onInvoiceChange({
            ...invoice,
            userDisplaySettings: {
                ...invoice.userDisplaySettings,
                [field]: value,
            },
        });
    };

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-semibold border-b pb-2">Invoice Details</h3>
            
            {/* Client Selection */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Bill To:</label>
                <div className="flex gap-2 mt-1">
                    <select
                        value={invoice.client?.id || ''}
                        onChange={(e) => onClientSelect(e.target.value)}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    >
                        <option value="">Select a Client</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <button
                        onClick={() => { if (invoice.client) onEditClient(invoice.client) }}
                        disabled={!invoice.client}
                        className="flex-shrink-0 bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Edit selected client"
                    >
                        <Pencil size={20} />
                    </button>
                    <button onClick={onAddNewClient} className="flex-shrink-0 bg-accent text-white p-2 rounded-lg hover:bg-orange-500" title="Add new client">
                        <UserPlus size={20} />
                    </button>
                </div>
                {invoice.client && (
                    <details className="mt-2 text-sm">
                        <summary className="cursor-pointer text-gray-600">Client display options</summary>
                        <div className="pt-2 pl-4 grid grid-cols-2 gap-x-4 gap-y-2">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={invoice.billToSettings.showAbn} onChange={e => handleBillToSettingChange('showAbn', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                                <span>Show ABN</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={invoice.billToSettings.showAddress} onChange={e => handleBillToSettingChange('showAddress', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                                <span>Show Address</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={invoice.billToSettings.showPhone} onChange={e => handleBillToSettingChange('showPhone', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                                <span>Show Phone</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" checked={invoice.billToSettings.showEmail} onChange={e => handleBillToSettingChange('showEmail', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                                <span>Show Email</span>
                            </label>
                        </div>
                    </details>
                )}
            </div>

            {/* Invoice Meta */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="invoiceNumber" className="block text-sm font-medium text-gray-700">Invoice #</label>
                    <input type="text" name="invoiceNumber" value={invoice.invoiceNumber} onChange={handleFieldChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"/>
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                    <input type="date" name="date" value={invoice.date} onChange={handleFieldChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"/>
                </div>
                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                    <input type="date" name="dueDate" value={invoice.dueDate} onChange={handleFieldChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"/>
                </div>
            </div>

            {/* Line Items */}
            <div>
                <h3 className="text-xl font-semibold border-b pb-2 mb-4">Items</h3>
                 <div className="grid grid-cols-12 gap-2 text-sm text-gray-500 font-medium mb-2 px-2">
                    <div className="col-span-4">Description</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-2 text-center">Rate</div>
                    <div className="col-span-1 text-center">GST?</div>
                    <div className="col-span-2 text-right">Total</div>
                </div>
                <div className="space-y-3">
                    {invoice.items.map((item, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-center">
                            <input type="text" placeholder="Description" value={item.description} onChange={e => handleItemChange(index, 'description', e.target.value)} className="col-span-4 p-2 border rounded-md" required/>
                            <input type="number" placeholder="Qty" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', parseFloat(e.target.value))} className="col-span-2 p-2 border rounded-md"/>
                            <input type="number" placeholder="Rate" value={item.rate} onChange={e => handleItemChange(index, 'rate', parseFloat(e.target.value))} className="col-span-2 p-2 border rounded-md"/>
                             <div className="col-span-1 flex justify-center">
                                <input type="checkbox" checked={item.gstApplicable} onChange={e => handleItemChange(index, 'gstApplicable', e.target.checked)} className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"/>
                            </div>
                            <div className="col-span-2 text-right font-medium pr-2">{(item.quantity * item.rate).toFixed(2)}</div>
                            <button onClick={() => removeItem(index)} className="col-span-1 text-red-500 hover:text-red-700 justify-self-end"><Trash2 size={20} /></button>
                        </div>
                    ))}
                </div>
                <button onClick={addItem} className="mt-4 flex items-center gap-2 text-primary font-semibold hover:text-blue-600">
                    <Plus size={18} /> Add Item
                </button>
            </div>
            
            <div className="space-y-2 pt-4 border-t text-right">
                <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">AUD {subTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">GST (10%):</span>
                    <span className="font-medium">AUD {totalGst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-2xl font-bold">
                    <span>Total:</span>
                    <span>AUD {grandTotal.toFixed(2)}</span>
                </div>
            </div>
            
            {/* Notes */}
            <div className="pt-4 border-t">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                    name="notes"
                    id="notes"
                    rows={3}
                    value={invoice.notes}
                    onChange={handleFieldChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Add any terms, conditions, or thank you notes here."
                />
            </div>

            {/* Template Selector */}
            <div>
                 <label htmlFor="template" className="block text-sm font-medium text-gray-700">Template</label>
                 <select name="template" value={invoice.template} onChange={handleFieldChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3">
                    <option value={TemplateId.SIMPLE}>Simple</option>
                    <option value={TemplateId.MODERN}>Modern</option>
                 </select>
            </div>

            {/* User Details */}
            <details className="pt-4 border-t">
                 <summary className="font-semibold cursor-pointer flex items-center gap-2">Your Details <Pencil size={16}/></summary>
                 <div className="mt-4 space-y-2">
                    <input type="text" name="user.name" value={invoice.user.name} onChange={handleFieldChange} placeholder="Your Name/Company" className="block w-full p-2 border rounded-md"/>
                    <input type="text" name="user.abn" value={invoice.user.abn} onChange={handleFieldChange} placeholder="Your ABN" className="block w-full p-2 border rounded-md"/>
                    <textarea name="user.address" value={invoice.user.address} onChange={handleFieldChange} placeholder="Your Address" className="block w-full p-2 border rounded-md" rows={3}/>
                    <input type="text" name="user.email" value={invoice.user.email} onChange={handleFieldChange} placeholder="Your Email" className="block w-full p-2 border rounded-md"/>
                    <input type="text" name="user.phone" value={invoice.user.phone} onChange={handleFieldChange} placeholder="Your Phone" className="block w-full p-2 border rounded-md"/>
                 </div>
                 <details className="mt-2 text-sm">
                    <summary className="cursor-pointer text-gray-600">Display options</summary>
                    <div className="pt-2 pl-4 grid grid-cols-2 gap-x-4 gap-y-2">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={invoice.userDisplaySettings.showAbn} onChange={e => handleUserDisplaySettingChange('showAbn', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                            <span>Show ABN</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={invoice.userDisplaySettings.showAddress} onChange={e => handleUserDisplaySettingChange('showAddress', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                            <span>Show Address</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={invoice.userDisplaySettings.showPhone} onChange={e => handleUserDisplaySettingChange('showPhone', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                            <span>Show Phone</span>
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" checked={invoice.userDisplaySettings.showEmail} onChange={e => handleUserDisplaySettingChange('showEmail', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"/>
                            <span>Show Email</span>
                        </label>
                    </div>
                </details>
            </details>
            
            {/* Payment Details */}
            <details className="pt-4 border-t">
                 <summary className="font-semibold cursor-pointer flex items-center gap-2">Payment Details <Pencil size={16}/></summary>
                 <div className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="paymentDetailsType" className="block text-sm font-medium text-gray-700">Display Style</label>
                        <select
                            name="paymentDetailsType"
                            id="paymentDetailsType"
                            value={invoice.paymentDetailsType}
                            onChange={handleFieldChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"
                        >
                            <option value="fullBankDetails">Full Bank Details</option>
                            <option value="payId">PayID Only</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <input type="text" name="paymentDetails.bankName" value={invoice.paymentDetails.bankName} onChange={handleFieldChange} placeholder="Bank Name" className="block w-full p-2 border rounded-md"/>
                        <input type="text" name="paymentDetails.bsb" value={invoice.paymentDetails.bsb} onChange={handleFieldChange} placeholder="BSB" className="block w-full p-2 border rounded-md"/>
                        <input type="text" name="paymentDetails.accountNumber" value={invoice.paymentDetails.accountNumber} onChange={handleFieldChange} placeholder="Account Number" className="block w-full p-2 border rounded-md"/>
                        <input type="text" name="paymentDetails.payId" value={invoice.paymentDetails.payId} onChange={handleFieldChange} placeholder="PayID (Optional)" className="block w-full p-2 border rounded-md"/>
                    </div>
                 </div>
            </details>

        </div>
    );
};

export default InvoiceForm;