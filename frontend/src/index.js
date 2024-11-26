import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa el método createRoot
import './index.css';
import AppRoutes from './routes';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <AppRoutes />
    </React.StrictMode>
);