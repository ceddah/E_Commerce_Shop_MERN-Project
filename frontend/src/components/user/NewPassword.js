import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import { LOGIN } from '../../constants/routes';
import { resetPassword, clearErrors } from '../../actions/userActions';


const NewPassword = ({ history, match }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const alert = useAlert();
    const dispatch = useDispatch(); 
    const { error, success } = useSelector(state => state.forgotPassword);

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('password', password);
        formData.set('confirmPassword', confirmPassword);

        dispatch(resetPassword(match.params.token, formData));
    }

    useEffect(() => {
        if(error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if(success) {
            alert.success('Password updated successfully');
            history.push(LOGIN);
        }

    }, [dispatch, alert, error, history, success]);
    return (
        <React.Fragment>
            <MetaData title="Reset your Password" />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form onSubmit={submitHandler} className="shadow-lg">
                        <h1 className="mb-3">New Password</h1>

                        <div className="form-group">
                            <label htmlFor="password_field">Password</label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control"
                                value={password}
                                onChange={({target}) => setPassword(target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirm_password_field">Confirm Password</label>
                            <input
                                type="password"
                                id="confirm_password_field"
                                className="form-control"
                                value={confirmPassword}
                                onChange={({target}) => setConfirmPassword(target.value)}
                            />
                        </div>

                        <button
                            id="new_password_button"
                            type="submit"
                            className="btn btn-block py-3">
                            Set Password
                        </button>

                    </form>
                </div>
            </div>
        </React.Fragment>
    )
}

export default NewPassword
