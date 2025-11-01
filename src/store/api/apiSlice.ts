import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseURL = import.meta.env.VITE_BACKEND_DOMAIN
const refreshURL = 'auth/token/refresh/'

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["User", "Tree", "Payments", "Withdrawals",
     'Dashboard', 'InvestmentHistory', 'UserTransfers'],
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    // Configuración para evitar problemas de CORS
    mode: 'cors',
    credentials: 'omit', // No enviar cookies en desarrollo
    prepareHeaders: async (headers) => {
      let token = localStorage.getItem('access');
      const refresh = localStorage.getItem('refresh');
      
      // Headers básicos necesarios
      headers.set('Content-Type', 'application/json');
      headers.set('Accept', 'application/json');
      
      if (token) {
        const timestamp = localStorage.getItem('timestamp');
        const now = new Date().getTime();
        if (timestamp) {
          const expiry = parseInt(timestamp);
          if (expiry < now) {
            try {
              const response = await fetch(baseURL + refreshURL, {
                method: 'POST',
                body: JSON.stringify({
                  refresh: refresh,
                }),
                headers: { 
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
              });
              if (!response.ok) throw new Error('Network response was not ok');
              const data = await response.json();
              token = data.access;
              localStorage.setItem('access', data.access);
              localStorage.setItem('refresh', data.refresh);
              // Asegurándose de que el tiempo de expiración está en milisegundos
              localStorage.setItem('timestamp', `${now + 5 * 60 * 1000}`);
            } catch (error) {
              console.error('Error refreshing token:', error);
              localStorage.removeItem('access');
              localStorage.removeItem('refresh');
              localStorage.removeItem('timestamp');
            }
          }
        }
      }
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({}),
});
