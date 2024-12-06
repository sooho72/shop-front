import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import Product from "../model/Product";
import { Modal } from "react-bootstrap";
import productService from "../services/product.service";

const ProductSave=forwardRef((props, ref) =>{ //
    const [product, setProduct] = useState(new Product('', '', 0));
    const [errorMessage, setErrorMessage] = useState('');
    const [show, setShow] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useImperativeHandle(ref, ()=>({ //  외부에서 호출할때 컴포넌트showProductModal 속성을 변경하는 훅
        showProductModal(){
            setTimeout(() => setShow(true), 0); // 모달을 보여줄지 말지 트루로 햇음
        }
    }));

    useEffect(()=>{
        setProduct(props.product); // 새 props로 -> product값을 넣을때
        console.log(props.product);
    }, [props.product]);

    const saveProduct = (e) => { //세이브 프로닥트 서브밋되어있어서
        e.preventDefault();
        setSubmitted(true);

        if (!product.name || !product.description || !product.price) {
			//이프조건들이 그렇지않으면 
            return;
		}

        productService.saveProduct(product)
			.then((response) => {
				props.onSaved(response.data);  //상위컴포넌트에 저장데이터 전달
				setShow(false); 
				setSubmitted(false);
			})
			.catch((err) => {
				setErrorMessage('제품 저장시 에러발생!');
				console.log(err); //등록했으면 새 프로닥트를 받을수있도록
			});
        setProduct(new Product('', '', 0)); //입력창 초기화    
    };
  
    const handleChange = (e) => { 
        const { name, value } = e.target;

        setProduct((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };

    return(
        <Modal show={show}>
            <form noValidate onSubmit={saveProduct} className={submitted ? 'was-validated' : ''}>
                <div className='modal-header'>
                    <h5 className='modal-title'>상품 정보</h5>
                    <button type='button' className='btn-close' onClick={() => setShow(false)}></button>
                </div>
                <div className='modal-body'>

                    {errorMessage && <div className='alert alert-danger'>{errorMessage}</div>}

                    <div className='form-group'>
                        <label htmlFor='name'>상품명: </label>
                        <input
                            type='text'
                            name='name'
                            placeholder='name'
                            className='form-control'
                            value={product?.name}
                            onChange={handleChange}
                            required
                        />
                        <div className='invalid-feedback'>Name is required.</div>
                    </div>

                    <div className='form-group'>
                        <label htmlFor='description'>상품설명: </label>
                        <textarea
                            name='description'
                            placeholder='description'
                            className='form-control'
                            value={product?.description}
                            onChange={handleChange}
                            required
                        />
                        <div className='invalid-feedback'>Description is required.</div>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='price'>가격: </label>
                        <input
                            type='number'
                            min='1'
                            step='any'
                            name='price'
                            placeholder='price'
                            className='form-control'
                            value={product?.price}
                            onChange={handleChange}
                            required
                        />
                        <div className='invalid-feedback'>Price is required and should be greater than 0.</div>
                    </div>
                </div>
                <div className='modal-footer'>
                    <button type='button' className='btn btn-secondary' onClick={() => setShow(false)}>
                        닫기
                    </button>
                    <button type='submit' className='btn btn-primary'>
                        저장하기
                    </button>
                </div>
            </form>

        </Modal>

    );
});
export default ProductSave;