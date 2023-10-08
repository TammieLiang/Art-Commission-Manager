import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Orders from './Order/Orders';
import FormBuilder from './Form/FormBuilder';
import Forms from './Form/Forms';
import Navbar from '../components/Navbar';
import ActiveForm from './Form/ActiveForm';
import FormDetails from './Form/FormDetails';
import OrderDetails from './Order/OrderDetails';
import EditOrderDetails from './Order/EditOrderDetails';
import Commissions from './Order/Commissions';

import { QuestionFieldsContext } from '../context/QuestionFieldsContext';
import { FormsContext } from '../context/FormsContext';
import { OrdersContext } from '../context/OrdersContext';
import Login from './Login';

import { useAuthContext } from '../hooks/useAuthContext';
import { useFormFetches } from '../hooks/useFormFetches';

function MainPage() {
    const [forms, setForms] = useState([]);
    const [orders, setOrders] = useState([]);
    //const [activeForm, setActiveForm] = useState(null);
    // the current list of questions of the CURRENT form the user is on
    const [questionFieldList, setQuestionFieldList] = useState([]);
    const { user } = useAuthContext();

    const fetchAllForms = async () => {
        if (!user) {
            return;
        }
        const response = await fetch('http://localhost:4000/api/forms/', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        const json = await response.json();

        if (response.ok) {
            setForms(json);
            console.log('Fetched all forms in main page! ', json);
            //findActiveForm();
        }
    };

    const fetchAllOrders = async () => {
        const response = await fetch('http://localhost:4000/api/orders', {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        const json = await response.json();

        if (response.ok) {
            setOrders(json);
            console.log('Fetched all orders in main page! ', json);
        }
    };

    useEffect(() => {
        if (user) {
            fetchAllForms();
            fetchAllOrders();
        }
    }, [user]);

    return (
        <div className="App">
            <BrowserRouter>
                <FormsContext.Provider value={{ forms, setForms }}>
                <OrdersContext.Provider value={{ orders, setOrders }}>


                <Navbar />
                </OrdersContext.Provider>
                </FormsContext.Provider>
                <div className="pages">
                    <Routes>
                        <Route
                            exact
                            path="/"
                            element={
                                user ? (
                                    <OrdersContext.Provider value={{ orders, setOrders }}>
                                        <Orders />
                                    </OrdersContext.Provider>
                                ) : (
                                    <Navigate to="/login"></Navigate>
                                )
                            }
                        />
                        <Route
                            exact
                            path="/forms"
                            element={
                                user ? (
                                    <FormsContext.Provider value={{ forms, setForms }}>
                                        <Forms />
                                    </FormsContext.Provider>
                                ) : (
                                    <Navigate to="/login"></Navigate>
                                )
                            }
                        />

                        <Route
                            exact
                            path="/form-builder"
                            element={
                                user ? (
                                    <FormsContext.Provider value={{ forms, setForms }}>
                                        <QuestionFieldsContext.Provider value={{ questionFieldList, setQuestionFieldList }}>
                                            <FormBuilder />
                                        </QuestionFieldsContext.Provider>
                                    </FormsContext.Provider>
                                ) : (
                                    <Navigate to="/login"></Navigate>
                                )
                            }
                        />
                        <Route
                            exact
                            path="/forms/:id"
                            element={
                                user ? (
                                    <FormsContext.Provider value={{ forms, setForms }}>
                                        <QuestionFieldsContext.Provider value={{ questionFieldList, setQuestionFieldList }}>
                                            <FormDetails />
                                        </QuestionFieldsContext.Provider>
                                    </FormsContext.Provider>
                                ) : (
                                    <Navigate to="/login"></Navigate>
                                )
                            }
                        />

                        <Route
                            exact
                            path="/form"
                            element={
                                user ? (
                                    <FormsContext.Provider value={{ forms, setForms }}>
                                        <QuestionFieldsContext.Provider value={{ questionFieldList, setQuestionFieldList }}>
                                            <ActiveForm />
                                        </QuestionFieldsContext.Provider>
                                    </FormsContext.Provider>
                                ) : (
                                    <Navigate to="/login"></Navigate>
                                )
                            }
                        />

                        <Route
                            exact
                            path="/orders"
                            element={
                                user ? (
                                    <OrdersContext.Provider value={{ orders, setOrders }}>
                                        <QuestionFieldsContext.Provider value={{ questionFieldList, setQuestionFieldList }}>
                                            <Orders />
                                        </QuestionFieldsContext.Provider>
                                    </OrdersContext.Provider>
                                ) : (
                                    <Navigate to="/login"></Navigate>
                                )
                            }
                        />

                        <Route
                            exact
                            path="/orders/:id"
                            element={
                                user ? (
                                    <OrdersContext.Provider value={{ orders, setOrders }}>
                                        <OrderDetails />
                                    </OrdersContext.Provider>
                                ) : (
                                    <Navigate to="/login"></Navigate>
                                )
                            }
                        />
                        <Route
                            exact
                            path="/orders/edit/:id"
                            element={
                                user ? (
                                    <OrdersContext.Provider value={{ orders, setOrders }}>
                                        <EditOrderDetails />
                                    </OrdersContext.Provider>
                                ) : (
                                    <Navigate to="/login"></Navigate>
                                )
                            }
                        />

                        <Route exact path="/commissions" element={user ? <Commissions /> : <Navigate to="/login"></Navigate>} />
                        <Route exact path="/login" element={!user ? <Login /> : <Navigate to="/"></Navigate>} />
                    </Routes>
                </div>
            </BrowserRouter>
        </div>
    );
}

export default MainPage;
