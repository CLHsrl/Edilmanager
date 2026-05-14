import { getClients } from '../actions';
import ClientsClient from './ClientsClient';

export default async function ClientsPage(props: { searchParams: Promise<{ query?: string }> }) {
    const searchParams = await props.searchParams;
    const query = searchParams.query || '';
    const clients = await getClients(query);

    const stats = {
        total: clients.length,
        privati: clients.filter(c => c.type === 'PRIVATE').length,
        aziende: clients.filter(c => c.type === 'COMPANY').length,
    };

    return (
        <div className="page-content">
            <ClientsClient 
                clients={clients as any} 
                stats={stats} 
            />
        </div>
    );
}
