import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { useNavigate } from 'react-router-dom';

// Registrar componentes de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [metrics, setMetrics] = useState(null);
    const [notifications, setNotifications] = useState(null);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        navigate('/');
    };

    useEffect(() => {
        // Obtener métricas del dashboard
        axiosInstance.get('/dashboard-metrics/')
            .then((response) => {
                setMetrics(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener las métricas:", error);
            });

        // Obtener notificaciones
        axiosInstance.get('/notifications/')
            .then((response) => {
                setNotifications(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener las notificaciones:", error);
            });
    }, []);

    if (!metrics || !notifications) {
        return <div>Cargando datos del dashboard...</div>;
    }

    const barChartData = {
        labels: metrics.facturas_por_mes.map((data) => `Mes ${data.issue_date__month}`),
        datasets: [
            {
                label: 'Total por mes',
                data: metrics.facturas_por_mes.map((data) => data.total),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div>
            <h1>Dashboard Contable</h1>
            <button onClick={handleLogout}>Cerrar Sesión</button>
            <div>
                <h3>Total por Cobrar: ${metrics.total_por_cobrar}</h3>
                <h3>Total por Pagar: ${metrics.total_por_pagar}</h3>
                <h3>Total Vencido: ${metrics.total_vencido}</h3>
            </div>
            <div style={{ width: '600px', margin: 'auto' }}>
                <Bar data={barChartData} />
            </div>
            <div>
                <h2>Notificaciones</h2>
                <h3>Próximas a vencer:</h3>
                <ul>
                    {notifications.proximas_a_vencer.map((factura) => (
                        <li key={factura.number}>
                            Factura {factura.number} - Cliente: {factura.client__name} - Vence el: {factura.due_date}
                        </li>
                    ))}
                </ul>
                <h3>Vencidas:</h3>
                <ul>
                    {notifications.vencidas.map((factura) => (
                        <li key={factura.number}>
                            Factura {factura.number} - Cliente: {factura.client__name} - Venció el: {factura.due_date}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;