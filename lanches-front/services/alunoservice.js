// service para interagir com a API de alunos
import api from './api';
export const getAlunos = async () => {
    try {
        const response = await api.get('/aluno');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar alunos:', error);
        throw error;
    }
};
export const getAlunoById = async (id) => {
    try {
        const response = await api.get(`/aluno/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar aluno:', error);
        throw error;
    }
};
export const createAluno = async (alunoData) => {
    try {
        const response = await api.post('/aluno', alunoData);
        return response.data;
    } catch (error) {
        console.error('Erro ao criar aluno:', error);
        throw error;
    }
};
export const updateAluno = async (id, alunoData) => {
    try {
        const response = await api.put(`/aluno/${id}`, alunoData);
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar aluno:', error);
        throw error;
    }
};
export const deleteAluno = async (id) => {
    try {
        const response = await api.delete(`/aluno/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar aluno:', error);
        throw error;
    }
};