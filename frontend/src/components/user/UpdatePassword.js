import React, { useEffect, useState } from 'react'

import { MY_PROFILE } from '../../constants/routes'
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import { updatePassword, clearErrors } from '../../actions/userActions';
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants';

const UpdatePassword = ({ history }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const alert = useAlert();
    const dispatch = useDispatch(); 
    const { error, isUpdated, loading } = useSelector(state => state.user);

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('oldPassword', oldPassword);
        formData.set('newPassword', newPassword);

        dispatch(updatePassword(formData));
    }

    useEffect(() => {
        if(error) {
            alert.error(error);
            dispatch(clearErrors());
        }

        if(isUpdated) {
            alert.success('Password updated successfully'); 
            history.push(MY_PROFILE);
            dispatch({
                type: UPDATE_PASSWORD_RESET
            });
        }

    }, [dispatch, alert, error, history, isUpdated]);
    return (
        <React.Fragment>
            <MetaData title="Change your Password" />
                <div className="row wrapper">
                    <div className="col-10 col-lg-5">
                        <form onSubmit={submitHandler} className="shadow-lg">
                            <h1 className="mt-2 mb-5">Update Password</h1>
                            <div className="form-group">
                                <label htmlFor="old_password_field">Old Password</label>
                                <input
                                    type="password"
                                    id="old_password_field"
                                    className="form-control"
                                    value={oldPassword}
                                    onChange={({target}) => setOldPassword(target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="new_password_field">New Password</label>
                                <input
                                    type="password"
                                    id="new_password_field"
                                    className="form-control"
                                    value={newPassword}
                                    onChange={({target}) => setNewPassword(target.value)}
                                />
                            </div>

                            <button disabled={loading ? true : false} type="submit" className="btn update-btn btn-block mt-4 mb-3">Update Password</button>
                        </form>
                    </div>
                </div>
        </React.Fragment>
    )
}

export default UpdatePassword
