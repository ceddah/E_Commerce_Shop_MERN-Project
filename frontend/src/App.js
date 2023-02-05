import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import { loadUser } from './actions/userActions';
import store from './store';
import axios from 'axios';
import { useSelector } from 'react-redux';

//Stripe Payment
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js'; 

//Pages
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/Home';
import ProductDetails from './components/product/ProductDetails'
import Login from './components/user/Login';
import Register from './components/user/Register';
import Profile from './components/user/Profile';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import ForgotPassword from './components/user/ForgotPassword';
import newPassword from './components/user/NewPassword';
import Cart from './components/cart/Cart';
import Shipping from './components/cart/Shipping';
import ConfirmOrder from './components/cart/ConfirmOrder';
import Payment from './components/cart/Payment';
import OrderSuccess from './components/cart/OrderSuccess';
import ListOrders from './components/order/ListOrders';
import OrderDetails from './components/order/OrderDetails';
import Dashboard from './components/admin/Dashboard';
import ProductsList from './components/admin/ProductsList';
import NewProduct from './components/admin/NewProduct';
import UpdateProduct from './components/admin/UpdateProduct';
import OrderList from './components/admin/OrderList';
import ProcessOrder from './components/admin/ProcessOrder';
import UserList from './components/admin/UserList';
import UpdateUser from './components/admin/UpdateUser';
import ProductReviews from './components/admin/ProductReviews';

import * as ROUTES from './constants/routes';
import ProtectedRoute from './components/route/ProtectedRoute'; 


function App() {
  const [stripeApiKey, setStripeApiKey] = useState('');
  const { user, isAuthenticated, loading } = useSelector(state => state.auth);
  useEffect(() => {
    store.dispatch(loadUser());

    async function getStripeApiKey() {
      const { data} = await axios.get('/api/v1/stripeapi');
      setStripeApiKey(data.stripeApiKey);
    }

    getStripeApiKey();
  }, []);
  
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Route path={ROUTES.HOME} component={Home} exact />
          <Route path={ROUTES.SEARCH_BY_KEYWORD} component={Home} exact />
          <Route path={ROUTES.PRODUCT_DETAILS} component={ProductDetails} exact />
          <Route path={ROUTES.LOGIN} component={Login} exact />
          <Route path={ROUTES.REGISTER} component={Register} exact />
          <Route path={ROUTES.FORGOT_PASSWORD} component={ForgotPassword} exact />
          <Route path={ROUTES.RESET_PASSWORD} component={newPassword} exact />
          <Route path={ROUTES.CART} component={Cart} exact />
          <ProtectedRoute path={ROUTES.MY_PROFILE} component={Profile} exact />
          <ProtectedRoute path={ROUTES.UPDATE_PROFILE} component={UpdateProfile} exact />
          <ProtectedRoute path={ROUTES.UPDATE_PASSWORD} component={UpdatePassword} exact />
          <ProtectedRoute path={ROUTES.SHIPPING_PAGE} component={Shipping} exact />
          <ProtectedRoute path={ROUTES.CONFIRM_ORDER_PAGE} component={ConfirmOrder} exact />
          <ProtectedRoute path={ROUTES.ORDER_SUCCESS} component={OrderSuccess} exact />
          <ProtectedRoute path={ROUTES.MY_ORDERS} component={ListOrders} exact />
          <ProtectedRoute path={ROUTES.VIEW_ORDER} component={OrderDetails} exact />
          {stripeApiKey && 
            <Elements stripe={loadStripe(stripeApiKey)} >
              <ProtectedRoute path={ROUTES.PAYMENT} component={Payment} exact />
            </Elements>
          }
        </div>
        <ProtectedRoute path={ROUTES.DASHBOARD} isAdmin={true} component={Dashboard} exact />
        <ProtectedRoute path={ROUTES.VIEW_ALL_PRODUCTS} isAdmin={true} component={ProductsList} exact />
        <ProtectedRoute path={ROUTES.CREATE_PRODUCT} isAdmin={true} component={NewProduct} exact />
        <ProtectedRoute path={ROUTES.UPDATE_PRODUCT} isAdmin={true} component={UpdateProduct} exact />
        <ProtectedRoute path={ROUTES.VIEW_ALL_ORDERS} isAdmin={true} component={OrderList} exact />
        <ProtectedRoute path={ROUTES.UPDATE_ORDER_STATUS} isAdmin={true} component={ProcessOrder} exact />
        <ProtectedRoute path={ROUTES.VIEW_ALL_USERS} isAdmin={true} component={UserList} exact />
        <ProtectedRoute path={ROUTES.UPDATE_USER} isAdmin={true} component={UpdateUser} exact />
        <ProtectedRoute path={ROUTES.VIEW_ALL_REVIEWS} isAdmin={true} component={ProductReviews} exact />
        {!loading && (!isAuthenticated || user.role !== 'admin') && (
          <Footer />
        )}
      </div>
    </Router>
  );
}

export default App;
