import React, { useEffect, useState } from 'react'

import { HOME } from '../../constants/routes'
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';
import MetaData from '../layout/MetaData';
import { register, clearErrors } from '../../actions/userActions';
const Register = ({ history }) => {
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [avatar, setAvatar] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('/images/default_avatar.jpg');
    const alert = useAlert();
    const dispatch = useDispatch();
    const { isAuthenticated, error, loading } = useSelector(state => state.auth);

    const submitHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', user.name);
        formData.set('email', user.email);
        formData.set('password', user.password);
        formData.set('avatar', avatar);

        dispatch(register(formData));
    }

    const onChange = (e) => {
        if(e.target.name === 'avatar') {
            const reader = new FileReader();
            reader.onload = () => {
                if(reader.readyState === 2) {
                    setAvatarPreview(reader.result);
                    setAvatar(reader.result);
                }
            }
            reader.readAsDataURL(e.target.files[0]);
        } else {
            setUser({...user, [e.target.name]: e.target.value });
        }
    }

    useEffect(() => {
        if(isAuthenticated) {
            history.push(HOME)
        }
    
        if(error) {
            alert.error(error);
            dispatch(clearErrors());
        }

    }, [dispatch, alert, isAuthenticated, error, history]);
    return (
        <React.Fragment>
            <MetaData title="Register User" />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form onSubmit={submitHandler } className="shadow-lg" encType='multipart/form-data'>
                        <h1 className="mb-3">Register</h1>
                        <div className="form-group">
                            <label htmlFor="name_field">Name</label>
                            <input 
                                type="name" 
                                id="name_field" 
                                className="form-control" 
                                value={user.name}
                                name="name"
                                onChange={onChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email_field">Email</label>
                            <input
                                type="email"
                                id="email_field"
                                className="form-control"
                                value={user.email}
                                name="email"
                                onChange={onChange}
                            />
                        </div>
            
                        <div className="form-group">
                            <label htmlFor="password_field">Password</label>
                            <input
                                type="password"
                                id="password_field"
                                className="form-control"
                                value={user.password}
                                name="password"
                                onChange={onChange}
                            />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='avatar_upload'>Avatar</label>
                            <div className='d-flex align-items-center'>
                                <div>
                                    <figure className='avatar mr-3 item-rtl'>
                                        <img
                                            src={avatarPreview}
                                            className='rounded-circle'
                                            alt='avatar preview'
                                        />
                                    </figure>
                                </div>
                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='avatar'
                                        className='custom-file-input'
                                        id='customFile'
                                        accept="images/*"
                                        onChange={onChange}
                                    />
                                    <label className='custom-file-label' htmlFor='customFile'>
                                        Choose Avatar
                                    </label>
                                </div>
                            </div>
                        </div>
            
                        <button
                            id="register_button"
                            type="submit"
                            className="btn btn-block py-3"
                            disabled={ loading ? true : false}
                        >
                        REGISTER
                        </button>
                    </form>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Register
