import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { personService } from '../api/personService';
import type { Person } from '../types/Person';
import toast from 'react-hot-toast';
import { UserCircleIcon, EnvelopeIcon, PhoneIcon, CalendarIcon, ArrowLeftIcon, PencilSquareIcon, ClockIcon } from '@heroicons/react/24/outline';

const PersonDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [person, setPerson] = useState<Person | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (id) {
            personService.getPersonById(Number(id))
                .then(data => setPerson(data))
                .catch(error => {
                    console.error("Failed to fetch person", error);
                    toast.error('Failed to load person details');
                    navigate('/');
                })
                .finally(() => setLoading(false));
        }
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!person) {
        return <div className="text-center mt-10 text-gray-500">Personne non trouvée</div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between">
                <Link to="/" className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
                    <ArrowLeftIcon className="h-4 w-4 mr-1" />
                    Retour à la liste
                </Link>
                <div className="flex space-x-3">
                    <Link
                        to={`/edit/${person.id}`}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        <PencilSquareIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                        Modifier
                    </Link>
                </div>
            </div>

            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                {/* Header Profile Section */}
                <div className="bg-indigo-600 px-6 py-8 sm:px-10 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
                    <div className="flex flex-col sm:flex-row items-center">
                        <div className="h-24 w-24 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-4xl border-4 border-white shadow-md">
                            {person.firstName[0]}{person.lastName[0]}
                        </div>
                        <div className="mt-4 sm:mt-0 sm:ml-6 text-white text-center sm:text-left">
                            <h1 className="text-3xl font-bold">{person.firstName} {person.lastName}</h1>
                            <p className="mt-1 text-indigo-200">Person ID: {person.id}</p>
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="px-6 py-8 sm:px-10">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        {/* Email */}
                        <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 flex items-start">
                            <div className="flex-shrink-0">
                                <EnvelopeIcon className="h-6 w-6 text-indigo-500" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                                <dd className="mt-1 text-base font-semibold text-gray-900">{person.email}</dd>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 flex items-start">
                            <div className="flex-shrink-0">
                                <PhoneIcon className="h-6 w-6 text-indigo-500" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                                <dd className="mt-1 text-base font-semibold text-gray-900">{person.phoneNumber || <span className="text-gray-400 italic">Not provided</span>}</dd>
                            </div>
                        </div>

                        {/* Age */}
                        <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 flex items-start">
                            <div className="flex-shrink-0">
                                <CalendarIcon className="h-6 w-6 text-indigo-500" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <dt className="text-sm font-medium text-gray-500">Age</dt>
                                <dd className="mt-1 text-base font-semibold text-gray-900">{person.age ? `${person.age} years` : <span className="text-gray-400 italic">Not provided</span>}</dd>
                            </div>
                        </div>

                        {/* Created At */}
                        <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-100 flex items-start">
                            <div className="flex-shrink-0">
                                <ClockIcon className="h-6 w-6 text-indigo-500" aria-hidden="true" />
                            </div>
                            <div className="ml-3">
                                <dt className="text-sm font-medium text-gray-500">Registered On</dt>
                                <dd className="mt-1 text-base font-semibold text-gray-900">
                                    {person.createdAt ? new Date(person.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                                </dd>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500 mb-2">Description / Notes</dt>
                            <dd className="mt-1 text-base text-gray-900 bg-gray-50 p-4 rounded-lg border border-gray-100 min-h-[100px]">
                                {person.description || <span className="text-gray-400 italic">No description provided.</span>}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
};

export default PersonDetails;
