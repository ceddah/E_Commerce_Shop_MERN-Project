import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import { forgotPassword, clearErrors } from '../../actions/userActions';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');

    const alert = useAlert();
    const dispatch = useDispatch(); 
    const { error, message, loading } = useSelector(state => state.forgotPassword);

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('email', email);

        dispatch(forgotPassword(formData));
    }

    useEffect(() => {
        if(error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if(message) {
            alert.success(message); 
        }

    }, [dispatch, alert, error, message]);
    return (
        <React.Fragment>
            <MetaData title="Forgot Password" />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form onSubmit={submitHandler}className="shadow-lg">
                        <h1 className="mb-3">Forgot Password</h1>
                        <div className="form-group">
                            <label htmlFor="email_field">Enter Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                value={email}
                                onChange={({target}) => setEmail(target.value)}
                            />
                        </div>

                        <button
                            id="forgot_password_button"
                            type="submit"
                            disabled={loading ? true : false}
                            className="btn btn-block py-3">
                            Send Email
                    </button>

                    </form>
                </div>
            </div>
        </React.Fragment>
    )
}

export default ForgotPassword
