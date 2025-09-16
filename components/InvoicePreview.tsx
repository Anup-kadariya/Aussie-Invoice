
import React from 'react';
import type { Invoice } from '../types';
import { TemplateId } from '../types';
import SimpleTemplate from '../templates/SimpleTemplate';
import ModernTemplate from '../templates/ModernTemplate';

interface InvoicePreviewProps {
    invoice: Invoice;
    subTotal: number;
    totalGst: number;
    grandTotal: number;
}

const templates = {
    [TemplateId.SIMPLE]: SimpleTemplate,
    [TemplateId.MODERN]: ModernTemplate,
};

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, subTotal, totalGst, grandTotal }) => {
    const TemplateComponent = templates[invoice.template];

    return (
        <div className="h-full w-full overflow-auto">
            <TemplateComponent invoice={invoice} subTotal={subTotal} totalGst={totalGst} grandTotal={grandTotal} />
        </div>
    );
};

export default InvoicePreview;
