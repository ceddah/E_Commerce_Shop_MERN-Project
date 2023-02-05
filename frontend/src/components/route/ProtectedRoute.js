import React from 'react'
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LOGIN, HOME } from '../../constants/routes';

const ProtectedRoute = ({ component: Component, isAdmin, ...rest }) => {
    const { isAuthenticated, loading, user } = useSelector(state => state.auth);
    return (
        <React.Fragment>
            {loading === false && (
                <Route 
                    {...rest} 
                    render={props => {
                        if(isAuthenticated === false) {
                            return <Redirect to={LOGIN} />
                        }

                        if(isAdmin === true && user.role !== 'admin') {
                            return <Redirect to={HOME} />
                        }

                        return <Component {...props} />
                    }}
                />
            )}
        </React.Fragment>
    )
}

export default ProtectedRoute
