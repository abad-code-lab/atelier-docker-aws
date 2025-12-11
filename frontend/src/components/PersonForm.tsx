import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { personService } from '../api/personService';
import toast from 'react-hot-toast';


const PersonForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditMode = !!id;
    const [loading, setLoading] = useState(false);
    const [initialValues, setInitialValues] = useState({
        firstName: '',
        lastName: '',
        email: '',
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
                        description: person.description
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
            description: Yup.string().max(500, 'Description must be 500 characters or less')
        }),
        onSubmit: async (values, { setSubmitting }) => {
            try {
                if (isEditMode) {
                    await personService.updatePerson(Number(id), values);
                    toast.success('Person updated successfully');
                } else {
                    await personService.createPerson(values);
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
        return <div className="text-center mt-10">Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-0">
                <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                    {isEditMode ? 'Edit Person' : 'Create New Person'}
                </h1>

                <form onSubmit={formik.handleSubmit} className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                                First Name
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="firstName"
                                    {...formik.getFieldProps('firstName')}
                                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${formik.touched.firstName && formik.errors.firstName ? 'border-red-300' : ''}`}
                                />
                                {formik.touched.firstName && formik.errors.firstName && (
                                    <p className="mt-2 text-sm text-red-600">{formik.errors.firstName}</p>
                                )}
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                                Last Name
                            </label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    id="lastName"
                                    {...formik.getFieldProps('lastName')}
                                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${formik.touched.lastName && formik.errors.lastName ? 'border-red-300' : ''}`}
                                />
                                {formik.touched.lastName && formik.errors.lastName && (
                                    <p className="mt-2 text-sm text-red-600">{formik.errors.lastName}</p>
                                )}
                            </div>
                        </div>

                        <div className="sm:col-span-6">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email address
                            </label>
                            <div className="mt-1">
                                <input
                                    type="email"
                                    id="email"
                                    {...formik.getFieldProps('email')}
                                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${formik.touched.email && formik.errors.email ? 'border-red-300' : ''}`}
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <p className="mt-2 text-sm text-red-600">{formik.errors.email}</p>
                                )}
                            </div>
                        </div>

                        <div className="sm:col-span-6">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <div className="mt-1">
                                <textarea
                                    id="description"
                                    rows={3}
                                    {...formik.getFieldProps('description')}
                                    className={`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md ${formik.touched.description && formik.errors.description ? 'border-red-300' : ''}`}
                                />
                                {formik.touched.description && formik.errors.description && (
                                    <p className="mt-2 text-sm text-red-600">{formik.errors.description}</p>
                                )}
                            </div>
                            <p className="mt-2 text-sm text-gray-500">Brief description about the person.</p>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={formik.isSubmitting}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isEditMode ? 'Update' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PersonForm;
