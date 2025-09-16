import React, { useState, useCallback, useMemo } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useLocalStorage } from './hooks/useLocalStorage';
import type { Client, Invoice, AuthUser } from './types';
import { TemplateId } from './types';
import Header from './components/Header';
import ClientManager from './components/ClientManager';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';
import { Plus, Download, Send, Eye } from 'lucide-react';

const GST_RATE = 0.10;

const App: React.FC = () => {
    // Auth States
    const [authUser, setAuthUser] = useLocalStorage<AuthUser | null>('authUser', null);
    const [authModal, setAuthModal] = useState<'login' | 'signup' | null>(null);

    const [clients, setClients] = useLocalStorage<Client[]>('clients', []);
    const [activeClient, setActiveClient] = useState<Client | null>(null);
    const [showClientManager, setShowClientManager] = useState<boolean>(false);
    const [showAdModal, setShowAdModal] = useState<boolean>(false);
    
    function getNewInvoice(): Invoice {
        return {
            id: `INV-${Date.now()}`,
            invoiceNumber: '001',
            date: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            client: null,
            items: [{ description: 'Service or Product', quantity: 1, rate: 100, gstApplicable: false }],
            notes: 'Thank you for your business!',
            paymentDetails: {
                bankName: 'Commonwealth Bank of Australia',
                bsb: '062-000',
                accountNumber: '1234 5678',
                payId: 'your.email@example.com'
            },
            user: {
                name: authUser?.name || 'Anup Kadariya',
                abn: '97106120051',
                address: 'U12 5 Belle Place\nMilner, NT 0810',
                phone: '0410641209',
                email: authUser?.email || 'kadariya.anup47@gmail.com',
            },
            template: TemplateId.SIMPLE,
            paymentDetailsType: 'fullBankDetails',
            billToSettings: {
                showAbn: true,
                showAddress: true,
                showPhone: true,
                showEmail: true,
            },
            userDisplaySettings: {
                showAbn: true,
                showAddress: true,
                showPhone: true,
                showEmail: true,
            }
        };
    }
    
    const [invoice, setInvoice] = useState<Invoice>(getNewInvoice());
    const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

    const handleClientSelect = useCallback((clientId: string) => {
        const client = clients.find(c => c.id === clientId);
        if (client) {
            setActiveClient(client);
            setInvoice(prev => ({ ...prev, client }));
        } else {
            setActiveClient(null);
            setInvoice(prev => ({...prev, client: null}));
        }
    }, [clients]);

    const handleInvoiceChange = useCallback((updatedInvoice: Invoice) => {
        setInvoice(updatedInvoice);
    }, []);

    const handleAddNewClient = () => {
        if (clients.length >= 3) {
            alert("Free plan allows up to 3 clients. Please upgrade for unlimited clients.");
            return;
        }
        setActiveClient(null);
        setShowClientManager(true);
    };

    const handleEditClient = (client: Client) => {
        setActiveClient(client);
        setShowClientManager(true);
    };

    const handleSaveClient = (client: Client) => {
        let savedClient: Client;
        if (client.id) {
            savedClient = client;
            setClients(clients.map(c => c.id === client.id ? client : c));
        } else {
            savedClient = { ...client, id: `CLIENT-${Date.now()}` };
            setClients([...clients, savedClient]);
        }
        
        setInvoice(prev => ({...prev, client: savedClient}));
        setActiveClient(savedClient);
        setShowClientManager(false);
    };

    const handleDeleteClient = (clientId: string) => {
        const clientToDelete = clients.find(c => c.id === clientId);
        if (!clientToDelete) return;

        if (window.confirm(`Are you sure you want to delete ${clientToDelete.name}? This action cannot be undone.`)) {
            const updatedClients = clients.filter(c => c.id !== clientId);
            setClients(updatedClients);

            if (invoice.client?.id === clientId) {
                setInvoice(prev => ({ ...prev, client: null }));
                setActiveClient(null);
            }
            setShowClientManager(false);
            setActiveClient(null);
        }
    };

    const handleShowAd = (callback: () => void) => {
        setShowAdModal(true);
        setTimeout(() => {
            setShowAdModal(false);
            callback();
        }, 3000); // Simulate watching an ad for 3 seconds
    };
    
    const validateInvoice = (): boolean => {
        const { invoiceNumber, items, client } = invoice;
        const errors: string[] = [];

        if (!invoiceNumber || invoiceNumber.trim() === '') {
            errors.push("Invoice number cannot be empty.");
        } else if (!isNaN(Number(invoiceNumber)) && Number(invoiceNumber) <= 0) {
            errors.push("Invoice number cannot be zero or negative.");
        }

        if (items.some(item => !item.description || item.description.trim() === '')) {
            errors.push("All item descriptions must be filled out.");
        }
        
        if (!client) {
            errors.push("Please select a client.");
        }

        if (errors.length > 0) {
            alert("Please fix the following issues:\n\n- " + errors.join("\n- "));
            return false;
        }

        return true;
    };


    const handleDownloadPdf = () => {
        if (!validateInvoice()) return;
        handleShowAd(() => {
            setIsGeneratingPdf(true);
            const input = document.getElementById('invoice-preview');
            if (input) {
                html2canvas(input, { scale: 2 }).then(canvas => {
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const pdfWidth = pdf.internal.pageSize.getWidth();
                    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                    pdf.save(`Invoice-${invoice.invoiceNumber}.pdf`);
                    setIsGeneratingPdf(false);
                });
            } else {
                setIsGeneratingPdf(false);
            }
        });
    };

    const handleSendEmail = () => {
        if (!validateInvoice()) return;
         if (!invoice.client?.email) {
            alert('Please select a client with an email address.');
            return;
        }
        handleShowAd(() => {
            const subject = encodeURIComponent(`Invoice ${invoice.invoiceNumber} from ${invoice.user.name}`);
            const body = encodeURIComponent(`Hi ${invoice.client?.name || ''},\n\nPlease find attached your invoice.\n\nThank you,\n${invoice.user.name}`);
            window.location.href = `mailto:${invoice.client.email}?subject=${subject}&body=${body}`;
        });
    };

    const handleSignup = (name: string, email: string, password: string) => {
        const users: AuthUser[] = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(user => user.email === email)) {
            alert('An account with this email already exists.');
            return;
        }
        
        const newUser: AuthUser = { name, email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        const activeUser = { name, email };
        setAuthUser(activeUser);
        setAuthModal(null);
        
        setInvoice(prev => ({
            ...prev,
            user: {
                ...prev.user,
                name: activeUser.name,
                email: activeUser.email,
            }
        }));
    };

    const handleLogin = (email: string, password: string) => {
        const users: AuthUser[] = JSON.parse(localStorage.getItem('users') || '[]');
        const foundUser = users.find(user => user.email === email && user.password === password);

        if (foundUser) {
            const activeUser = { name: foundUser.name, email: foundUser.email };
            setAuthUser(activeUser);
            setAuthModal(null);

             setInvoice(prev => ({
                ...prev,
                user: {
                    ...prev.user,
                    name: activeUser.name,
                    email: activeUser.email,
                }
            }));
        } else {
            alert('Invalid email or password.');
        }
    };
    
    const handleLogout = () => {
        setAuthUser(null);
    };
    
    const subTotal = useMemo(() => {
        return invoice.items.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
    }, [invoice.items]);

    const totalGst = useMemo(() => {
        return invoice.items.reduce((acc, item) => {
            if (item.gstApplicable) {
                return acc + (item.quantity * item.rate * GST_RATE);
            }
            return acc;
        }, 0);
    }, [invoice.items]);

    const grandTotal = useMemo(() => {
        return subTotal + totalGst;
    }, [subTotal, totalGst]);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <Header 
                authUser={authUser}
                onLoginClick={() => setAuthModal('login')}
                onSignupClick={() => setAuthModal('signup')}
                onLogout={handleLogout}
            />
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                        <h1 className="text-3xl font-bold text-gray-900">Create Invoice</h1>
                        <div className="flex items-center gap-2">
                             <button onClick={handleDownloadPdf} disabled={isGeneratingPdf} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                {isGeneratingPdf ? 'Generating...' : <><Download size={18} /> Download PDF</>}
                            </button>
                            <button onClick={handleSendEmail} className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition-colors">
                                <Send size={18} /> Send Email
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        {/* Left side: Form */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                            <InvoiceForm
                                invoice={invoice}
                                onInvoiceChange={handleInvoiceChange}
                                clients={clients}
                                onClientSelect={handleClientSelect}
                                onAddNewClient={handleAddNewClient}
                                onEditClient={handleEditClient}
                                subTotal={subTotal}
                                totalGst={totalGst}
                                grandTotal={grandTotal}
                            />
                        </div>

                        {/* Right side: Preview */}
                        <div className="lg:col-span-3">
                            <div className="sticky top-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-semibold flex items-center gap-2"><Eye size={24}/> Preview</h2>
                                </div>
                                <div id="invoice-preview" className="bg-white p-2 rounded-xl shadow-lg aspect-[1/1.414]">
                                    <InvoicePreview invoice={invoice} subTotal={subTotal} totalGst={totalGst} grandTotal={grandTotal} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {showClientManager && (
                <ClientManager
                    client={activeClient}
                    onSave={handleSaveClient}
                    onDelete={handleDeleteClient}
                    onClose={() => {
                        setShowClientManager(false);
                        setActiveClient(null);
                    }}
                />
            )}

            {showAdModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-2xl text-center">
                        <h3 className="text-xl font-bold mb-4">Upgrade to Pro for an Ad-Free Experience!</h3>
                        <p className="mb-2">Your invoice will be ready in a few seconds...</p>
                        <div className="w-16 h-16 border-4 border-dashed border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                </div>
            )}

            {authModal === 'login' && (
                <LoginModal
                    onLogin={handleLogin}
                    onClose={() => setAuthModal(null)}
                    onSwitchToSignup={() => setAuthModal('signup')}
                />
            )}
            {authModal === 'signup' && (
                <SignupModal
                    onSignup={handleSignup}
                    onClose={() => setAuthModal(null)}
                    onSwitchToLogin={() => setAuthModal('login')}
                />
            )}
        </div>
    );
};

export default App;