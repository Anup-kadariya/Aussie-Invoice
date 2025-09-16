import React from 'react';
import type { Invoice } from '../types';
import { Building2 } from 'lucide-react';

const GST_RATE = 0.10;

interface TemplateProps {
    invoice: Invoice;
    subTotal: number;
    totalGst: number;
    grandTotal: number;
}

const ModernTemplate: React.FC<TemplateProps> = ({ invoice, subTotal, totalGst, grandTotal }) => {
    const { user, client, invoiceNumber, date, dueDate, items, paymentDetails } = invoice;

    return (
        <div className="p-8 font-sans text-sm bg-white h-full text-gray-800 flex flex-col">
            <header className="flex justify-between items-start pb-6 border-b-2 border-gray-200">
                <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-primary text-white flex items-center justify-center rounded-lg">
                        <Building2 size={40} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                        {invoice.userDisplaySettings.showAddress && user.address.split('\n').map((line, i) => <p key={i} className="text-gray-600">{line}</p>)}
                    </div>
                </div>
                <div className="text-right">
                    <h2 className="text-3xl font-light uppercase text-gray-500 tracking-widest">Tax Invoice</h2>
                </div>
            </header>

            <section className="grid grid-cols-3 gap-8 my-8">
                <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Invoice Details</h3>
                    <p><span className="font-semibold">Invoice Date:</span> {date}</p>
                    <p><span className="font-semibold">Invoice Number:</span> {invoiceNumber}</p>
                    {invoice.userDisplaySettings.showAbn && <p><span className="font-semibold">ABN:</span> {user.abn}</p>}
                </div>
                <div/>
                <div className="text-right">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bill To</h3>
                     {client ? (
                        <>
                            <p className="font-bold">{client.name}</p>
                            {invoice.billToSettings.showAbn && client.abn && <p>ABN: {client.abn}</p>}
                            {invoice.billToSettings.showAddress && client.address && client.address.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                            {invoice.billToSettings.showPhone && client.phone && <p>Phone: {client.phone}</p>}
                            {invoice.billToSettings.showEmail && client.email && <p>Email: {client.email}</p>}
                        </>
                    ) : <p>Select a client</p>}
                </div>
            </section>
            
            <section>
                <table className="w-full">
                    <thead className="border-b border-gray-300">
                        <tr className="text-left text-xs font-bold text-gray-500 uppercase">
                            <th className="py-2">Description</th>
                            <th className="py-2 text-center w-24">Quantity</th>
                            <th className="py-2 text-right w-32">Unit Price</th>
                            <th className="py-2 text-right w-24">GST</th>
                            <th className="py-2 text-right w-32">Amount AUD</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => {
                            const lineTotal = item.rate * item.quantity;
                            const gstAmount = item.gstApplicable ? lineTotal * GST_RATE : 0;
                             return (
                                <tr key={index} className="border-b border-gray-100">
                                    <td className="py-3">{item.description}</td>
                                    <td className="py-3 text-center">{item.quantity}</td>
                                    <td className="py-3 text-right">{item.rate.toFixed(2)}</td>
                                    <td className="py-3 text-right">{gstAmount.toFixed(2)}</td>
                                    <td className="py-3 text-right font-semibold">{lineTotal.toFixed(2)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </section>

            <section className="flex justify-end my-6">
                <div className="w-full max-w-xs space-y-2 text-gray-700">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{subTotal.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between border-b pb-2">
                        <span>Total GST (10%)</span>
                        <span>{totalGst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg text-gray-900 pt-2">
                        <span>Amount Due AUD</span>
                        <span>{grandTotal.toFixed(2)}</span>
                    </div>
                </div>
            </section>

            <footer className="mt-auto pt-8 border-t border-gray-200">
                <div>
                    {invoice.notes && invoice.notes.trim() !== '' && (
                        <div className="mb-4">
                             <h3 className="font-bold text-gray-600">Notes</h3>
                             <p className="text-xs text-gray-500 whitespace-pre-wrap">{invoice.notes}</p>
                        </div>
                    )}
                    <p className="font-bold">Due Date: {dueDate || 'ON RECEIPT'}</p>
                    <p className="mt-2">You can pay this invoice by depositing funds to following bank account:</p>
                    <div className="mt-2 space-y-1 text-sm">
                        {invoice.paymentDetailsType === 'payId' ? (
                            <p><span className="font-semibold">PayID:</span> {paymentDetails.payId || 'N/A'}</p>
                        ) : (
                            <>
                                <p><span className="font-semibold">Bank Name:</span> {paymentDetails.bankName}</p>
                                <p><span className="font-semibold">Account Name:</span> {user.name}</p>
                                <p><span className="font-semibold">BSB Number:</span> {paymentDetails.bsb}</p>
                                <p><span className="font-semibold">Account Number:</span> {paymentDetails.accountNumber}</p>
                                {paymentDetails.payId && <p><span className="font-semibold">PayID:</span> {paymentDetails.payId}</p>}
                            </>
                        )}
                    </div>
                    <p className="mt-4 text-xs text-gray-500">
                        NOTE: Please use Invoice Number as a reference for payments for us to process your payments promptly.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default ModernTemplate;