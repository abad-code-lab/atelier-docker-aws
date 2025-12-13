import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { personService } from '../api/personService';
import type { Person } from '../types/Person';
import { PencilIcon, TrashIcon, EyeIcon, PlusIcon, UserGroupIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // Added Search Icon
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
        return (
            <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
                <div className="relative w-20 h-20">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full opacity-25"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Header Section */}
            <div className="md:flex md:items-center md:justify-between">
                <div className="flex-1 min-w-0">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl flex items-center gap-3">
                        Personnes
                        <span className="bg-indigo-100 text-indigo-700 text-base py-1 px-3 rounded-full font-semibold">{persons.length}</span>
                    </h2>
                    <p className="mt-2 text-md text-slate-500 max-w-2xl">
                        Gérez vos personnes ici.
                    </p>
                </div>
                <div className="mt-4 flex md:mt-0 md:ml-4 gap-3">
                    <div className="relative rounded-md shadow-sm hidden sm:block">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            type="text"
                            name="search"
                            id="search"
                            className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-lg py-2.5"
                            placeholder="Search..."
                        />
                    </div>
                    <Link
                        to="/create"
                        className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:translate-y-[-1px]"
                    >
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                        Ajouter une personne
                    </Link>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th scope="col" className="px-6 py-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-[25%]">
                                    Personnes
                                </th>
                                <th scope="col" className="px-6 py-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-[25%]">
                                    Email
                                </th>
                                <th scope="col" className="px-6 py-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-[20%]">
                                    Téléphone
                                </th>
                                <th scope="col" className="px-6 py-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-[10%]">
                                    Âge
                                </th>
                                <th scope="col" className="px-6 py-5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-[10%]">
                                    Rejoint le
                                </th>
                                <th scope="col" className="relative px-6 py-5 w-[10%]">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-50">
                            {persons.map((person) => (
                                <tr key={person.id} className="hover:bg-slate-50/80 transition-colors duration-200 group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-600 font-bold text-sm shadow-sm">
                                                    {person.firstName[0]}{person.lastName[0]}
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{person.firstName} {person.lastName}</div>
                                                <div className="text-xs text-slate-400">ID: {person.id}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-600">{person.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-slate-600">{person.phoneNumber || <span className="text-slate-300">-</span>}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {person.age ? <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">{person.age}</span> : <span className="text-slate-300">-</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                        {person.createdAt ? new Date(person.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <Link to={`/view/${person.id}`} className="text-slate-400 hover:text-indigo-600 transition-colors p-1 rounded-md hover:bg-indigo-50">
                                                <EyeIcon className="h-5 w-5" aria-label="View" />
                                            </Link>
                                            <Link to={`/edit/${person.id}`} className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded-md hover:bg-blue-50">
                                                <PencilIcon className="h-5 w-5" aria-label="Edit" />
                                            </Link>
                                            <button onClick={() => handleDelete(person.id)} className="text-slate-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50">
                                                <TrashIcon className="h-5 w-5" aria-label="Delete" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {persons.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center">
                                        <div className="mx-auto h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                            <UserGroupIcon className="h-10 w-10 text-slate-400" />
                                        </div>
                                        <h3 className="text-lg font-medium text-slate-900">Aucun personne trouvée</h3>
                                        <p className="mt-1 text-sm text-slate-500">Commencez par ajouter une personne.</p>
                                        <div className="mt-6">
                                            <Link
                                                to="/create"
                                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                                Créer une personne
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PersonList;
