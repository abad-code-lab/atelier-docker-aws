import axios from 'axios';
import type { Person } from '../types/Person';

const API_URL = 'http://localhost:8080/api/persons';

export const personService = {
    getAllPersons: async (): Promise<Person[]> => {
        const response = await axios.get(API_URL);
        return response.data;
    },

    getPersonById: async (id: number): Promise<Person> => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    createPerson: async (person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>): Promise<Person> => {
        const response = await axios.post(API_URL, person);
        return response.data;
    },

    updatePerson: async (id: number, person: Omit<Person, 'id' | 'createdAt' | 'updatedAt'>): Promise<Person> => {
        const response = await axios.put(`${API_URL}/${id}`, person);
        return response.data;
    },

    deletePerson: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/${id}`);
    }
};
