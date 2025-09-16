import React from 'react';
import type { Invoice } from '../types';

const GST_RATE = 0.10;

interface TemplateProps {
    invoice: Invoice;
    subTotal: number;
    totalGst: number;
    grandTotal: number;
}

const SimpleTemplate: React.FC<TemplateProps> = ({ invoice, subTotal, totalGst, grandTotal }) => {
    const { user, client, invoiceNumber, date, dueDate, items } = invoice;

    return (
        <div className="p-8 font-sans text-sm bg-white h-full text-gray-800">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="font-bold text-lg">{user.name}</h2>
                    {invoice.userDisplaySettings.showAbn && <p>ABN: {user.abn}</p>}
                    {invoice.userDisplaySettings.showAddress && user.address.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                    {invoice.userDisplaySettings.showPhone && <p>{user.phone}</p>}
                    {invoice.userDisplaySettings.showEmail && <p>{user.email}</p>}
                </div>
                <div className="text-right">
                    <h1 className="text-4xl font-bold mb-4">INVOICE</h1>
                    <p><span className="font-bold">INVOICE #</span> {invoiceNumber}</p>
                    <p><span className="font-bold">DATE:</span> {date}</p>
                    <p><span className="font-bold">DUE:</span> {dueDate || 'ON RECEIPT'}</p>
                </div>
            </div>

            <div className="mt-8">
                <h3 className="font-bold">BILL TO:</h3>
                {client ? (
                    <>
                        <p className="font-bold">{client.name}</p>
                        {invoice.billToSettings.showAbn && client.abn && <p>ABN: {client.abn}</p>}
                        {invoice.billToSettings.showAddress && client.address && client.address.split('\n').map((line, i) => <p key={i}>{line}</p>)}
                        {invoice.billToSettings.showPhone && client.phone && <p>{client.phone}</p>}
                        {invoice.billToSettings.showEmail && client.email && <p>{client.email}</p>}
                    </>
                ) : (
                    <p>Select a client</p>
                )}
            </div>

            <table className="w-full mt-8 border-collapse">
                <thead>
                    <tr className="bg-gray-800 text-white">
                        <th className="p-2 border border-black text-left w-12">S. N</th>
                        <th className="p-2 border border-black text-left">DESCRIPTION</th>
                        <th className="p-2 border border-black text-right w-24">RATE</th>
                        <th className="p-2 border border-black text-right w-20">QTY</th>
                        <th className="p-2 border border-black text-right w-24">GST</th>
                        <th className="p-2 border border-black text-right w-32">AMOUNT</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => {
                        const lineTotal = item.rate * item.quantity;
                        const gstAmount = item.gstApplicable ? lineTotal * GST_RATE : 0;
                        return (
                            <tr key={index}>
                                <td className="p-2 border border-black text-center">{index + 1}</td>
                                <td className="p-2 border border-black">{item.description}</td>
                                <td className="p-2 border border-black text-right">{item.rate.toFixed(2)}</td>
                                <td className="p-2 border border-black text-right">{item.quantity}</td>
                                <td className="p-2 border border-black text-right">{gstAmount.toFixed(2)}</td>
                                <td className="p-2 border border-black text-right">{lineTotal.toFixed(2)}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="flex justify-end mt-4">
                 <div className="w-1/3 text-right space-y-1">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>AUD {subTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Total GST:</span>
                        <span>AUD {totalGst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-gray-400 pt-1 mt-1">
                        <span>Balance Due:</span>
                        <span>AUD {grandTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {invoice.notes && invoice.notes.trim() !== '' && (
                <div className="mt-8">
                    <h3 className="font-bold">Notes</h3>
                    <p className="text-xs whitespace-pre-wrap">{invoice.notes}</p>
                </div>
            )}

            <div className="mt-8">
                <h3 className="font-bold">Payment Info</h3>
                {invoice.paymentDetailsType === 'payId' ? (
                     <p>Pay ID: {invoice.paymentDetails.payId || 'N/A'}</p>
                ) : (
                    <>
                        <p>Bank: {invoice.paymentDetails.bankName}</p>
                        <p>BSB: {invoice.paymentDetails.bsb}</p>
                        <p>Account: {invoice.paymentDetails.accountNumber}</p>
                        {invoice.paymentDetails.payId && <p>Pay ID: {invoice.paymentDetails.payId}</p>}
                    </>
                )}
                <p className="mt-4">Make all checks payable to {user.name}</p>
            </div>
            
            <div className="text-center mt-12 font-bold">
                <p>THANK YOU FOR YOUR BUSINESS!</p>
            </div>
        </div>
    );
};

export default SimpleTemplate;