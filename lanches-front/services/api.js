import axios from 'axios';

const api = axios.create({
    baseURL: 'http://10.0.2.2:3000',
    timeout: 30000, // 30 segundos para upload de imagens
    headers: {
        'Content-Type': 'application/json',
    },
    maxContentLength: Infinity,
    maxBodyLength: Infinity
});

export default api;