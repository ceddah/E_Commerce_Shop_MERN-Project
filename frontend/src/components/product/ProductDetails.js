import React, { useEffect, useState } from 'react'

import { useDispatch, useSelector } from 'react-redux';
import { getProductDetails, newReview, clearErrors } from '../../actions/productActions';
import { useAlert } from 'react-alert';
import Loader from '../layout/Loader';
import MetaData from '../layout/MetaData';
import ListReviews from '../review/ListReviews';
import { Carousel } from 'react-bootstrap';
import { addItemToCart } from '../../actions/cartActions'

import { NEW_REVIEW_RESET } from '../../constants/productConstants';

const ProductDetails = ({ match }) => {
    const [quantity, setQuantity] = useState(1);
    const dispatch =  useDispatch();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const { loading, error, product } = useSelector(state => state.productDetails);
    const { user } = useSelector(state => state.auth);
    const { error: reviewError, success } = useSelector(state => state.newReview);
    const alert = useAlert();

    const increaseQty = () => {
        const count = document.querySelector('.count');
        if(count.valueAsNumber >= product.stock) return;

        const qty = count.valueAsNumber + 1;
        setQuantity(qty);
    }

    const decreaseQty = () => {
        const count = document.querySelector('.count');
        if(count.valueAsNumber <= 1) return;

        const qty = count.valueAsNumber - 1;
        setQuantity(qty);
    }

    const addToCart = () => {
        dispatch(addItemToCart(match.params.id, quantity));
        alert.success('Item added to cart ');
    }

    function setUserRatings() {
        const stars = document.querySelectorAll('.star');

        stars.forEach((star, index) => {
            star.starValue = index + 1;

            ['click', 'mouseover', 'mouseout'].forEach(function (e) {
                star.addEventListener(e, showRatings);
            })
        })

        function showRatings(e) {
            stars.forEach((star, index) => {
                if (e.type === 'click') {
                    if (index < this.starValue) {
                        star.classList.add('orange');

                        setRating(this.starValue)
                    } else {
                        star.classList.remove('orange')
                    }
                }

                if (e.type === 'mouseover') {
                    if (index < this.starValue) {
                        star.classList.add('yellow');
                    } else {
                        star.classList.remove('yellow')
                    }
                }

                if (e.type === 'mouseout') {
                    star.classList.remove('yellow')
                }
            })
        }
    }

    const reviewHandler = () => {
        const formData = new FormData();

        formData.set('rating', rating);
        formData.set('comment', comment);
        formData.set('productId', match.params.id);

        dispatch(newReview(formData))
    }

    useEffect(() => {
        if(error) {
            alert.error(error);
            dispatch(clearErrors());
        }
        if(reviewError) {
            alert.error(reviewError);
            dispatch(clearErrors());
        }
        if(success) {
            alert.success('Review posted successfully');
            dispatch({ type: NEW_REVIEW_RESET });
        }
        dispatch(getProductDetails(match.params.id));   
    }, [dispatch, alert, error, match.params.id, reviewError, success])

    return (
        <React.Fragment>
            {loading ? <Loader /> : (
                <React.Fragment>
                    <MetaData title={product.name} />
                    <div className="row f-flex justify-content-around">
                        <div className="col-12 col-lg-5 img-fluid" id="product_image">
                            <Carousel pause='hover'>
                                {product.images && product.images.map(img => (
                                    <Carousel.Item key={img.public_id}>
                                    <img src={img.url} alt={product.name} className="d-block w-100" />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        </div>

                        <div className="col-12 col-lg-5 mt-5">
                            <h3>{product.name}</h3>
                            <p id="product_id">Product # {product._id}</p>

                            <hr />

                            <div className="rating-outer">
                                <div className="rating-inner" style={{ width: `${(product.ratings / 5) * 100}%` }}></div>
                            </div>
                            <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>

                            <hr />

                            <p id="product_price">${product.price}</p>
                            <div className="stockCounter d-inline">
                                <span onClick={decreaseQty} className="btn btn-danger minus">-</span>

                                <input type="number" className="form-control count d-inline" value={quantity} readOnly />

                                <span onClick={increaseQty} className="btn btn-primary plus">+</span>
                            </div>
                            <button onClick={addToCart} disabled={product.stock === 0} type="button" id="cart_btn" className="btn btn-primary d-inline ml-4">Add to Cart</button>

                            <hr />

                            <p>Status: <span className={product.stock > 0 ? 'greenColor' : 'redColor'} id="stock_status">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></p>

                            <hr />

                            <h4 className="mt-2">Description:</h4>
                            <p>{product.description}</p>
                            <hr />
                            <p id="product_seller mb-3">Sold by: <strong>{product.seller}</strong></p>
                            
                            {user ? <button id="review_btn" type="button" onClick={setUserRatings} className="btn btn-primary mt-4" data-toggle="modal" data-target="#ratingModal">
                                        Submit Your Review
                            </button> : <div className="alert alert-danger mt-5" type="alert ">Login to post your Review.</div>}
                            
                            <div className="row mt-2 mb-5">
                                <div className="rating w-50">

                                    <div className="modal fade" id="ratingModal" tabIndex="-1" role="dialog" aria-labelledby="ratingModalLabel" aria-hidden="true">
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="ratingModalLabel">Submit Review</h5>
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">

                                                    <ul className="stars" >
                                                        <li className="star"><i className="fa fa-star"></i></li>
                                                        <li className="star"><i className="fa fa-star"></i></li>
                                                        <li className="star"><i className="fa fa-star"></i></li>
                                                        <li className="star"><i className="fa fa-star"></i></li>
                                                        <li className="star"><i className="fa fa-star"></i></li>
                                                    </ul>

                                                    <textarea 
                                                        name="review" 
                                                        id="review" 
                                                        className="form-control mt-3"
                                                        value={comment} 
                                                        onChange={({target}) => setComment(target.value)}                                                       
                                                    >

                                                    </textarea>

                                                    <button 
                                                        onClick={reviewHandler} 
                                                        className="btn my-3 float-right review-btn px-4 text-white" 
                                                        data-dismiss="modal" aria-label="Close"
                                                    >
                                                        Submit
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>     
                            </div>
                        </div>
                    </div>
                    {product.reviews && product.reviews.length > 0 && (
                        <ListReviews reviews={product.reviews} />
                    )}
                </React.Fragment>
            )}
        </React.Fragment>
    )
}

export default ProductDetails
