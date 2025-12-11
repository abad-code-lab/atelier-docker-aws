import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { personService } from '../api/personService';
import type { Person } from '../types/Person';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const PersonList: React.FC = () => {
    const [persons, setPersons] = useState<Person[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        loadPersons();
    }, []);

    const loadPersons = async () => {
        try {
            const data = await personService.getAllPersons();
            setPersons(data);
        } catch (error) {
            console.error("Failed to fetch persons", error);
            toast.error('Failed to load persons');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this person?')) {
            try {
                await personService.deletePerson(id);
                toast.success('Person deleted successfully');
                loadPersons();
            } catch (error) {
                console.error("Failed to delete person", error);
                toast.error('Failed to delete person');
            }
        }
    };

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Person List</h1>
                    <Link to="/create" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Add Person
                    </Link>
                </div>

                <div className="flex flex-col">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                ID
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Full Name
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Created At
                                            </th>
                                            <th scope="col" className="relative px-6 py-3">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {persons.map((person) => (
                                            <tr key={person.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {person.id}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{person.firstName} {person.lastName}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">{person.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {person.createdAt ? new Date(person.createdAt).toLocaleDateString() : '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                    <Link to={`/view/${person.id}`} className="text-gray-400 hover:text-gray-900">
                                                        <EyeIcon className="h-5 w-5 inline" aria-label="View" />
                                                    </Link>
                                                    <Link to={`/edit/${person.id}`} className="text-indigo-600 hover:text-indigo-900">
                                                        <PencilIcon className="h-5 w-5 inline" aria-label="Edit" />
                                                    </Link>
                                                    <button onClick={() => handleDelete(person.id)} className="text-red-600 hover:text-red-900">
                                                        <TrashIcon className="h-5 w-5 inline" aria-label="Delete" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        {persons.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                                                    No persons found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonList;
