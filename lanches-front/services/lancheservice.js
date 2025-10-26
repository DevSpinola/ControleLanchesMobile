// service para interagir com a API de lanches
import api from './api';

export const getLanches = async () => {
    try {
        const response = await api.get('/lanche');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar lanches:', error);
        throw error;
    }   
};
export const getLancheById = async (id) => {
    try {
        const response = await api.get(`/lanche/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar lanche:', error);
        throw error;
    }
};
export const getNextLancheId = async () => {
    try {
        const response = await api.get('/lanche/getNextId');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar próximo ID de lanche:', error);
        throw error;
    }
};
export const createLanche = async (lancheData) => {
    try {
        const response = await api.post('/lanche', lancheData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar lanche:', error);
        throw error;
    }
};
export const updateLanche = async (id, lancheData) => {
    try {
        const response = await api.put(`/lanche/${id}`, lancheData);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar lanche:', error);
        throw error;
    }
};
export const deleteLanche = async (id) => {
    try {
        const response = await api.delete(`/lanche/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar lanche:', error);
        throw error;
    }
};

export const marcarLancheEntregue = async (id) => {
    try {
        const response = await api.patch(`/lanche/${id}/entregar`);
        return response.data;
    } catch (error) {
        console.error('Erro ao marcar lanche como entregue:', error);
        throw error;
    }
};

export const getLanchesByData = async (data) => {
    try {
        const response = await api.get(`/lanche/data/${data}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar lanches por data:', error);
        throw error;
    }
};
