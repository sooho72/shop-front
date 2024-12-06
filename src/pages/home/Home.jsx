import React, { useState } from "react";
import Purchase from "../../model/Purchase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import './Home.css'
import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import productService from "../../services/product.service";
import purchaseService from "../../services/purchase.service";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const Home =()=>{
    const [productList, setProductList] = useState([]);
	const [errorMessage, setErrorMessage] = useState('');
	const [infoMessage, setInfoMessage] = useState('')
    const [quantity, setQuantity] = useState(0);

    const currentUser=useSelector((state) =>state.user);
  
    useEffect(()=>{
        productService.getAllProducts().then((response) =>{
            setProductList(response.data);
        });
    },[]);

    const handleChange=(e)=>{
        setQuantity(e.target.value)
        console.log(quantity);
    }

    const purchase = (product) => {
		if (!currentUser?.id) {
			setErrorMessage('로그인하셔야 구매가능 합니다.');
			return;
		}
    
        const purchase = new Purchase(currentUser.username, product.id, quantity);
        console.log(purchase);
		purchaseService.savePurchaseService(purchase)
			.then(() => {
				setInfoMessage('구매완료!');
			})
			.catch((err) => {
				setErrorMessage('예상치 못한 에러가 발생했습니다.');
				console.log(err);
			});
	};
    return  (
        <div className='mt-3'>
        {errorMessage && <div className='alert alert-danger'>{errorMessage}</div>}
        {infoMessage && <div className='alert alert-success'>{infoMessage}</div>}
        <div className='d-flex justify-content-around flex-wrap gap-3'>
            {productList.map((item, ind) => (
                <div key={item.id} className='card home-card'>
                    <div className='card-body'>
                        <div className='card-title text-uppercase'>{item.name}</div>
                        <div className='card-subtitle text-muted'>{item.description}</div>
                          <div className='card-subtitle text-muted'>{`${item.price} 원`}</div>
                    </div>
                    <FontAwesomeIcon icon={faCartPlus} className='ms-auto me-auto product-icon' />
                    <div className='row mt-2 p-3'>
                          <div className='col-6'>
                            수량 : <input type="text" name="quantity" onChange={handleChange}/>
                          </div>
                        <div className='col-6'>
                            <button className='btn btn-outline-success w-100' onClick={() => purchase(item)}>
                                구매
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </div>
    );
}
export default Home;