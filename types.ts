export interface Client {
    id: string;
    name: string;
    abn: string;
    address: string;
    phone: string;
    email: string;
}

export interface InvoiceItem {
    description: string;
    quantity: number;
    rate: number;
    gstApplicable: boolean;
}

export interface PaymentDetails {
    bankName: string;
    bsb: string;
    accountNumber: string;
    payId?: string;
}

export interface UserDetails {
    name: string;
    abn: string;
    address: string;
    phone: string;
    email: string;
}

export enum TemplateId {
    SIMPLE = 'simple',
    MODERN = 'modern',
}

export interface Template {
    id: TemplateId;
    name: string;
    component: React.FC<{ invoice: Invoice, subTotal: number, totalGst: number, grandTotal: number }>;
}

export interface Invoice {
    id: string;
    invoiceNumber: string;
    date: string;
    dueDate: string;
    client: Client | null;
    items: InvoiceItem[];
    notes: string;
    paymentDetails: PaymentDetails;
    user: UserDetails;
    template: TemplateId;
    paymentDetailsType: 'fullBankDetails' | 'payId';
    billToSettings: {
        showAbn: boolean;
        showAddress: boolean;
        showPhone: boolean;
        showEmail: boolean;
    };
    userDisplaySettings: {
        showAbn: boolean;
        showAddress: boolean;
        showPhone: boolean;
        showEmail: boolean;
    };
}