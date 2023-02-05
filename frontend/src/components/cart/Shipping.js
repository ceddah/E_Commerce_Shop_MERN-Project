import React, { useState } from 'react'
import { countries } from 'countries-list'

import MetaData from '../layout/MetaData'
import CheckoutSteps from './CheckoutSteps';

import { useDispatch, useSelector } from 'react-redux'
import { saveShoppingInfo } from '../../actions/cartActions'
import { CONFIRM_ORDER_PAGE } from '../../constants/routes';

const Shipping = ({ history }) => {
    const countriesList = Object.values(countries);
    const { shippingInfo } = useSelector(state => state.cart);
    const [address, setAddress] = useState(shippingInfo.address);   
    const [city, setCity] = useState(shippingInfo.city);
    const [postalCode, setPostalCode] = useState(shippingInfo.postalCode);
    const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);
    const [country, setCountry] = useState(shippingInfo.country);

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(saveShoppingInfo({ address, city, postalCode, phoneNo, country }));
        history.push(CONFIRM_ORDER_PAGE); 
    }
    return (
        <React.Fragment>
            <MetaData title="Shipping Info" />
            <CheckoutSteps shipping />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form onSubmit={submitHandler} className="shadow-lg">
                        <h1 className="mb-4">Shipping Info</h1>
                        <div className="form-group">
                            <label htmlFor="address_field">Address</label>
                            <input
                                type="text"
                                id="address_field"
                                className="form-control"
                                value={address}
                                onChange={({target}) => setAddress(target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="city_field">City</label>
                            <input
                                type="text"
                                id="city_field"
                                className="form-control"
                                value={city}
                                onChange={({target}) => setCity(target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone_field">Phone No</label>
                            <input
                                type="phone"
                                id="phone_field"
                                className="form-control"
                                value={phoneNo}
                                onChange={({target}) => setPhoneNo(target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="postal_code_field">Postal Code</label>
                            <input
                                type="number"
                                id="postal_code_field"
                                className="form-control"
                                value={postalCode}
                                onChange={({target}) => setPostalCode(target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="country_field">Country</label>
                            <select
                                id="country_field"
                                className="form-control"
                                value={country}
                                onChange={({target}) => setCountry(target.value)}
                                required
                            >   
                                {countriesList.map(country => <option key={country.name} value={country.name}>{country.name}</option>)}
                            </select>
                        </div>

                        <button
                            id="shipping_btn"
                            type="submit"
                            className="btn btn-block py-3"
                        >
                            CONTINUE
                        </button>
                    </form>
                </div>
            </div>
        </React.Fragment>
    )
}

export default Shipping
