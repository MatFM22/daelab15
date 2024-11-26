import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';

const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);

    useEffect(() => {
        axiosInstance.get('/invoices/')
            .then((response) => setInvoices(response.data))
            .catch((error) => console.error(error));
    }, []);

    return (
        <div>
            <h2>Listado de Facturas</h2>
            <table>
                <thead>
                    <tr>
                        <th>Número</th>
                        <th>Cliente</th>
                        <th>Monto</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice) => (
                        <tr key={invoice.id}>
                            <td>{invoice.number}</td>
                            <td>{invoice.client?.name || 'N/A'}</td>
                            <td>{invoice.total_amount}</td>
                            <td>{invoice.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InvoiceList;
