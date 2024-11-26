import React, { useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/token/', { username, password });
            console.log("Respuesta del servidor:", response.data);
    
            // Guardar los tokens en localStorage
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
    
            // Redirigir al dashboard
            navigate('/dashboard');
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            if (error.response) {
                console.error("Error en la respuesta del servidor:", error.response.data);
                if (error.response.status === 401) {
                    alert('Usuario o contraseña incorrectos.');
                } else {
                    alert(`Error del servidor: ${error.response.status}`);
                }
            } else if (error.request) {
                console.error("No se recibió respuesta del servidor:", error.request);
                alert('No se pudo conectar con el servidor. Verifica la conexión.');
            } else {
                console.error("Error al configurar la solicitud:", error.message);
                alert('Hubo un error en la solicitud.');
            }
        }
    };

    return (
        <div>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Ingresar</button>
            </form>
        </div>
    );
};

export default Login;
