import React from 'react'
import '../../App.css';
import { Route, Link } from 'react-router-dom';
import { HOME, LOGIN, CART, MY_ORDERS, DASHBOARD, MY_PROFILE } from '../../constants/routes'
import Search from './Search';

import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import { logout } from '../../actions/userActions'

const Header = () => {
    const alert = useAlert();
    const dispatch = useDispatch();

    const { user, loading } = useSelector(state => state.auth);
    const { cartItems } = useSelector(state => state.cart);

    const logoutHandler = () => {
        dispatch(logout());
        alert.success('Logged out Successfully.');
    }

    return (
        <React.Fragment>
            <nav className="navbar row">
                <div className="col-12 col-md-3">
                    <div className="navbar-brand">
                        <Link to={HOME} className="logo-link" >
                            <div className="d-flex px-3 rounded py-1 bg-dark">
                                <svg viewBox="0 0 24 24" width="36" height="36" stroke="#fa9c23" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                                <h3 className="ml-3">E-Shop</h3>
                            </div>
                        </Link>
                    </div>
                </div>

                <div className="col-12 col-md-6 mt-2 mt-md-0">
                    <Route render={({ history }) => <Search history={history} />} />
                </div>

                <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
                    <Link to={CART} style={{ textDecoration: 'none' }}>
                        <span id="cart" className="ml-3">Cart</span>
                        <span className="ml-2" id="cart_count">{cartItems.length}</span>
                    </Link>
                    {user ? (
                        <div className="ml-4 dropdown d-inline">
                            <Link 
                                to="#!" 
                                className="btn dropdown-toggle text-white mr-4" 
                                type="button" id="dropDownMenuButton" 
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                            >
                                <figure className="avatar avatar-nav">
                                    <img 
                                        src={user.avatar && user.avatar.url} 
                                        alt={user && user.name} 
                                        className="rounded-circle"
                                    />
                                </figure>
                                <span>{user && user.name}</span>
                            </Link>
                            <div className="dropdown-menu" aria-labelledby="dropDownMenuButton">
                                {user && user.role === 'admin' ? <Link to={DASHBOARD} className="dropdown-item">Dashboard</Link> : null}
                                <Link to={MY_ORDERS} className="dropdown-item">Orders</Link>
                                <Link to={MY_PROFILE} className="dropdown-item">Profile</Link>
                                <Link to={HOME} className="dropdown-item text-danger" onClick={logoutHandler}>
                                    Logout
                                </Link>
                            </div>
                        </div>
                    ) : !loading && <Link to={LOGIN} className="btn ml-4" id="login_btn">Login</Link>}
            
                </div>
            </nav>
        </React.Fragment>
    )
}

export default Header
