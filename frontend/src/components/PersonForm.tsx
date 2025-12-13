import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { personService } from '../api/personService';
import toast from 'react-hot-toast';
import { UserCircleIcon, EnvelopeIcon, PhoneIcon, CalendarIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'; // Using 24/outline for inputs

const PersonForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        age: '',
        description: ''
    });

    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            personService.getPersonById(Number(id))
                .then(person => {
                    setInitialValues({
                        firstName: person.firstName,
                        lastName: person.lastName,
                        email: person.email,
                        phoneNumber: person.phoneNumber || '',
                        age: person.age ? String(person.age) : '',
                        description: person.description || ''
                    });
                })
                .catch(error => {
                    console.error('Failed to fetch person details', error);
                    toast.error('Failed to load person details');
                    navigate('/');
                })
                .finally(() => setLoading(false));
        }
    }, [id, isEditMode, navigate]);

    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: Yup.object({
            firstName: Yup.string().required('First Name is required'),
            lastName: Yup.string().required('Last Name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            phoneNumber: Yup.string(),
            age: Yup.number().positive('Age must be positive').integer('Age must be an integer').nullable(),
            description: Yup.string().max(500, 'Description must be 500 characters or less')
        }),
        onSubmit: async (values, { setSubmitting }) => {
            const submissionValues = {
                ...values,
                age: values.age ? Number(values.age) : undefined
            };

            try {
                if (isEditMode) {
                    await personService.updatePerson(Number(id), submissionValues);
                    toast.success('Person updated successfully');
                } else {
                    await personService.createPerson(submissionValues);
                    toast.success('Person created successfully');
                }
                navigate('/');
            } catch (error: any) {
                console.error("Failed to save person", error);
                if (error.response && error.response.data) {
                    toast.error(`Error: ${error.response.data.message || 'Failed to save person'}`);
                } else {
                    toast.error('Failed to save person');
                }
            } finally {
                setSubmitting(false);
            }
        },
    });

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
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
                <button onClick={() => navigate('/')} className="flex items-center text-sm text-slate-500 hover:text-indigo-600 transition-colors mb-4 group">
                    <ArrowLeftIcon className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                    Retour au tableau de bord
                </button>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    {isEditMode ? 'Edit Profile' : 'Nouvelle Personne'}
                </h1>
                <p className="mt-2 text-slate-500">
                    {isEditMode ? 'Update personal information and contact details.' : 'Ajouter une nouvelle personne.'}
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-visible p-8">
                <form onSubmit={formik.handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 gap-y-8 gap-x-8 sm:grid-cols-2">
                        {/* First Name */}
                        <div className="relative">
                            <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Prénom
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="firstName"
                                    {...formik.getFieldProps('firstName')}
                                    className={`block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3 transition-colors ${formik.touched.firstName && formik.errors.firstName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                                    placeholder="Abad"
                                />
                            </div> 

                            {formik.touched.firstName && formik.errors.firstName && (
                                <p className="absolute -bottom-6 left-0 text-xs text-red-500 font-medium">{formik.errors.firstName}</p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div className="relative">
                            <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Nom
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                {...formik.getFieldProps('lastName')}
                                className={`block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 px-3 transition-colors ${formik.touched.lastName && formik.errors.lastName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                                placeholder="DAFFE" 
                            />
                            {formik.touched.lastName && formik.errors.lastName && (
                                <p className="absolute -bottom-6 left-0 text-xs text-red-500 font-medium">{formik.errors.lastName}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="sm:col-span-2 relative">
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Adresse Email
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <EnvelopeIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    {...formik.getFieldProps('email')}
                                    className={`block w-full rounded-lg border-slate-300 pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 transition-colors ${formik.touched.email && formik.errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                                    placeholder="abad@example.com"
                                />
                            </div>
                            {formik.touched.email && formik.errors.email && (
                                <p className="absolute -bottom-6 left-0 text-xs text-red-500 font-medium">{formik.errors.email}</p>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div className="relative">
                            <label htmlFor="phoneNumber" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Téléphone <span className="text-slate-400 font-normal text-xs ml-1">(Optional)</span>
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <PhoneIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                                </div>
                                <input
                                    type="text"
                                    id="phoneNumber"
                                    {...formik.getFieldProps('phoneNumber')}
                                    className={`block w-full rounded-lg border-slate-300 pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 transition-colors`}
                                    placeholder="+221 77 777 77 77"
                                />
                            </div>
                        </div>

                        {/* Age */}
                        <div className="relative">
                            <label htmlFor="age" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Âge <span className="text-slate-400 font-normal text-xs ml-1">(Optional)</span>
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <CalendarIcon className="h-5 w-5 text-slate-400" aria-hidden="true" />
                                </div>
                                <input
                                    type="number"
                                    id="age"
                                    {...formik.getFieldProps('age')}
                                    className={`block w-full rounded-lg border-slate-300 pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2.5 transition-colors ${formik.touched.age && formik.errors.age ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                                    placeholder="25"
                                />
                            </div>
                            {formik.touched.age && formik.errors.age && (
                                <p className="absolute -bottom-6 left-0 text-xs text-red-500 font-medium">{formik.errors.age}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="sm:col-span-2 relative">
                            <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Description 
                            </label>
                            <textarea
                                id="description"
                                rows={4}
                                {...formik.getFieldProps('description')}
                                className={`block w-full rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-3 transition-colors ${formik.touched.description && formik.errors.description ? 'border-red-300' : ''}`}
                                placeholder="Ajoutez une description"
                            />
                            {formik.touched.description && formik.errors.description && (
                                <p className="mt-1 text-xs text-red-500 font-medium">{formik.errors.description}</p>
                            )}
                            <p className="mt-2 text-xs text-slate-400 text-right">Maximum 500 caractères</p>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-6">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="px-6 py-2.5 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="inline-flex justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-200 transition-all duration-200 transform hover:translate-y-[-1px]"
                        >
                            {formik.isSubmitting ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Ajouter')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PersonForm;
